'use strict';

const path = require('path');

module.exports = {
    entry: path.resolve('src/mesh.ts'),
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'dist'),
        libraryTarget: 'amd'
    },
    devtool: 'source-map',
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    module: {
        loaders: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            { test: /\.ts$/, exclude: __dirname + '/', loader: 'ts-loader?'+JSON.stringify({
                compilerOptions: {
                    lib: ['es5', 'ES2015.Promise', 'DOM'],
                    types: ['node'],
                    target: 'es5'
                },
                libraryTarget: 'umd'
            })}
        ]
    },
    externals: {
        lodash : 'lodash'
    }
};
