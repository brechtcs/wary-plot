import builtins from 'rollup-plugin-node-builtins'
import cjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'

export default {
  plugins: [
    cjs(),
    json(),
    builtins(),
    resolve({
      mainFields: ['module', 'browser', 'main'],
      preferBuiltins: false
    })
  ]
}
