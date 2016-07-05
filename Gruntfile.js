module.exports = function(grunt) {
	var FILES_TO_MOVE = [
		'bower_components/angular/angular.min.js',
		'bower_components/angular/angular.js',
		'bower_components/angular-ui-router/release/angular-ui-router.min.js',
		'bower_components/restangular/dist/restangular.min.js',
		'bower_components/lodash/dist/lodash.min.js',
		'bower_components/jquery/dist/jquery.min.js',
		'bower_components/jquery/dist/jquery.min.map',
		'bower_components/angular-translate/angular-translate.min.js',
		'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
		'bower_components/angular-translate-loader-partial/angular-translate-loader-partial.min.js',
		'bower_components/angular-local-storage/dist/angular-local-storage.min.js',
		'bower_components/ng-file-upload/angular-file-upload.min.js',
		'bower_components/ng-file-upload/angular-file-upload-shim.min.js'
	];

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			scripts: {
				files: ['src/main/client/js/*js'],
				tasks: ['eslint'],
				options: {
					spawn: false,
					interrupt: true
				}
			},
		},
		eslint: {
			all: ['src/main/client/js/**'],
			options: {
				config: 'eslint_config.json'
			}
		},
		sass: {
			build: {
				options: {
					style: 'compact'
				},
				files: {
					'src/main/client/css/<%= pkg.name %>.css': 'src/main/client/scss/<%= pkg.name %>.scss'
				}
			}
		},
		cssmin: {
			options: {
				shorthandCompacting: false,
				roundingPrecision: -1
			},
			target: {
				files: {
					'src/main/client/css/<%= pkg.name %>.min.css': 'src/main/client/css/<%= pkg.name %>.css',
					'src/main/webapp/resources/css/<%= pkg.name %>.min.css' : 'src/main/client/css/<%= pkg.name %>.css'
				}
			}
		},
		htmlmin: {
			build: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: [{
					expand: true,
					cwd: 'src/main/client/templates/',
					src: ['**/*.html'],
					dest: 'src/main/webapp/resources/templates/'
				}]
			}
		},
		imagemin: {
			build: {
				options: {
					optimizationLevel: 3,
					svgoPlugins: [{
						removeViewBox: false
					}]
				},
				files: [{
					expand: true,
					cwd: 'src/main/client/img/',
					src: ['**/*.{png,jpg,gif,ico}'],
					dest: 'src/main/webapp/resources/img/'
				}]
			}
		},
		concat: {
			options: {
				banner : '/*! <%= pkg.name %> - <%= grunt.template.today("dd-mm-yyyy") %> */\n',
				separator: ';'
			},
			build: {
				src: ['src/main/client/js/**/*.js'],
				dest: 'src/main/webapp/resources/js/<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> - <%= grunt.template.today("yyyy-mm-dd") %> */',
				preserveComments: true,
				beautify: true,
				mangle: false
			},
			build: {
				files: {
					'src/main/webapp/resources/js/<%= pkg.name %>.min.js': ['src/main/webapp/resources/js/<%= pkg.name %>.js']
				}
			}
		},
		copy: {
			client: {
				options: {
					process: function (c) {
						return '\n' + c;
					}
				},
				expand: true,
				src: FILES_TO_MOVE,
				dest: 'src/main/client/lib/vendor/',
				filter: 'isFile'
			},
			build: {
				expand: true,
				cwd: 'src/main/client/js/i18n/',
				src: '**/*',
				dest: 'src/main/webapp/resources/js/i18n/',
				filter: 'isFile'
			},
			html: {
				expand: false,
				src: 'src/main/client/index.html',
				dest: 'src/main/webapp/index.jsp',
				filter: 'isFile'
			}
		},
		useminPrepare: {
			html: 'src/main/client/index.html',
			options: {
				dest: 'src/main/webapp/resources/'
			}
		},
		usemin: {
			html: 'src/main/webapp/index.jsp',
			options: {
				dest: 'src/main/webapp/'
			}
		},
		clean: {
			build: ['src/main/webapp/resources/**'],
			cache: ['.tmp/**', '.sass-cache/**', 'bower_components/']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks("grunt-contrib-eslint");
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-filerev');
	grunt.loadNpmTasks('grunt-usemin');

	grunt.registerTask('default', ['clean:build', 'htmlmin', 'copy', 'imagemin', 'useminPrepare', 'concat:generated', 'cssmin:generated', 'uglify:generated', 'usemin','clean:cache']);
	grunt.registerTask('check', ['eslint']);
};