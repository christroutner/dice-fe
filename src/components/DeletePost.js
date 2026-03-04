/**
 *  Component to delete a post
 */
import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { AlertTriangle } from 'lucide-react';
import { deletePost } from '../services/post';
import { toast } from 'react-toastify';

function DeletePost({ show, onHide, appData, post, onDelete }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle delete post
  const handleDelete = async () => {
    try {
      await deletePost(post._id, appData.userData.token);
      appData.updatePosts(); // update posts in the appData
      if (onDelete) onDelete(post._id);
      if (onHide) onHide();
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  return (
    <>
      {!isMobile && show && (
        <style>
          {`
            .modal-dialog.delete-post-modal-desktop {
              max-width: 500px !important;
              width: 90% !important;
            }
          `}
        </style>
      )}
      <Modal
        show={show}
        onHide={onHide}
        centered
        backdrop="static"
        keyboard={false}
        dialogClassName={!isMobile ? 'delete-post-modal-desktop' : ''}
        style={{
          zIndex: 1050
        }}
      >
        <Modal.Header
          style={{
            borderBottom: '1px solid #e5e7eb',
            padding: isMobile ? '20px' : '24px',
            backgroundColor: '#ffffff',
            borderRadius: '8px 8px 0 0',
            position: 'relative'
          }}
        >
          <Modal.Title
            style={{
              fontSize: isMobile ? '20px' : '24px',
              fontWeight: '700',
              color: '#1e3a5f',
              margin: 0,
              width: '100%',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
          >
            <AlertTriangle size={24} color="#dc3545" />
            Delete Post
          </Modal.Title>
        </Modal.Header>

        <Modal.Body
          style={{
            padding: isMobile ? '24px 20px' : '32px 24px',
            backgroundColor: '#ffffff'
          }}
        >
          <div
            style={{
              textAlign: 'center',
              marginBottom: '8px'
            }}
          >
            <p
              style={{
                fontSize: isMobile ? '16px' : '18px',
                color: '#374151',
                fontWeight: '500',
                lineHeight: '1.6',
                margin: '0 0 12px 0'
              }}
            >
              Are you sure you want to delete this post?
            </p>
            <p
              style={{
                fontSize: '14px',
                color: '#6b7280',
                lineHeight: '1.5',
                margin: 0
              }}
            >
              This action cannot be undone. The post will be permanently removed.
            </p>
          </div>
        </Modal.Body>

        <Modal.Footer
          style={{
            borderTop: '1px solid #e5e7eb',
            padding: isMobile ? '16px 20px' : '20px 24px',
            backgroundColor: '#ffffff',
            borderRadius: '0 0 8px 8px',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px'
          }}
        >
          <Button
            variant="secondary"
            onClick={onHide}
            style={{
              padding: '10px 24px',
              backgroundColor: '#f3f4f6',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              color: '#374151',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              minWidth: '100px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e5e7eb';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#f3f4f6';
            }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(220, 53, 69, 0.3)',
              minWidth: '100px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(220, 53, 69, 0.3)';
            }}
            onMouseDown={(e) => {
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeletePost;

