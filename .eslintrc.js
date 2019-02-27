module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html',
    'import',
  ],
  // add your custom rules here
  'rules': {
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-param-reassign': 0,
    'no-underscore-dangle': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 1 : 0,
    'import/prefer-default-export': 'off',
    'prefer-promise-reject-errors': 0,
  },
  'globals': {
    'document': true,
    'window': true,
    'navigator': true,
    'performance': true,
    'alert': true,
    'location': true,
  }
}
