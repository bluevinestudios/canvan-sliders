import typescript from 'rollup-plugin-typescript2';
 
export default [{
    input: './src/index.ts',
    output: [
        { file: './dist/canvan-sliders.umd.js', name: 'canvan-sliders', format: 'umd', sourcemap: true },
        { file: './dist/canvan-sliders.es5.js', format: 'es', sourcemap: true },
    ],
 
    plugins: [
        typescript({ useTsconfigDeclarationDir: true })
    ]
}, 
{
    input: './examples/ts/main.ts',
    output: { file: './examples/js/main.js', name: 'main', format: 'cjs', sourcemap: true },
     
    plugins: [
        typescript({ useTsconfigDeclarationDir: true })
    ]
}
]