module.exports = {
  presets: ['next/babel'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['transform-define', {
      'process.env.PREFIX_PATH': process.env.NODE_ENV === 'production' ? '/bb-scouting': '',
    }],
  ],
};
