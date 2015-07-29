module.exports = function(grunt) {

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        build: {
            src: 'src'
        },
        connect: {
            server: {
                options: {
                    port: 9001,
                    livereload: true,
                    open: {
                        target: 'http://127.0.0.1:<%= connect.server.options.port %>'
                    }
                }
            }
        },
        watch: {
            options: {
                livereload: true,
            },
            js: {
                files: ['src/**/*.js'],
            },
            html: {
                files: [ 'index.html', 'src/**/*.html'],
            },
            css: {
                files: [ 'src/**/*.css'],
            },
        }
    });

    grunt.registerTask('server',[
        'connect',
        'watch'
    ]);

};
