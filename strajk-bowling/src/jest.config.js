module.exports = {
    // Other Jest configurations...
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
      '^.+\\.js?$': 'babel-jest',
    },
    transformIgnorePatterns: [
      '/node_modules/(?!nanoid)/', // Ignore nanoid in node_modules
    ],
  };