import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.svg';

function Clickwrap() {
  const navigate = useNavigate();
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (acceptTerms) {
      // Navigate to dashboard after accepting terms
      navigate('/dashboard');
    }
  };

  const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.

Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.

Id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.

Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.`;

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

      {/* Main content card */}
      <div
        style={{
          width: '100%',
          maxWidth: isMobile ? '100%' : '450px',
          minHeight: isMobile ? '600px' : '650px',
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
            marginBottom: '1rem',
            textAlign: 'center',
            letterSpacing: '-0.5px'
          }}
        >
          Marketplace App
        </h1>

        
        <div
          style={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '25px'
          }}
        >

          {/* Scrollable text area */}
          <div
            style={{
              flexGrow: 1,
              backgroundColor: '#f9fafb',
              border: '2px solid #e5e7eb',
              borderRadius: '10px',
              padding: '20px',
              overflowY: 'auto',
              maxHeight: isMobile ? '300px' : '400px',
              minHeight: isMobile ? '200px' : '300px'
            }}
          >
            <p
              style={{
                fontSize: '14px',
                color: '#374151',
                lineHeight: '1.6',
                margin: 0,
                whiteSpace: 'pre-wrap'
              }}
            >
              {loremIpsum}
            </p>
          </div>
        </div>

        {/* Accept terms checkbox */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '25px'
          }}
        >
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            style={{
              width: '18px',
              height: '18px',
              backgroundColor: acceptTerms ? '#4285f4' : '#ffffff',
              border: '2px solid',
              borderColor: acceptTerms ? '#4285f4' : '#d1d5db',
              marginRight: '12px',
              cursor: 'pointer',
              borderRadius: '4px',
              transition: 'all 0.2s ease',
              flexShrink: 0
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
            Accept terms
          </label>
        </div>

        {/* Proceed Button */}
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!acceptTerms}
          style={{
            width: '100%',
            padding: '14px',
            background: acceptTerms 
              ? 'linear-gradient(135deg, #4285f4 0%, #1e3a5f 100%)' 
              : 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '600',
            color: '#ffffff',
            cursor: acceptTerms ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            boxShadow: acceptTerms 
              ? '0 4px 15px rgba(66, 133, 244, 0.4)' 
              : 'none',
            textTransform: 'none',
            opacity: acceptTerms ? 1 : 0.6
          }}
          onMouseEnter={(e) => {
            if (acceptTerms) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(66, 133, 244, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            if (acceptTerms) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(66, 133, 244, 0.4)';
            }
          }}
          onMouseDown={(e) => {
            if (acceptTerms) {
              e.target.style.transform = 'translateY(0)';
            }
          }}
        >
          Proceed
        </Button>
      </div>
    </Container>
  );
}

export default Clickwrap;

