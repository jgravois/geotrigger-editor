module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    connect: {
      dev: {
        options: {
          port: 8080,
          base: '.'
        }
      },
      test: {
        options: {
          port: 8081,
          base: '.'
        }
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        report: 'gzip'
      },
      dist: {
        src: [
          'js/lib/*.js',
          'js/app.js',
          'src/js/modules/*.js',
          'src/js/models/*.js',
          'src/js/collections/*.js',
          'src/js/layouts/*.js',
          'src/js/views/*.js'
        ],
        dest: 'dist/js/<%= pkg.name %>.min.js'
      }
    },

    watch: {
      scripts: {
        files: [
          'src/**/*.js',
          'src/scss/**/*.scss',
          'src/img/**/*.jpg',
          'src/img/**/*.png',
          'src/templates/*.hbs',
          'src/**/*.json'
        ],
        tasks: [
          'jshint',
          'clean:dev',
          'compass:dev',
          'copy:dev',
          'concat:dev'
        ]
        // options: {
        //   nospawn: true
        // }
      }
    },

    compass: {
      // Production
      dist: {
        options: {
          sassDir: 'src/scss',
          cssDir: 'dist/css',
          environment: 'production'
        }
      },
      // Development
      dev: {
        options: {
          sassDir: 'src/scss',
          cssDir: 'dev/css'
        }
      }
    },

    jshint: {
      files: ['src/**/*.js']
    },

    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: ';'
      },
      dev: {
        src: [
          'src/js/lib/*.js',
          'src/js/app.js',
          'src/js/modules/*.js',
          'src/js/models/*.js',
          'src/js/collections/*.js',
          'src/js/layouts/*.js',
          'src/js/views/*.js'
        ],
        dest: 'dev/js/<%= pkg.name %>.js'
      },
      // production
      dist: {
        // the files to concatenate
        src: [
          'src/js/lib/*.js',
          'src/js/app.js',
          'src/js/modules/*.js',
          'src/js/models/*.js',
          'src/js/collections/*.js',
          'src/js/layouts/*.js',
          'src/js/views/*.js'
        ],
        // the location of the resulting JS file
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },

    complexity: {
      generic: {
        src: [
          'src/**/*.js',
          'tasks/grunt-complexity.js'
        ],
        options: {
          // jsLintXML: 'report.xml', // create XML JSLint-like report
          // checkstyleXML: 'checkstyle.xml', // create checkstyle report
          errorsOnly: false, // show only maintainability errors
          cyclomatic: 5,
          halstead: 15,
          maintainability: 85
        }
      }
    },

    cucumberjs: {
      files: 'features',
      options: {
        steps: 'features/step_definitions',
        format: 'pretty'
      }
    },

    copy: {
      dev: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: [
            'img/**',
            'js/response.json',
            'templates/**'
          ],
          dest: 'dev/'
        }]
      }
    },

    clean: {
      dist: {
        src: 'dist/'
      },
      dev: {
        src: [
          'dev/img/',
          'dev/css/',
          'dev/js/',
          'dev/templates/'
        ]
      }
    },

    smushit: {
      // filter by filetype
      dist: {
        src: [
          'src/img/**/*.png',
          'src/img/**/*.jpg'
        ],
        dest: 'dist/img'
      }
    }
  });

  // load npm tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Tasks
  grunt.registerTask('test', [
    'connect:test',
    'jshint',
    'complexity',
    'cucumberjs'
  ]);

  grunt.registerTask('dev', [
    'clean:dev',
    'compass:dev',
    'copy:dev',
    'concat:dev',
    'connect:dev',
    'watch'
  ]);

  grunt.registerTask('build', [
    'test',
    'clean:dist',
    'compass:dist',
    'concat:dist',
    'uglify:dist',
    'smushit'
  ]);

  grunt.registerTask('default', [
    'dev'
  ]);
};