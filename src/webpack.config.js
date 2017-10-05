// Learn more on how to config.
// - https://github.com/ant-tool/atool-build#配置扩展

const path = require('path');


module.exports = function (webpackConfig, env) {
    /*webpackConfig.babel.plugins.push('transform-runtime');

    // Support hmr
    if (env === 'development') {
        webpackConfig.babel.plugins.push(['dva-hmr', {
            entries: [
                './client/src/index.js',
            ],
        }]);
    }

    // Support CSS Modules
    // Parse all less files as css module.
    webpackConfig.module.loaders.forEach((_loader, index) => {
        const loader = _loader;
        if (typeof loader.test === 'function' && loader.test.toString().indexOf('\\.less$') > -1) {
            loader.include = /node_modules/;
            loader.test = /\.less$/;
        }
        if (loader.test.toString() === '/\\.module\\.less$/') {
            loader.exclude = /node_modules/;
            loader.test = /\.less$/;
        }
        if (typeof loader.test === 'function' && loader.test.toString().indexOf('\\.css$') > -1) {
            loader.include = /node_modules/;
            loader.test = /\.css$/;
        }
        if (loader.test.toString() === '/\\.module\\.css$/') {
            loader.exclude = /node_modules/;
            loader.test = /\.css$/;
        }
    });

    webpackConfig.babel.plugins.push(['import', {
        libraryName: 'antd',
        style: 'css',
    }]);

    webpackConfig.output.path = path.join(__dirname, 'client/dist');*/

    return webpackConfig;
};
