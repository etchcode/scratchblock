/*
 * scratchblock
 * https://github.com/etchcode/scratchblock
 *
 * Copyright (c) 2015 Daniel Franklin and Sam Schickler
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {
    'use strict';

    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks("grunt-contrib-clean");

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
            ],
        },

        // Configuration to be run (and then tested).
        scratchblock: {
            generate: {
                options: {},
                files: [
                    {expand: true, src: ['test/*.html'], dest: "", ext: ".parsed.html", exclude: "test/*.parsed.html"}
                ]
            }
        }
    });

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ["scratchblock"]);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);
};
