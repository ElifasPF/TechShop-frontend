// src/componentes/carrinho/Carrinho.tsx

import { useState, useEffect } from 'react';
import api from '../../api/api';
import { Link, useNavigate } from 'react-router-dom';
import './carrinho.css'; // Importa o CSS do carrinho
import '../../App.css'; // Importa o CSS do Header (para o cabeçalho preto)

// Interfaces (tipos) do Carrinho
interface ItemCarrinho {
    produtoId: string;
    quantidade: number;
    precoUnitario: number;
    nome: string;
}
interface Carrinho {
    usuarioId: string;
    itens?: ItemCarrinho[]; // 'itens' é opcional
    dataAtualizacao: Date;
    total?: number; // 'total' é opcional
}

function Carrinho() {
    const [carrinho, setCarrinho] = useState<Carrinho | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Busca o carrinho quando a página carrega
    useEffect(() => {
        fetchCarrinho();
    }, []);

    function fetchCarrinho() {
        setLoading(true);
        api.get('/carrinho')
            .then(response => {
                setCarrinho(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Erro ao buscar carrinho:', error);
                if (error.response?.status === 404) {
                    // Se o backend disser 404, o carrinho está vazio (não é um erro)
                    setCarrinho(null);
                } else if (error.response?.status === 401) {
                    // Se o token for inválido, desloga
                    localStorage.removeItem('token');
                    navigate('/login?mensagem=Sessão expirada');
                }
                setLoading(false);
            });
    }

    // Função para remover item
    function handleRemoverItem(produtoId: string) {
        api.post('/removerItem', { produtoId })
            .then(() => {
                alert('Item removido!');
                fetchCarrinho(); // Recarrega o carrinho
            })
            .catch(error => {
                const msg = error?.response?.data?.error || error.message;
                alert('Erro ao remover item: ' + msg);
            });
    }

    // Função de logout
    function handleLogout() {
        localStorage.removeItem('token');
        navigate('/login');
    }

    // =======================================================
    // RENDERIZAÇÃO SEGURA (A CORREÇÃO ESTÁ AQUI)
    // =======================================================

    // 1. Criamos um cabeçalho reutilizável
    const renderHeader = () => (
        <header className='header'>
            <div className='header-content'>
                <h1>TechShop</h1>
                <div className='header-links'>
                    <Link to='/'>Ver Produtos</Link>
                    <button onClick={handleLogout}>Sair</button>
                </div>
            </div>
        </header>
    );

    // 2. Tratamento do 'Loading'
    if (loading) {
        return (
            <>
                {renderHeader()}
                <div className='carrinho-container'>
                    <h1>Carregando Carrinho...</h1>
                </div>
            </>
        );
    }

    // 3. Variáveis 'à prova de falhas'
    // Se 'carrinho' for null, 'itensDoCarrinho' vira um array vazio []
    const itensDoCarrinho = carrinho?.itens || [];
    // Se 'carrinho' for null, 'totalDoCarrinho' vira 0
    const totalDoCarrinho = carrinho?.total || 0;

    // 4. Renderização principal (agora segura)
    return (
        <>
            {renderHeader()}
            <div className='carrinho-container'>
                <h1>Meu Carrinho</h1>

                {/* Usamos a variável segura 'itensDoCarrinho' */}
                {itensDoCarrinho.length === 0 ? (
                    <p>Seu carrinho está vazio.</p>
                ) : (
                    <>
                        <div className='carrinho-itens'>
                            {itensDoCarrinho.map(item => (
                                <div key={item.produtoId} className='carrinho-item'>
                                    <div className='item-info'>
                                        <h2>{item.nome}</h2>
                                        <p>Quantidade: {item.quantidade}</p>
                                        <p>Preço Unit.: R$ {item.precoUnitario.toFixed(2)}</p>
                                    </div>
                                    <button onClick={() => handleRemoverItem(item.produtoId)} className='btn-remover'>
                                        Remover
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className='carrinho-total'>
                            {/* Usamos a variável segura 'totalDoCarrinho' */}
                            <h2>Total: R$ {totalDoCarrinho.toFixed(2)}</h2>
                        </div>
                    </>
                )}
                <Link to='/' className='link-voltar'>Continuar Comprando</Link>
            </div>
        </>
    );
}

export default Carrinho;