import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import "./styles/colors.scss";
import './App.css'
import { Link, Route, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage'
import Navbar from './components/Navbar'
import { AuthProvider } from './components/Authentication/AuthContext';
import Loginpage from './pages/Loginpage';
import Profilepage from './pages/Profilepage';
import InternalServerErrorPage from './pages/Errorpages/InternalServerErrorPage';
import Japanesepage from './pages/JapaneseMode/JapanesePage';
import CreateVocabsetPage from './pages/VocabularyMode/CreateVocabsetPage';
import Learnhub from './pages/VocabularyMode/Learnpage';
import VocabsetCreatedPage from './pages/VocabularyMode/VocabsetCreatedPage';


export default function App() {
  return(
<>
<AuthProvider>
  <Navbar />

<Routes>
  <Route path="/" element={<Homepage />} />
  <Route path="/dashboard" element={<Homepage />} />
  <Route path='/navbar' element ={<Navbar />} />
  <Route path='/learn' element={ <Learnhub />} />
  <Route path='/login' element={<Loginpage />} />
  <Route path='/profile' element={<Profilepage />} />
  <Route path='/create' element={<CreateVocabsetPage />} />
  <Route path='/signedout' element={<h1>You have been signed out successfully!</h1>} />
  <Route path ="/japanese" element={<Japanesepage />} />
  <Route path='/error500' element={<InternalServerErrorPage />} />
  <Route path='/learn/vocabset-created' element={<VocabsetCreatedPage />} />
</Routes>

</AuthProvider>
</>
  )
}
