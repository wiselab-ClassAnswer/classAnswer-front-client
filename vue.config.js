const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  configureWebpack: config => {
    config.devtool = 'source-map';

	config.target = ["web"];

    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true
    };

    if (!config.module) {
      config.module = { rules: [] };
    }

    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async'
    });
  },

  chainWebpack: config => {
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule.use("vue-svg-loader").loader("vue-svg-loader");
  },

  assetsDir: './',
  outputDir: '../src/main/resources/static',
  lintOnSave: false,

  pages: {
    index: {
      title: 'Wise-GPT',
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    },
    popup: {
      title: 'POPUP',
      entry: 'src/popup/main.js',
      template: 'public/popup.html',
      filename: 'popup.html'
    }
  },

  // index.html 파일이 생성될 위치를 지정
  indexPath: "index.html",

  // Spring Boot의 내장 was의 주소를 작성
  devServer: {
    port: 3000,
    proxy: {
      '.hb$': {
        target: process.env.VUE_APP_API_URL || 'http://127.0.0.1:8080',
        changeOrigin: true,
        ws: true
      }
    },
    client: {
      overlay: false
    }
  }
});
