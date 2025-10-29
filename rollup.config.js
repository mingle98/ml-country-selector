import ts from 'rollup-plugin-typescript2';
import path from 'path';
import dts from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import autoprefixer from 'autoprefixer';
import alias from '@rollup/plugin-alias';
import { DEFAULT_EXTENSIONS } from '@babel/core';
const resolveDir = dir => path.join(__dirname, dir);
import nodeResolve from '@rollup/plugin-node-resolve';
export default [{
    // 入口文件
    input: './src/core/index.ts',
    output: [
        // 打包esModule
        {
            file: path.resolve(__dirname, './dist/index.esm.js'),
            format: 'es',
        },
         // 打包common js
        {
            file: path.resolve(__dirname, './dist/index.cjs.js'),
            format: 'cjs',
        },
       // 打包 AMD CMD UMD
        {
            input: './src/core/index.ts',
            file: path.resolve(__dirname, './dist/index.js'),
            format: 'umd',
            name: 'countrySelector',
        }
    ],
    // 配置ts
    plugins: [
        ts(),
        commonjs(),
        postcss({
            plugins: [
              autoprefixer()
            ],
            use: [
                ['sass', { javascriptEnabled: true }]
            ],
            inject: false,
            extract: false,
            modules: false
        }),
        babel({
            exclude: 'node_modules/**',
            extensions: [
              ...DEFAULT_EXTENSIONS,
              '.ts',
              '.tsx'
            ],
          }),
        terser(),
        nodeResolve({ browser: true }),
        alias({
            entries: [
                { find: '@', replacement: resolveDir('src') }
            ]
        })
    ]
}, {
    // 打包声明文件
    input: './src/core/index.ts',
    output: {
        file: path.resolve(__dirname, './dist/index.d.ts'),
        format: 'es',
    },
    plugins: [dts()]
}];