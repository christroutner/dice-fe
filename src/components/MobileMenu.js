/**
 *  Mobile Menu component for navigation
 */
import React from 'react';
import { Offcanvas, Nav } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  User, 
  PlusSquare, 
  LogOut,
  Menu
} from 'lucide-react';

function MobileMenu({ appData, show, onHide, onCreatePost }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/dashboard',
      onClick: () => {
        navigate('/dashboard');
        onHide();
      }
    },
    {
      id: 'create-post',
      label: 'Create Post',
      icon: PlusSquare,
      path: null,
      onClick: () => {
        if (onCreatePost) {
          onCreatePost();
        }
        onHide();
      }
    },
    {
      id: 'members',
      label: 'Members',
      icon: Users,
      path: '/members',
      onClick: () => {
        navigate('/members');
        onHide();
      }
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      path: '/profile',
      onClick: () => {
        navigate('/profile');
        onHide();
      }
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: LogOut,
      path: null,
      onClick: () => {
        appData.logout();
        onHide();
        navigate('/login');
      },
      isDanger: true
    }
  ];

  const isActive = (item) => {
    if (item.path) {
      return location.pathname === item.path;
    }
    return false;
  };

  return (
    <Offcanvas 
      show={show} 
      onHide={onHide} 
      placement="end"
      style={{
        zIndex: 1050
      }}
    >
      <Offcanvas.Header
        style={{
          borderBottom: '1px solid #e5e7eb',
          padding: '20px 24px',
          backgroundColor: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <Menu size={24} color="#1e3a5f" />
          <Offcanvas.Title
            style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#1e3a5f',
              margin: 0
            }}
          >
            Menu
          </Offcanvas.Title>
        </div>
        <button
          type="button"
          onClick={onHide}
          style={{
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
      </Offcanvas.Header>
      <Offcanvas.Body
        style={{
          padding: 0,
          backgroundColor: '#ffffff'
        }}
      >
        <Nav className="flex-column">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            
            return (
              <Nav.Link
                key={item.id}
                onClick={item.onClick}
                style={{
                  padding: '16px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: active ? '#f3f4f6' : 'transparent',
                  borderLeft: active ? '4px solid #4285f4' : '4px solid transparent',
                  color: item.isDanger ? '#dc3545' : active ? '#4285f4' : '#374151',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Icon 
                  size={22} 
                  color={item.isDanger ? '#dc3545' : active ? '#4285f4' : '#6b7280'} 
                />
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: active ? '600' : '500'
                  }}
                >
                  {item.label}
                </span>
              </Nav.Link>
            );
          })}
        </Nav>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default MobileMenu;
