const Dotenv = require('dotenv-webpack');
const path = require('path');

module.exports = {
  useFileSystemPublicRoutes: false,
  webpack: (config, options) => {
    config.plugins.push(
      new Dotenv({
        path: path.join(__dirname, '.env'),
        systemvars: true,
      }),
    );

    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };

    return config;
  }
}
