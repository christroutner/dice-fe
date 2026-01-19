/**
 *  Dashboard component
 */
import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import Post from './Post';
import NewsFeed from './NewsFeed';

function Dashboard({appData}) {
  const navigate = useNavigate();
  const [showPostModal, setShowPostModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

      {/* Header */}
      <div
        style={{
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          borderBottom: '1px solid #e5e7eb'
        }}
      >
        <div
          style={{
            maxWidth: isMobile ? '100%' : '1200px',
            margin: '0 auto',
            padding: isMobile ? '12px 16px' : '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          {/* Logo/Title */}
          <h1
            style={{
              fontSize: isMobile ? '20px' : '24px',
              fontWeight: '700',
              color: '#1e3a5f',
              margin: 0
            }}
          >
            Marketplace App
          </h1>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}
          >
            <Button
              onClick={() => setShowPostModal(true)}
              style={{
                padding: isMobile ? '8px 16px' : '10px 20px',
                background: 'linear-gradient(135deg, #4285f4 0%, #1e3a5f 100%)',
                border: 'none',
                borderRadius: '10px',
                fontSize: isMobile ? '13px' : '14px',
                fontWeight: '600',
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(66, 133, 244, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(66, 133, 244, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(66, 133, 244, 0.3)';
              }}
            >
              Create Post
            </Button>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              style={{
                padding: isMobile ? '8px 16px' : '10px 20px',
                background: '#f3f4f6',
                border: 'none',
                borderRadius: '10px',
                fontSize: isMobile ? '13px' : '14px',
                fontWeight: '600',
                color: '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#e5e7eb';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
              }}
            >
              <User size={16} />
              Profile
            </button>
            <button
              type="button"
              onClick={() => appData.logout()}
              style={{
                padding: isMobile ? '8px 16px' : '10px 20px',
                background: '#f3f4f6',
                border: 'none',
                borderRadius: '10px',
                fontSize: isMobile ? '13px' : '14px',
                fontWeight: '600',
                color: '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#e5e7eb';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

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
        <NewsFeed appData={appData} />
      </div>

      <Post show={showPostModal} onHide={() => setShowPostModal(false)} appData={appData} />
    </Container>
  );
}

export default Dashboard;
