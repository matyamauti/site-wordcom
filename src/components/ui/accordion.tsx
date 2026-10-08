"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";

export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({ className = "", ...props }: ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item className={`faqItem ${className}`} {...props} />;
}

export function AccordionTrigger({ children, className = "", ...props }: ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="faqHeading">
      <AccordionPrimitive.Trigger className={`faqTrigger ${className}`} {...props}>
        {children}
        <ChevronDown className="faqChevron" size={20} aria-hidden="true" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({ children, className = "", ...props }: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content className={`faqContent ${className}`} {...props}>
      <div className="faqContentInner">{children}</div>
    </AccordionPrimitive.Content>
  );
}
