// https://cn.vitejs.dev/guide/api-javascript.html#createserver

import { createServer } from 'vite'

export async function createDevServer(root = process.cwd()) {
  console.log('root is ', root)
  return createServer({
    root,
  })
}
