import React, { Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'

import Header from './components/BaseComponents/Header'
import Footer from './components/BaseComponents/Footer'
import ProtectedRoute from './components/ProtectedRoute';

const Static = React.lazy(() => import('./views/Static'))

const Home = React.lazy(() => import('./views/Home'))
const Login = React.lazy(() => import('./views/Login'))
const Signup = React.lazy(() => import('./views/Signup'))
const ResetPassword = React.lazy(() => import('./views/ResetPassword'))
const NewPassword = React.lazy(() => import('./views/NewPassword'))
const Dashboard = React.lazy(() => import('./views/Dashboard'))
// const UpdateProfile = React.lazy(() => import('./views/UpdateProfile'))

const ForAuthors = React.lazy(() => import('./views/ForAuthors'))
const ForReaders = React.lazy(() => import('./views/ForReaders'))

function App() {

  
  return (
    <BrowserRouter>
      <Suspense 
        // fallback={ <BadLink /> }
      >
        <AppContent />
      </Suspense>
    </BrowserRouter>
  );
}

function AppContent() {

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <>
    <Header 
      onLoginClick={() => setIsLoginOpen(true)}
      onSignupClick={() => setIsSignupOpen(true)}
    />
    <main>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/reset-password" element={<ResetPassword />}/>
        <Route path="/new-password/:token" element={<NewPassword />} />
        {/* <Route path="/update-profile" element={<UpdateProfile />} /> */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>} />
        <Route path="/for-authors" element={<ForAuthors />} />
        <Route path="/for-readers" element={<ForReaders />} />
      </Routes>
    </main>
    <Footer />
    {/* 👇 ADD MODALS HERE */}
      {isLoginOpen && (
        <Login onClose={() => setIsLoginOpen(false)} isModal />
      )}

      {isSignupOpen && (
        <Signup onClose={() => setIsSignupOpen(false)} isModal />
      )}
    </>
  )
}

export default App
