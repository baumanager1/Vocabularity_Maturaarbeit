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
import JapanesePage from './pages/JapaneseMode/JapanesePage'
import CreateVocabsetPage from './pages/VocabularyMode/CreateVocabsetPage';
import Learnhub from './pages/VocabularyMode/LearnHubPage';
import VocabsetCreatedPage from './pages/VocabularyMode/VocabsetCreatedPage';
import LearnSessionPage from './pages/VocabularyMode/LearnSessionPage';
import SetCompletionPage from './pages/VocabularyMode/SetCompletionPage';
import NotFoundErrorPage from './pages/Errorpages/NotFoundErrorPage';


export default function App() {
  return(
<>
<AuthProvider>
  <Navbar />

<Routes>
  <Route path="/" element={<Homepage />} />
  <Route path="*" element={<NotFoundErrorPage />} />
  <Route path="/dashboard" element={<Homepage />} />
  <Route path='/navbar' element ={<Navbar />} />
  <Route path='/learn' element={ <Learnhub />} />
  <Route path='/login' element={<Loginpage />} />
  <Route path='/profile' element={<Profilepage />} />
  <Route path='/create' element={<CreateVocabsetPage />} />
  <Route path='/signedout' element={<h1>You have been signed out successfully!</h1>} />
  <Route path ="/japanese" element={<JapanesePage />} />
  <Route path='/error500' element={<InternalServerErrorPage />} />
  <Route path='/learn/vocabset-created' element={<VocabsetCreatedPage />} />
  <Route path='/learn/vocabset/:vocabsetid' element ={<LearnSessionPage />} />
  <Route path='/learn/vocabset/:vocabsetid/completion' element ={<SetCompletionPage />} />
  <Route path='/404' element={<NotFoundErrorPage/>} />
</Routes>

</AuthProvider>
</>
  )
}
