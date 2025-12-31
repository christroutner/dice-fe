import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import Post from './Post';

function Dashboard({appData}) {
  const [showPostModal, setShowPostModal] = useState(false);

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
     <h1 style={{ color: 'white'}}>Home Page</h1>
     <Button onClick={() => setShowPostModal(true)} style={{ marginBottom: '16px' }}>
       Create Post
     </Button>
     <button onClick={()=>{ appData.logout()}}>Logout</button>
     <Post show={showPostModal} onHide={() => setShowPostModal(false)}  appData={appData}/>
    </Container>
  );
}

export default Dashboard;
