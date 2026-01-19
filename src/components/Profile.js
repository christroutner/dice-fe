/**
 *  Profile component for user profile management
 */
import React, { useState, useEffect, useRef } from 'react';
import { Container, Button, Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Upload, Camera } from 'lucide-react';
import config from '../config';
import UppyDashboard from './UppyDashboard';
import AuthMediaViewer from './AuthMediaViewer';
import { uploadFile } from '../services/files';
import { updateUser, authUser } from '../services/auth';
import { toast } from 'react-toastify';

function Profile({ appData }) {
  const { userData, setUserData, updateLocalStorage } = appData;
  const uppyDashboardRef = useRef(null);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'password'
  
  // Form states
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [showProfilePictureModal, setShowProfilePictureModal] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null); // file to upload to the server
  const [profilePictureSrc, setProfilePictureSrc] = useState(null);

  // Handle mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize form with user data
  useEffect(() => {
    if (userData?.user) {
      setEmail(userData.user.email || '');
      setName(userData.user.name || '');
      setProfilePictureSrc(userData.user.profilePictureUrl);
    }
  }, [userData]);

  // Handle update profile
  const handleUpdateProfile = async (e) => {
    try {
      e.preventDefault();
      const token = userData?.token;

      let url = userData?.user?.profilePictureUrl;
      // Upload profile picture if fileToUpload is not null
      if (fileToUpload) {
        const uploadedFileResponse = await uploadFile({ file: fileToUpload.data, token });
        url = `${config.pmaServer}/files/${uploadedFileResponse.fileRef}`
      }
      // Create profile object
      const profileObj = {
        name: name,
        email: email,
        profilePictureUrl: url
      }

      // Update user profile
      const profileResponse = await updateUser({ userId: userData?.user?._id, userObj: profileObj, token });
      console.log('Profile Response: ', profileResponse);
      const newUserData = { ...userData, user: profileResponse.user };
      setUserData(newUserData);
      updateLocalStorage({ userData: newUserData });
      setProfilePictureSrc(url);
      setFileToUpload(null);
      setProfilePicturePreview(null);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Error updating profile: ' + error.message);
    }
  }

  // Handle change password 
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const { user, token } = userData;
    // Check if password and confirm password match
    try {
      if (newPassword !== confirmPassword) {
        throw new Error('Password Does not match');
      }
      // Check if old password is correct
      const authResponse = await authUser({ email: user.email, password: currentPassword });
      if (!authResponse.token) {
        throw new Error('Invalid Old Password');
      }
      // Update user password
      const updateUserResponse = await updateUser({ userId: userData?.user?._id, userObj: { password: newPassword }, token });
      console.log('Update User Response: ', updateUserResponse);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password changed successfully');
    } catch (error) {
      if (error.message.includes('401')) {
        toast.error('Invalid Old Password');
        return
      }
      toast.error('Error changing password: ' + error.message);
    }
  }

  // handle uppy changes
  const onChangeFileAdded = (file) => {
    console.log('File added: ', file);
    try {
      if (!file) {
        /**Revoke the object URL */
        setProfilePictureSrc(userData?.user?.profilePictureUrl);
        setFileToUpload(null);
        setProfilePicturePreview(null);
        return;
      }
      /**Create a new object URL */
      if (fileToUpload) {
        URL.revokeObjectURL(fileToUpload.data);
      }
      const imageSrc = window.URL.createObjectURL(file.data);
      setProfilePicturePreview(imageSrc);
      setProfilePictureSrc(imageSrc);
      setShowProfilePictureModal(false);
      setFileToUpload(file);
    } catch (error) {
      console.error('Error creating object URL: ', error);
    }
  }

  // Handle profile picture change via camera button
  const handleProfilePictureChange = (e) => {
    setShowProfilePictureModal(true);
  };

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
          {/* Back button */}
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              color: '#1e3a5f',
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <ChevronLeft size={20} />
            Back
          </button>

          {/* Title */}
          <h1
            style={{
              fontSize: isMobile ? '20px' : '24px',
              fontWeight: '700',
              color: '#1e3a5f',
              margin: 0,
              flex: 1,
              textAlign: 'center'
            }}
          >
            Edit Profile
          </h1>

          {/* Logout button */}
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
            maxWidth: isMobile ? '100%' : '800px',
            margin: '0 auto'
          }}
        >
          {/* Profile Header Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              marginBottom: '20px'
            }}
          >
            {/* Banner Photo Area */}
            <div
              style={{
                height: isMobile ? '150px' : '200px',
                background: 'linear-gradient(135deg, #4285f4 0%, #1e3a5f 100%)',
                position: 'relative'
              }}
            >
              <button
                type="button"
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  padding: '8px 16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1e3a5f',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#ffffff';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <Upload size={16} />
                Edit Banner
              </button>
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
                  {profilePicturePreview ? (
                    <img
                      src={profilePicturePreview}
                      alt="Profile"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : profilePictureSrc && userData?.token ? (
                    <AuthMediaViewer 
                      src={profilePictureSrc} 
                      token={userData.token} 
                      alt="Profile Picture" 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        borderRadius: '50%'
                      }} 
                    />
                  ) : (
                    name ? name.charAt(0).toUpperCase() : 'U'
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleProfilePictureChange}
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    width: isMobile ? '36px' : '40px',
                    height: isMobile ? '36px' : '40px',
                    borderRadius: '50%',
                    backgroundColor: '#4285f4',
                    border: '3px solid #ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                    padding: 0
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#1e3a5f';
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#4285f4';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <Camera size={20} color="white" />
                </button>
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
                  {name || 'User Name'}
                </h2>
                <p
                  style={{
                    fontSize: '15px',
                    color: '#6b7280',
                    margin: 0
                  }}
                >
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: isMobile ? '20px' : '24px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              marginBottom: '20px'
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '8px',
                borderBottom: '2px solid #e5e7eb',
                marginBottom: '24px'
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                style={{
                  padding: '12px 24px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'profile' ? '3px solid #4285f4' : '3px solid transparent',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: activeTab === 'profile' ? '#4285f4' : '#6b7280',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginBottom: '-2px'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'profile') {
                    e.target.style.color = '#4285f4';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'profile') {
                    e.target.style.color = '#6b7280';
                  }
                }}
              >
                Profile Information
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('password')}
                style={{
                  padding: '12px 24px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'password' ? '3px solid #4285f4' : '3px solid transparent',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: activeTab === 'password' ? '#4285f4' : '#6b7280',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginBottom: '-2px'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'password') {
                    e.target.style.color = '#4285f4';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'password') {
                    e.target.style.color = '#6b7280';
                  }
                }}
              >
                Password & Security
              </button>
            </div>

            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleUpdateProfile}>
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1e3a5f',
                    marginBottom: '24px'
                  }}
                >
                  Edit Profile Information
                </h3>

                {/* Name Field */}
                <div style={{ marginBottom: '24px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1e3a5f',
                      marginBottom: '8px'
                    }}
                  >
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      backgroundColor: '#f9fafb',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
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

                {/* Email Field */}
                <div style={{ marginBottom: '24px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1e3a5f',
                      marginBottom: '8px'
                    }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      backgroundColor: '#f9fafb',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
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
                  <p
                    style={{
                      fontSize: '13px',
                      color: '#6b7280',
                      marginTop: '6px',
                      marginBottom: 0
                    }}
                  >
                    Your email address is used for account recovery and notifications.
                  </p>
                </div>

                {/* Save Button */}
                <Button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'linear-gradient(135deg, #4285f4 0%, #1e3a5f 100%)',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(66, 133, 244, 0.4)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(66, 133, 244, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(66, 133, 244, 0.4)';
                  }}
                >
                  Save Changes
                </Button>
              </form>
            )}

            {/* Password & Security Tab */}
            {activeTab === 'password' && (
              <form onSubmit={handleChangePassword}>
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1e3a5f',
                    marginBottom: '24px'
                  }}
                >
                  Change Password
                </h3>

                {/* Current Password */}
                <div style={{ marginBottom: '24px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1e3a5f',
                      marginBottom: '8px'
                    }}
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      backgroundColor: '#f9fafb',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
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

                {/* New Password */}
                <div style={{ marginBottom: '24px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1e3a5f',
                      marginBottom: '8px'
                    }}
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      backgroundColor: '#f9fafb',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
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

                {/* Confirm Password */}
                <div style={{ marginBottom: '24px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1e3a5f',
                      marginBottom: '8px'
                    }}
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      backgroundColor: '#f9fafb',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
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

                {/* Update Password Button */}
                <Button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'linear-gradient(135deg, #4285f4 0%, #1e3a5f 100%)',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(66, 133, 244, 0.4)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(66, 133, 244, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(66, 133, 244, 0.4)';
                  }}
                >
                  Update Password
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Profile Picture Modal */}
      <Modal show={showProfilePictureModal} onHide={() => setShowProfilePictureModal(false)}>
        <ModalHeader>
          <ModalTitle>Change Profile Picture</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <UppyDashboard ref={uppyDashboardRef} onChange={onChangeFileAdded} allowedFileTypes={['image/*']} maxNumberOfFiles={1} />
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setShowProfilePictureModal(false)}>Close</Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
}

export default Profile;
