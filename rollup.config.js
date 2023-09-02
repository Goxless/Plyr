
import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
	input: 'src/server.ts',
	output: {
		sourceMap: true,
		file: './dist/bundle.js',
		format: 'esm'
	},
    plugins: [
		typescript()
	]
		
};