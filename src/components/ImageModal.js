import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import AuthMediaViewer from './AuthMediaViewer';
function ImageModal({ show, onHide, images, initialIndex = 0 , token }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, show]);

  useEffect(() => {
    if (!show) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (e.key === 'Escape') {
        onHide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [show, currentIndex, images.length, onHide]);

  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  const handlePrevious = () => {
    if (hasPrevious) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <>
      {!isMobile && show && (
        <style>
          {`
            .modal-dialog.image-modal-desktop {
              max-width: 90vw !important;
              width: 90vw !important;
              max-height: 90vh !important;
            }
          `}
        </style>
      )}
      <Modal
        show={show}
        onHide={onHide}
        centered
        backdrop="static"
        keyboard={false}
        dialogClassName={!isMobile ? 'image-modal-desktop' : ''}
        style={{
          zIndex: 1060
        }}
      >
        <Modal.Body
          className="position-relative d-flex align-items-center justify-content-center"
          style={{
            padding: 0,
            backgroundColor: '#000000',
            minHeight: isMobile ? '50vh' : '70vh',
            maxHeight: isMobile ? '90vh' : '90vh',
            overflow: 'hidden'
          }}
        >
          {/* Close Button */}
          <Button
            variant="light"
            onClick={onHide}
            className="position-absolute rounded-circle d-flex align-items-center justify-content-center"
            style={{
              top: isMobile ? '10px' : '20px',
              right: isMobile ? '10px' : '20px',
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              width: isMobile ? '36px' : '40px',
              height: isMobile ? '36px' : '40px',
              zIndex: 10,
              transition: 'all 0.2s ease',
              color: '#1e3a5f',
              padding: 0
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </Button>

          {/* Previous Button */}
          {hasPrevious && (
            <Button
              variant="light"
              onClick={handlePrevious}
              className="position-absolute rounded-circle d-flex align-items-center justify-content-center"
              style={{
                left: isMobile ? '10px' : '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                width: isMobile ? '40px' : '48px',
                height: isMobile ? '40px' : '48px',
                zIndex: 10,
                transition: 'all 0.2s ease',
                color: '#1e3a5f',
                padding: 0
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                e.target.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </Button>
          )}

          {/* Image */}
          <AuthMediaViewer
            src={currentImage}
            token={token}
            alt={currentImage.alt || `Image ${currentIndex + 1}`}
            fluid
            className="d-block"
            style={{
              maxWidth: '100%',
              maxHeight: isMobile ? '90vh' : '90vh',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain'
            }}
          />

          {/* Next Button */}
          {hasNext && (
            <Button
              variant="light"
              onClick={handleNext}
              className="position-absolute rounded-circle d-flex align-items-center justify-content-center"
              style={{
                right: isMobile ? '10px' : '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                width: isMobile ? '40px' : '48px',
                height: isMobile ? '40px' : '48px',
                zIndex: 10,
                transition: 'all 0.2s ease',
                color: '#1e3a5f',
                padding: 0
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                e.target.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Button>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div
              className="position-absolute start-50 translate-middle-x"
              style={{
                bottom: isMobile ? '10px' : '20px',
                background: 'rgba(0, 0, 0, 0.7)',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                zIndex: 10
              }}
            >
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ImageModal;

