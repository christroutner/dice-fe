/**
 *  Members component to display all users in the database
 */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Users, ChevronLeft, Search, Menu } from 'lucide-react';
import { getAllUsers } from '../services/auth';
import { getHydratedPosts } from '../services/post';
import AuthMediaViewer from './AuthMediaViewer';
import MobileMenu from './MobileMenu';
import { toast } from 'react-toastify';

function Members({ appData }) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userPostCounts, setUserPostCounts] = useState({});
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Handle mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch all users and their post counts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = appData?.userData?.token;

        if (!token) {
          toast.error('Please log in to view members');
          navigate('/login');
          return;
        }

        // Fetch all users
        const usersResponse = await getAllUsers({ token });
        console.log('getAllUsers() result:', usersResponse);
        
        // Handle different response structures
        const usersListArray = usersResponse.users || usersResponse.data?.users || (Array.isArray(usersResponse) ? usersResponse : []);
      
        // remove type admin from usersList
        const usersList = usersListArray.filter(user => user.type !== 'admin');
        setUsers(usersList);
        setFilteredUsers(usersList);

        // Fetch all posts to count posts per user
        const postsResponse = await getHydratedPosts(token);
        const posts = postsResponse.posts || [];
        
        // Count posts per user
        const counts = {};
        posts.forEach(post => {
          const userId = post.ownerId?._id || post.ownerId;
          if (userId) {
            counts[userId] = (counts[userId] || 0) + 1;
          }
        });
        setUserPostCounts(counts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Error loading members: ' + error.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [appData, navigate]);

  // Filter users based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = users.filter(user => {
      const name = (user.name || '').toLowerCase();
      const email = (user.email || '').toLowerCase();
      return name.includes(query) || email.includes(query);
    });
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

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
        <div style={{ color: '#ffffff', fontSize: '18px' }}>Loading members...</div>
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
            gap: '16px',
            flexWrap: 'wrap'
          }}
        >
          {/* Back button or Menu button on mobile */}
          {isMobile ? (
            <button
              type="button"
              onClick={() => setShowMobileMenu(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f3f4f6',
                border: 'none',
                color: '#374151',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '10px',
                transition: 'all 0.2s ease',
                width: '40px',
                height: '40px'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#e5e7eb';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
              }}
            >
              <Menu size={24} />
            </button>
          ) : (
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
          )}

          {/* Title */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Users size={24} color="#1e3a5f" />
            <h1
              style={{
                fontSize: isMobile ? '20px' : '24px',
                fontWeight: '700',
                color: '#1e3a5f',
                margin: 0
              }}
            >
              Members
            </h1>
            <span
              style={{
                fontSize: '14px',
                color: '#6b7280',
                fontWeight: '500'
              }}
            >
              ({filteredUsers.length})
            </span>
          </div>

          {/* Logout button - only show on desktop */}
          {!isMobile && (
            <button
              type="button"
              onClick={() => appData.logout()}
              style={{
                padding: '10px 20px',
                background: '#f3f4f6',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
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
          )}
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
        <div
          style={{
            maxWidth: isMobile ? '100%' : '1200px',
            margin: '0 auto'
          }}
        >
          {/* Search Bar */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: isMobile ? '16px' : '20px',
              marginBottom: '20px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Search
                size={20}
                color="#6b7280"
                style={{
                  position: 'absolute',
                  left: '16px',
                  pointerEvents: 'none'
                }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search members by name or email..."
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 48px',
                  backgroundColor: '#f9fafb',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '15px',
                  color: '#1e3a5f',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4285f4';
                  e.target.style.backgroundColor = '#ffffff';
                  e.target.style.boxShadow = '0 0 0 3px rgba(66, 133, 244, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.backgroundColor = '#f9fafb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Members Grid */}
          {filteredUsers.length === 0 ? (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                padding: '60px 20px',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}
            >
              <p style={{ margin: 0, fontSize: '16px', fontWeight: '500', color: '#6b7280' }}>
                {searchQuery ? 'No members found matching your search.' : 'No members found.'}
              </p>
            </div>
          ) : (
            <Row className="g-4">
              {filteredUsers.map((user) => {
                const userId = user._id || user.id;
                const postCount = userPostCounts[userId] || 0;
                
                return (
                  <Col
                    key={userId}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={3}
                  >
                    <div
                      onClick={() => navigate(`/user/${userId}`)}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '20px',
                        padding: isMobile ? '20px' : '24px',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        height: '100%'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                    {/* Profile Picture */}
                    <div
                      style={{
                        width: isMobile ? '100px' : '120px',
                        height: isMobile ? '100px' : '120px',
                        borderRadius: '50%',
                        border: '4px solid #ffffff',
                        background: 'linear-gradient(135deg, #4285f4 0%, #1e3a5f 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontWeight: '600',
                        fontSize: isMobile ? '40px' : '48px',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                        marginBottom: '16px'
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
                        (user.name ? user.name.charAt(0).toUpperCase() : user.email ? user.email.charAt(0).toUpperCase() : 'U')
                      )}
                    </div>

                    {/* User Name */}
                    <h3
                      style={{
                        fontSize: isMobile ? '18px' : '20px',
                        fontWeight: '700',
                        color: '#1e3a5f',
                        margin: '0 0 4px 0',
                        wordBreak: 'break-word'
                      }}
                    >
                      {user.name || user.email}
                    </h3>

                    {/* Email (if name exists) */}
                    {user.name && user.email && (
                      <p
                        style={{
                          fontSize: '14px',
                          color: '#6b7280',
                          margin: '0 0 12px 0',
                          wordBreak: 'break-word'
                        }}
                      >
                        {user.email}
                      </p>
                    )}

                    {/* Stats */}
                    <div
                      style={{
                        display: 'flex',
                        gap: '16px',
                        marginTop: '8px',
                        paddingTop: '16px',
                        borderTop: '1px solid #e5e7eb',
                        width: '100%',
                        justifyContent: 'center'
                      }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            color: '#1e3a5f',
                            marginBottom: '4px'
                          }}
                        >
                          {postCount}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            fontWeight: '500'
                          }}
                        >
                          {postCount === 1 ? 'Post' : 'Posts'}
                        </div>
                      </div>
                    </div>

                    {/* View Profile Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/user/${userId}`);
                      }}
                      style={{
                        width: '100%',
                        marginTop: '16px',
                        padding: '10px 20px',
                        background: 'linear-gradient(135deg, #4285f4 0%, #1e3a5f 100%)',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '14px',
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
                      View Profile
                    </button>
                    </div>
                  </Col>
                );
              })}
            </Row>
          )}
        </div>
      </div>
      <MobileMenu 
        appData={appData} 
        show={showMobileMenu} 
        onHide={() => setShowMobileMenu(false)}
      />
    </Container>
  );
}

export default Members;
