import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './componentes/login/login.tsx'
import Cadastrar from './componentes/cadastro/cadastrar.tsx'
import Carrinho from './componentes/carrinho/Carrinho.tsx'
import CartaoPagamento from './componentes/pagamento/CartaoPagamento.tsx'

import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/login' element={<Login />} />
        <Route path='/cadastrar' element={<Cadastrar />} />
        <Route path='/carrinho' element={<Carrinho />} />
        <Route path='/error' element={<>Error</>} />
        <Route path='/finalizar-compra' element={
            <Elements stripe={stripePromise}>
              <CartaoPagamento />
            </Elements>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)