/*
 *Development config
 */

module.exports = {
  database: {
    name: 'course_voter_dev',
    username: 'root',
    password: 'root',
    options: {
      //host: localhost,
      //port: 3306,
      //protocol: 'tcp',
      //logging: console.log,
      maxConcurrentQueries: 100,
      //storage: ':memory:',
      //omitNull: false,
      //native: false,
      //sync: { force: false },
      //syncOnAssociation: true,
      define: {
        freezeTableName: true,
      },
      pool: {
        maxConnections: 5,
        maxIdleTime: 30
      },
      dialect: 'mysql'
    }
  },
  logging: {
    verbose: true,
    vverbose: false
  },
  cache: {
    day: 0,
    hour6: 0,
    hour: 0,
    min15: 0,
    min3: 0,
    none: 0
  }
};
