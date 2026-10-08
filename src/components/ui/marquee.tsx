"use client";

import { useSyncExternalStore, type HTMLAttributes } from "react";
import FastMarquee, { type MarqueeProps as FastMarqueeProps } from "react-fast-marquee";

export type MarqueeProps = HTMLAttributes<HTMLDivElement>;
export type MarqueeContentProps = FastMarqueeProps;
export type MarqueeFadeProps = HTMLAttributes<HTMLDivElement> & { side: "left" | "right" };
export type MarqueeItemProps = HTMLAttributes<HTMLDivElement>;

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export const Marquee = ({ className = "", ...props }: MarqueeProps) => (
  <div className={`marqueeRoot ${className}`} {...props} />
);

export function MarqueeContent({
  loop = 0, autoFill = true, pauseOnHover = true, children, ...props
}: MarqueeContentProps) {
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => true);

  if (reducedMotion) return <div className="marqueeStatic">{children}</div>;

  return (
    <FastMarquee loop={loop} autoFill={autoFill} pauseOnHover={pauseOnHover} {...props}>
      {children}
    </FastMarquee>
  );
}

export const MarqueeFade = ({ className = "", side, ...props }: MarqueeFadeProps) => (
  <div className={`marqueeFade marqueeFade-${side} ${className}`} aria-hidden="true" {...props} />
);

export const MarqueeItem = ({ className = "", ...props }: MarqueeItemProps) => (
  <div className={`marqueeItem ${className}`} {...props} />
);
