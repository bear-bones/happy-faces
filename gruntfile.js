module.exports = function (grunt) {
    var code_root = 'C:/Users/jwhite/Programming/HappyFaces/',
        project_root = process.cwd();


    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),

        build : {'meals' : true, 'title-xx' : true},

        clean : {
            'meals' : ['./css', './doc', './v8.log', './build/meals'],
            'title-xx' : ['./css', './doc', './v8.log', './build/title-xx']
        },

        copy : {
            'meals' : {
                expand : true, filter : 'isFile',
                files  : [{
                    src : [
                        'meals.html', 'lib/**/*', '!**/*.txt',
                        'css/**', 'img/**',
                        'js/common/**', 'js/meals/**',
                        'license/*', 'node_modules/log/**'
                    ], dest : 'build/meals/'
                }, {
                    src : ['meals-package.json'],
                    dest : 'build/meals/package.json'
                }]
            },
            'title-xx' : {
                files  : [{
                    src : [
                        'title-xx.html', 'lib/**/*', '!**/*.txt',
                        'css/**', 'img/**',
                        'js/common/**', 'js/title-xx/**',
                        'license/*', 'node_modules/log/**'
                    ], dest : 'build/title-xx/'
                }, {
                    src : ['title-xx-package.json'],
                    dest : 'build/title-xx/package.json'
                }]
            },
        },

        exe : {'meals' : 'Meals', 'title-xx' : 'TitleXX'},

        jasmine : {
            'meals' : {
                src : ['js/common/**', 'js/meals/**'],
                options : {
                    specs : ['spec/common/**', 'spec/meals/**']
                }
            },
            'title-xx' : {
                src : ['js/common/**', 'js/title-xx/**'],
                options : {
                    specs : ['spec/common/**', 'spec/title-xx/**']
                }
            }
        },

        sass : {
            'meals' : {
                files : {
                    'css/common.css' : 'sass/common.sass',
                    'css/meals.css' : 'sass/meals.sass',
                }
            },
            'title-xx' : {
                files : {
                    'css/common.css' : 'sass/common.sass',
                    'css/title-xx.css' : 'sass/title-xx.sass',
                }
            }
        },

        snapshot : {},

        yuidoc :  {all : grunt.file.readJSON('yuidoc.json')}
    });


    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');

    grunt.registerTask('time', function () {console.log(new Date())});

    grunt.registerMultiTask(
        'exe', 'Rename and iconize nw.exe the way we want it',
        function () {
            var done = this.async(),
                fs = require('fs'),
                path = require('path'),
                exec = require('child_process').exec,
                exe = this.data + '.exe',
                ico = this.data + '.ico';

            process.chdir(path.join(project_root, 'build', this.target));

            grunt.log.write(
                'Renaming ' +
                    grunt.log.wordlist(['nw.exe'], {color : 'cyan'}) +
                    ' to ' + grunt.log.wordlist([exe], {color : 'cyan'}) +
                    '...'
            );
            fs.renameSync('nw.exe', exe);
            grunt.log.ok();

            grunt.log.write(
                'Updating ' + grunt.log.wordlist([exe], {color : 'cyan'}) +
                ' with new icon...'
            );
            exec(
                'Resourcer.exe -op:upd -src:' + exe +
                ' -type:14 -name:IDR_MAINFRAME -file:img/' + ico,
                function (error) {
                    if (error) {
                        grunt.log.error();
                        grunt.verbose.error(error);
                    } else {
                        fs.unlinkSync('Resourcer.exe');
                        grunt.log.ok();
                    }
                    process.chdir(project_root);
                    done(!error);
                }
            );
        }
    );

    grunt.registerMultiTask(
        'build', 'Build one or both of the report programs', function () {
            grunt.task.run(
                'time', 'clean:' + this.target, 'yuidoc',
                'sass:' + this.target, 'copy:' + this.target,
                'exe:' + this.target
            );
        }
    );
};
