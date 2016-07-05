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
		'bower_components/ng-file-upload/angular-file-upload-shim.min.js',
		'bower_components/angular-recaptcha/release/angular-recaptcha.min.js'
	];

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			scripts: {
				files: ['js/*js'],
				tasks: ['eslint'],
				options: {
					spawn: false,
					interrupt: true
				}
			},
		},
		eslint: {
			all: ['js/**'],
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
					'css/<%= pkg.name %>.css': 'scss/<%= pkg.name %>.scss'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks("grunt-contrib-eslint");
	grunt.loadNpmTasks('grunt-contrib-watch');
};