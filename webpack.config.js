const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const outputDir = path.resolve(__dirname, 'dist'); // This has to be an absolute path!;

module.exports = {
    entry: './src/index.tsx',
    output: {
        filename: 'index.js',
        path: outputDir
    },

    devtool: "eval-source-map",
    mode: "development",

    devServer: {
        static: outputDir,
        hot: false,
    },

    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },

    module: {
        rules: [
            {
                test: /\.less$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "less-loader",
                ],
            },

            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                use: ["source-map-loader"],
            },
        ],
    },

    ignoreWarnings: [/Failed to parse source map/],

    plugins: [
        new HtmlWebpackPlugin({
            template: "src/index.html"
        }),

        new CopyWebpackPlugin({
            patterns: [
                {
                    from: `./node_modules/antd/dist/antd.css`,
                    to: outputDir,
                },
                {
                    from: `./src/styles/tailwind.css`,
                    to: outputDir,
                },
            ],
        }),

    ],
};