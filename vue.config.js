const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  // assetsDir: './static'
  // pwa: {
  //   workboxPluginMode: 'InjectManifest',
  //   workboxOptions: {
  //     swSrc: './src/serviceWorker.js',
  //   }
  // }
  pwa: {
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    workboxPluginMode: 'InjectManifest',
    // workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      // swDest: 'serviceWorker.js',
      swSrc: './src/serviceWorker.js',
      additionalManifestEntries: [
        {
          url: 'img/icons/favicon-32x32.png',
          revision: 'v1'
        }
      ],
      // globPatterns: ['**/*.ico'],
      // exclude: ['**/*.png']
    }
  }
})
