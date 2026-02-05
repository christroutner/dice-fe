/**
 *  Component to create a post
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Image } from 'lucide-react';
import UppyDashboard from './UppyDashboard';
import OverType, { defaultToolbarButtons } from 'overtype';
import { updatePost } from '../services/post';
import { toast } from 'react-toastify';
import { uploadFile, fetchFile } from '../services/files';
import config from '../config';

function EditPost({ show, onHide, appData, post }) {
  // State variables
  //console.log('post', post);
  const [postText, setPostText] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMediaDashboard, setShowMediaDashboard] = useState(false);
  const [loading, setLoading] = useState(false)
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const uppyDashboardRef = useRef(null);

  // Handle mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const loadFilesToUppyDashboard = useCallback(async () => {
    try {
      if (!post?.mediaUrls) return

      if (!Array.isArray(post?.mediaUrls)) return
      if (post?.mediaUrls.length === 0) return;

      if (uppyDashboardRef.current) {
        uppyDashboardRef.current.setLoading(true);
        // Convert mediaUrls to Uppy files
        for (const url of post?.mediaUrls) {
          const fileName = url.split('/').pop();
          const file = await fetchFile({ url, token: appData.userData.token });
          const uppFile = new File([file], fileName, { type: file.type });
          uppyDashboardRef.current.addFile(uppFile);
        }
        uppyDashboardRef.current.setLoading(false);
      }
    } catch (error) {
      console.error('Error loading files to Uppy Dashboard: ', error);
      toast.error('Error loading files to Uppy Dashboard: ' + error.message);
    }
  }, [post?.mediaUrls, appData.userData.token]);


  useEffect(()=>{
    if(post?.mediaUrls?.length && !showMediaDashboard){
      setShowMediaDashboard(true)
    }
    if(showMediaDashboard){
      loadFilesToUppyDashboard();
    }

  },[post,showMediaDashboard,loadFilesToUppyDashboard])

  // Initialize OverType editor
  useEffect(() => {
    if (show && editorRef.current) {
      // Reset postText when modal opens
      setPostText(post?.postContent || '');

      const [editorInstance] = new OverType(editorRef.current, {
        placeholder: 'What do you want to sell?',
        value: post?.postContent || '',
        onChange: (value) => {
          setPostText(value);
        },
        fontSize: '16px',
        lineHeight: 1.5,
        padding: '12px',
        autoResize: true,
        minHeight: isMobile ? '120px' : '160px',
        toolbar: true,
        toolbarButtons: defaultToolbarButtons
      });

      editorInstanceRef.current = editorInstance;

      return () => {
        if (editorInstanceRef.current) {
          editorInstanceRef.current.destroy();
          editorInstanceRef.current = null;
        }
      };
    }
  }, [show, isMobile, post?.postContent, loadFilesToUppyDashboard]);

  // Handle modal close
  const handleClose = () => {
    if (editorInstanceRef.current) {
      editorInstanceRef.current.setValue('');
    }
    setPostText('');
    onHide();
  };

  // Handle post creation
  const handleEditPost = async () => {
    try {
      setLoading(true)
      const { userData } = appData;
      const { user } = userData;


      const token = userData.token;

      let mediaUrls = [];
      // make media upload
      if (uppyDashboardRef.current) {
        const uploadedFiles = uppyDashboardRef.current.getFiles()
        for (const file of uploadedFiles) {
          const uploadedFileResponse = await uploadFile({ file: file, token });
          const url = `${config.pmaServer}/files/${uploadedFileResponse.fileRef}`
          mediaUrls.push(url);
        }

      }
      const postObj = {
        ownerId: user._id,
        postContent: postText,
        mediaUrls: mediaUrls
      }

      await updatePost({ postId: post._id, postObj, token });
      handleClose();
      // Update posts global state with the new post
      appData.updatePosts();
      setLoading(false)

      toast.success('Post updated successfully');
    }
    catch (e) {
      setLoading(false)
      toast.error('Post update failed');
      throw e
    }
  };

  return (
    <>
      {!isMobile && show && (
        <style>
          {`
            .modal-dialog.post-modal-desktop {
              max-width: 800px !important;
              width: 90% !important;
            }
          `}
        </style>
      )}
      <Modal
        show={show}
        onHide={handleClose}
        centered
        backdrop="static"
        keyboard={false}
        dialogClassName={!isMobile ? 'post-modal-desktop' : ''}
        style={{
          zIndex: 1050
        }}
      >
        <Modal.Header
          style={{
            borderBottom: '1px solid #e5e7eb',
            padding: isMobile ? '16px 20px' : '20px 24px',
            backgroundColor: '#ffffff',
            borderRadius: '8px 8px 0 0'
          }}
        >
          <Modal.Title
            style={{
              fontSize: isMobile ? '20px' : '24px',
              fontWeight: '700',
              color: '#1e3a5f',
              margin: 0,
              width: '100%',
              textAlign: 'center'
            }}
          >
            Create Post
          </Modal.Title>
          <button
            type="button"
            onClick={handleClose}
            style={{
              position: 'absolute',
              right: isMobile ? '20px' : '24px',
              top: '50%',
              transform: 'translateY(-50%)',
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
        </Modal.Header>

        <Modal.Body
          style={{
            padding: isMobile ? '20px' : '24px',
            backgroundColor: '#ffffff'
          }}
        >
          {/* User info section */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '16px',
              paddingBottom: '16px',
              borderBottom: '1px solid #e5e7eb'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#4285f4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: '600',
                fontSize: '16px',
                marginRight: '12px',
                flexShrink: 0
              }}
            >
              U
            </div>
            <div style={{ flexGrow: 1 }}>
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#1e3a5f',
                  marginBottom: '2px'
                }}
              >
                Username
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: '#6b7280'
                }}
              >
                <select
                  style={{
                    border: 'none',
                    backgroundColor: '#f3f4f6',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#374151',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option>Public</option>
                  <option>Friends</option>
                </select>
              </div>
            </div>
          </div>

          {/* OverType markdown editor */}
          <div
            ref={editorRef}
            style={{
              minHeight: isMobile ? '120px' : '160px',
              border: 'none',
              outline: 'none'
            }}
          />

          {/* Action buttons */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid #e5e7eb'
            }}
          >
            {/* Photo/Video/Product button */}
            {!showMediaDashboard && (
              <button
                type="button"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  backgroundColor: '#f3f4f6',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1e3a5f',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#e5e7eb';
                  e.target.style.borderColor = '#d1d5db';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.borderColor = '#e5e7eb';
                }}
                onClick={() => setShowMediaDashboard(!showMediaDashboard)}
              >
                <Image size={20} />
                Photo/Video/Product
              </button>
            )}
            {showMediaDashboard && !loading && (
              <>
                <UppyDashboard
                  ref={uppyDashboardRef}
                  maxNumberOfFiles={config.maxPostMediaFiles}
                  closeBtnCallback={() => setShowMediaDashboard(false)} />
              </>
            )}
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
            onClick={handleClose}
            style={{
              padding: '10px 24px',
              backgroundColor: '#f3f4f6',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
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
            Cancel
          </Button>
          <Button
            style={{
              padding: '10px 24px',
              background: postText.trim()
                ? 'linear-gradient(135deg, #4285f4 0%, #1e3a5f 100%)'
                : 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              color: '#ffffff',
              cursor: postText.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              boxShadow: postText.trim()
                ? '0 2px 8px rgba(66, 133, 244, 0.3)'
                : 'none',
              opacity: postText.trim() ? 1 : 0.6
            }}
            disabled={!postText.trim()}
            onMouseEnter={(e) => {
              if (postText.trim()) {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(66, 133, 244, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (postText.trim()) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(66, 133, 244, 0.3)';
              }
            }}
            onClick={handleEditPost}
          >
            Post
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditPost;

