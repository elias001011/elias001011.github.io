import { useEffect } from "react";

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

// Movimento ligado à rolagem e ao ponteiro, no mesmo espírito do site da Connecta:
// - [data-reveal]     ganha .in quando entra na tela (títulos por palavra, cards)
// - [data-scroll]     recebe --p (0 → 1 enquanto atravessa a tela) e --enter
// - [data-scroll-lit] acende palavra a palavra conforme a rolagem
// - [data-spotlight]  recebe --mx/--my para o brilho que segue o mouse
// - [data-magnetic]   puxa de leve na direção do ponteiro
// - [data-tilt]       inclina com o ponteiro
export function useScrollMotion(key: string) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;

    const reveals = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    reveals.forEach((node) => (reduced ? node.classList.add("in") : observer.observe(node)));

    const tracks = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll]"));
    const lit = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-lit]"));
    let frame: number | null = null;

    const update = () => {
      frame = null;
      const vh = window.innerHeight || 1;
      const max = root.scrollHeight - vh;
      root.style.setProperty("--page", (max > 0 ? window.scrollY / max : 0).toFixed(4));

      for (const node of tracks) {
        const rect = node.getBoundingClientRect();
        const through = clamp((vh - rect.top) / (vh + rect.height));
        const enter = clamp((vh - rect.top) / (vh * 0.75));
        node.style.setProperty("--p", through.toFixed(4));
        node.style.setProperty("--enter", enter.toFixed(4));
      }

      for (const block of lit) {
        const rect = block.getBoundingClientRect();
        const progress = clamp((vh * 0.85 - rect.top) / (rect.height + vh * 0.35));
        const words = block.querySelectorAll<HTMLElement>(".lw");
        const on = Math.round(progress * words.length);
        words.forEach((word, index) => word.classList.toggle("on", index < on));
      }
    };

    const request = () => {
      if (frame === null) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);

    const cleanups: Array<() => void> = [];

    if (!reduced && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      document.querySelectorAll<HTMLElement>("[data-spotlight]").forEach((node) => {
        const move = (event: PointerEvent) => {
          const rect = node.getBoundingClientRect();
          node.style.setProperty("--mx", `${event.clientX - rect.left}px`);
          node.style.setProperty("--my", `${event.clientY - rect.top}px`);
        };
        node.addEventListener("pointermove", move);
        cleanups.push(() => node.removeEventListener("pointermove", move));
      });

      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((node) => {
        const move = (event: PointerEvent) => {
          const rect = node.getBoundingClientRect();
          const x = event.clientX - rect.left - rect.width / 2;
          const y = event.clientY - rect.top - rect.height / 2;
          node.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
        };
        const leave = () => {
          node.style.transform = "";
        };
        node.addEventListener("pointermove", move);
        node.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          node.removeEventListener("pointermove", move);
          node.removeEventListener("pointerleave", leave);
        });
      });

      document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((node) => {
        const move = (event: PointerEvent) => {
          const rect = node.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          node.style.setProperty("--tx", (x * 10).toFixed(2));
          node.style.setProperty("--ty", (y * -10).toFixed(2));
        };
        const leave = () => {
          node.style.setProperty("--tx", "0");
          node.style.setProperty("--ty", "0");
        };
        node.addEventListener("pointermove", move);
        node.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          node.removeEventListener("pointermove", move);
          node.removeEventListener("pointerleave", leave);
        });
      });
    }

    return () => {
      observer.disconnect();
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [key]);
}
