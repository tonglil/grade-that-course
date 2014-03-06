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
          ignoredFiles: [
            'gruntfile.js',
            'node_modules/**',
            '.git/**'
          ]
        }
      }
    },
    jshint: {
      files: [
        'gruntfile.js',
        'src/**/*.js',
        'test/**/*.js',
        '!src/public/js/jquery-2.*.js'
      ],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    cssmin: {
      combine: {
        options: {
          //keepSpecialComments: '*'
        },
        files: {
          'src/public/css/style.min.css': [
            'src/public/css/reset.css',
            'src/public/css/font.css',
            'src/public/css/functions.css',
            'src/public/css/main.css',
            'src/public/css/opt-tablet.css',
            'src/public/css/opt-mobile.css'
          ]
        }
      }
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
      },
      css: {
        files: [
          'src/public/css/*.css',
          '!src/public/css/style.css'
        ],
        tasks: ['cssmin']
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
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  //grunt.loadNpmTasks('grunt-contrib-csslint');
  //grunt.loadNpmTasks('grunt-contrib-imagemin');

  // Task(s)
  grunt.registerTask('default', []);
  grunt.registerTask('dev', ['concurrent:dev']);
  grunt.registerTask('live', ['cssmin']);

};
