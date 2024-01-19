// generate random string with length
function genStargramID(length) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return `sgm_${result}`
}

const id = genStargramID(32)
// eslint-disable-next-line no-console
console.log(id)
