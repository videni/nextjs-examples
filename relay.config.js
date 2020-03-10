module.exports = {
  // Configuration options accepted by the `relay-compiler` command-line tool
  // and `babel-plugin-relay`.
  src: './src',
  schema: './schema/schema.admin.graphql',
  exclude: ['**/node_modules/**', '**/__mocks__/**', '**/__generated__/**'],
  artifactDirectory: './src/__generated__',
  extensions: ['js', 'jsx', 'tsx', 'ts'],
  language: 'typescript'
};
