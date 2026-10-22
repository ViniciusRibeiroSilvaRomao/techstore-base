import { useState } from 'react'
import { Link, useParams } from 'react-router'

export default function PaginaProduto({ produtos, onAdicionar, onSolicitarAviso }) {
  const { id } = useParams()
  const [nomeAviso, setNomeAviso] = useState('')
  const [emailAviso, setEmailAviso] = useState('')
  const [mensagemAviso, setMensagemAviso] = useState('')
  const produto = produtos.find((item) => item.id === id)

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const relacionados = produtos
    .filter(
      (item) =>
        item.category === produto.category &&
        item.id !== produto.id &&
        item.estoque > 0 &&
        item.price !== null &&
        item.price !== undefined
    )
    .slice(0, 4)

  function enviarSolicitacaoAviso(evento) {
    evento.preventDefault()

    const envioOk = onSolicitarAviso(produto.id, nomeAviso, emailAviso)
    if (envioOk) {
      setMensagemAviso('Você será avisado quando o produto voltar ao estoque.')
      setNomeAviso('')
      setEmailAviso('')
      return
    }

    setMensagemAviso('Preencha nome e e-mail para receber o aviso.')
  }

  const precoProduto = produto.price ?? 0

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">
            {produto.price === null || produto.price === undefined
              ? 'Preço em atualização'
              : `R$ ${precoProduto.toFixed(2).replace('.', ',')}`}
          </p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className="detalhe-estoque">
            {produto.price === null || produto.price === undefined
              ? 'Produto aguardando definição de preço'
              : `${produto.estoque} unidades disponíveis`}
          </p>

          {produto.estoque === 0 ? (
            <form onSubmit={enviarSolicitacaoAviso} className="form-aviso">
              <p className="aviso aviso-erro">Produto esgotado.</p>
              <label>
                Nome
                <input
                  type="text"
                  value={nomeAviso}
                  onChange={(evento) => setNomeAviso(evento.target.value)}
                  placeholder="Seu nome"
                />
              </label>
              <label>
                E-mail
                <input
                  type="email"
                  value={emailAviso}
                  onChange={(evento) => setEmailAviso(evento.target.value)}
                  placeholder="seu@email.com"
                />
              </label>
              <button type="submit" className="botao botao-grande">
                Me avise quando voltar
              </button>
              {mensagemAviso && <p className="mensagem-cupom">{mensagemAviso}</p>}
            </form>
          ) : produto.price === null || produto.price === undefined ? (
            <p className="aviso aviso-erro">Este produto não pode ser vendido até que o preço seja definido.</p>
          ) : (
            <button
              className="botao botao-grande"
              onClick={() => onAdicionar(produto)}
              disabled={produto.estoque === 0}
            >
              Adicionar ao carrinho
            </button>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <article key={item.id} className="card">
            <Link to={`/produto/${item.id}`} className="card-link">
              <div className="card-imagem-moldura">
                <img src={item.image} alt={item.title} className="card-imagem" />
              </div>
              <h3 className="card-titulo">{item.title}</h3>
            </Link>
            <p className="preco">R$ {Number(item.price).toFixed(2).replace('.', ',')}</p>
            <button className="botao" onClick={() => onAdicionar(item)}>
              Adicionar ao carrinho
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
