import assert from 'node:assert/strict';
import { test } from 'node:test';
import { interpretarPreferencias, VALIDADE_COOKIES, lerPreferenciasCookies, salvarPreferenciasCookies } from '../src/lib/cookies.ts';

const agora = Date.now();
const escolha = { versao: 1, analise: false, publicidade: false, atualizadoEm: agora };

test('sem escolha ou registro invalido, nao permite opcionais', () => {
  for (const valor of [null, undefined, '', '{}', 'null', '[1]', 'invalido']) assert.equal(interpretarPreferencias(valor, agora), null);
});
test('preserva separadamente aceite e rejeicao de cada categoria', () => {
  for (const analise of [true, false]) for (const publicidade of [true, false]) {
    const registro = { ...escolha, analise, publicidade };
    assert.deepEqual(interpretarPreferencias(JSON.stringify(registro), agora), registro);
  }
});
test('recusa preferencia expirada, futura, versao antiga e tipos incorretos', () => {
  for (const alteracao of [{ atualizadoEm: agora - VALIDADE_COOKIES }, { atualizadoEm: agora + 1000 }, { versao: 0 }, { analise: 'true' }, { publicidade: 1 }, { atualizadoEm: 'hoje' }]) {
    assert.equal(interpretarPreferencias(JSON.stringify({ ...escolha, ...alteracao }), agora), null);
  }
});

test('funciona sem armazenamento e respeita exclusao de uma escolha persistida', () => {
  const armazenamento = new Map();
  const alvo = new EventTarget();
  globalThis.window = {
    localStorage: {
      getItem: chave => armazenamento.get(chave) ?? null,
      setItem: (chave, valor) => armazenamento.set(chave, valor),
    },
    dispatchEvent: evento => alvo.dispatchEvent(evento),
  };
  try {
    salvarPreferenciasCookies(true, false);
    assert.equal(interpretarPreferencias(lerPreferenciasCookies()).analise, true);
    armazenamento.clear();
    assert.equal(lerPreferenciasCookies(), null);
    window.localStorage.setItem = () => { throw new Error('armazenamento bloqueado'); };
    salvarPreferenciasCookies(false, false);
    assert.equal(interpretarPreferencias(lerPreferenciasCookies()).analise, false);
    assert.equal(interpretarPreferencias(lerPreferenciasCookies()).publicidade, false);
  } finally {
    delete globalThis.window;
  }
});
