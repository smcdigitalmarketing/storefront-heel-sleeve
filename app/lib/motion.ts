import {
  useEffect,
  useState,
  useSyncExternalStore,
  type RefObject,
} from "react";

// Motion and viewport helpers, from Flashpop's app/lib/spin.ts (Rally has no
// 360° spins, so only these came across).

const REDUCED = "(prefers-reduced-motion: reduce)";

/** Live prefers-reduced-motion. The server and the first render assume motion is fine. */
export function useReducedMotion() {
  return useSyncExternalStore(
    (listener) => {
      const query = window.matchMedia(REDUCED);
      query.addEventListener("change", listener);
      return () => query.removeEventListener("change", listener);
    },
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
}

/** True while the element intersects the viewport (or once it has, with `once`). */
export function useInView(
  ref: RefObject<Element | null>,
  { threshold = 0.15, once = false, rootMargin = "0px" } = {},
) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) setInView(false);
      },
      { threshold, rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold, once, rootMargin]);
  return inView;
}
