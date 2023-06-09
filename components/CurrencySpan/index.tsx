const CurrencySpan = ({ quantity }: { quantity: number }) => {
  const value = new Intl.NumberFormat('es-Mx', {
    style: 'currency',
    currency: 'mxn'
  }).format(quantity)
  return <p className="text-end">{value}</p>
}

export default CurrencySpan
