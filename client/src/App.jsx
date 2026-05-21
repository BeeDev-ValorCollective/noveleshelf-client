import React, { Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'

import Header from './components/BaseComponents/Header'
import Footer from './components/BaseComponents/Footer'
import ProtectedRoute from './components/AuthComponents/ProtectedRoute';
import VerificationBanner from './components/BaseComponents/VerificationBanner';
import useUser from './hooks/useUser'

const Home = React.lazy(() => import('./views/Home'))
const Login = React.lazy(() => import('./views/Login'))
const Signup = React.lazy(() => import('./views/Signup'))
const VerifyEmail = React.lazy(() => import('./views/VerifyEmail'))
const ResetPassword = React.lazy(() => import('./views/ResetPassword'))
const NewPassword = React.lazy(() => import('./views/NewPassword'))
const Dashboard = React.lazy(() => import('./views/Dashboard'))
// const Shop = React.lazy(() => import('./views/Shop'))
// const Library = React.lazy(() => import('./views/Library'))
const ForAuthors = React.lazy(() => import('./views/ForAuthors'))
const ForReaders = React.lazy(() => import('./views/ForReaders'))
const Profile = React.lazy(() => import('./views/Profile'))
const UpdateProfile = React.lazy(() => import('./views/UpdateProfile'))
const ErrorPage = React.lazy(() => import('./views/ErrorPage'))

// Author Pages
const CreateNewBook = React.lazy(() => import('./views/AuthorViews/CreateNewBook'))
const ManageBook = React.lazy(() => import('./views/AuthorViews/ManageBook'))
const CreateNewChapter = React.lazy(() => import('./views/AuthorViews/CreateNewChapter'))
const EditChapter = React.lazy(() => import('./views/AuthorViews/EditChapter'))

function App() {
  return (
    <BrowserRouter>
      <Suspense
      fallback={<ErrorPage type="notFound" />}
      >
        <AppContent />
      </Suspense>
    </BrowserRouter>
  );
}
function AppContent() {
  const [modal, setModal] = useState(null);
  const { user, accessToken } = useUser();

  // DEV ONLY
    if (import.meta.env.DEV) {
        const refreshToken = localStorage.getItem('refresh_token')
        console.log('🔑 CURRENT TOKENS:', {
            access: accessToken,
            refresh: refreshToken
        })
    }

  return (
    <>
      <Header
        onLoginClick={() => setModal('login')}
        onSignupClick={() => setModal('signup')}
      />
      <VerificationBanner />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/new-password/:token" element={<NewPassword />} />
          <Route path="/for-authors" element={<ForAuthors />} />
          <Route path="/for-readers" element={<ForReaders />} />

          <Route path="/unauthorized" element={<ErrorPage type="unauthorized" />} />
          <Route path="*" element={<ErrorPage type="notFound" />} />

          {/* protected - login only */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>}
          />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>}
          />
          <Route path="/profile-update" element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>}
          />
          <Route path="author/create-book" element={
            <ProtectedRoute allowedRoles={['author', 'free_author']}>
              <CreateNewBook  />
            </ProtectedRoute>
          }
          />
          <Route path="author/books/:bookId/manage" element={
            <ProtectedRoute allowedRoles={['author', 'free_author']}>
              <ManageBook />
            </ProtectedRoute>
          }
          />
          <Route path="author/books/:bookId/chapters/new" element={
            <ProtectedRoute allowedRoles={['author', 'free_author']}>
              <CreateNewChapter />
            </ProtectedRoute>
            }
          />
          <Route path="author/books/:bookId/chapters/:chapterId/edit" element={
            <ProtectedRoute allowedRoles={['author', 'free_author']}>
              <EditChapter />
            </ProtectedRoute>
            }
          />

          {/* protected - login + verified */}
          {/* <Route path="/shop" element={
            <ProtectedRoute requiresVerification>
              <Shop />
            </ProtectedRoute>}
          /> */}
          {/* <Route path="/library" element={
            <ProtectedRoute requiresVerification>
              <Library />
            </ProtectedRoute>}
          /> */}
        </Routes>
      </main>
      <Footer />

      <Suspense>
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