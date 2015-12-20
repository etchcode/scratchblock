/*
 * scratchblock
 * https://github.com/etchcode/scratchblock
 *
 * Copyright (c) 2015 Daniel Franklin and Sam Schickler
 * Licensed under the MIT license.
 */
 var jsdom = require("jsdom");
 var fs = require("fs");
 var path = require("path");

 var JQUERY = "tasks/scratchblocks-files/jquery.min.js";
 var SCRATCHBLOCKS2 = "tasks/scratchblocks-files/scratchblocks2.js";

function parse_html(html){
	// takes a chunk of html, and renders as scratchblocks scripts inside of <scratch> elements
	return new Promise(function(resolve, reject){
		var virtualConsole = jsdom.createVirtualConsole();
		virtualConsole.on("jsdomError", function (error) {
			console.error(error.stack, error.detail);
		});
		jsdom.env("", [JQUERY, SCRATCHBLOCKS2], function(err, window){

			if(err){
				reject(new Error(err));
			}
			var sb2 = window.scratchblocks2;
			var document = window.document;
			var transformed = document.createElement("div");

			transformed.innerHTML = html;
			[].slice.call(transformed.getElementsByTagName("scratch")).forEach(function(tag){ // [].slice.call changes HTMLCollection --> Array
				var output = document.createElement("div");
				output.classList.add("sb2");

				var to_parse = tag.innerHTML;
				var inline = tag.getAttribute("inline") ? true : false;
				if(inline){
					to_parse = to_parse.replace("\n", "");
					output.classList.add("inline-block");
				}

				var parsed = sb2.parse_scripts(to_parse); // returns a list of block objects
				parsed.forEach(function(block){
					var item = sb2.render_stack(block)[0]; // they return jQuery item, get raw dom item with [0]
					item.classList.add("script");

					output.appendChild(item);
				});

				tag.outerHTML = output.outerHTML;
			});

			var result = transformed.innerHTML;
			resolve(result);
		}, {virtualConsole: virtualConsole});
	});
}

module.exports = function (grunt) {
    'use strict';

	var jsdom = require("jsdom");
	var fs = require("fs");

	var jQuery = fs.readFileSync("tasks/scratchblocks-files/jquery.min.js", "utf-8");
	var scratchblocks2 = fs.readFileSync("tasks/scratchblocks-files/scratchblocks2.js", "utf-8");

    grunt.registerMultiTask('scratchblock', 'Server-side version of scratchblock2', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
			extension: undefined
        });

		var grunt_done = this.async();

        this.files.forEach(function(file){
            var src = file.src[0];
            var dest = file.dest;

            if(grunt.file.exists(src)){
                var content = grunt.file.read(src);

                parse_html(content).then(function sucess(parsed){
					grunt.log.writeln("scratchblock parsed", src, "into", dest);
					grunt.file.write(dest, parsed);
				}, function failure(error){
					grunt.log.error(error);
				});
            }
            else{
                grunt.log.error("file " + src + " does not exist");
            }
        });
    });

};
