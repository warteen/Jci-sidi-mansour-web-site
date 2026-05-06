"use client";

import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function AnimatedCounter({ value, label, prefix = "", suffix = "" }: { value: number, label: string, prefix?: string, suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const springValue = useSpring(0, {
    stiffness: 40,
    damping: 20,
    restDelta: 0.001,
  });

  const displayValue = useTransform(springValue, (latest) => Math.floor(latest).toLocaleString());

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, value, springValue]);

  return (
    <div ref={ref} className="card-premium" style={{ textAlign: "center", overflow: "hidden", position: "relative" }}>
      <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "100px", height: "100px", background: "var(--c-soft-deep-blue)", borderRadius: "50%", opacity: 0.2, filter: "blur(40px)" }} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--c-jci-blue)", textTransform: "uppercase", letterSpacing: "0.15em", display: "block", marginBottom: "1rem" }}>{label}</span>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.25rem" }}>
          {prefix && <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--c-jci-marine)" }}>{prefix}</span>}
          <motion.h3 
            style={{ 
              fontSize: "4rem", 
              fontWeight: 900, 
              color: "var(--c-jci-marine)", 
              lineHeight: 1,
              letterSpacing: "-0.03em"
            }}
          >
            {displayValue}
          </motion.h3>
          {suffix && <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--c-jci-blue)" }}>{suffix}</span>}
        </div>
      </motion.div>
    </div>
  );
}
