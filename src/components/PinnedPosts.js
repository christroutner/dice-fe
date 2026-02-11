/**
 *  Pinned Posts component
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, FileText } from 'lucide-react';
import AuthMediaViewer from './AuthMediaViewer';
import { getHydratedPost } from '../services/post';

function PinnedPosts({ postsUrls, isMobile, appData }) {
  console.log('PinnedPosts() called with postsUrls: ', postsUrls);
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // readable date format
  const dateToLocaleString = (isoDate) => {
    if (!isoDate) return null;
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Truncate content for preview
  const truncateContent = (content, maxLength = 100) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  // Handle card click - navigate to post
  const handleCardClick = (postId) => {
    navigate(`/post/${postId}`);
  };


  // Fetch posts when postsUrls changes and posts are not loaded
  useEffect(() => {
    const fetchPosts = async () => {
      try {

        setLoading(true);
        const hydratedPosts = [];
        for (const postUrl of postsUrls) {
          if (postUrl) {
            const postId = postUrl.split('/').pop();
            const postResponse = await getHydratedPost(postId, appData?.userData?.token);
            if (postResponse.post) {
              const post = postResponse.post;
              hydratedPosts.push(post);
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
    <div
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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: isMobile ? '12px' : '16px',
          width: '100%'
        }}
      >
        {posts && posts.length > 0 && posts.map((post) => {
          const postId = post._id;
          const hasMedia = post.mediaUrls && post.mediaUrls.length > 0;
          const firstMediaUrl = hasMedia ? post.mediaUrls[0] : null;
          const likesCount = post.likes?.length || 0;
          const commentsCount = post.totalComments || 0;

          return (
            <div
              key={postId}
              onClick={() => handleCardClick(postId)}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: isMobile ? '16px' : '20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                minHeight: isMobile ? '140px' : '160px',
                position: 'relative',
                overflow: 'hidden'
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
              {/* Top Section: Icon and Title */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  marginBottom: '12px'
                }}
              >
                {/* Post Icon or Thumbnail */}
                <div
                  style={{
                    width: isMobile ? '40px' : '48px',
                    height: isMobile ? '40px' : '48px',
                    borderRadius: '8px',
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    overflow: 'hidden',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  {firstMediaUrl && appData?.userData?.token ? (
                    <AuthMediaViewer
                      src={firstMediaUrl}
                      token={appData.userData.token}
                      alt="Post thumbnail"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <FileText size={isMobile ? 20 : 24} color="#4285f4" />
                  )}
                </div>

                {/* Title and Badge */}
                <div
                  style={{
                    flex: 1,
                    minWidth: 0
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <h4
                      style={{
                        fontSize: isMobile ? '14px' : '16px',
                        fontWeight: '600',
                        color: '#4285f4',
                        margin: 0,
                        wordBreak: 'break-word',
                        lineHeight: '1.3'
                      }}
                    >
                      {truncateContent(post.postContent, isMobile ? 40 : 50)}
                    </h4>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div
                style={{
                  fontSize: isMobile ? '12px' : '13px',
                  color: '#6b7280',
                  lineHeight: '1.5',
                  marginBottom: '12px',
                  flex: 1,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}
              >
                {truncateContent(post.postContent, isMobile ? 80 : 120)}
              </div>

              {/* Bottom Section: Metrics */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? '12px' : '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid #f3f4f6',
                  fontSize: isMobile ? '11px' : '12px',
                  color: '#6b7280'
                }}
              >
                {/* Likes */}
                {likesCount > 0 && (
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
                )}

                {/* Comments */}
                {commentsCount > 0 && (
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
                )}

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
          );
        })}
      </div>
    </div>
  );
}

export default PinnedPosts;
