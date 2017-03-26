module.exports = {
  entry: './app.ts',
  output: {
    filename: 'build/app.js'
  },
  module: {
    loaders: [{
      test: /\.ts(x?)$/,
      loader: 'ts-loader'
    }]
  }
}