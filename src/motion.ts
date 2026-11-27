import { useEffect } from "react";

export function useScrollMotion(language: string) {
  useEffect(() => {
    const revealNodes = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.in)");
    const canAnimate = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

    if (!canAnimate || typeof IntersectionObserver === "undefined") {
      revealNodes.forEach((node) => node.classList.add("in"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    revealNodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [language]);
}
