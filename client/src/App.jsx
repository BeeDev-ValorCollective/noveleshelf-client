import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'

import Header from './components/BaseComponents/Header'
import Footer from './components/BaseComponents/Footer'

const Static = React.lazy(() => import('./views/Static'))

const Home = React.lazy(() => import('./views/Home'))

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
      </Routes>
    </main>
    <Footer />
    </>
  )
}

export default App
