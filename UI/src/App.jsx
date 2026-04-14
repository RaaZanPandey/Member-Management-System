import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import './App.css'
import Dashbord from './Components/Dashbord';
import Details from './Components/Details';
import { ToastContainer } from 'react-toastify';
function App() {

  return (
    <>
    <ToastContainer />
    <Routes>
      <Route path = '/' element = {<Login/>}/>
      <Route path='/dashbord' element = {<Dashbord/>}/>
      <Route path='/details/:id' element = {<Details/>}/>
    </Routes>
    </>
  )
}

export default App
