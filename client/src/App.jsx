import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'

import Header from './components/BaseComponents/Header'
import Footer from './components/BaseComponents/Footer'

const Static = React.lazy(() => import('./views/Static'))

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
    <div>
    <Header />
    <Routes>
      <Route path="/" element={<Static />}/>
    </Routes>
    <Footer />
    </div>
  )
}

export default App
