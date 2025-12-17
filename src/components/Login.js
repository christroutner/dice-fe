import React, { useState, useEffect } from 'react';
import { Container, Form, Button, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.svg';
import { authUser } from '../services/auth';
import { toast } from 'react-toastify';

function Login({ appData}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Submit Auth request
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      console.log('Login submitted', { email, password, rememberMe });
      const authRes = await authUser({ email, password });
      // Store user data on local storage
      if (rememberMe) {
        appData.updateLocalStorage({ userData: authRes });
      }
      // Update user data state
      appData.setUserData(authRes);
      
      // Navigate to dashboard after successful login
      navigate('/dashboard');
    } catch (error) {
      toast.error("Login Error : " + error.message);
    }
  };

  return (
    <Container 
      fluid 
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2d4a6b 50%, #1a2f4a 100%)',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background style elements */}
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

      {/* Main content card */}
      <div
        style={{
          width: '100%',
          maxWidth: isMobile ? '100%' : '450px',
          minHeight: isMobile ? '600px' : '745px',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: isMobile ? '30px 25px' : '45px 40px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          position: 'relative',
          zIndex: 1,
          margin: '20px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '30px',
            margin: '0 auto 30px auto'
          }}
        >
          <img 
            src={logo} 
            alt="Logo" 
            style={{
              width: isMobile ? '120px' : '150px',
              height: 'auto',
              maxHeight: isMobile ? '40px' : '50px',
              objectFit: 'contain'
            }}
          />
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: isMobile ? '28px' : '36px',
            fontWeight: '700',
            color: '#1e3a5f',
            marginBottom: '8px',
            textAlign: 'center',
            letterSpacing: '-0.5px'
          }}
        >
          Marketplace App
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontSize: isMobile ? '13px' : '15px',
            color: '#6b7280',
            marginBottom: '35px',
            textAlign: 'center',
            lineHeight: '1.5'
          }}
        >
          Join local private groups, buy & sale easily
        </p>

        {/* Sign in section */}
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <h2
            style={{
              fontSize: isMobile ? '20px' : '24px',
              fontWeight: '600',
              color: '#1e3a5f',
              marginBottom: '8px',
              textAlign: 'left'
            }}
          >
            Sign in to your account
          </h2>

          <p
            style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '30px',
              textAlign: 'left'
            }}
          >
            Not a member?{' '}
            <button
              type="button"
              style={{
                color: '#4285f4',
                textDecoration: 'none',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'color 0.2s ease',
                background: 'none',
                border: 'none',
                padding: 0,
                font: 'inherit'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#1e3a5f';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#4285f4';
              }}
              onClick={() => {
                navigate('/signup');
              }}
            >
              Sign up
            </button>
          </p>

          <Form onSubmit={handleSubmit} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Email Field */}
            <FormGroup style={{ marginBottom: '22px' }}>
              <FormLabel
                style={{
                  fontSize: '14px',
                  color: '#1e3a5f',
                  fontWeight: '600',
                  marginBottom: '10px',
                  display: 'block'
                }}
              >
                Email Address
              </FormLabel>
              <FormControl
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
            </FormGroup>

            {/* Password Field */}
            <FormGroup style={{ marginBottom: '22px' }}>
              <FormLabel
                style={{
                  fontSize: '14px',
                  color: '#1e3a5f',
                  fontWeight: '600',
                  marginBottom: '10px',
                  display: 'block'
                }}
              >
                Password
              </FormLabel>
              <FormControl
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
            </FormGroup>

            {/* Remember me and Forgot password */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '28px',
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    width: '18px',
                    height: '18px',
                    backgroundColor: rememberMe ? '#4285f4' : '#ffffff',
                    border: '2px solid',
                    borderColor: rememberMe ? '#4285f4' : '#d1d5db',
                    marginRight: '10px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    transition: 'all 0.2s ease'
                  }}
                />
                <label
                  style={{
                    fontSize: '14px',
                    color: '#374151',
                    cursor: 'pointer',
                    margin: 0,
                    fontWeight: '500'
                  }}
                >
                  Remember me
                </label>
              </div>

              <button
                type="button"
                style={{
                  fontSize: '14px',
                  color: '#4285f4',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'color 0.2s ease',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  font: 'inherit'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#1e3a5f';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#4285f4';
                }}
                onClick={() => {
                  // Handle forgot password
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* Sign in Button */}
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
                boxShadow: '0 4px 15px rgba(66, 133, 244, 0.4)',
                textTransform: 'none',
                marginTop: 'auto'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(66, 133, 244, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(66, 133, 244, 0.4)';
              }}
              onMouseDown={(e) => {
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Sign in
            </Button>
          </Form>
        </div>
      </div>
    </Container>
  );
}

export default Login;
