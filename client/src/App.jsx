import React, { Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'

import Header from './components/BaseComponents/Header'
import Footer from './components/BaseComponents/Footer'
import ProtectedRoute from './components/AuthComponents/ProtectedRoute';
import VerificationBanner from './components/BaseComponents/VerificationBanner';
import MaintenanceNotice from './components/MaintenanceNotice'
import useUser from './hooks/useUser'
import ScrollToTop from './components/ScrollToTop'

const Home = React.lazy(() => import('./views/Home'))
const ForAuthors = React.lazy(() => import('./views/ForAuthors'))
const ForReaders = React.lazy(() => import('./views/ForReaders'))
const Contact = React.lazy(() => import('./views/Contact'))
const FreeAuthorAgreement = React.lazy(() => import('./views/iFrameViews/FreeAuthorAgreement'))
const Unsubscribe = React.lazy(() => import('./views/Unsubscribe'))
const ErrorPage = React.lazy(() => import('./views/ErrorPage'))

// Auth Pages
const Login = React.lazy(() => import('./views/AuthViews/Login'))
const Signup = React.lazy(() => import('./views/AuthViews/Signup'))
const VerifyEmail = React.lazy(() => import('./views/AuthViews/VerifyEmail'))
const ResetPassword = React.lazy(() => import('./views/AuthViews/ResetPassword'))
const NewPassword = React.lazy(() => import('./views/AuthViews/NewPassword'))

// User Pages
const Dashboard = React.lazy(() => import('./views/UserViews/Dashboard'))
const Profile = React.lazy(() => import('./views/UserViews/Profile'))
const UpdateProfile = React.lazy(() => import('./views/UserViews/UpdateProfile'))

// Library Pages
const Library = React.lazy(() => import('./views/LibraryViews/Library'))
const BookDetail = React.lazy(() => import('./views/LibraryViews/BookDetail'))
const AuthorDetail = React.lazy(() => import('./views/LibraryViews/AuthorDetail'))

// Author Pages
const CreateNewBook = React.lazy(() => import('./views/AuthorViews/CreateNewBook'))
const ManageBook = React.lazy(() => import('./views/AuthorViews/ManageBook'))
const CreateNewChapter = React.lazy(() => import('./views/AuthorViews/CreateNewChapter'))
const EditChapter = React.lazy(() => import('./views/AuthorViews/EditChapter'))
const CreateEditBookPage = React.lazy(() => import('./views/AuthorViews/CreateEditBookPage'))
const SetAuthorUsername = React.lazy(() => import('./views/AuthorViews/SetAuthorUsername'))

// Admin Pages
const AdminAuthorRequests = React.lazy(() => import('./views/AdminViews/AdminAuthorRequests'))
const AdminBookApprovals = React.lazy(() => import('./views/AdminViews/AdminBookApprovals'))
const AdminUserManagement = React.lazy(() => import('./views/AdminViews/AdminUserManagement'))

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
      <ScrollToTop />
      <MaintenanceNotice />
      <Header
        onLoginClick={() => setModal('login')}
        onSignupClick={() => setModal('signup')}
      />
      <VerificationBanner />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/new-password/:token" element={<NewPassword />} />
          {/* Library */}
          <Route path="/library" element={<Library />} />
          <Route path="/library/book/:bookId" element={<BookDetail />} />
          <Route path="/library/author/:authorUsername" element={<AuthorDetail />} />
          {/* Other */}
          <Route path="/for-authors" element={<ForAuthors onLoginClick={() => setModal('login')} />} />
          <Route path="/for-readers" element={<ForReaders />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/agreement/free-author" element={<FreeAuthorAgreement />} />
          <Route path='/unsubscribe' element={<Unsubscribe />} />
          <Route path="/unauthorized" element={<ErrorPage type="unauthorized" />} />
          <Route path="*" element={<ErrorPage type="notFound" />} />

          {/* protected - login only */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>}
          />
          {/* User Paths - has switch for different roles */}
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
          {/* protected - login + verified */}

          {/* Reader */}

          {/* Author */}
          <Route path='/set-author-username' element={
            <ProtectedRoute allowedRoles={['author', 'free_author']}>
              <SetAuthorUsername />
            </ProtectedRoute>
          } />
          <Route path="author/create-book" element={
            <ProtectedRoute allowedRoles={['author', 'free_author']}>
              <CreateNewBook />
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
          <Route path="author/books/:bookId/pages/:pageType" element={
            <ProtectedRoute allowedRoles={['author', 'free_author']}>
              <CreateEditBookPage />
            </ProtectedRoute>
          } />
          {/* Admin */}
          <Route path="/admin/author-requests" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminAuthorRequests />
            </ProtectedRoute>
          } />
          <Route path="/admin/book-approvals" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminBookApprovals />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUserManagement />
            </ProtectedRoute>
          } />

          {/* Moderator */}
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