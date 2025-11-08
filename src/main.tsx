import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './componentes/login/login.tsx'
import Cadastrar from './componentes/cadastro/cadastrar.tsx' // (Rota que já arrumamos)

// 1. ESTA LINHA ESTAVA FALTANDO
import Carrinho from './componentes/carrinho/Carrinho.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/login' element={<Login />} />
        <Route path='/cadastrar' element={<Cadastrar />} />
        <Route path='/carrinho' element={<Carrinho />} />
        <Route path='/error' element={<>Error</>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)