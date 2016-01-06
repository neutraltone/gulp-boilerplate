/**
 * Gulp Packages
 * =============
 *
 */

const gulp          = require('gulp');
const browserSync   = require('browser-sync').create();
const concat        = require('gulp-concat');
const autoprefixer  = require('autoprefixer');
const partialImport = require('postcss-partial-import');
const path          = require('path');
const cssnano       = require('cssnano');
const lost          = require('lost');
const pngquant      = require('imagemin-pngquant');
const eslint        = require('gulp-eslint');
const header        = require('gulp-header');
const imagemin      = require('gulp-imagemin');
const notify        = require('gulp-notify');
const postcss       = require('gulp-postcss');
const rename        = require('gulp-rename');
const sourcemaps    = require('gulp-sourcemaps');
const svgmin        = require('gulp-svgmin');
const svgstore      = require('gulp-svgstore');
const uglify        = require('gulp-uglify');


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

const cssPath = {
  src: `${project.src}/css/*.css`,
  dest: `${project.dist}/assets/css/`
};

const jsPath = {
  src: [
    `${project.src}/js/plugins/*.js`,
    `${project.src}/js/*.js`
  ],
  dest: `${project.dist}/assets/js`
};

const imagePath = {
  src: `${project.src}/img/{,*/}*.{jpg,jpeg,png,gif,svg}`,
  dest: `${project.dist}/assets/img`
};

const iconPath = {
  src: `${project.src}/icons/{,*/}*.svg`,
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
    'css',
    'js',
    'images',
    'svg-sprite'
  ], () => {
    browserSync.init({
      server: './dist'
    });
    gulp.watch(`${project.src}/css/{,*/}*.css`, ['css']);
    gulp.watch(jsPath.src, ['js']);
    gulp.watch(imagePath.src, ['images']);
    gulp.watch(iconPath.src, ['svg-sprite']);
    gulp.watch(`${project.dist}/*.html`).on('change', browserSync.reload);
});



/**
 * PostCSS
 * -------
 * - Assign plugins to processors variable
 * - Create sourcemaps
 * - Process css with PostCSS
 * - Inject banner into finished file
 * - Add .min suffix
 * - Copy to destination
 */

gulp.task('css', () => {
  const processors = [
    partialImport,
    lost(),
    autoprefixer,
    cssnano
  ];
  return gulp.src(cssPath.src)
    .pipe(sourcemaps.init())
    .pipe(postcss(processors))
    .pipe(sourcemaps.write('.'))
    .pipe(header(banner, { pkg : pkg }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(cssPath.dest))
    .pipe(notify({
      message: 'CSS task complete',
      onLast: true
    }));
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
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(header(banner, { pkg : pkg }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(jsPath.dest))
    .pipe(browserSync.reload({stream:true, once: true}))
    .pipe(notify({ message: 'JS task complete' }));
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
    .pipe(notify({ message: 'Images task complete', onLast: true }));
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
  return gulp.src(iconPath.src).pipe(svgmin(file => {
    const prefix = path.basename(file.relative, path.extname(file.relative));
    return {
      plugins: [{
        cleanupIDs: {
          prefix: `${ prefix }-`,
          minify: true
        }
      }]
    };
  }))
    .pipe(svgstore())
    .pipe(gulp.dest(iconPath.dest))
    .pipe(browserSync.stream())
    .pipe(notify({ message: 'SVG Sprite task complete', onLast: true }));
});

// Default Task
gulp.task('default', ['serve']);

// Build Task
gulp.task('build', ['css', 'js', 'images', 'svg-sprite']);
