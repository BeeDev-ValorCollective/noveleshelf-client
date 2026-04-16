import React, { Suspense } from 'react';
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

  return (
    <>
    <Header />
    <main>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/reset-password" element={<ResetPassword />}/>
        <Route path="/new-password/:token" element={<NewPassword />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>} />
      </Routes>
    </main>
    <Footer />
    </>
  )
}

export default App
