/**
 *  Component to display a news card
 */
import React, { useState } from 'react';
import ImageGallery from './ImageGallery';
import ImageModal from './ImageModal';
import { updatePost } from '../services/post';
import MarkdownFormat from './MarkdownFormat';
function NewsCard({ post, isMobile, onCommentClick, appData }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle like click
  const handleLikeClick = async (post) => {
    console.log('handleLikeClick() post: ', post);

    // Update the post likes array with the new like /dislike

    let newLikes = [];
    if (post.likes.includes(appData.userData.user._id)) {
      // if exist in the likes array, remove the like

      newLikes = post.likes.filter(like => like !== appData.userData.user._id);
    } else {
      // if not exist in the likes array, add the like
      newLikes = [...post.likes, appData.userData.user._id];
    }
    const postObj = {
      likes: newLikes
    }

    const result = await updatePost({ postId: post._id, postObj, token: appData.userData.token });
    console.log('updatePost() result: ', result);
    appData.updatePosts();
  }

  // Date to human readable format
  const dateToLocaleString = (isoDate) => {
    if (!isoDate) return null;
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  // Check if content should be truncated and truncate it
  // Mobile: 140 chars, Desktop: 300 chars
  const charLimit = isMobile ? 140 : 300;
  const shouldTruncate = post.postContent && post.postContent.length > charLimit;
  const displayContent = shouldTruncate && !isExpanded 
    ? post.postContent.substring(0, charLimit) + '...'
    : post.postContent;
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: isMobile ? '20px' : '24px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
      }}
    >
      {/* Post Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '16px'
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: isMobile ? '48px' : '56px',
            height: isMobile ? '48px' : '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4285f4 0%, #1e3a5f 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: '600',
            fontSize: isMobile ? '18px' : '20px',
            marginRight: '12px',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(66, 133, 244, 0.3)'
          }}
        >
          {post.authorInitial}
        </div>

        {/* Author Info */}
        <div style={{ flexGrow: 1 }}>
          <div
            style={{
              fontSize: isMobile ? '16px' : '18px',
              fontWeight: '600',
              color: '#1e3a5f',
              marginBottom: '4px'
            }}
          >
            {post.ownerId?.name || post.ownerId?.email}
          </div>
          <div
            style={{
              fontSize: '13px',
              color: '#6b7280'
            }}
          >
            {dateToLocaleString(post.createdAt)}
          </div>
        </div>

        {/* More Options */}
        <button
          type="button"
          style={{
            background: 'none',
            border: 'none',
            color: '#6b7280',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            width: '36px',
            height: '36px'
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
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>
      </div>

      {/* Post Content */}
      <div
        style={{
          fontSize: isMobile ? '15px' : '16px',
          color: '#374151',
          lineHeight: '1.6',
          marginBottom: post.images && post.images.length > 0 ? '16px' : '20px',
          whiteSpace: 'pre-wrap'
        }}
      >
        <MarkdownFormat content={displayContent} />
        {shouldTruncate && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: 'none',
              border: 'none',
              color: '#4285f4',
              cursor: 'pointer',
              fontSize: isMobile ? '14px' : '15px',
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
            {isExpanded ? 'Read less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Image Gallery */}
      {post.images && post.images.length > 0 && (
        <ImageGallery
          images={post.images}
          isMobile={isMobile}
          onImageClick={(image, index) => {
            setSelectedImageIndex(index);
            setShowImageModal(true);
          }}
        />
      )}

      {/* Post Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          paddingTop: '16px',
          borderTop: '1px solid #e5e7eb'
        }}
      >
        {/* Like Button */}
        <button
          type="button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            flex: 1,
            justifyContent: 'center',
            color:post.likes.includes(appData?.userData?.user?._id) ? '#4285f4' : '#6b7280'
          }}

          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f3f4f6';
            e.target.style.color = '#4285f4';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = post.likes.includes(appData?.userData?.user?._id) ? '#4285f4' : '#6b7280'
          }}
          onClick={() => handleLikeClick(post)}
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
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {post.likes.length}
        </button>

        {/* Comment Button */}
        <button
          type="button"
          onClick={() => onCommentClick(post)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: '#6b7280',
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            flex: 1,
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f3f4f6';
            e.target.style.color = '#4285f4';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#6b7280';
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
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          {post.totalComments}
        </button>

        {/* Share Button */}
        <button
          type="button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: '#6b7280',
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            flex: 1,
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f3f4f6';
            e.target.style.color = '#4285f4';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#6b7280';
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
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          {post.shares}
        </button>
      </div>

      {/* Image Modal */}
      {post.images && post.images.length > 0 && (
        <ImageModal
          show={showImageModal}
          onHide={() => {
            setShowImageModal(false);
          }}
          images={post.images}
          initialIndex={selectedImageIndex}
        />
      )}
    </div>
  );
}

export default NewsCard;

