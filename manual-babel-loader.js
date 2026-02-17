const babel = require('@babel/core');

module.exports = function(source) {
  const result = babel.transformSync(source, {
    presets: ['@babel/preset-env', '@babel/preset-react'],
    filename: this.resourcePath
  });
  
  return result.code;
};
