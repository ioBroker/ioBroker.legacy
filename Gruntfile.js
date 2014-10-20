// To use this file in WebStorm, right click on the file name in the Project Panel (normally left) and select "Open Grunt Console"

/** @namespace __dirname */
/* jshint -W097 */// jshint strict:false
/*jslint node: true */
"use strict";

module.exports = function (grunt) {

    var srcDir    = __dirname + '/';
    var dstDir    = srcDir + '.build/';
    var pkg       = grunt.file.readJSON('package.json');
    var iopackage = grunt.file.readJSON('io-package.json');

    // Project configuration.
    grunt.initConfig({
        pkg: pkg,
        clean: {
            all: ['tmp/*.json', 'tmp/*.zip', 'tmp/*.jpg', 'tmp/*.jpeg', 'tmp/*.png',
                  dstDir + '*.json', dstDir + '*.zip', dstDir + '*.jpg', dstDir + '*.jpeg', dstDir + '*.png']
        },
        replace: {
            core: {
                options: {
                    patterns: [
                        {
                            match: /var version = '[\.0-9]*';/g,
                            replacement: "var version = '" + iopackage.common.version + "';"
                        },
                        {
                            match: /"version"\: "[\.0-9]*",/g,
                            replacement: '"version": "' + iopackage.common.version + '",'
                        }
                    ]
                },
                files: [
                    {
                        expand:  true,
                        flatten: true,
                        src:     [
                                srcDir + 'controller.js',
                                srcDir + 'package.json'
                        ],
                        dest:    srcDir
                    }
                ]
            }
        },
        // Javascript code styler
        jscs:   require(__dirname + '/tasks/jscs.js'),
        // Lint
        jshint: require(__dirname + '/tasks/jshint.js'),
        http: {
            get_hjscs: {
                options: {
                    url: 'https://raw.githubusercontent.com/ioBroker/ioBroker.nodejs/master/tasks/jscs.js'
                },
                dest: 'tasks/jscs.js'
            },
            get_jshint: {
                options: {
                    url: 'https://raw.githubusercontent.com/ioBroker/ioBroker.nodejs/master/tasks/jshint.js'
                },
                dest: 'tasks/jshint.js'
            },
            get_jscsRules: {
                options: {
                    url: 'https://raw.githubusercontent.com/ioBroker/ioBroker.nodejs/master/tasks/jscsRules.js'
                },
                dest: 'tasks/jscsRules.js'
            },
            get_iconOnline: {
                options: {
                    encoding: null,
                    url: iopackage.common.extIcon || 'https://raw.githubusercontent.com/ioBroker/ioBroker.nodejs/master/adapter/example/admin/example.png'
                },
                dest: dstDir + 'ioBroker.adapter.' + iopackage.common.name + '.png'

            },
            get_iconOffline: {
                options: {
                    encoding: null,
                    url: iopackage.common.extIcon || 'https://raw.githubusercontent.com/ioBroker/ioBroker.nodejs/master/adapter/example/admin/example.png'
                },
                dest: dstDir + 'ioBroker.adapter.offline.' + iopackage.common.name + '.png'

            }
        },
        compress: {
            adapter: {
                options: {
                    archive: dstDir + 'ioBroker.adapter.' + iopackage.common.name + '.zip'
                },
                files: [
                    {
                        expand: true,
                        src: ['**', '!tasks/*', '!Gruntfile.js', '!node_modules/**/*', '!build/**/*'],
                        dest: '/',
                        cwd: srcDir
                    }
                ]
            },
            adapterOffline: {
                options: {
                    archive: dstDir + 'ioBroker.adapter.offline.' + iopackage.common.name + '.zip'
                },
                files: [
                    {
                        expand: true,
                        src: ['**',
                            '!tasks/*',
                            '!Gruntfile.js',
                            '!build/**/*',
                            '!node_modules/grunt/**/*',
                            '!node_modules/grunt*/**/*'
                        ],
                        dest: '/',
                        cwd: srcDir
                    }
                ]
            }
        },
        exec: {
            npm: {
                cmd: 'npm install'
            }
        },
        copy: {
            json: {
                files: [
                    {
                        expand: true,
                        cwd: srcDir,
                        src: ['io-package.json'],
                        dest: dstDir,
                        rename: function (dest, src) {
                            return dstDir + 'ioBroker.adapter.offline.' + iopackage.common.name + '.json';
                        }
                    },
                    {
                        expand: true,
                        cwd: srcDir,
                        src: ['io-package.json'],
                        dest: dstDir,
                        rename: function (dest, src) {
                            return dstDir + 'ioBroker.adapter.' + iopackage.common.name + '.json';
                        }
                    }
                ]
            }
        }
    });

    grunt.registerTask('updateReadme', function () {
        var readme = grunt.file.read('README.md');
        var crlf = '\r\n';
        var chglog = '## Changelog' + crlf;
        var pos = readme.indexOf(chglog);
        if (pos == -1) {
            crlf   = '\n';
            chglog = '## Changelog' + crlf;
            pos = readme.indexOf(chglog);
        }

        if (pos != -1) {
            var readmeStart = readme.substring(0, pos + chglog.length);
            var readmeEnd   = readme.substring(pos + chglog.length);

            if (iopackage.common && readme.indexOf(iopackage.common.version) == -1) {
                var timestamp = new Date();
                var date = timestamp.getFullYear() + '-' +
                    ("0" + (timestamp.getMonth() + 1).toString(10)).slice(-2) + '-' +
                    ("0" + (timestamp.getDate()).toString(10)).slice(-2);

                var news = "";
                if (iopackage.common.whatsNew) {
                    for (var i = 0; i < iopackage.common.whatsNew.length; i++) {
                        if (typeof iopackage.common.whatsNew[i] == 'string') {
                            news += '* ' + iopackage.common.whatsNew[i] + crlf;
                        } else {
                            news += '* ' + iopackage.common.whatsNew[i].en + crlf;
                        }
                    }
                }
                grunt.file.write('README.md', readmeStart + '### ' + iopackage.common.version + ' (' + date + ')' + crlf + (news ? news + crlf + crlf : crlf) + readmeEnd);
            }
        }
    });

    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-http');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', [
        'exec',
        'http',
        'clean',
        'replace',
        'updateReadme',
        'compress',
        'copy'
        //'jshint', // too many errors
        //'jscs'    // too many errors
    ]);
};