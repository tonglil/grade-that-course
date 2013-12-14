/*
 *Application config
 */

module.exports = {
    database: {
        name: 'course_voter',
        username: 'course_voter_user',
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
            pool: { maxConnections: 5, maxIdleTime: 30 },
            //language: 'en',
            dialect: 'postgres'
        }
    },
    logging: {
        verbose: true,
        vverbose: false
    }
};
