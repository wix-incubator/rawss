'use strict';

const path = require('path');

module.exports = {
    entry: {
        lefil: path.resolve('src/lefil.ts'),
        domUtils: path.resolve('src/domUtils.ts')
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'dist'),
        libraryTarget: 'umd'
    },
    devtool: 'source-map',
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    module: {
        loaders: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            { test: /src\/.*\.ts$/, loader: 'ts-loader?'+JSON.stringify({
                compilerOptions: {
                    lib: ['es5', 'ES2015.Promise', 'DOM'],
                    types: ['node', 'mocha'],
                    target: 'es5'
                }
            })}
        ]
    },
    externals: {
        lodash : 'lodash'
    }
};
