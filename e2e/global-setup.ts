import { createServer } from 'vite';

export default async function setup() {
  // Own the server directly so teardown does not depend on killing a shell tree on Windows.
  const server = await createServer({
    server: { host: '127.0.0.1', port: 4191, strictPort: true },
  });
  await server.listen();
  return async () => {
    await server.close();
  };
}
