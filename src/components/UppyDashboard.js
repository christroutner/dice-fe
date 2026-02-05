/**
 *  Uppy Dashboard component
 */
import React, { useEffect, forwardRef, useImperativeHandle, useMemo, useState } from "react";
import Uppy from "@uppy/core";
import Dashboard from '@uppy/react/dashboard';
import '@uppy/core/css/style.css';
import '@uppy/dashboard/css/style.min.css';

// Uppy Dashboard component

const UppyDashboard = forwardRef((props, ref) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const [loading, setLoading] = useState(false);


  // State variables
  const { onChange, maxFileSizeMB , closeBtnCallback , allowedFileTypes, maxNumberOfFiles} = props;

  // Handle desktop view
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // Initialize Uppy instance
  const uppyInstance = useMemo(() => {
    return new Uppy({
      restrictions: {
        maxFileSize: maxFileSizeMB ? maxFileSizeMB * 1024 * 1024 : null,
        allowedFileTypes: allowedFileTypes || null,
        maxNumberOfFiles: maxNumberOfFiles || null,
      },
      autoProceed: false,
    });
  }, [maxFileSizeMB,allowedFileTypes, maxNumberOfFiles]);

  // Handle imperative handle
  // Allows the parent component to access the this declared functions
  useImperativeHandle(ref, () => ({
    getFiles: () => uppyInstance.getFiles().map((f) => f.data),
    cancelAll: () => uppyInstance.cancelAll(),
    addFile: (file) => uppyInstance.addFile(file),
    setLoading: (loading) => setLoading(loading),
  }));

  // Handle file added and removed
  useEffect(() => {
    uppyInstance.on("file-added", onChange);
    uppyInstance.on("file-removed", onChange);

    return () => {
      uppyInstance.off("file-added", onChange);
      uppyInstance.off("file-removed", onChange);
      uppyInstance?.instance?.close();
    };
  }, [uppyInstance, onChange]);


  return (
    // Uppy Dashboard component
    <div style={{ width: "100%", height: "100%", position: 'relative' }}>
    {closeBtnCallback && (
        <button
        type="button"
        style={{
          zIndex: 10,
          position: 'absolute',
          right: '10px',
          top: '10px',
          background: 'none',
          border: 'none',
          fontSize: '30px',
          color: '#6b7280',
          cursor: 'pointer',
          padding: '0',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          transition: 'all 0.2s ease',
        }}
        onClick={closeBtnCallback}
      >
        ×
      </button>
    )}
    {/*Add spinner on loading*/}

  <Dashboard
        uppy={uppyInstance}
        proudlyDisplayPoweredByUppy={false}
        width={"100%"}
        height={isDesktop ? 350 : 200}
        hideUploadButton={true}
        disabled={loading}

      />

    </div>
  );
});

UppyDashboard.displayName = "UppyDashboard";

export default UppyDashboard;