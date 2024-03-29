// Generated on 2013-02-27 using generator-webapp 0.1.5
'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var serveStatic = require('serve-static');

var mountFolder = function (connect, dir) {
    return serveStatic(require('path').resolve(dir));
};

var routes = require('./server/routes.js'); 

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist'
    };

    var barstaskdef = {
                files: {
                    "app/scripts/compiled-templates.js": [
                    "app/bundles/**/templates/*.bars"
                ]
            },
            options: {
                    namespace: 'JST',
                    processName: function(filename) {
                        return filename
                        .replace(/^app\//, '')
                        .replace(/\.bars$/, '')
                        .replace('bundles/', '')
                        .replace('app/', '') // TODO: just make a regex once moving is complete
                        .replace('common/', '') // see above todo
                        .replace('templates/', '');
                    },
                    amd: true
                }
            };

    grunt.initConfig({
        yeoman: yeomanConfig,

        handlebars: {
          compile: barstaskdef
        },

        replace: {
            compile: {
                src: ['/dist/index.html'],
                overwrite: true,                 // overwrite matched source files
                replacements: [{ 
                    from: "window.isOptimized = false;",
                    to: "window.isOptimized = true;"
                }]
            }
        },

        watch: {
            handlebars: {
                files: [
                    "/app/bundles/**/templates/*.bars"
                ],
                tasks: ['handlebars', 'livereload']
            },
            livereload: {
                files: [
                    '<%= yeoman.app %>/*.html',
                    '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
                    '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,webp}'
                ],
                tasks: ['livereload']
            }
        },
        connect: {
            options: {
                port: 9000,
                hostname: '*',
                onCreateServer: function(server, connect, options) {
                   require('./server/app.js').start(server,connect,options)
                },
                middleware: function(connect, options, middlewares) {
                  // inject a custom middleware into the array of default middlewares
                  middlewares.unshift(function(req, res, next) {
                    if (req.url !== '/hello/world') return next();

                    res.end('Hello, world from port #' + options.port + '!');
                  });

                  return middlewares;
                },
            },
            
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            routes,
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'app'), 
                            
            
                        ];
                    }
                }
            },
            test: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'test')
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, 'dist')
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },
        clean: {
            dist: ['.tmp', '<%= yeoman.dist %>/*'],
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/{,*/}*.js',
                '!<%= yeoman.app %>/scripts/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://localhost:<%= connect.options.port %>/index.html']
                }
            }
        },
        // not used since Uglify task does concat,
        // but still available if needed
        /*concat: {
            dist: {}
        },*/
        requirejs: {
            dist: {
                // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
                options: {
                    // `name` and `out` is set by grunt-usemin
                    baseUrl: '/app/scripts',
                    optimize: 'none',
                    mainConfigFile: '/app/scripts/main.js',
                    // TODO: Figure out how to make sourcemaps work with grunt-usemin
                    // https://github.com/yeoman/grunt-usemin/issues/30
                    //generateSourceMaps: true,
                    // required to support SourceMaps
                    // http://requirejs.org/docs/errors.html#sourcemapcomments
                    preserveLicenseComments: false,
                    useStrict: true,
                    wrap: true,
                    //uglify2: {} // https://github.com/mishoo/UglifyJS2
                }
            }
        },
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                dirs: ['<%= yeoman.dist %>']
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        // cssmin: {
        //     dist: {
        //         files: {
        //             '<%= yeoman.dist %>/styles/main.css': [
        //                 '.tmp/styles/{,*/}*.css',
        //                 '<%= yeoman.app %>/styles/{,*/}*.css'
        //             ]
        //         }
        //     }
        // },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: '*.html',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '.htaccess',
                        'empty.html',
                        'preview_export/**',
                        'zip/**'
                    ]
                },
                {
                    expand: true,
                    dot: true,
                    flatten: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>/styles/img',
                    src: [
                        '**/*.{ico,txt,png,jpg,gif}',
                    ]
                },
                // TODO: figure out what the deal is with the fonts in dist mode...
                {
                    expand: true,
                    dot: true,
                    flatten: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>/styles',
                    src: [
                        '**/*.woff'
                    ]
                },
                {
                    expand: true,
                    cwd: '<%= yeoman.app %>/styles/strut.themes',
                    dest: '<%= yeoman.dist %>/styles/strut.themes',
                    src: [
                        '**/*.png',
                        '*.css'
                    ]
                }]
            }
        },
        bower: {
            all: {
                rjsConfig: '<%= yeoman.app %>/scripts/main.js'
            }
        }
    });

    // grunt.renameTask('regarde', 'watch');

    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'handlebars',
            'livereload-start',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'connect:test',
        'mocha'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'handlebars',
        'useminPrepare',
        'requirejs',
        'imagemin',
        'htmlmin',
        'concat',
        // 'cssmin',
        'uglify',
        'copy',
        'replace',
        'usemin'
    ]);

    grunt.registerTask('default', [
        // 'jshint',
        'test',
        'build'
    ]);
};
