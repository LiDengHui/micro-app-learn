// 改为import
import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const __dirname = import.meta.dirname;

export default{
    mode: 'development',
    entry: './src/index.js', // 你的入口文件
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true, // 每次构建清理 dist
    },
    devtool: 'eval-source-map', // 开发用更快的 source map
    devServer: {
        historyApiFallback: true,
        static: './dist',
        hot: true,
        port: 8080,
        open: true,
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i, // sass/scss 文件处理
                use: [
                    'style-loader', // 开发环境用 style-loader
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.css$/i, // 支持纯 css 文件
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i, // 图片资源
                type: 'asset/resource',
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            scriptLoading: "module",
            template: './public/index.html', // 自动插入 script 标签
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
        }),
    ],
    resolve: {
        extensions: ['.js', '.json'],
    },
};
