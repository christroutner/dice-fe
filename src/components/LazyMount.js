import React from 'react';
import { useInView } from '../hooks/useInView';

/**
 * Defers mounting `children` until the wrapper intersects the viewport (or `root`).
 * Uses a pooled IntersectionObserver for viewport mode. Set `eager` for above-the-fold items (LCP).
 */
function LazyMount({
  children,
  fallback = null,
  className,
  style,
  minHeight = 200,
  root = null,
  rootMargin = '200px 0px',
  once = true,
  eager = false,
}) {
  const [ref, inView] = useInView({
    root,
    rootMargin,
    once,
    initialInView: eager,
    enabled: !eager,
  });

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        ...(inView ? {} : { minHeight }),
      }}
    >
      {inView ? children : fallback}
    </div>
  );
}

export default LazyMount;
