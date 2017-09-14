// Learn more on how to config.
// - https://github.com/ant-tool/atool-build#配置扩展

const webpack = require('atool-build/lib/webpack');
const path = require('path');


module.exports = function (webpackConfig, env) {
    webpackConfig.babel.plugins.push('transform-runtime');

    // Support hmr
    if (env === 'development') {
        webpackConfig.babel.plugins.push(['dva-hmr', {
            entries: [
                './client/src/index.js',
            ],
        }]);
    }

    webpackConfig.babel.plugins.push(['import', {
        libraryName: 'antd',
        style: 'css',
    }]);

    webpackConfig.output.path = path.join(__dirname, 'client/dist');

    return webpackConfig;
};
