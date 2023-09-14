import typescript from '@rollup/plugin-typescript';
import run from '@rollup/plugin-run';

export default {
    input: 'src/index.ts',
    output: {
        sourceMap: true,
        file: './dist/bundle.js',
        format: 'esm',
    },
    plugins: [typescript(), run()],
};
