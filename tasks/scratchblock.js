/*
 * scratchblock
 * https://github.com/etchcode/scratchblock
 *
 * Copyright (c) 2015 Daniel Franklin and Sam Schickler
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {
    'use strict';

    grunt.registerMultiTask('scratchblock', 'Server-side version of scratchblock2', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({

        });

        this.files.forEach(function(f){
            var src = f.src[0];
            var dest = f.dest[0];

            if(grunt.file.exists(src)){
                var content = grunt.file.read(src);
                grunt.log.writeln("content", content);
            }
            else{
                grunt.log.warn("file " + src + " does not exist");
            }
        });
    });

};
