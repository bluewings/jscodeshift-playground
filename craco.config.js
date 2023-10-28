
module.exports = {
  webpack: {
    // alias: {
    //   '~': path.resolve(__dirname, 'src/'),
    // },
    configure: (webpackConfig, { paths }) => {
      // add esbuild-loader
    //   addBeforeLoader(webpackConfig, loaderByName('babel-loader'), {
    //     test: /\.(js|mjs|jsx|ts|tsx)$/,
    //     include: [
    //       paths.appSrc,
    //       /\/packages\/(content-model|core|core-client|widget|blockly|blockly-ui)\//,
    //       /\/node_modules\/(color|dayjs)\//,
    //     ],
    //     loader: require.resolve('esbuild-loader'),
    //     options: {
    //       loader: 'tsx',
    //       target: 'es2015',
    //     },
    //   });

      // remove the babel loaders
    //   removeLoaders(webpackConfig, loaderByName('babel-loader'));

      // replace terser with esbuild
    //   replaceMinimizer(
    //     webpackConfig,
    //     'TerserPlugin',
    //     new ESBuildMinifyPlugin({
    //       target: 'es2015',
    //       css: true,
    //     }),
    //   );

    //   // remove the css OptimizeCssAssetsWebpackPlugin
    //   removeMinimizer(webpackConfig, 'OptimizeCssAssetsWebpackPlugin');

    //   // add yaml-loader
    //   addAfterLoader(webpackConfig, loaderByName('url-loader'), {
    //     test: /\.ya?ml$/,
    //     use: 'yaml-loader',
    //     type: 'json',
    //   });

      // yarn run build 시 결과에 미사용 파일을 표시한다. (실제 삭제는 하지 않음))
    //   if (webpackConfig.mode === 'production') {
    //     webpackConfig.plugins = [
    //       ...webpackConfig.plugins,
    //       new UnusedWebpackPlugin({
    //         // Source directories
    //         directories: [path.join(__dirname, 'src')],
    //         // Exclude patterns
    //         exclude: [
    //           '*.test.{js,ts}',
    //           '*.stories.tsx',
    //           'components/Storybook/**/*',
    //           'setup*.{js,ts}',
    //           'react-app-env.d.ts',
    //         ],
    //       }),
    //     ];
    //   }
    webpackConfig.resolve = {
        ...webpackConfig.resolve,
        fallback: {
            ...webpackConfig.resolve?.fallback,
            constants: false,
            os: false,
        }
    }
    // esolve.fallback: { "os": false }


      return webpackConfig;
    },
  },
//   typescript: {
//     enableTypeChecking: false,
//   },
//   jest: {
//     configure: {
//       moduleNameMapper: {
//         '^~(.*)$': '<rootDir>/src$1',
//       },
//     },
//   },
};
