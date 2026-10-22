import { formatarPreco } from '../utils/formatarPreco'

const categorias = ['roupas', 'eletronicos', 'acessorios', 'casa']

export default function PainelLojista({ produtos = [], listaEspera = [] }) {
    const totaisPorCategoria = categorias.map((categoria) => {
        const categoriaProdutos = produtos.filter((produto) => produto.category === categoria)

        const valorEstoque = categoriaProdutos.reduce((total, produto) => {
            if (produto.estoque <= 0 || produto.price === null || produto.price === undefined) {
                return total
            }

            return total + Number(produto.price) * Number(produto.estoque)
        }, 0)

        const valorReferencia = categoriaProdutos.reduce((total, produto) => {
            const precoBase = produto.precoOriginal ?? produto.price ?? 0
            if (produto.estoque <= 0 || precoBase === 0) {
                return total
            }

            return total + Number(precoBase) * Number(produto.estoque)
        }, 0)

        const lucroEstocado = valorEstoque - valorReferencia

        const produtosSemPreco = categoriaProdutos.filter(
            (produto) => produto.price === null || produto.price === undefined
        )

        const clientesEsperando = listaEspera.filter((registro) => {
            const produto = categoriaProdutos.find((item) => item.id === registro.produtoId)
            return Boolean(produto && produto.estoque === 0)
        }).length

        return {
            categoria,
            valorEstoque,
            lucroEstocado,
            produtosSemPreco,
            clientesEsperando,
        }
    })

    const valorTotalEstoque = totaisPorCategoria.reduce((total, item) => total + item.valorEstoque, 0)

    const clientesEsperandoTotal = listaEspera.filter((registro) => {
        const produto = produtos.find((item) => item.id === registro.produtoId)
        return Boolean(produto && produto.estoque === 0)
    }).length

    const produtosAguardandoPreco = produtos.filter(
        (produto) => produto.price === null || produto.price === undefined
    )

    return (
        <section>
            <p className="sobretitulo">Painel administrativo</p>
            <h1>Visão geral da loja</h1>

            <div className="painel-grid">
                <div className="card-metrica">
                    <small>Dinheiro parado em estoque</small>
                    <strong>{formatarPreco(valorTotalEstoque)}</strong>
                </div>
                <div className="card-metrica">
                    <small>Receita se vender tudo hoje</small>
                    <strong>{formatarPreco(valorTotalEstoque)}</strong>
                </div>
                <div className="card-metrica">
                    <small>Aguardando preço do fornecedor</small>
                    <strong>{produtosAguardandoPreco.length}</strong>
                </div>
                <div className="card-metrica">
                    <small>Clientes na fila de reposição</small>
                    <strong>{clientesEsperandoTotal}</strong>
                </div>
            </div>

            <div className="painel-secoes">
                <div className="painel-bloco">
                    <h2>Resumo por categoria</h2>
                    <div className="tabela-moldura">
                        <table className="painel-tabela">
                            <thead>
                                <tr>
                                    <th>Categoria</th>
                                    <th>Valor em estoque</th>
                                    <th>Venda hoje</th>
                                    <th>Lucro estimado</th>
                                    <th>Clientes esperando</th>
                                </tr>
                            </thead>
                            <tbody>
                                {totaisPorCategoria.map((item) => (
                                    <tr key={item.categoria}>
                                        <td>
                                            <span className="categoria-nome">{item.categoria}</span>
                                        </td>
                                        <td>{formatarPreco(item.valorEstoque)}</td>
                                        <td>{formatarPreco(item.valorEstoque)}</td>
                                        <td
                                            className={
                                                item.lucroEstocado >= 0 ? 'painel-valor-positivo' : 'painel-valor-negativo'
                                            }
                                        >
                                            {formatarPreco(item.lucroEstocado)}
                                        </td>
                                        <td>{item.clientesEsperando}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="painel-bloco">
                    <h2>Produtos sem preço definido</h2>
                    {produtosAguardandoPreco.length === 0 ? (
                        <p className="aviso">Todos os produtos já têm preço disponível.</p>
                    ) : (
                        <ul className="painel-lista">
                            {produtosAguardandoPreco.map((produto) => (
                                <li key={produto.id}>
                                    <strong>{produto.title}</strong>
                                    <span>{produto.category}</span>
                                    <span>{produto.estoque} em estoque aguardando preço</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="painel-bloco">
                    <h2>Clientes aguardando retorno</h2>
                    {listaEspera.length === 0 ? (
                        <p className="aviso">Nenhum cliente está na fila de espera no momento.</p>
                    ) : (
                        <ul className="painel-lista">
                            {listaEspera.map((registro, indice) => {
                                const produto = produtos.find((item) => item.id === registro.produtoId)
                                const estaEsgotado = produto ? produto.estoque === 0 : false

                                if (!estaEsgotado) {
                                    return null
                                }

                                return (
                                    <li key={`${registro.produtoId}-${registro.email}-${indice}`}>
                                        <strong>{registro.nome}</strong>
                                        <span>{registro.email}</span>
                                        <span>{produto ? produto.title : 'Produto sem cadastro'}</span>
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </section>
    )
}
