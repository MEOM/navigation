import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const umd = { format: 'umd', name: 'Navigation', exports: 'named' };
const es = { format: 'es' };
const minify = {
    plugins: [ terser() ],
    banner: () => `/*! navigation ${ pkg.version } — © MEOM */`,
};

export default {
    input: 'src/index.js',
    output: [
        // Main files
        { file: 'dist/index.js', ...umd },
        { file: 'dist/index.esm.js', ...es },
        // Minified versions
        { file: 'dist/index.min.js', ...umd, ...minify },
        { file: 'dist/index.esm.min.js', ...es, ...minify },
    ],
    plugins: [ nodeResolve(), commonjs( { include: 'node_modules/**' } ) ],
};
