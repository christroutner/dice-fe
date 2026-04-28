import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Clickwrap from './components/Clickwrap';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import UserProfile from './components/UserProfile';
import Members from './components/Members';
import useAppState from './hooks/state';
import PostView from './components/PostView';

function ProtectedRoute({ appData, children }) {
  if (!appData.userData?.token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const appData = useAppState();
  const authed = !!appData.userData?.token;

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            authed ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/login" element={<Login appData={appData}/>} />
        <Route path="/signup" element={<SignUp appData={appData}/>} />
        <Route path="/clickwrap" element={<Clickwrap appData={appData} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute appData={appData}>
              <Dashboard appData={appData}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute appData={appData}>
              <Profile appData={appData}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/members"
          element={
            <ProtectedRoute appData={appData}>
              <Members appData={appData}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/:userId"
          element={
            <ProtectedRoute appData={appData}>
              <UserProfile appData={appData}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/post/:postId"
          element={
            <ProtectedRoute appData={appData}>
              <PostView appData={appData}/>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={authed ? "/dashboard" : "/login"} replace />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
