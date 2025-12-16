import React from 'react';
import { Container } from 'react-bootstrap';


function Dashboard({appData}) {

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
     <button onClick={()=>{ appData.logout()}}>Logout</button>
    </Container>
  );
}

export default Dashboard;
