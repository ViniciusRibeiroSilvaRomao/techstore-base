import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router'
import Header from './components/Header'
import Footer from './components/Footer'
import RolarParaTopo from './components/RolarParaTopo'
import Loja from './pages/Loja'
import PaginaProduto from './pages/PaginaProduto'
import Carrinho from './pages/Carrinho'
import Estoque from './pages/Estoque'
import PainelLojista from './pages/PainelLojista'
import { buscarProdutos } from './services/produtos'
import { buscarClientes } from './services/clientes'

export default function App() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [carrinho, setCarrinho] = useState([])
  const [clientes, setClientes] = useState([])
  const [clienteAtualId, setClienteAtualId] = useState(null)
  const [listaEspera, setListaEspera] = useState([])

  useEffect(() => {
    buscarProdutos()
      .then((dados) => setProdutos(dados))
      .catch(() => setErro('Não foi possível carregar os produtos.'))
      .finally(() => setCarregando(false))

    buscarClientes().then((dados) => {
      setClientes(dados)
      if (dados.length > 0) setClienteAtualId(dados[0].id)
    })
  }, [])

  function adicionarAoCarrinho(produto) {
    setCarrinho((carrinhoAtual) => {
      const quantidadeNoCarrinho = carrinhoAtual.filter((item) => item.id === produto.id).length

      if (produto.estoque === 0 || quantidadeNoCarrinho >= produto.estoque) {
        return carrinhoAtual
      }

      return carrinhoAtual.concat(produto)
    })
  }

  function removerUmaUnidade(produtoId) {
    setCarrinho((carrinhoAtual) => {
      const indicePrimeiro = carrinhoAtual.findIndex((produto) => produto.id === produtoId)

      if (indicePrimeiro === -1) {
        return carrinhoAtual
      }

      return carrinhoAtual.filter((_, indice) => indice !== indicePrimeiro)
    })
  }

  function removerProduto(produtoId) {
    setCarrinho((carrinhoAtual) => carrinhoAtual.filter((produto) => produto.id !== produtoId))
  }

  function solicitarAviso(produtoId, nome, email) {
    const nomeLimpo = nome.trim()
    const emailLimpo = email.trim()

    if (!nomeLimpo || !emailLimpo) {
      return false
    }

    setListaEspera((anteriores) => {
      const jaRegistrado = anteriores.some(
        (item) =>
          item.produtoId === produtoId && item.email.toLowerCase() === emailLimpo.toLowerCase()
      )

      if (jaRegistrado) {
        return anteriores
      }

      return [...anteriores, { produtoId, nome: nomeLimpo, email: emailLimpo }]
    })

    return true
  }

  const clienteAtual = clientes.find((cliente) => cliente.id === clienteAtualId)

  return (
    <div className="app">
      <RolarParaTopo />
      <Header carrinho={carrinho} clienteAtual={clienteAtual} />

      <main className="conteudo">
        {carregando && <p className="aviso">Carregando produtos...</p>}
        {erro && <p className="aviso aviso-erro">{erro}</p>}

        {!carregando && !erro && (
          <Routes>
            <Route
              path="/"
              element={<Loja produtos={produtos} onAdicionar={adicionarAoCarrinho} />}
            />
            <Route
              path="/produto/:id"
              element={
                <PaginaProduto
                  produtos={produtos}
                  onAdicionar={adicionarAoCarrinho}
                  onSolicitarAviso={solicitarAviso}
                />
              }
            />
            <Route
              path="/carrinho"
              element={
                <Carrinho
                  carrinho={carrinho}
                  produtos={produtos}
                  clienteAtual={clienteAtual}
                  onAdicionar={adicionarAoCarrinho}
                  onRemover={removerUmaUnidade}
                  onRemoverTodos={removerProduto}
                />
              }
            />
            <Route
              path="/estoque"
              element={<Estoque produtos={produtos} listaEspera={listaEspera} />}
            />
            <Route
              path="/admin"
              element={<PainelLojista produtos={produtos} listaEspera={listaEspera} />}
            />
          </Routes>
        )}
      </main>

      <Footer
        clientes={clientes}
        clienteAtualId={clienteAtualId}
        onTrocarCliente={setClienteAtualId}
      />
    </div>
  )
}
