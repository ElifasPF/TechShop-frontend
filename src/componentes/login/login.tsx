import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../../api/api";
import "./login.css"; // <-- 1. IMPORTA O CSS

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mensagem = searchParams.get("mensagem");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const senha = formData.get("senha");

    api
      .post("/login", { email, senha })
      .then((resposta) => {
        if (resposta.status === 200) {
          localStorage.setItem("token", resposta.data.token);
          navigate("/");
        }
      })
      .catch((error: any) => {
        const msg =
          error?.response?.data?.mensagem ||
          error?.mensagem ||
          "Erro desconhecido";
        navigate(`/login?mensagem=${encodeURIComponent(msg)}`);
      });
  }

  return (
    // 2. ADICIONA AS CLASSES DO CSS
    <div className="login-page-container">
           {" "}
      <div className="login-form-box">
                <h1>Login</h1>       {" "}
        {mensagem && <p className="login-error-message">{mensagem}</p>}       {" "}
        <form onSubmit={handleSubmit} className="login-form">
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" id="email" required />     
              <label htmlFor="senha">Senha</label>
                    <input type="password" name="senha" id="senha" required /> 
                  <button type="submit">Entrar</button>       {" "}
        </form>
                {/* 3. ADICIONA O LINK PARA CADASTRO */}       {" "}
        <div className="login-register-link">
                    Não tem uma conta? <Link to="/cadastrar">Registre-se</Link> 
               {" "}
        </div>
             {" "}
      </div>
         {" "}
    </div>
  );
}
export default Login;
