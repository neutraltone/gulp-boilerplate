/**
 * Gulp Packages
 * =============
 * Import our gulp packages.
 */

import gulp from 'gulp';
import browserSync from 'browser-sync';
import cheerio from 'gulp-cheerio';
import concat from 'gulp-concat';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';
import header from 'gulp-header';
import imagemin from 'gulp-imagemin';
import path from 'path';
import pngquant from 'imagemin-pngquant';
import rename from 'gulp-rename';
import svgmin from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import uglify from 'gulp-uglify';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';



/**
 * Constants
 * ---------
 * Constants used throughout this boilerplate.
 */

const pkg = require('./package.json');



/**
 * Directory Templates
 * -------------------
 * Here we setup the various project directories
 * making it easy to amend at a later date.
 */

const project = {
  src: 'src',
  dist: 'dist'
};

const scssPath = {
  src: `${project.src}/scss/**/*.scss`,
  dest: `${project.dist}/assets/css/`
};

const jsPath = {
  src: `${project.src}/js/**/*.js`,
  dest: `${project.dist}/assets/js`
};

const imagePath = {
  src: `${project.src}/img/{,*/}*.{jpg,jpeg,png,gif,svg}`,
  dest: `${project.dist}/assets/img`
};

const spritePath = {
  src: `${project.src}/sprite/{,*/}*.svg`,
  dest: `${project.dist}/assets/img`
}



/**
 * Banner Template
 * ---------------
 * Define our banner template which is injected into
 * the top of our minfied Stylesheet and JavaScript.
 */

const banner = [
  `/*!
    * ${pkg.name}
    * ${pkg.title}
    * ${pkg.url}
    * @author ${pkg.author}
    * @version ${pkg.version}
    * Copyright ${new Date().getFullYear()}. ${pkg.license} licensed.
    */`,
  '\n'
].join('');



/**
 * BrowserSync.io
 * --------------
 * - Runs css, js, images and svg-sprite tasks
 * - Serve project on: localhost:3000
 * - Watch css, js, images and svg files for changes
 */

gulp.task('serve', [
    'sass',
    'js',
    'images',
    'svg-sprite'
  ], () => {
    browserSync.init({
      server: './dist'
    });
    gulp.watch(scssPath.src, ['sass']);
    gulp.watch(jsPath.src, ['js']);
    gulp.watch(imagePath.src, ['images']);
    gulp.watch(spritePath.src, ['svg-sprite']);
    gulp.watch(`${project.dist}/*.html`).on('change', browserSync.reload);
});



/**
 * Sass
 * -------
 * - Assign plugins to processors variable
 * - Create sourcemaps
 * - Process css with PostCSS
 * - Inject banner into finished file
 * - Add .min suffix
 * - Copy to destination
 */

gulp.task('sass', () => {
  return gulp.src(scssPath.src)
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed',
      errLogToConsole: true
    }))
    .pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
    .pipe(sourcemaps.write())
    .pipe(header(banner, { pkg : pkg }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(scssPath.dest))
    .pipe(browserSync.reload({stream:true, once: true}))
});



/**
 * JavaScript
 * ----------
 * - Lint source files with eslint
 * - Concatinate plugins and scripts files
 * - Uglify concatinated code
 * - Inject banner into finished file
 * - Add .min suffix
 * - Copy to destination
 * - Reload BrowserSync
 */

gulp.task('js', () => {
  return gulp.src(jsPath.src)
    .pipe(eslint())
    .pipe(eslint.format())
//		.pipe(babel({
//			presets: ['es2015']
//		}))
//    .pipe(concat('scripts.js'))
//    .pipe(uglify())
    .pipe(header(banner, { pkg : pkg }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(jsPath.dest))
    .pipe(browserSync.reload({stream:true, once: true}))
});



/**
 * Image Optimisation
 * ------------------
 * - Compress images
 * - Copy to destination
 * - Reload BrowserSync
 */

gulp.task('images', () => {
  return gulp.src(imagePath.src)
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        use: [pngquant()]
    }))
    .pipe(gulp.dest(imagePath.dest))
    .pipe(browserSync.stream())
});



/**
 * SVG Sprite
 * ----------
 * - Define prefix based on folder name
 * - Sprite svg's
 * - Copy sprite.svg to destination
 * - Reload BrowserSync
 */

gulp.task('svg-sprite', () => {
  return gulp.src(spritePath.src)
    .pipe(svgmin())
    .pipe(svgstore())
    .pipe(cheerio($ => $('svg').attr('style',  'display:none')))
    .pipe(gulp.dest(spritePath.dest))
    .pipe(browserSync.stream())
});



// Default Task
gulp.task('default', ['serve']);

// Build Task
gulp.task('build', ['sass', 'js', 'images', 'svg-sprite']);
