import './App.css'
import api from './api/api'
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

type ProdutoType = {
  _id: string,
  nome: string,
  preco: number,
  urlImagem: string,
  descricao: string,
  categoria: string
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
        console.error('Token inválido ou expirado:', error);
        handleLogout();
      }
    } else {
      navigate('/login?mensagem=Você precisa estar logado');
    }
    api.get('/produtos')
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
      urlImagem: formData.get('urlfoto') as string,
      categoria: formData.get('categoria') as string,
      descricao: formData.get('descricao') as string
    }
    api.post('/produtos', data)
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
      .then(() => alert('Produto adicionando no carrinho!'))
      .catch((error: any) => {
        console.error('Error posting data:', error.response?.data || error.message)
        const msg = error?.response?.data?.error ||
          error?.response?.data?.mensagem ||
          error?.message ||
          'Erro desconhecido';
        alert('Erro ao adicionar ao carrinho: ' + msg);
      })
  }

  function handleExcluir(produtoId: string) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    api.delete(`/produtos/${produtoId}`)
      .then(() => {
        setProdutos(produtos.filter(p => p._id !== produtoId));
        alert('Produto excluído com sucesso!');
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
    <>
      <header className='header'>
        <div className='header-content'>
          <h1>TechShop</h1>
          <div className='header-links'>
            <Link to='/carrinho' className='btn-carrinho'>Meu Carrinho</Link>
            <button onClick={handleLogout}>Sair</button>
          </div>
        </div>
      </header>

      <main className='container'>

        {tipoUsuario === 'admin' && (
          <section className='container-cadastro'>
            <h2>Cadastrar Novo Produto</h2>
            <form onSubmit={handleForm}>
              <input type='text' name='nome' placeholder='Nome do Produto' />
              <input type='number' name='preco' placeholder='Preço' />
              <input type='text' name='urlfoto' placeholder='URL da Imagem' />
              <input type='text' name='categoria' placeholder='Categoria' />
              <input type='text' name='descricao' placeholder='Descrição' />
              <button type='submit'>Cadastrar</button>
            </form>
          </section>
        )}

        <section className='container-listagem'>
          {produtos.map((produto) => (
            <div key={produto._id} className='product-card'>
              <img src={produto.urlImagem} alt={produto.nome} />
              <div className='product-card-content'>
                <h3>{produto.nome}</h3>
                <p className='preco'>R$ {produto.preco.toFixed(2)}</p>
                <p className='descricao'>{produto.descricao}</p>
                <div className='product-card-buttons'>
                  <button onClick={() => adicionarCarrinho(produto._id)}>
                    Adicionar ao carrinho
                  </button>
                  {tipoUsuario === 'admin' && (
                    <button onClick={() => handleExcluir(produto._id)} className='btn-excluir'>
                      Excluir
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </>
  )
}

export default App