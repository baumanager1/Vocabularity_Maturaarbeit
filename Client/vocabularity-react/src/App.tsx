import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import "./styles/colors.scss";
import './App.css'
import { Link, Route, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage'
import Navbar from './components/Navbar'
import Learn from './pages/Learnpage'


export default function App() {
  return(
<>

<Navbar />

<Routes>
  <Route path="/" element={<Homepage />} />
  <Route path='/navbar' element ={<Navbar />} />
  <Route path='/learn' element={ <Learn />} />
</Routes>
</>
  )
}
