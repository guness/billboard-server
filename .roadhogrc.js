module.exports = {
    "entry": "src/index.js",
    "outputPath": "./dist",
    "define": {
        'process.env.NODE_CONF': process.env.NODE_CONF,
    },
    "env": {
        "development": {
            "extraBabelPlugins": [
                "transform-decorators-legacy",
                "dva-hmr",
                "transform-runtime",
                ["import", {"libraryName": "antd", "style": "css"}],
            ],
        },
        "production": {
            "extraBabelPlugins": [
                "transform-decorators-legacy",
                "transform-runtime",
                ["import", {"libraryName": "antd", "style": "css"}],
            ],
        },
        "stage": {
            "extraBabelPlugins": [
                "transform-decorators-legacy",
                "transform-runtime",
                ["import", {"libraryName": "antd", "style": "css"}],
            ],
        },
    },
};
