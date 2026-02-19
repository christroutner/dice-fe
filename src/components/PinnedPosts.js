/**
 *  Pinned Posts component
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Heart, MessageCircle } from 'lucide-react';
import ImageGallery from './ImageGallery';
import ImageModal from './ImageModal';
import MarkdownFormat from './MarkdownFormat';
import AuthMediaViewer from './AuthMediaViewer';
import { getHydratedPost } from '../services/post';

function PinnedPosts({ postsUrls, isMobile, appData }) {
  console.log('PinnedPosts() called with postsUrls: ', postsUrls);
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate = useNavigate();

  // readable date format
  const dateToLocaleString = (isoDate) => {
    if (!isoDate) return null;
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Handle card click - navigate to post
  const handleCardClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  // Handle navigation to user profile
  const handleUserClick = (e, userId) => {
    e.stopPropagation();
    if (userId) {
      navigate(`/user/${userId}`);
    }
  };


  // Fetch posts when postsUrls changes and posts are not loaded
  useEffect(() => {
    const fetchPosts = async () => {
      try {

        setLoading(true);
        const hydratedPosts = [];
        for (const postUrl of postsUrls) {
          if (postUrl) {
            try {
              const postId = postUrl.split('/').pop();
              const postResponse = await getHydratedPost(postId, appData?.userData?.token);
              if (postResponse.post) {
                const post = postResponse.post;
                hydratedPosts.push(post);
              }
            } catch (error) {
              // skip error if post cannot be retrieved
            }
          }
        }
          setPosts(hydratedPosts);
          setLoading(false)
       

      } catch (error) {
        console.error('Error fetching posts: ', error);
        setLoading(false);
      }
    }
    if (postsUrls.length > 0 && !loading && !posts) {
      fetchPosts();
    }
  }, [postsUrls, appData, loading, posts]);

  return (
    <Container
      fluid
      style={{
        padding: isMobile ? '0 10px 20px 10px' : '0 20px 20px 20px',
        borderBottom: '1px solid #e5e7eb',
        marginBottom: '20px'
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: isMobile ? '16px' : '20px'
        }}
      >
        <h3
          style={{
            fontSize: isMobile ? '20px' : '24px',
            fontWeight: '700',
            color: '#1e3a5f',
            margin: '0 0 8px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          Pinned Posts
        </h3>
        <p
          style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: 0
          }}
        >
          Posts that you have pinned to your profile
        </p>
      </div>

      {/* Grid Container */}
      <Row className="g-3" style={{ margin: 0 }}>
        {posts && posts.length > 0 && posts.map((post) => {
          const postId = post._id;
          const hasMedia = post.mediaUrls && post.mediaUrls.length > 0;
          const likesCount = post.likes?.length || 0;
          const commentsCount = post.totalComments || 0;
          const ownerId = post.ownerId?._id || post.ownerId;
          const pictureSrc = post.ownerId?.profilePictureUrl;

          return (
            <Col
              key={postId}
              xs={12}
              md={6}
            >
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: isMobile ? '16px' : '20px',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  height: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#4285f4';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(66, 133, 244, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
              {/* Content Wrapper - grows to push metrics to bottom */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Post Header - Author Info */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}
              >
                {/* Default Avatar */}
                {!pictureSrc && (
                  <div
                    onClick={(e) => handleUserClick(e, ownerId)}
                    style={{
                      width: isMobile ? '40px' : '48px',
                      height: isMobile ? '40px' : '48px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #4285f4 0%, #1e3a5f 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontWeight: '600',
                      fontSize: isMobile ? '16px' : '18px',
                      marginRight: '12px',
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(66, 133, 244, 0.3)',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    {(post.ownerId?.name || post.ownerId?.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                {/* Profile Picture */}
                {pictureSrc && (
                  <div
                    onClick={(e) => handleUserClick(e, ownerId)}
                    style={{
                      cursor: 'pointer',
                      marginRight: '12px',
                      transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <AuthMediaViewer 
                      src={pictureSrc} 
                      token={appData?.userData?.token} 
                      alt="Profile Picture" 
                      style={{ 
                        width: isMobile ? '40px' : '48px', 
                        height: isMobile ? '40px' : '48px', 
                        borderRadius: '50%', 
                        objectFit: 'cover' 
                      }} 
                    />
                  </div>
                )}

                {/* Author Info */}
                <div style={{ flexGrow: 1 }}>
                  <div
                    onClick={(e) => handleUserClick(e, ownerId)}
                    style={{
                      fontSize: isMobile ? '14px' : '16px',
                      fontWeight: '600',
                      color: '#1e3a5f',
                      marginBottom: '2px',
                      cursor: 'pointer',
                      transition: 'color 0.2s ease',
                      display: 'inline-block'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#4285f4';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#1e3a5f';
                    }}
                  >
                    {post.ownerId?.name || post.ownerId?.email}
                  </div>
                </div>
              </div>

              {/* Post Content */}
              {post.postContent && (() => {
                // Check if content should be truncated and truncate it
                // Mobile: 140 chars, Desktop: 300 chars
                const charLimit = isMobile ? 140 : 300;
                const shouldTruncate = post.postContent && post.postContent.length > charLimit;
                const displayContent = shouldTruncate 
                  ? post.postContent.substring(0, charLimit) + '...'
                  : post.postContent;

                return (
                  <div
                    style={{
                      fontSize: isMobile ? '14px' : '15px',
                      color: '#374151',
                      lineHeight: '1.6',
                      marginBottom: hasMedia ? '16px' : '12px',
                      wordBreak: 'break-word'
                    }}
                  >
                    <div
                      onClick={() => handleCardClick(postId)}
                      style={{
                        cursor: 'pointer'
                      }}
                    >
                      <MarkdownFormat content={displayContent} />
                    </div>
                    {shouldTruncate && (
                      <Button
                        variant="link"
                        onClick={() => handleCardClick(postId)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#4285f4',
                          cursor: 'pointer',
                          fontSize: isMobile ? '13px' : '14px',
                          fontWeight: '600',
                          padding: '4px 0',
                          marginTop: '8px',
                          textAlign: 'left',
                          transition: 'color 0.2s ease',
                          textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = '#1e3a5f';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = '#4285f4';
                        }}
                      >
                        Read more
                      </Button>
                    )}
                  </div>
                );
              })()}

              {/* Media Gallery */}
              {hasMedia && (
                <div
                  style={{
                    marginBottom: '12px'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ImageGallery
                    token={appData?.userData?.token}
                    images={post.mediaUrls}
                    isMobile={isMobile}
                    onImageClick={(image, index) => {
                      setSelectedImageIndex(index);
                      setSelectedPost(post);
                      setShowImageModal(true);
                    }}
                  />
                </div>
              )}
              </div>

              {/* Bottom Section: Metrics */}
              <div
                onClick={() => handleCardClick(postId)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? '12px' : '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid #f3f4f6',
                  fontSize: isMobile ? '11px' : '12px',
                  color: '#6b7280',
                  cursor: 'pointer',
                  marginTop: 'auto'
                }}
              >
                {/* Likes */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Heart size={14} color="#6b7280" fill="none" />
                  <span>{likesCount}</span>
                </div>

                {/* Comments */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <MessageCircle size={14} color="#6b7280" fill="none" />
                  <span>{commentsCount}</span>
                </div>

                {/* Date */}
                {post.createdAt && (
                  <div
                    style={{
                      marginLeft: 'auto',
                      fontSize: isMobile ? '10px' : '11px',
                      color: '#9ca3af'
                    }}
                  >
                    {dateToLocaleString(post.createdAt)}
                  </div>
                )}
              </div>
              </div>
            </Col>
          );
        })}
      </Row>

      {/* Image Modal */}
      {selectedPost && selectedPost.mediaUrls && selectedPost.mediaUrls.length > 0 && (
        <ImageModal
          show={showImageModal}
          onHide={() => {
            setShowImageModal(false);
            setSelectedPost(null);
          }}
          images={selectedPost.mediaUrls}
          initialIndex={selectedImageIndex}
          token={appData?.userData?.token}
        />
      )}
    </Container>
  );
}

export default PinnedPosts;
