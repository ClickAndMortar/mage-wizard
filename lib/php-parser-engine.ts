import engine from 'php-parser';

// @ts-ignore
const parser = new engine({
  parser: {
    extractDoc: false,
    php7: true,
  },
  ast: {
    withPositions: false,
  },
});

export default parser;
