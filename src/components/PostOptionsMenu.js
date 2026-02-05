/**
 *  PostOptionsMenu component - Dropdown menu for post options
 */
import React, { useState }  from 'react';
import { Dropdown } from 'react-bootstrap';
import { MoreVertical, Edit } from 'lucide-react';
import EditPost from './EditPost';

function PostOptionsMenu({ post, appData, onEdit }) {
  // Check if current user is the post owner
  const isPostOwner = appData?.userData?.user?._id === (post.ownerId?._id || post.ownerId);
  const [showEditPost, setShowEditPost] = useState(false);
  if (!isPostOwner) {
    return null;
  }

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowEditPost(true);
  };

  return (
    <>
      <style>
        {`
          .post-options-dropdown .dropdown-toggle::after {
            display: none;
          }
          .post-options-dropdown .dropdown-toggle:focus {
            box-shadow: none;
            outline: none;
          }
          .post-options-dropdown .dropdown-item:active {
            background-color: #f3f4f6;
            color: #4285f4;
          }
        `}
      </style>
      <Dropdown align="end" className="post-options-dropdown">
        <Dropdown.Toggle
          as="button"
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
          <MoreVertical size={20} />
        </Dropdown.Toggle>

        <Dropdown.Menu
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            padding: '4px',
            minWidth: '160px',
            marginTop: '8px'
          }}
        >
          <Dropdown.Item
            onClick={handleEdit}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              fontSize: '14px',
              color: '#1e3a5f',
              fontWeight: '500',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              border: 'none',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#4285f4';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#1e3a5f';
            }}
          >
            <Edit size={16} style={{ flexShrink: 0, lineHeight: 0 }} />
            <span style={{ lineHeight: '16px' }}>Edit</span>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      {showEditPost && (
        <EditPost show={showEditPost} onHide={() => setShowEditPost(false)} appData={appData} post={post} />
      )}
    </>
  );
}

export default PostOptionsMenu;
