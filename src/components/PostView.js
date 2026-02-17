/**
 *  Component to view a single post
 */
import React, { useCallback, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getHydratedPost } from '../services/post';
import NewsCard from './NewsCard';
import Comments from './Comments';

import { Container } from 'react-bootstrap';

function PostView({ appData }) {


  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { postId } = useParams();
  const [showComments, setShowComments] = useState(false);


  // Handle mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // Fetch post data 
  // Also use for updating the post on post action like edit, delete, etc.
  const fetchPostData = useCallback(async () => {
    try {
      const postResponse = await getHydratedPost(postId, appData?.userData?.token);
      setPost(postResponse.post);

    } catch (error) {
      return false
    }
  }, [postId, appData?.userData?.token]);

  // Fetch post data on component mount and when postId exists
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        await fetchPostData();
        setLoading(false);
        setLoaded(true);
      } catch (error) {
        console.error('Error in getPost()', error);
        setLoading(false);
        setLoaded(true);
      }
    }
    if (!loaded && !loading) {
      fetchPost();
    }
  }, [fetchPostData, loaded, loading]);

  return (
    <Container
      fluid
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2d4a6b 50%, #1a2f4a 100%)',
        padding: 0,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background decorative elements */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(66, 133, 244, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(66, 133, 244, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0
        }}
      />

      {/* Content Area */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          zIndex: 1,
          overflowY: 'auto',
          padding: isMobile ? '20px 10px' : '40px 20px'
        }}
      >
        <div
          style={{
            maxWidth: isMobile ? '100%' : '680px',
            margin: '0 auto'
          }}
        >
          {loading && <div style={{ color: '#ffffff' }}>Loading...</div>}
          {!loading && post && (
            <NewsCard
              post={post}
              isMobile={false}
              onCommentClick={() => setShowComments(true)}
              appData={appData}
              onUpdatePost={fetchPostData}
            />
          )}
          {loaded && !post && <div style={{ color: '#ffffff' , textAlign: 'center' }}>Post not found</div>}
        </div>
      </div>
      {showComments && (
        <Comments
          show={showComments}
          onHide={() => setShowComments(false)}
          post={post}
          appData={appData}
          onUpdateComments={() => {
            fetchPostData();
          }}
        />
      )}
      
    </Container>
  );
};

export default PostView;