/*

  Component to map and display the news feed
*/
import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Comments from './Comments';
import NewsCard from './NewsCard';

function NewsFeed({ appData }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [postFetched, setPostFetched] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showComments, setShowComments] = useState(false);

  // Handle mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update posts local state with the posts from the global state appData
  useEffect(() => {
    setPosts(appData.posts);
  }, [appData.posts]);

  // Update posts from the global state appData
  useEffect(() => {
    if (!postFetched) {
      appData.updatePosts();
      setPostFetched(true);
    }
  }, [appData, postFetched]);


  return (
    <Container
      fluid
      style={{
        minHeight: '100vh',
        padding: isMobile ? '20px 10px' : '40px 20px',
        maxWidth: isMobile ? '100%' : '680px',
        margin: '0 auto'
      }}
    >
      {/* News Feed Header */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: isMobile ? '20px' : '24px',
          marginBottom: '20px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <h2
          style={{
            fontSize: isMobile ? '24px' : '28px',
            fontWeight: '700',
            color: '#1e3a5f',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          News Feed
        </h2>
        <p
          style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: '8px 0 0 0'
          }}
        >
          Stay updated with the latest posts from your community
        </p>
      </div>

      {/* Posts Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {posts.map((post) => (
          <NewsCard
            key={post._id}
            post={post}
            isMobile={isMobile}
            onCommentClick={(post) => {
              setSelectedPost(post);
              setShowComments(true);
            }}
            appData={appData}
            onUpdatePost={(post) => {
              appData.updatePosts();
            }}
          />
        ))}
      </div>

      {/* Comments Modal */}
      <Comments
        show={showComments}
        onHide={() => {
          setShowComments(false);
          setSelectedPost(null);
        }}
        post={selectedPost}
        appData={appData}
        onUpdateComments={() => {
          appData.updatePosts();
        }}
      />
    </Container>
  );
}

export default NewsFeed;

