const parse = require('pg-connection-string').parse;

module.exports = ({ env }) => {
  const { host, port, database, user, password } = parse(
    env('DATABASE_URL', 'postgres://postgres:postgres@localhost:5433/realizah_cms')
  );

  return {
    connection: {
      client: 'postgres',
      connection: {
        host,
        port,
        database,
        user,
        password,
        ssl: env.bool('DATABASE_SSL', false),
      },
      debug: false,
    },
  };
}; 