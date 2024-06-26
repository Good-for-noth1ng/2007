module.exports = function(api) {
  api.cache(true);
  return {
    // presets: ['babel-preset-expo', 'module:metro-react-native-babel-preset'],
    // presets: ['babel-preset-expo'],
    presets: ["module:metro-react-native-babel-preset"],
    // presets: [["module:metro-react-native-babel-preset", { "useTransformReactJSXExperimental": true }]],
    plugins: [
        // {
        //   "envName": "APP_ENV",
        //   "moduleName": "@env",
        //   "path": ".env",
        //   "safe": false,
        //   "allowUndefined": true,
        //   "verbose": false,
        // },
        "module:react-native-dotenv", 
        'react-native-reanimated/plugin'
    ]
  };
};
