module.exports = function (api) {
  api.cache(true);
  // babel-preset-expo automatically applies the react-native-worklets
  // (Reanimated) plugin when reanimated is installed. No manual plugin needed.
  return {
    presets: ['babel-preset-expo'],
  };
};
