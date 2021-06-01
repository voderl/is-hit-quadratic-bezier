module.exports = {
  rollup(config, options) {
    if (options.format === 'umd') {
      config.output.exports = 'auto';
      config.output.name = 'measureBezier';
    }
    return config;
  },
};
