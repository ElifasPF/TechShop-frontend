// src/App.tsx
import './App.css' // Garanta que o App.css está sendo importado
import api from './api/api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

type ProdutoType = {
  _id: string,
  nome: string,
  preco: number,
  urlfoto: string, // Mantemos como urlfoto aqui para exibição no frontend
  descricao: string,
  categoria: string // Adicionamos categoria para o tipo
}

type UserPayload = {
  tipo: 'admin' | 'user';
  usuario_id: string;
}

function App() {
  const [produtos, setProdutos] = useState<ProdutoType[]>([])
  const [tipoUsuario, setTipoUsuario] = useState<'admin' | 'user' | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const payloadJson = atob(payloadBase64);
        const payload = JSON.parse(payloadJson) as UserPayload;
        setTipoUsuario(payload.tipo);
      } catch (error) {
        console.error("Token inválido ou expirado:", error);
        handleLogout();
      }
    } else {
      navigate('/login?mensagem=Você precisa estar logado');
    }
    api.get("/produtos")
      .then((response) => setProdutos(response.data))
      .catch((error) => console.error('Error fetching data:', error))
  }, [])

  function handleForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const data = {
      nome: formData.get('nome') as string,
      preco: Number(formData.get('preco')),
      urlImagem: formData.get('urlfoto') as string, // Corrigido para urlImagem (backend)
      categoria: formData.get('categoria') as string, // Categoria adicionada
      descricao: formData.get('descricao') as string
    }
    api.post("/produtos", data)
      .then((response) => setProdutos([...produtos, response.data]))
      .catch((error: any) => {
        console.error('Error posting data:', error.response?.data || error.message);
        const msg = error?.response?.data?.error ||
          error?.response?.data?.mensagem ||
          error?.message ||
          'Erro desconhecido';
        alert('Erro ao cadastrar produto: ' + msg);
      })
    form.reset()
  }

  function adicionarCarrinho(produtoId: string) {
    api.post('/adicionarItem', { produtoId, quantidade: 1 })
      .then(() => alert("Produto adicionando no carrinho!"))
      .catch((error) => {
        console.error('Error posting data:', error)
        alert('Error posting data:' + error?.mensagem)
      })
  }

  function handleExcluir(produtoId: string) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    api.delete(`/produtos/${produtoId}`)
      .then(() => {
        setProdutos(produtos.filter(p => p._id !== produtoId));
        alert("Produto excluído com sucesso!");
      })
      .catch((error) => {
        console.error('Erro ao excluir:', error)
        alert('Erro ao excluir produto: ' + error?.response?.data?.error)
      });
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setTipoUsuario(null);
    navigate('/login');
  }

  return (
    <div className="app-container"> {/* CLASSE PRINCIPAL DO CONTAINER */}
      <header className="app-header"> {/* CLASSE DO CABEÇALHO */}
        <h1>TechShop</h1>
        <button onClick={handleLogout} className="logout-button">Sair</button> {/* CLASSE DO BOTÃO */}
      </header>

      {/* Seção de Admin */}
      {tipoUsuario === 'admin' && (
        <section className="admin-form-section"> {/* CLASSE DA SEÇÃO DO FORM */}
          <h2>Cadastrar Novo Produto</h2>
          <form onSubmit={handleForm}>
            <input type="text" name="nome" placeholder="Nome do Produto" />
            <input type="number" name="preco" placeholder="Preço" />
            <input type="text" name="urlfoto" placeholder="URL da Imagem" />
            <input type="text" name="categoria" placeholder="Categoria" /> {/* Campo Categoria */}
            <input type="text" name="descricao" placeholder="Descrição" />
            <button type="submit">Cadastrar</button>
          </form>
        </section>
      )}

      {/* Lista de Produtos */}
      <section>
        <h2>Nossos Produtos</h2>
        <div className="product-list"> {/* CLASSE PARA A LISTA DE PRODUTOS */}
          {produtos.map((produto) => (
            <div key={produto._id} className="product-card"> {/* CLASSE PARA CADA CARD DE PRODUTO */}
              <img src={produto.urlfoto} alt={produto.nome} />
              <div className="product-content"> {/* CLASSE PARA O CONTEÚDO DO CARD */}
                <h2>{produto.nome}</h2>
                <p className="product-price">R$ {produto.preco.toFixed(2)}</p>
                <p className="product-description">{produto.descricao}</p>
                <div className="product-buttons"> {/* CLASSE PARA OS BOTÕES */}
                  <button onClick={() => adicionarCarrinho(produto._id)} className="add-to-cart-button">
                    Adicionar ao carrinho
                  </button>
                  {tipoUsuario === 'admin' && (
                    <button onClick={() => handleExcluir(produto._id)} className="delete-button"> {/* CLASSE DO BOTÃO DE EXCLUIR */}
                      Excluir
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default App