/**
 *  UserProfile component to view another user's profile
 */
import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { getUser } from '../services/auth';
import { getHydratedPosts } from '../services/post';
import AuthMediaViewer from './AuthMediaViewer';
import NewsCard from './NewsCard';
import Comments from './Comments';
import { toast } from 'react-toastify';

function UserProfile({ appData }) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // Handle mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch user data and posts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const token = appData?.userData?.token;

        if (!token) {
          toast.error('Please log in to view profiles');
          navigate('/login');
          return;
        }

        // Fetch user data
        const userResponse = await getUser({ userId, token });
        console.log('getUser() result:', userResponse);
        setUser(userResponse.user);

        // Fetch all posts and filter by this user
        const postsResponse = await getHydratedPosts(token);
        console.log('getHydratedPosts() result:', postsResponse);
        
        // Filter posts by ownerId and sort by date (reverse-chronological)
        const filteredPosts = postsResponse.posts
          .filter(post => post.ownerId?._id === userId || post.ownerId === userId)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setUserPosts(filteredPosts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Error loading user profile: ' + error.message);
        setLoading(false);
        navigate('/dashboard');
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId, appData, navigate]);

  if (loading) {
    return (
      <Container 
        fluid 
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2d4a6b 50%, #1a2f4a 100%)'
        }}
      >
        <div style={{ color: '#ffffff', fontSize: '18px' }}>Loading...</div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container 
        fluid 
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2d4a6b 50%, #1a2f4a 100%)'
        }}
      >
        <div style={{ color: '#ffffff', fontSize: '18px' }}>User not found</div>
      </Container>
    );
  }

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
            alignItems: 'center',
            gap: '16px'
          }}
        >
          {/* Back button */}
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              color: '#1e3a5f',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <ChevronLeft size={24} />
          </button>

          {/* Title */}
          <div>
            <h1
              style={{
                fontSize: isMobile ? '18px' : '20px',
                fontWeight: '700',
                color: '#1e3a5f',
                margin: 0
              }}
            >
              {user.name || user.email}
            </h1>
            <p
              style={{
                fontSize: '13px',
                color: '#6b7280',
                margin: 0
              }}
            >
              {userPosts.length} {userPosts.length === 1 ? 'post' : 'posts'}
            </p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          zIndex: 1,
          overflowY: 'auto'
        }}
      >
        <div
          style={{
            maxWidth: isMobile ? '100%' : '800px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            minHeight: '100vh'
          }}
        >
          {/* Profile Header Card */}
          <div
            style={{
              position: 'relative',
              marginBottom: '20px'
            }}
          >
            {/* Banner Photo Area */}
            <div
              style={{
                height: isMobile ? '150px' : '200px',
                background: 'linear-gradient(135deg, #4285f4 0%, #1e3a5f 100%)',
                position: 'relative',
                width: '100%'
              }}
            >
              {user.bannerPictureUrl && (
                <AuthMediaViewer 
                  src={user.bannerPictureUrl} 
                  token={appData?.userData?.token} 
                  alt="Banner" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover'
                  }} 
                />
              )}
            </div>

            {/* Profile Picture and Info Section */}
            <div
              style={{
                padding: isMobile ? '20px' : '24px',
                paddingTop: isMobile ? '60px' : '80px',
                position: 'relative'
              }}
            >
              {/* Profile Picture */}
              <div
                style={{
                  position: 'absolute',
                  top: isMobile ? '-60px' : '-80px',
                  left: isMobile ? '20px' : '24px'
                }}
              >
                <div
                  style={{
                    width: isMobile ? '120px' : '160px',
                    height: isMobile ? '120px' : '160px',
                    borderRadius: '50%',
                    border: '4px solid #ffffff',
                    background: 'linear-gradient(135deg, #4285f4 0%, #1e3a5f 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: isMobile ? '48px' : '64px',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  {user.profilePictureUrl && appData?.userData?.token ? (
                    <AuthMediaViewer 
                      src={user.profilePictureUrl} 
                      token={appData.userData.token} 
                      alt="Profile Picture" 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        borderRadius: '50%'
                      }} 
                    />
                  ) : (
                    (user.name ? user.name.charAt(0).toUpperCase() : 'U')
                  )}
                </div>
              </div>

              {/* User Name Display */}
              <div style={{ marginTop: isMobile ? '20px' : '24px' }}>
                <h2
                  style={{
                    fontSize: isMobile ? '24px' : '28px',
                    fontWeight: '700',
                    color: '#1e3a5f',
                    margin: '0 0 4px 0'
                  }}
                >
                  {user.name || user.email}
                </h2>
                {user.email && user.name && (
                  <p
                    style={{
                      fontSize: '15px',
                      color: '#6b7280',
                      margin: '0 0 8px 0'
                    }}
                  >
                    {user.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Posts Section */}
          <div
            style={{
              padding: isMobile ? '0 10px 20px 10px' : '0 20px 40px 20px'
            }}
          >
            {userPosts.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  color: '#6b7280'
                }}
              >
                <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>
                  No posts yet
                </p>
                <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
                  This user hasn't shared anything yet.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {userPosts.map((post) => (
                  <NewsCard
                    key={post._id}
                    post={post}
                    isMobile={isMobile}
                    onCommentClick={(post) => {
                      setSelectedPost(post);
                      setShowComments(true);
                    }}
                    appData={appData}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
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
      />
    </Container>
  );
}

export default UserProfile;
