import { get } from './api'

function normalizarValor(valor) {
  if (valor === null || valor === undefined || valor === '') {
    return null
  }

  const texto = String(valor).trim()
  if (!texto) {
    return null
  }

  const valorNumerico = Number(
    texto.replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '')
  )

  return Number.isFinite(valorNumerico) ? valorNumerico : null
}

// Formato dos produtos documentado em docs/api.md
export function buscarProdutos() {
  return get('/products.json').then((produtos) =>
    produtos.map((produto) => {
      const price = normalizarValor(produto.price)
      const precoOriginal = normalizarValor(produto.precoOriginal)

      return {
        ...produto,
        price,
        ...(precoOriginal !== null ? { precoOriginal } : {}),
      }
    })
  )
}
