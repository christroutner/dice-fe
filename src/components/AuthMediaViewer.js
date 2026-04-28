import React, { useState, useEffect } from 'react';
import { Image } from 'react-bootstrap';
import { fetchCachedMedia } from '../utils/mediaCache';

const AuthMediaViewer = ({ src, token, alt = "Loading...", ...props }) => {
  const [mediaSrc, setMediaSrc] = useState("");
  const [status, setStatus] = useState('loading'); // 'loading' | 'loaded' | 'error'
  const [mediaType, setMediaType] = useState('unknown'); // 'image' | 'video' | 'other'

  useEffect(() => {
    let objectUrl = null;
    let cancelled = false;
    const controller = new AbortController();

    const fetchMedia = async () => {
      try {
        setStatus('loading');

        const { blob, contentType } = await fetchCachedMedia(src, {
          token,
          signal: controller.signal,
        });

        if (cancelled) {
          return;
        }

        if (contentType.startsWith('image/')) {
          setMediaType('image');
        } else if (contentType.startsWith('video/')) {
          setMediaType('video');
        } else {
          setMediaType('other');
        }

        objectUrl = URL.createObjectURL(blob);
        if (cancelled) {
          URL.revokeObjectURL(objectUrl);
          return;
        }

        setMediaSrc(objectUrl);
        setStatus('loaded');
      } catch (e) {
        if (e.name === 'AbortError' || cancelled) return;
        console.error("Error in AuthMedia:", e.message);
        setStatus('error');
      }
    };

    if (src && token) {
      fetchMedia();
    }

    return () => {
      cancelled = true;
      controller.abort();
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src, token]);

  if (status === 'loading') {
    return <div className="media-placeholder">Loading...</div>;
  }

  if (status === 'error') {
    return <div className="media-error">Failed to load media</div>;
  }

  if (mediaType === 'video') {
    return (
      <div style={{ position: 'relative', maxWidth: '100%' }}>
        <video
          src={mediaSrc}
          controls
          style={{ maxWidth: '100%', display: 'block' }}
          {...props}
        />

      {props.previewMode &&  (
        <div
        onClick={(e) => e.preventDefault()}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: '80px', 
          zIndex: 1
        }}
      />
      )}
      </div>
    );
  }

  if (mediaType === 'image') {
    return (
      <Image
        src={mediaSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        {...props}
      />
    );
  }

  return (
    <div className="file-icon-container" style={{ textAlign: 'center', padding: '20px' }}>
      <div style={{ fontSize: '2rem' }}>📄</div>
      <p style={{ fontSize: '0.8rem' }}>File Attachment</p>
    </div>
  );
};

export default AuthMediaViewer;