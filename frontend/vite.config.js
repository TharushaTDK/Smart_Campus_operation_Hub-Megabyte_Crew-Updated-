import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Strip SameSite/Secure from Set-Cookie so JSESSIONID is accepted by the
// browser for localhost:5173 requests (the same origin as all XHR calls).
function cookieFixPlugin(proxy) {
  proxy.on('proxyRes', (proxyRes) => {
    const setCookie = proxyRes.headers['set-cookie'];
    if (setCookie) {
      proxyRes.headers['set-cookie'] = setCookie.map((cookie) =>
        cookie
          .replace(/;\s*SameSite=[^;]*/gi, '')
          .replace(/;\s*Secure/gi, '')
      );
    }
  });
}

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // REST API calls
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
        configure: cookieFixPlugin,
      },
      // OAuth2 authorization start: /oauth2/authorization/google
      '/oauth2': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
        configure: cookieFixPlugin,
      },
      // OAuth2 callback from Google: /login/oauth2/code/google
      '/login/oauth2': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
        configure: cookieFixPlugin,
      },
    },
  },
});
