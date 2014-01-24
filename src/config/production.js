/*
 *Production config
 */

module.exports = {
  database: {
    name: 'course_voter',
    username: 'voter_user',
    password: 'course_voter_pw',
    options: {
      //host: localhost,
      //port: 3306,
      //protocol: 'tcp',
      logging: false,
      maxConcurrentQueries: 100,
      //storage: ':memory:',
      //omitNull: false,
      //native: false,
      //defined: {},
      //sync: { force: true },
      //syncOnAssociation: true,
      pool: {
        maxConnections: 5,
        maxIdleTime: 30
      },
      //language: 'en',
      dialect: 'mysql'
    }
  },
  logging: {
    verbose: true,
    vverbose: false
  },
  cache: {
    day: 86400000,
    hour6: 21600000,
    hour: 3600000,
    min15: 900000,
    min3: 180000,
    none: 0
  }
};
