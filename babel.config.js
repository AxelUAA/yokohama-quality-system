module.exports = function(api) {
  api.cache(true);
  
  return {
    sourceType: 'unambiguous',
    presets: [
      '@babel/preset-env',
      ['@babel/preset-react', { runtime: 'classic' }]
    ]
  };
};
