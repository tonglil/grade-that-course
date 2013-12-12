module.exports = function(grunt) {

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        nodemon: {
            dev: {
                options: {
                    file: 'src/app.js',
                    env: {
                        PORT: '4000'
                    },
                    ignoredFiles: ['gruntfile.js', 'node_modules/**']
                }
            }
        },
        jshint: {
            all: [
                'gruntfile.js',
                'src/**/*.js',
                'test/**/*.js'
            ]
        },
        watch: {
            //http://blog.ponyfoo.com/2013/11/13/grunt-tips-and-tricks
            options: {
                livereload: true
            },
            scripts: {
                files: [
                    'src/**/*.js',
                    'test/**/*.js'
                    ],
                tasks: ['jshint']
            }
        },
        concurrent: {
            dev: {
                tasks: ['watch', 'nodemon'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    //grunt.loadNpmTasks('grunt-contrib-csslint');
    //grunt.loadNpmTasks('grunt-contrib-imagemin');

    // Task(s)
    grunt.registerTask('default', ['jshint', 'watch']);
    grunt.registerTask('dev', ['concurrent:dev']);

};
