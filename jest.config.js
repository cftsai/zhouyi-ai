module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\.js$': 'babel-jest'
  },
  moduleNameMapper: {
    'node-fetch': '<rootDir>/__mocks__/node-fetch.js'
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/']
};
