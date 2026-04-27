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
  const [modal, setModal] = useState(null); // null | 'login' | 'signup'

  return (
    <>
      <Header
        onLoginClick={() => setModal('login')}
        onSignupClick={() => setModal('signup')}
      />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/new-password/:token" element={<NewPassword />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>}
          />
          <Route path="/for-authors" element={<ForAuthors />} />
          <Route path="/for-readers" element={<ForReaders />} />
        </Routes>
      </main>
      <Footer />

      {/* Auth modals — Suspense needed here since Login/Signup are lazy */}
      <Suspense
        // fallback={ <BadLink /> }
      >
        {modal === 'login' && (
          <Login
            isModal
            onClose={() => setModal(null)}
            onSwitchToSignup={() => setModal('signup')}
          />
        )}
        {modal === 'signup' && (
          <Signup
            isModal
            onClose={() => setModal(null)}
            onSwitchToLogin={() => setModal('login')}
          />
        )}
      </Suspense>
    </>
  );
}

export default App