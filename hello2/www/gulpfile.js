const {src, dest, parallel, series, watch} = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const pug = require('gulp-pug');

// Move JS Files to dist/js
function js() {
    return src([
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
            'node_modules/owl.carousel/dist/owl.carousel.min.js',
            'node_modules/wowjs/dist/wow.min.js',
            'node_modules/jquery-waypoints/waypoints.min.js',
            'node_modules/counterup/jquery.counterup.min.js',
            'node_modules/jquery.easing/jquery.easing.min.js',
            'node_modules/jquery-countdown/dist/jquery.countdown.min.js',
            'node_modules/datatables.net/js/jquery.dataTables.min.js',
            'node_modules/imagesloaded/imagesloaded.pkgd.min.js',
            'node_modules/apexcharts/dist/apexcharts.min.js',
            'node_modules/magnific-popup/dist/jquery.magnific-popup.min.js',
            'node_modules/isotope-layout/dist/isotope.pkgd.min.js',
            'node_modules/ion-rangeslider/js/ion.rangeSlider.min.js'
        ])
        .pipe(dest('dist/js'));
}

// Move CSS to dist/css
function css() {
    return src([
            'node_modules/font-awesome/css/font-awesome.min.css',
            'node_modules/owl.carousel/dist/assets/owl.carousel.min.css',
            'node_modules/wowjs/css/libs/animate.css',
            'node_modules/datatables.net-bs4/css/dataTables.bootstrap4.min.css',
            'node_modules/apexcharts/dist/apexcharts.css',
            'node_modules/magnific-popup/dist/magnific-popup.css',
            'node_modules/ion-rangeslider/css/ion.rangeSlider.min.css',
            'node_modules/bootstrap-icons/font/bootstrap-icons.css'
        ])
        .pipe(dest('dist/css'));
}

// CSS Autoprefixer
function cssAutoprefixer() {
    return src('node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(postcss([ autoprefixer( {overrideBrowserslist: ['last 2 versions']} )]))
        .pipe(dest('dist/css/'));
}

// Move Font Awesome Fonts to dist/fonts
function fafonts() {
    return src('node_modules/font-awesome/fonts/*')
        .pipe(dest('dist/fonts'));
}

// Move Bootstrap Icons to dist/fonts
function bootstrapIcons() {
    return src('node_modules/bootstrap-icons/font/fonts/*')
        .pipe(dest('dist/css/fonts'));
}

// Move all Static Images to dist/img
function staticImages() {
    return src('static/img/*/*')
        .pipe(dest('dist/img'));
}

// Move all Static JS to dist/js
function staticJS() {
    return src('static/js/*')
        .pipe(dest('dist/js'));
}

// Move all Static files to dist/
function staticFiles() {
    return src('static/*')
        .pipe(dest('dist/'));
}

// SCSS to CSS Convert
function sassToCss() {
    return src('src/scss/*.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(postcss([ autoprefixer( {overrideBrowserslist: ['last 2 versions']} )]))
        .pipe(dest('dist/'))
}

// Pug to HTML Convert
function pugToHtml() {
    return src('src/pug/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(dest('dist/'));
}

// SCSS - Pug Watching
function watching() {
    watch('src/scss/*.scss', series(sassToCss));
    watch(['src/pug/*.pug', 'src/pug/inc/*.pug'], series(pugToHtml));
    watch('static/img/*/*', series(staticImages));
    watch('static/js/*', series(staticJS));
    watch('static/*', series(staticFiles));
}

const watching2 = parallel(watching);

// exports
exports.watch = watching2;
exports.default = series(js, css, cssAutoprefixer, fafonts, bootstrapIcons, staticImages, staticJS, staticFiles, sassToCss, pugToHtml, watching);