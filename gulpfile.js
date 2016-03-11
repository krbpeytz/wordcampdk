var gulp       = require( 'gulp' );              // Gulp!
var sass       = require( 'gulp-ruby-sass' );    // Sass
var sourcemaps = require( 'gulp-sourcemaps' );   // Sourcemaps
var prefix     = require( 'gulp-autoprefixer' ); // Autoprefixr
var minifycss  = require( 'gulp-minify-css' );   // Minify CSS
var concat     = require( 'gulp-concat' );       // Concat files
var uglify     = require( 'gulp-uglify' );       // Uglify javascript
var rename     = require( 'gulp-rename' );       // Rename files
var util       = require( 'gulp-util' );         // Writing stuff
var livereload = require( 'gulp-livereload' );
var server     = require( 'tiny-lr' );
var jshint     = require( 'gulp-jshint' );
var del        = require( 'del' );

/**
 * Compile all CSS for the site
 */
gulp.task( 'sass-gulp', function() {

  return sass( 'assets/scss/app.scss', { sourcemap: true } ) // Compile sass
    .on( 'error', function (err) {
      console.error( 'Error!', err.message );
    } )
    .pipe( sourcemaps.write() )                              // Sourcemap
    .pipe( concat( 'styles.css' ) )                          // Concat all css
    .pipe( gulp.dest( 'assets/dist/' ) )                     // Save unminified
    .pipe( rename( { suffix: '.min' } ) )                    // Rename
    .pipe( minifycss( { 'keepSpecialComments' : 0 } ) )      // Minify
    .pipe( gulp.dest( 'assets/dist/' ) )                     // Save again

  util.log( util.colors.yellow( 'Sass compiled & minified' ) ) // Output to terminal
} );

/**
 * Get all the JS, concat and uglify
 */
gulp.task( 'javascripts', function() {
  gulp.src( [
    'bower_components/fastclick/lib/fastclick.js',        // Gets fastclick
    'bower_components/svgeezy/svgeezy.js',                // Gets svgeezy
    'bower_components/modernizr/modernizr.js',            // Gets modernizr
    // moving on...
    'assets/js/_*.js'
  ] )

    .pipe( concat( 'scripts.js' ) )         // Concat all the scripts
    .pipe( gulp.dest( 'assets/dist/' ) )    // Save unminified
    .pipe( rename( { suffix: '.min' } ) )   // Rename it
    .pipe( uglify() )                       // Uglify & minify it
    .pipe( gulp.dest( 'assets/dist/' ) )    // Set destination to assets/js

  util.log(util.colors.yellow( 'Javascripts compiled and minified' ));
} );

/**
 * JS hint
 */
gulp.task( 'jshint', function() {
  gulp.src( 'assets/js/_*.js' )
    .pipe( jshint() )
    .pipe( jshint.reporter( 'jshint-stylish' ) );
} );

/**
 * Minify all SVGs and images
 */
gulp.task( 'svgmin', function() {
  gulp.src( 'assets/img/*.svg' )                     // Gets all SVGs
    .pipe( svgmin() )                                // Minifies SVG
    .pipe( gulp.dest( 'assets/img_min/' ) );         // Set destination to assets/img_min/

  util.log( util.colors.yellow( 'SVGs minified' ) ); // Output to terminal
} );

/**
 * Move files
 */
gulp.task( 'move', ['clean'], function() {
  gulp.src( ['bower_components/fontawesome/css/font-awesome.min.css'] )
    .pipe( gulp.dest( 'assets/fonts/fontawesome/css' ) );

  gulp.src( ['bower_components/fontawesome/fonts/*.*'] )
    .pipe( gulp.dest( 'assets/fonts/fontawesome/fonts' ) );

  util.log( util.colors.yellow( 'Files and fonts copied' )); // Output to terminal
} );

/**
 * Clean up
 */
gulp.task( 'clean', function() {
  del( ['**/.DS_Store'] );
  util.log( util.colors.yellow( 'Cleaning done' ) ); // Output to terminal
} );

/**
 * Default gulp task.
 */
gulp.task( 'watch', function() {

  // Watch and listen
  gulp.watch( 'assets/scss/**/*.scss', ['sass-gulp'] );       // Watch and run sass on changes
  gulp.watch( 'assets/js/_*.js', ['jshint', 'javascripts'] ); // Watch and run javascripts on changes
  livereload.listen();

  // Handy message
  util.log( 'Watching source files for changes... Press ' + util.colors.cyan( 'CTRL + C' ) + ' to stop.' );

  // Reload when php files, compiled css, compiled js and images change.
  gulp.watch( ['**/*.php', 'assets/dist/**', 'assets/img/**'] ).on( 'change', function( file ) {
    gulp.src( file.path ).pipe( livereload() ); // Trigger LiveReload
    util.log( util.colors.yellow( 'File changed' + ': ' + file.path ) );
  } );

} );

gulp.task( 'default', ['sass-gulp', 'jshint', 'javascripts', 'move', 'clean', 'watch'] );
