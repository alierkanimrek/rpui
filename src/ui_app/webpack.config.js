const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        user: './src/user.ts',
        node: './src/node.ts'
    },
    resolve: {
        extensions: ['.js', '.ts', '.css', '.ghtml']
    },
    output: {
        filename: "[name].[hash].js",
        path: path.resolve(__dirname, 'dist/app'),
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "awesome-typescript-loader"
            },
            {
                test:/\.css$/,
                exclude: /node_modules/,
                use:['style-loader','css-loader']
            },
            {
            test: /\.ghtml$/,
            use: 'raw-loader',
            }
        ]
    }
};