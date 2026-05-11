import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Link, Route, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage'


export default function App() {
  return(
<>
<nav>
  <Link to="/">Home</Link>
</nav>

<Routes>
  <Route path="/" element={<Homepage />} />
</Routes>
</>
  )
}
