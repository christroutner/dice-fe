import React from 'react';
import { Row, Col, Image } from 'react-bootstrap';

function ImageGallery({ images, isMobile, onImageClick }) {
  if (!images || images.length === 0) {
    return null;
  }

  const getColProps = (index, total) => {
    if (total === 1) {
      return { xs: 12, style: { height: isMobile ? '200px' : '300px' } };
    }
    if (total === 2) {
      return { xs: 6, style: { height: isMobile ? '150px' : '200px' } };
    }
    if (total === 3) {
      if (index === 0) {
        return { 
          xs: 12, 
          md: 6, 
          style: { 
            height: isMobile ? '200px' : '250px',
            display: 'flex'
          } 
        };
      }
      return { 
        xs: 6, 
        md: 3, 
        style: { 
          height: isMobile ? '100px' : '125px' 
        } 
      };
    }
    if (total === 4) {
      return { xs: 6, style: { height: isMobile ? '120px' : '150px' } };
    }
    // 5+ images
    return { xs: 4, style: { height: isMobile ? '100px' : '120px' } };
  };

  const getBorderRadius = (index, total) => {
    if (total === 1) {
      return '12px';
    }
    if (total === 2) {
      return index === 0 ? '12px 0 0 12px' : '0 12px 12px 0';
    }
    if (total === 3) {
      if (index === 0) return '12px 0 0 0';
      if (index === 1) return '0 12px 0 0';
      return '0 0 0 0';
    }
    if (total === 4) {
      if (index === 0) return '12px 0 0 0';
      if (index === 1) return '0 12px 0 0';
      if (index === 2) return '0 0 0 0';
      return '0 0 12px 0';
    }
    // 5+ images
    return '4px';
  };

  const displayImages = images.slice(0, 6);
  const totalImages = images.length;
  const isThreeImageLayout = totalImages === 3;

  return (
    <div
      style={{
        marginBottom: '20px',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: '#f3f4f6'
      }}
    >
      {isThreeImageLayout ? (
        // Special layout for 3 images: one large on left, two small on right
        <Row className="g-1">
          <Col
            xs={12}
            md={6}
            style={{
              padding: '0',
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: '#e5e7eb',
              cursor: 'pointer',
              height: isMobile ? '200px' : '250px'
            }}
            onClick={() => onImageClick(displayImages[0], 0)}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
              const img = e.currentTarget.querySelector('img');
              if (img) {
                img.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
              const img = e.currentTarget.querySelector('img');
              if (img) {
                img.style.transform = 'scale(1)';
              }
            }}
          >
            <Image
              src={displayImages[0].url}
              alt={displayImages[0].alt || 'Image 1'}
              fluid
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.2s ease, opacity 0.2s ease',
                borderRadius: '12px 0 0 0'
              }}
              loading="lazy"
            />
          </Col>
          <Col
            xs={12}
            md={6}
            style={{ padding: '0' }}
          >
            <Row className="g-1">
              <Col
                xs={6}
                md={12}
                style={{
                  padding: '0',
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: '#e5e7eb',
                  cursor: 'pointer',
                  height: isMobile ? '100px' : '125px'
                }}
                onClick={() => onImageClick(displayImages[1], 1)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                  const img = e.currentTarget.querySelector('img');
                  if (img) {
                    img.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  const img = e.currentTarget.querySelector('img');
                  if (img) {
                    img.style.transform = 'scale(1)';
                  }
                }}
              >
                <Image
                  src={displayImages[1].url}
                  alt={displayImages[1].alt || 'Image 2'}
                  fluid
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.2s ease, opacity 0.2s ease',
                    borderRadius: '0 12px 0 0'
                  }}
                  loading="lazy"
                />
              </Col>
              <Col
                xs={6}
                md={12}
                style={{
                  padding: '0',
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: '#e5e7eb',
                  cursor: 'pointer',
                  height: isMobile ? '100px' : '125px'
                }}
                onClick={() => onImageClick(displayImages[2], 2)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                  const img = e.currentTarget.querySelector('img');
                  if (img) {
                    img.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  const img = e.currentTarget.querySelector('img');
                  if (img) {
                    img.style.transform = 'scale(1)';
                  }
                }}
              >
                <Image
                  src={displayImages[2].url}
                  alt={displayImages[2].alt || 'Image 3'}
                  fluid
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.2s ease, opacity 0.2s ease',
                    borderRadius: '0 0 0 0'
                  }}
                  loading="lazy"
                />
              </Col>
            </Row>
          </Col>
        </Row>
      ) : (
        // Standard grid layout for other cases
        <Row className="g-1">
          {displayImages.map((image, index) => {
            const colProps = getColProps(index, Math.min(totalImages, 6));
            const borderRadius = getBorderRadius(index, Math.min(totalImages, 6));
            const isLastInDisplay = index === 5 && totalImages > 6;

            return (
              <Col
                key={index}
                {...colProps}
                style={{
                  ...colProps.style,
                  padding: '0',
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: '#e5e7eb',
                  cursor: 'pointer'
                }}
                onClick={() => onImageClick(image, index)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                  const img = e.currentTarget.querySelector('img');
                  if (img) {
                    img.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  const img = e.currentTarget.querySelector('img');
                  if (img) {
                    img.style.transform = 'scale(1)';
                  }
                }}
              >
                <Image
                  src={image.url}
                  alt={image.alt || `Image ${index + 1}`}
                  fluid
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.2s ease, opacity 0.2s ease',
                    borderRadius: borderRadius
                  }}
                  loading="lazy"
                />
                {isLastInDisplay && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: isMobile ? '18px' : '24px',
                      fontWeight: '700',
                      borderRadius: borderRadius
                    }}
                  >
                    +{totalImages - 6}
                  </div>
                )}
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
}

export default ImageGallery;

