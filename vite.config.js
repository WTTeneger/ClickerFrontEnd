// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// import mkcert from 'vite-plugin-mkcert';

// // https://vitejs.dev/config/
// export default defineConfig({
//   server: { https: false }, // Not needed for Vite 5+
//   plugins: [mkcert(), react()],
//   build: { chunkSizeWarningLimit: 1600 },
// });


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import mkcert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/
export default defineConfig({
  server: { https: true }, // Not needed for Vite 5+
  plugins: [mkcert(), react()],
  build: { chunkSizeWarningLimit: 25600 },
});

