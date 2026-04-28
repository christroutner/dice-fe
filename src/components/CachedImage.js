import React, { useState, useEffect } from 'react';
import { Image } from 'react-bootstrap';
import { fetchCachedMedia } from '../utils/mediaCache';

/**
 * Image that loads through Cache Storage when available (same-origin / CORS),
 * so revisiting routes does not re-download bytes. Pass token for bearer-protected URLs.
 */
const CachedImage = ({ src, token, alt = '', ...props }) => {
  const [objectUrl, setObjectUrl] = useState('');
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (!src) {
      setStatus('error');
      return;
    }

    let createdUrl = null;
    const controller = new AbortController();

    (async () => {
      try {
        setStatus('loading');
        const { blob } = await fetchCachedMedia(src, {
          token,
          signal: controller.signal,
        });
        createdUrl = URL.createObjectURL(blob);
        setObjectUrl(createdUrl);
        setStatus('loaded');
      } catch (e) {
        if (e.name === 'AbortError') return;
        console.error('CachedImage:', e.message);
        setStatus('error');
      }
    })();

    return () => {
      controller.abort();
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [src, token]);

  if (status === 'loading') {
    return <div className="media-placeholder">Loading...</div>;
  }

  if (status === 'error') {
    return <div className="media-error">Failed to load image</div>;
  }

  return <Image src={objectUrl} alt={alt} loading="lazy" decoding="async" {...props} />;
};

export default CachedImage;
