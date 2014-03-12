/*
 *Production config
 */

module.exports = {
  database: {
    name: 'db_name',
    username: 'db_user',
    password: 'db_user_pw',
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
      define: {
        //freezeTableName: true,
        instanceMethods: {
          clean: function() {
            var object = this.values;
            delete object.createdAt;
            delete object.updatedAt;
            return object;
          }
        }
      },
      pool: {
        maxConnections: 10,
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
    day: 86400000,
    hour6: 21600000,
    hour: 3600000,
    min15: 900000,
    min3: 180000,
    none: 0
  }
};
