import typescript from 'rollup-plugin-typescript2';
import { uglify } from "rollup-plugin-uglify";

export default [{
    input: './src/index.ts',
    output: [
        { file: './dist/canvan-sliders.js', name: 'canvan', format: 'iife', sourcemap: true },
    ],
    /*output: [
        { file: './dist/canvan-sliders.umd.js', name: 'canvan-sliders', format: 'umd', sourcemap: true },
        { file: './dist/canvan-sliders.es5.js', format: 'es', sourcemap: true },
    ], */
 
    plugins: [
        typescript({ useTsconfigDeclarationDir: true }),
    ]
}, 
{
        input: './dist/canvan-sliders.js',
        output: [
            { file: './dist/canvan-sliders.min.js', name: 'canvan', format: 'iife', sourcemap: true },
        ],
        plugins: [
            uglify(),
        ]
    },
{
    input: './examples/ts/main.ts',
    output: [
        { file: './examples/js/main.js', name: 'main', format: 'cjs', sourcemap: true },
        { file: './docs/js/main.js', name: 'main', format: 'cjs', sourcemap: false }
    ],
     
    plugins: [
        typescript({ useTsconfigDeclarationDir: true })
    ]
}
]