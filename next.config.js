// next.config.js

// make css accessible
const withCSS = require('@zeit/next-css')

module.exports =
  withCSS({
    exportTrailingSlash: true,
      exportPathMap: function() {
      return {
        '/': { page: '/' },
      };
    },
    webpack(config, options) {

      config.module.rules.push({
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2|wav|mp3)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 100000,
            name: '[name].[ext]',
            esModule: false,
          },
        }
      })

      config.module.rules.push({
        test: /\.(mp4)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        ]
      })

      config.module.rules.push({
        test: /\.md$/,
        use: 'raw-loader'
      })

      return config
    },
    env: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    },
  })
