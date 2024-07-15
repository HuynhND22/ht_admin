import * as path from 'path';
import { Configuration } from 'webpack';
const Dotenv = require('dotenv-webpack');

const config: Configuration = {
  // Các cài đặt khác của webpack ở đây
  plugins: [
    new Dotenv()
  ],
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify"),
    },
  },
};

export default config;
