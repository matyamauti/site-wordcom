import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validarContato, montarEmailContato, LOGO_CONTATO_CID } from '../src/lib/contato-email.ts';
import { readFile } from 'node:fs/promises';
import nodemailer from 'nodemailer';

const dados = {
  nome: 'Visitante de teste', email: 'visitante@example.com', empresa: 'Empresa teste',
  telefone: '11999999999', servico: 'Branding', mensagem: 'Primeira linha\nSegunda linha',
  consentimento: 'sim',
};

test('valida dados completos e preserva mensagem multilinha', () => {
  const resultado = validarContato({ ...dados, nome: ' Visitante de teste ' });
  assert.equal(resultado.ok, true);
  assert.equal(resultado.contato.nome, dados.nome);
  assert.equal(resultado.contato.mensagem, dados.mensagem);
});

test('logo segue incorporada ao MIME sem acesso externo ou envio SMTP', async () => {
  const resultado = validarContato(dados);
  assert.equal(resultado.ok, true);
  const email = montarEmailContato(resultado.contato);
  assert.ok(email.html.includes(`src="cid:${LOGO_CONTATO_CID}"`));
  assert.ok(email.html.includes('mailto:visitante%40example.com'));
  const logo = await readFile(new URL('../public/marca/wordcom-logo.png', import.meta.url));
  const transporte = nodemailer.createTransport({ streamTransport: true, buffer: true, disableFileAccess: true, disableUrlAccess: true });
  const resultadoMime = await transporte.sendMail({
    from: 'site@wordcom.com.br', to: 'destinatario@example.com', ...email,
    attachments: [{ filename: 'wordcom-logo.png', content: logo, contentType: 'image/png', cid: LOGO_CONTATO_CID, contentDisposition: 'inline' }],
  });
  const mime = resultadoMime.message.toString();
  assert.ok(mime.includes(`Content-ID: <${LOGO_CONTATO_CID}>`));
  assert.ok(mime.includes('Content-Disposition: inline;'));
  assert.ok(mime.includes('multipart/related;'));
  assert.ok(mime.includes('Content-Type: text/plain;'));
  assert.ok(mime.includes('Content-Type: text/html;'));
});

test('recusa campos ausentes, tipos invalidos e limites excedidos', () => {
  for (const alteracao of [{ nome: '' }, { empresa: 123 }, { mensagem: 'x'.repeat(2001) }, { telefone: '123' }, { servico: 'Outra frente' }]) {
    assert.equal(validarContato({ ...dados, ...alteracao }).ok, false);
  }
});

test('consentimento precisa ser explicito', () => {
  for (const consentimento of [false, 'false', undefined, 'nao']) {
    assert.equal(validarContato({ ...dados, consentimento }).ok, false);
  }
});

test('bloqueia injecao de cabecalhos', () => {
  assert.equal(validarContato({ ...dados, email: 'a@example.com\r\nBcc: b@example.com' }).ok, false);
  assert.equal(validarContato({ ...dados, empresa: 'Empresa\nOutro assunto' }).ok, false);
});

test('email inclui todos os dados e escapa HTML do visitante e metadados', () => {
  const resultado = validarContato({ ...dados, empresa: 'A & B', mensagem: '<script>alert(1)</script>\nOutra linha', origem: '<img src=x>' });
  assert.equal(resultado.ok, true);
  const email = montarEmailContato(resultado.contato, new Date('2026-10-08T15:00:00Z'));
  for (const campo of ['nome', 'email', 'empresa', 'telefone', 'servico', 'mensagem']) assert.ok(email.text.includes(resultado.contato[campo]));
  assert.ok(email.html.includes('A &amp; B'));
  assert.ok(email.html.includes('&lt;script&gt;'));
  assert.ok(email.html.includes('&lt;img src=x&gt;'));
  assert.ok(email.html.includes('<br>Outra linha'));
  assert.ok(!email.html.includes('<script>'));
  assert.equal(email.subject, '[Site WordCom] Novo contato - A & B');
});
