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
import modernizr from 'gulp-modernizr';
import path from 'path';
import pngquant from 'imagemin-pngquant';
import rename from 'gulp-rename';
import svgmin from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import uglify from 'gulp-uglify';
import gulpStylelint from 'gulp-stylelint';
import autoprefixer from 'gulp-autoprefixer';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';


/**
 * Constants
 * ---------
 * Constants used throughout this boilerplate.
 */

import pkg from './package.json';
import options from './gulp-options.json';


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
    'lint-sass',
    'sass',
    'lint-js',
    'js',
    'modernizr',
    'images',
    'svg-sprite'
  ], () => {
    browserSync.init({
      server: options.dest.dist
    });
    gulp.watch(options.src.scss, ['lint-sass', 'sass']);
    gulp.watch(options.src.js, ['lint-js', 'js', 'modernizr']);
    gulp.watch(options.src.img, ['images']);
    gulp.watch(options.src.sprite, ['svg-sprite']);
    gulp.watch(`${options.dest.dist}/*.html`).on('change', browserSync.reload);
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
  return gulp.src(options.src.scss)
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed',
      errLogToConsole: true
    }))
    .pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(options.dest.css))
    .pipe(browserSync.reload({
      stream: true,
      once: true
    }))
});


/**
 * Lint Sass
 * -------
 * - Lints src files with stylelint
 */

gulp.task('lint-sass', () => {
  return gulp
    .src(options.src.scss)
    .pipe(gulpStylelint({
      reporters: [{
        formatter: 'string',
        console: true
      }],
      failAfterError: false,
      syntax: "scss"
    }));
});


/*
 * JavaScript
 * ----------
 * - Concatinate plugins and scripts files
 * - Uglify concatinated code
 * - Inject banner into finished file
 * - Add .min suffix
 * - Copy to destination
 * - Reload BrowserSync
 */

gulp.task('js', () => {
  return gulp.src([options.src.vendor, options.src.js])
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(options.dest.js))
    .pipe(browserSync.reload({
      stream: true,
      once: true
    }))
});


/**
 * Modernizr
 * ---------
 * - Scan src JavaScript files for Modernizr checks
 * - Build production Modernizr
 * - Copy to destination
 * - Reload browsersync
 */

gulp.task('modernizr', () => {
  return gulp
    .src(options.src.js)
    .pipe(modernizr('modernizr-build.min.js'))
    .pipe(gulp.dest(options.dest.vendor))
    .pipe(browserSync.reload({
      stream: true,
      once: true
    }))
});


/**
 * Lint JavaScript
 * ----------
 * - Lint source files with eslint
 */

gulp.task('lint-js', () => {
  return gulp.src(options.src.js)
    .pipe(eslint())
    .pipe(eslint.format())
});


/**
 * Image Optimisation
 * ------------------
 * - Compress images
 * - Copy to destination
 * - Reload BrowserSync
 */

gulp.task('images', () => {
  return gulp.src(options.src.img)
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{
          removeViewBox: false
        }],
        use: [pngquant()]
    }))
    .pipe(gulp.dest(options.dest.img))
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
  return gulp.src(options.src.sprite)
    .pipe(svgmin())
    .pipe(svgstore())
    .pipe(cheerio($ => $('svg').attr('style',  'display:none')))
    .pipe(gulp.dest(options.dest.img))
    .pipe(browserSync.stream())
});


// Default Task
gulp.task('default', ['serve']);

// Build Task
gulp.task('build', ['lint-sass', 'sass', 'lint-js', 'js', 'modernizr', 'images', 'svg-sprite']);
