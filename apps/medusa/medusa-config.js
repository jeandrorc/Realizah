const path = require('path');
const { defineConfig, loadEnv } = require('@medusajs/framework/utils');

loadEnv(process.env.NODE_ENV || 'development', process.cwd());

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseDriverOptions: { connection: { ssl: false } },
    http: {
      storeCors: process.env.STORE_CORS || 'http://localhost:3000',
      adminCors: process.env.ADMIN_CORS || 'http://localhost:7001',
      authCors: process.env.AUTH_CORS || 'http://localhost:3000,http://localhost:7001',
      jwtSecret: process.env.JWT_SECRET || 'supersecret',
      cookieSecret: process.env.COOKIE_SECRET || 'supersecret',
    },
  },
  modules: [
    {
      resolve: '@medusajs/medusa/payment',
      options: {
        providers: [
          {
            resolve: path.resolve(__dirname, 'node_modules/@realizah/mercadopago-provider'),
            id: 'mercadopago',
            options: {
              accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN ?? '',
              webhookSecret: process.env.MERCADOPAGO_WEBHOOK_SECRET ?? '',
              sandbox: process.env.MERCADOPAGO_SANDBOX === 'true',
            },
          },
        ],
      },
    },
  ],
});
