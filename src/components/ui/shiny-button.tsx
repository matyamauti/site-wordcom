"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import styles from "./shiny-button.module.css";

type ShinyButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label: string;
};

export const ShinyButton = forwardRef<HTMLButtonElement, ShinyButtonProps>(
  function ShinyButton({ label, className = "", type = "button", ...props }, ref) {
    return (
      <button ref={ref} type={type} className={`${styles.button} ${className}`} {...props}>
        <span className={styles.speckle} aria-hidden="true" />
        <span className={styles.sheen} aria-hidden="true" />
        <span className={styles.label}>{label}</span>
      </button>
    );
  },
);

export default ShinyButton;
