import ts from 'rollup-plugin-typescript2';
import path from 'path';
import dts from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import autoprefixer from 'autoprefixer';
import alias from '@rollup/plugin-alias';
import nodeResolve from '@rollup/plugin-node-resolve';
const resolveDir = dir => path.join(__dirname, dir);
export default [{
    // 入口文件
    input: './src/core/index.ts',
    output: [
        // 打包esModule
        {
            file: path.resolve(__dirname, './dist/index.esm.js'),
            format: 'es',
            sourcemap: true
        },
         // 打包common js
        {
            file: path.resolve(__dirname, './dist/index.cjs.js'),
            format: 'cjs',
            sourcemap: true
        },
       // 打包 AMD CMD UMD
        {
            file: path.resolve(__dirname, './dist/index.js'),
            format: 'umd',
            name: 'countrySelector',
            sourcemap: true
        }
    ],
    // 配置ts
    plugins: [
        ts(),
        nodeResolve({ browser: true }),
        postcss({
            plugins: [
              autoprefixer()
            ],
            use: [
                ['sass', { javascriptEnabled: true }]
            ],
            inject: false,
            extract: false,
            modules: false,
            sourceMap: true
        }),
        babel({
            exclude: 'node_modules/**'
        }),
        // 开发环境下不压缩，避免样式注入代码被意外优化掉
        serve({
            open: true,
            port: 8889,
            contentBase: '',
        }),
        livereload(),
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