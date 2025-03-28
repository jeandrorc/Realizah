module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: '@strapi/provider-upload-local',
      providerOptions: {
        sizeLimit: 100 * 1024 * 1024, // 100mb
      },
    },
  },
  email: {
    config: {
      provider: 'strapi-provider-email-nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.example.com'),
        port: env.int('SMTP_PORT', 587),
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
      },
      settings: {
        defaultFrom: env('SMTP_FROM', 'info@example.com'),
        defaultReplyTo: env('SMTP_REPLY_TO', 'info@example.com'),
      },
    },
  },
  graphql: {
    enabled: true,
    config: {
      playgroundAlways: env.bool('GRAPHQL_PLAYGROUND', true),
      defaultLimit: 10,
      maxLimit: 100,
    },
  },
  documentation: {
    enabled: true,
    config: {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'Realizah CMS API Documentation',
        description: 'API documentation for Realizah CMS',
        contact: {
          name: 'Realizah Team',
        },
        license: {
          name: 'MIT',
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
  },
}); 