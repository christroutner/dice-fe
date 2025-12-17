import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Clickwrap from './components/Clickwrap';
import Dashboard from './components/Dashboard';
import useAppState from './hooks/state';

function App() {
  const appData = useAppState()
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login appData={appData}/>} />
        <Route path="/signup" element={<SignUp appData={appData}/>} />
        <Route path="/clickwrap" element={<Clickwrap appData={appData} />} />
        <Route path="/dashboard" element={<Dashboard appData={appData}/>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
