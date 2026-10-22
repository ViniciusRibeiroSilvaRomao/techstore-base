function converterNumero(valor) {
  if (valor === null || valor === undefined || valor === '') {
    return null
  }

  if (typeof valor === 'number') {
    return Number.isFinite(valor) ? valor : null
  }

  const texto = String(valor).trim().replace(/R\$\s*/gi, '').replace(/\s+/g, '')
  if (!texto) {
    return null
  }

  let normalizado = texto.replace(/[^0-9,.-]/g, '')
  if (!normalizado) {
    return null
  }

  if (normalizado.includes(',') && normalizado.includes('.')) {
    const ultimoSeparador =
      normalizado.lastIndexOf(',') > normalizado.lastIndexOf('.') ? ',' : '.'

    if (ultimoSeparador === ',') {
      normalizado = normalizado.replace(/\./g, '').replace(',', '.')
    } else {
      normalizado = normalizado.replace(/,/g, '')
    }
  } else if (normalizado.includes(',')) {
    const [parteInteira, parteDecimal] = normalizado.split(',')
    const temSeparadorMilhar = parteDecimal && parteDecimal.length === 3 && parteInteira.length > 0

    normalizado = temSeparadorMilhar ? normalizado.replace(',', '') : normalizado.replace(',', '.')
  } else if (normalizado.includes('.')) {
    const partes = normalizado.split('.')
    const ultimaParte = partes[partes.length - 1]
    const temSeparadorMilhar = partes.length > 1 && ultimaParte.length === 3 && partes[0].length > 0

    if (temSeparadorMilhar && partes.length > 1) {
      normalizado = normalizado.replace(/\./g, '')
    }
  }

  const valorNumerico = Number(normalizado)
  return Number.isFinite(valorNumerico) ? valorNumerico : null
}

export function formatarPreco(valor) {
  const valorNumerico = converterNumero(valor)

  if (valorNumerico === null) {
    return 'R$ 0,00'
  }

  return valorNumerico.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}
