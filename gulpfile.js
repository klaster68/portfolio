const {src, dest, watch, parallel, series} = require('gulp');

const scss         = require('gulp-sass')(require('sass'));
const concat       = require('gulp-concat');
const uglify       = require('gulp-uglify-es').default;
const browserSync  = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean        = require('gulp-clean');
const imagemin     = require('gulp-imagemin');

function localServer() {
    browserSync.init({
        server: {
            baseDir: "src/"
        }
    });
};

function styles() {
    return src("src/scss/*.+(scss|sass)")
        .pipe(concat('style.min.css'))
        .pipe(scss({outputStyle: 'compressed'}).on('error', scss.logError))
        .pipe(autoprefixer())
        .pipe(dest("src/css"))
        .pipe(browserSync.stream());
}

function scripts() {
    return src('src/js/script.js')
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(dest('src/js'))
}

function watching() {
    watch(['src/scss/**/*.+(scss|sass)'], styles)
    watch(['src/js/script.js'], scripts)
    watch(['src/*.html']).on('change', browserSync.reload)
}

function cleanDist() {
    return src('dist')
        .pipe(clean())
}

function images() {
    return src('src/img/*')
		.pipe(imagemin())
		.pipe(dest('dist/img'))
}

function building() {
    return src([
        'src/css/style.min.css',
        'src/js/script.min.js',
        'src/**/*.html'
    ],{base: 'src'})
    .pipe(dest('dist'))
}

exports.styles      = styles;
exports.scripts     = scripts;
exports.watching    = watching;
exports.localServer = localServer;
exports.images      = images;
exports.build       = series(cleanDist, building);

exports.default     = parallel(styles, scripts, localServer, watching, images, building)