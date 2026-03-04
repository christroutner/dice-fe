import React, { useState, useEffect } from 'react';
import { Image } from 'react-bootstrap';
import axios from 'axios';

const AuthMediaViewer = ({ src, token, alt = "Loading...", ...props }) => {
  const [mediaSrc, setMediaSrc] = useState("");
  const [status, setStatus] = useState('loading'); // 'loading' | 'loaded' | 'error'
  const [mediaType, setMediaType] = useState('unknown'); // 'image' | 'video' | 'other'

  useEffect(() => {
    let objectUrl = null;

    const fetchMedia = async () => {
      try {
        setStatus('loading');

        const response = await axios({
          method: 'GET',
          url: src,
          headers: {
            Authorization: `Bearer ${token}`
          },
          responseType: 'blob'
        });

        const contentType = response.headers['content-type'] || "";

        if (contentType.startsWith('image/')) {
          setMediaType('image');
        } else if (contentType.startsWith('video/')) {
          setMediaType('video');
        } else {
          setMediaType('other');
        }

        objectUrl = URL.createObjectURL(response.data);
        setMediaSrc(objectUrl);
        setStatus('loaded');
      } catch (e) {
        console.error("Error in AuthMedia:", e.message);
        setStatus('error');
      }
    };

    if (src && token) {
      fetchMedia();
    }

    // Cleanup: revoke the object URL when the component unmounts
    return () => {
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