import Engine from 'php-parser'

// @ts-ignore
const parser = new Engine({
  parser: {
    extractDoc: false,
    php7: true,
  },
  ast: {
    withPositions: false,
  },
})

export default parser
