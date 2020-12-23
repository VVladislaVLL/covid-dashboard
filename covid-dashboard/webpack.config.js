const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
// const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
const ASSET_PATH = process.env.ASSET_PATH || '/';


const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }
    if (isProd) {
        config.minimizer = [
            new OptimizeCssAssetsPlugin(),
            new TerserWebpackPlugin()
        ]
    }

}

const getModules = () => {
    const modulesArr = [{
            test: /\.css$/,
            use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: isDev,
                        reloadAll: true,
                        publicPath: ''
                    },
                },
                'css-loader'
            ],
        },
        {
            test: /\.s[ac]ss$/,
            use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: isDev,
                        reloadAll: true,
                        publicPath: ''
                    },
                },
                'css-loader',
                'sass-loader'
            ],
        },
        {
            test: /\.(png|jpg|jpeg|gif|svg)$/,
            use: ['file-loader'],
        },
        {
            test: /\.(ttf|woff|woff2|eot)$/,
            use: ['file-loader'],
        },
        {
            test: /\.mp3$/,
            use: ['file-loader'],
        }
    ];


    // if (isDev) {
    //     modulesArr.push(
    //         {
    //             test: /\.js$/,
    //             exclude: /(node_modules)/,
    //             loader:  'eslint-loader'
    //         }
    //     );
    // };

    return modulesArr;
}


module.exports = {
    //context: path.resolve(__dirname, 'src'), // место откуда беруться все файлы для работы 
    mode: 'development',
    entry: {
        main: './src/js/index.js',
        countries: './src/js/countries.js',
        currentInfected: './src/js/currentInfected.js',
        infected__list: './src/js/infected__list.js',
        search: './src/js/search.js',
        keyboard: './src/js/keyboard.js',
        map: './src/js/map.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        // publicPath: '/',
        filename: '[name].[contenthash].js',
        chunkFilename: '[id].[contenthash]_[chunkhash].js',
        sourceMapFilename: '[file].map',
        // publicPath: path.resolve(__dirname, 'dist'),        
    },
    resolve: {
        extensions: ['.js', '.json', '.png'],
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    optimization: optimization(),
    devServer: {
        port: 4200,
        hot: isDev
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/html/index.html',
            chunks: ['main', 'map', 'fullscreen', 'countries', 'currentInfected', 'infected__list', 'search.js', 'keyboard.js'],
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, './assets/icons/icon-fullscreen.png'),
                    to: path.resolve(__dirname, 'dist')
                },
                {
                  from: path.resolve(__dirname, './assets/icons/icon-fullscreen-2x.png'),
                  to: path.resolve(__dirname, 'dist')
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        })
    ],
    module: {
        rules: getModules()
    }
}