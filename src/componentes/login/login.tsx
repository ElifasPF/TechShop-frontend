import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import api from '../../api/api'
import './login.css'

function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const mensagem = searchParams.get('mensagem')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const senha = formData.get('senha')
    api.post('/login', { email, senha })
      .then((resposta) => {
        if (resposta.status === 200) {
          localStorage.setItem('token', resposta.data.token)
          navigate('/')
        }
      }).catch((error: any) => {
        const msg = error?.response?.data?.mensagem || error?.mensagem || 'Erro desconhecido'
        navigate(`/login?mensagem=${encodeURIComponent(msg)}`)
      })
  }

  return (
    <div className='login-container'>
      <div className='login-form-box'>
        <h1>TechShop Login</h1>
        {mensagem && <p className='login-error-message'>{mensagem}</p>}
        <form onSubmit={handleSubmit} className='login-form'>
          <label htmlFor='email'>Email</label>
          <input type='text' name='email' id='email' required />
          <label htmlFor='senha'>Senha</label>
          <input type='password' name='senha' id='senha' required />
          <button type='submit'>Entrar</button>
        </form>
        <div className='login-register-link'>
          Não tem uma conta? <Link to='/cadastrar'>Cadastre-se</Link>
        </div>
      </div>
    </div>
  )
}
export default Login