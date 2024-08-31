import React,{lazy} from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
// import Home from './pages/Home'

const Home = lazy(()=> import('./pages/Home'));
const Login = lazy(()=> import('./pages/Login'));
const Chat = lazy(()=> import('./pages/Chat'));
const Groups = lazy(()=> import('./pages/Groups'));

const App = () => {
  return (
    <BrowserRouter>
    <span></span>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/chat/:chatId" element={<Login/>} />
      <Route path="/groups" element={<Login/>} />
      <Route path="/login" element={<Login/>} />

    </Routes>
    </BrowserRouter>
  )
}

export default App