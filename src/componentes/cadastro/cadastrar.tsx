import { useNavigate, Link } from 'react-router-dom'
import api from '../../api/api'
import '../login/login.css'
import { useState } from 'react'

function Cadastrar() {
  const navigate = useNavigate()
  const [mensagem, setMensagem] = useState<string | null>(null)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMensagem(null)
    const formData = new FormData(event.currentTarget)
    const nome = formData.get('nome')
    const email = formData.get('email')
    const senha = formData.get('senha')

    api.post('/adicionarUsuario', { nome, email, senha })
      .then((resposta) => {
        if (resposta.status === 201) {
          navigate('/login?mensagem=Cadastro realizado com sucesso! Faça o login.')
        }
      }).catch((error: any) => {
        const msg = error?.response?.data?.mensagem || error?.mensagem || 'Erro desconhecido'
        setMensagem(msg)
      })
  }

  return (
    <div className='login-container'>
      <div className='login-form-box'>
        <h1>Criar Conta</h1>
        {mensagem && <p className='login-error-message'>{mensagem}</p>}
        <form onSubmit={handleSubmit} className='login-form'>
          <label htmlFor='nome'>Nome</label>
          <input type='text' name='nome' id='nome' required />
          <label htmlFor='email'>Email</label>
          <input type='text' name='email' id='email' required />
          <label htmlFor='senha'>Senha (mín. 6 caracteres)</label>
          <input type='password' name='senha' id='senha' required />
          <button type='submit'>Registrar</button>
        </form>
        <div className='login-register-link'>
          Já tem uma conta? <Link to='/login'>Faça o login</Link>
        </div>
      </div>
    </div>
  )
}
export default Cadastrar