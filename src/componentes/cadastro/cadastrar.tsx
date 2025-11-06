import { useNavigate, Link } from "react-router-dom";
import api from "../../api/api";
import "../login/login.css"; // Vamos reusar o CSS do login
import { useState } from "react";

function Cadastrar() {
  const navigate = useNavigate();
  const [mensagem, setMensagem] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMensagem(null); // Limpa erros
    const formData = new FormData(event.currentTarget);
    const nome = formData.get("nome");
    const email = formData.get("email");
    const senha = formData.get("senha");
    // Você pode adicionar um campo "tipo" se quiser, ou deixar o backend definir como 'user'
    // const tipo = formData.get('tipo') // 'admin' ou 'user'

    api
      .post("/adicionarUsuario", { nome, email, senha /*, tipo */ })
      .then((resposta) => {
        if (resposta.status === 201) {
          // Sucesso! Manda para o login com uma mensagem boa
          navigate(
            "/login?mensagem=Cadastro realizado com sucesso! Faça o login."
          );
        }
      })
      .catch((error: any) => {
        const msg =
          error?.response?.data?.mensagem ||
          error?.mensagem ||
          "Erro desconhecido";
        setMensagem(msg); // Mostra o erro na tela
      });
  }

  return (
    <div className="login-page-container">
           {" "}
      <div className="login-form-box">
                <h1>Criar Conta</h1>       {" "}
        {mensagem && <p className="login-error-message">{mensagem}</p>}       {" "}
        <form onSubmit={handleSubmit} className="login-form">
                    <label htmlFor="nome">Nome Completo</label>
                    <input type="text" name="nome" id="nome" required />       
            <label htmlFor="email">Email</label>
                    <input type="text" name="email" id="email" required />     
              <label htmlFor="senha">Senha (mín. 6 caracteres)</label>
                    <input type="password" name="senha" id="senha" required /> 
                  <button type="submit">Registrar</button>       {" "}
        </form>
               {" "}
        <div className="login-register-link">
                    Já tem uma conta? <Link to="/login">Faça o login</Link>     
           {" "}
        </div>
             {" "}
      </div>
         {" "}
    </div>
  );
}
export default Cadastrar;
