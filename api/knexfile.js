module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './src/database/database.sqlite'
    },
    migrations: {
      directory: './src/database/migrations'
    },
    useNullAsDefault: true,
  },
  production: {
    client: 'sqlite3',
    connection: { filename: '/opt/render/project/src/database/database.db' },
    useNullAsDefault: true,
    migrations: { directory: './src/database/migrations' }
  }
};