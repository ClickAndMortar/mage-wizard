import Engine from 'php-parser'

// @ts-ignore
const parser = new Engine({
  parser: {
    extractDoc: false,
  },
  ast: {
    withPositions: false,
    withSource: true,
  },
})

export default parser
