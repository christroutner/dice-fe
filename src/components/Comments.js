/**
 *  Component to display comments for a post
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal } from 'react-bootstrap';
import { getCommentsByParent, createComment } from '../services/comment';
import MarkdownFormat from './MarkdownFormat';
import AuthMediaViewer from './AuthMediaViewer';

function Comments({ show, onHide, post, appData }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [postExpanded, setPostExpanded] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [pictureSrc, setPictureSrc] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const pictureSrc = post?.ownerId?.profilePictureUrl;
    setPictureSrc(pictureSrc);
  }, [post]);

  // Handle mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // Fetch comments for the post

  const fetchComments = useCallback(async () => {
    try {
      if (!post || !post._id) return;
      const { userData } = appData;
      const result = await getCommentsByParent(post._id, userData.token);
      console.log(`getCommentsByParent() result: ${JSON.stringify(result.data, null, 2)}`);
      const comments = result.comments;
      console.log('comments', comments);
      setComments(comments);
    } catch (e) {
      console.warn('Error in comment/getCommentsByParent()', e.message)
      throw e
    }
  }, [appData, post]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);


  // Focus input when modal opens
  useEffect(() => {
    if (show && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [show]);

  const handleClose = () => {
    setCommentText('');
    setPostExpanded(false);
    setExpandedComments({});
    onHide();
  };

  // Handle post comment
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (commentText.trim()) {

      const commentObj = {
        ownerId: appData.userData.user._id,
        parentId: post._id,
        parentType: 'post',
        commentContent: commentText
      }
      const result = await createComment({ commentObj, token: appData.userData.token });
      console.log('createComment() result', result);  
      setCommentText('');
      fetchComments();
      appData.updatePosts();
    }
  };
  // Date to human readable format
  const dateToLocaleString = (isoDate) => {
    if (!isoDate) return null;
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  // Truncation logic for content
  const getTruncatedContent = (content, isExpanded, contentId = null) => {
    if (!content) return '';
    const charLimit = isMobile ? 140 : 300;
    const shouldTruncate = content.length > charLimit;
    
    if (shouldTruncate && !isExpanded) {
      return content.substring(0, charLimit) + '...';
    }
    return content;
  };

  // Check if content should be truncated
  const shouldTruncate = (content) => {
    if (!content) return false;
    const charLimit = isMobile ? 140 : 300;
    return content.length > charLimit;
  };

  // Toggle comment expanded state
  const toggleCommentExpanded = (commentId) => {
    setExpandedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  if (!post) return null;

  return (
    <>
      {!isMobile && show && (
        <style>
          {`
            .modal-dialog.comments-modal-desktop {
              max-width: 600px !important;
              width: 90% !important;
            }
          `}
        </style>
      )}
      <Modal
        show={show}
        onHide={handleClose}
        centered
        backdrop="static"
        keyboard={false}
        dialogClassName={!isMobile ? 'comments-modal-desktop' : ''}
        style={{
          zIndex: 1050
        }}
      >
        <Modal.Header
          style={{
            borderBottom: '1px solid #e5e7eb',
            padding: isMobile ? '16px' : '20px',
            backgroundColor: '#ffffff',
            borderRadius: '8px 8px 0 0',
            position: 'relative'
          }}
        >
          <Modal.Title
            style={{
              fontSize: isMobile ? '18px' : '20px',
              fontWeight: '700',
              color: '#1e3a5f',
              margin: 0,
              width: '100%',
              textAlign: 'center'
            }}
          >
            Comments
          </Modal.Title>
          <button
            type="button"
            onClick={handleClose}
            style={{
              position: 'absolute',
              right: isMobile ? '16px' : '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              color: '#6b7280',
              cursor: 'pointer',
              padding: '0',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f3f4f6';
              e.target.style.color = '#1e3a5f';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#6b7280';
            }}
          >
            ×
          </button>
        </Modal.Header>

        <Modal.Body
          style={{
            padding: 0,
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: isMobile ? '70vh' : '80vh',
            overflow: 'hidden'
          }}
        >
          {/* Post Preview */}
          { (
            <div
              style={{
                padding: isMobile ? '16px' : '20px',
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              { !pictureSrc && <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4285f4 0%, #1e3a5f 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '16px',
                    marginRight: '12px',
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(66, 133, 244, 0.3)'
                  }}
                >
                  {post.authorInitial}
                </div>}
                { pictureSrc && (
                  <AuthMediaViewer src={pictureSrc} token={appData?.userData?.token} alt="Profile Picture" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'contain' }} />
                )}
                <div style={{ flexGrow: 1 }}>
                  <div
                    style={{
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#1e3a5f',
                      marginBottom: '2px'
                    }}
                  >
                    {post.ownerId?.name || post.ownerId?.email}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#6b7280'
                    }}
                  >
                    {dateToLocaleString(post.createdAt)}
                  </div>
                </div>
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: '#374151',
                  lineHeight: '1.5',
                  paddingLeft: '52px'
                }}
              >
                <MarkdownFormat content={getTruncatedContent(post?.postContent, postExpanded)} />
                {shouldTruncate(post?.postContent) && (
                  <button
                    type="button"
                    onClick={() => setPostExpanded(!postExpanded)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#4285f4',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                      padding: '4px 0',
                      marginTop: '8px',
                      textAlign: 'left',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#1e3a5f';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#4285f4';
                    }}
                  >
                    {postExpanded ? 'Read less' : 'Read more'}
                  </button>
                )}
              </div>
            </div>)}

          {/* Comments List */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: isMobile ? '16px' : '20px',
              backgroundColor: '#ffffff'
            }}
          >
            {comments.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#6b7280'
                }}
              >
                <p style={{ margin: 0, fontSize: '14px' }}>No comments yet.</p>
                <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>Be the first to comment!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    style={{
                      display: 'flex',
                      gap: '12px'
                    }}
                  >
                    {/* Comment Avatar */}
                     {!comment.ownerId?.profilePictureUrl && <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #4285f4 0%, #1e3a5f 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          fontWeight: '600',
                          fontSize: '14px',
                          flexShrink: 0,
                          boxShadow: '0 2px 6px rgba(66, 133, 244, 0.3)'
                        }}
                      >
                        {comment.authorInitial}
                      </div>}
                      { comment.ownerId?.profilePictureUrl && (
                        <AuthMediaViewer src={comment.ownerId?.profilePictureUrl} token={appData?.userData?.token} alt="Profile Picture" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'contain' }} />
                      )}

                    {/* Comment Content */}
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <div
                        style={{
                          backgroundColor: '#f3f4f6',
                          borderRadius: '18px',
                          padding: '10px 14px',
                          marginBottom: '4px'
                        }}
                      >
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#1e3a5f',
                            marginBottom: '4px'
                          }}
                        >
                          {comment.ownerId?.name || comment.ownerId?.email}
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            color: '#374151',
                            lineHeight: '1.5',
                            wordBreak: 'break-word'
                          }}
                        >
                          <MarkdownFormat content={getTruncatedContent(comment.commentContent, expandedComments[comment._id], comment._id)} />
                          {shouldTruncate(comment.commentContent) && (
                            <button
                              type="button"
                              onClick={() => toggleCommentExpanded(comment._id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#4285f4',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: '600',
                                padding: '4px 0',
                                marginTop: '8px',
                                textAlign: 'left',
                                transition: 'color 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.color = '#1e3a5f';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.color = '#4285f4';
                              }}
                            >
                              {expandedComments[comment._id] ? 'Read less' : 'Read more'}
                            </button>
                          )}
                        </div>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          paddingLeft: '4px',
                          marginTop: '4px'
                        }}
                      >
                        <span
                          style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            fontWeight: '500'
                          }}
                        >
                          {dateToLocaleString(comment.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comment Input Area */}
          <div
            style={{
              borderTop: '1px solid #e5e7eb',
              padding: isMobile ? '12px 16px' : '16px 20px',
              backgroundColor: '#ffffff'
            }}
          >
            <form onSubmit={handlePostComment} style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4285f4 0%, #1e3a5f 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: '600',
                  fontSize: '14px',
                  flexShrink: 0,
                  boxShadow: '0 2px 6px rgba(66, 133, 244, 0.3)'
                }}
              >
                U
              </div>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#f3f4f6',
                    border: '2px solid #e5e7eb',
                    borderRadius: '20px',
                    fontSize: '14px',
                    color: '#1e3a5f',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#4285f4';
                    e.target.style.backgroundColor = '#ffffff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.backgroundColor = '#f3f4f6';
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={!commentText.trim()}
                style={{
                  padding: '10px 20px',
                  background: commentText.trim()
                    ? 'linear-gradient(135deg, #4285f4 0%, #1e3a5f 100%)'
                    : '#d1d5db',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ffffff',
                  cursor: commentText.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  boxShadow: commentText.trim() ? '0 2px 8px rgba(66, 133, 244, 0.3)' : 'none',
                  opacity: commentText.trim() ? 1 : 0.6,
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  if (commentText.trim()) {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(66, 133, 244, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (commentText.trim()) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 8px rgba(66, 133, 244, 0.3)';
                  }
                }}
              >
                Post
              </button>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Comments;

