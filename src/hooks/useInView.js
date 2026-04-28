import { useState, useEffect, useRef } from 'react';

const viewportBuckets = new Map();

function getViewportBucket(rootMargin, threshold) {
  const key = `${rootMargin}|${threshold}`;
  let bucket = viewportBuckets.get(key);
  if (!bucket) {
    const callbacks = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const fn = callbacks.get(entry.target);
          if (fn) fn(entry);
        }
      },
      { root: null, rootMargin, threshold }
    );
    bucket = { observer, callbacks };
    viewportBuckets.set(key, bucket);
  }
  return bucket;
}

/**
 * Subscribe to intersection with the viewport or a custom scroll root.
 * Viewport observers are shared per (rootMargin, threshold) for performance.
 */
export function subscribeInView(element, handler, options = {}) {
  const {
    once = false,
    root = null,
    rootMargin = '200px 0px',
    threshold = 0,
  } = options;

  if (root != null) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target !== element) continue;
          handler(entry);
          if (once && entry.isIntersecting) {
            observer.unobserve(element);
          }
        }
      },
      { root, rootMargin, threshold }
    );
    observer.observe(element);
    return () => observer.unobserve(element);
  }

  const bucket = getViewportBucket(rootMargin, threshold);
  const wrapped = (entry) => {
    handler(entry);
    if (once && entry.isIntersecting) {
      bucket.callbacks.delete(element);
      bucket.observer.unobserve(element);
    }
  };
  bucket.callbacks.set(element, wrapped);
  bucket.observer.observe(element);
  return () => {
    bucket.callbacks.delete(element);
    bucket.observer.unobserve(element);
  };
}

/**
 * @param {object} [options]
 * @param {Element|null} [options.root] - scroll root; null = viewport
 * @param {string} [options.rootMargin]
 * @param {number|number[]} [options.threshold]
 * @param {boolean} [options.once] - stop observing after first intersection
 * @param {boolean} [options.initialInView] - skip IO (always "visible")
 * @param {boolean} [options.enabled] - when false, no observation
 */
export function useInView(options = {}) {
  const {
    root = null,
    rootMargin = '200px 0px',
    threshold = 0,
    once = true,
    initialInView = false,
    enabled = true,
  } = options;

  const [inView, setInView] = useState(initialInView);
  const ref = useRef(null);
  const optsRef = useRef({ root, rootMargin, threshold, once, initialInView, enabled });
  optsRef.current = { root, rootMargin, threshold, once, initialInView, enabled };

  useEffect(() => {
    const { initialInView: init, enabled: en } = optsRef.current;
    if (!en || init) return undefined;

    const el = ref.current;
    if (!el) return undefined;

    const { root: r, rootMargin: rm, threshold: th, once: o } = optsRef.current;

    return subscribeInView(
      el,
      (entry) => {
        if (entry.isIntersecting) {
          setInView(true);
        } else if (!o) {
          setInView(false);
        }
      },
      { root: r, rootMargin: rm, threshold: th, once: o }
    );
  }, [root, rootMargin, threshold, once, initialInView, enabled]);

  return [ref, inView];
}
