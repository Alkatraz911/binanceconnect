import path from 'path';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import webpack from 'webpack';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));


export default {
    context: path.resolve(__dirname,'src'),
    mode: 'development',
    entry: {
        main: ['@babel/polyfill','./main.js']
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist')
    },
    experiments: {
        topLevelAwait: true,
    },
    devServer: {
      historyApiFallback: true,
      open: true,
      compress: true,
      hot: true,
      port: 8080,
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html'
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            filename: '[name].[contenthash].css'
        }),
        // new CopyWebpackPlugin({
        //     patterns: [
        //         { 
        //             from: path.resolve(__dirname, './src/files'), 
        //             to: path.resolve(__dirname, 'dist/assets') 
        //         },
        //     ],
        // }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    module:{
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader",
                ],
            }, 
            {
                test: /\.(png|svg|jpe?g|gif)$/i,
                use: [
                  {
                    loader: 'file-loader',
                  },
                ],
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader",
                  options: {
                    presets: ['@babel/preset-env'],
                    
                  }
                }
            },

        ]
    }
}