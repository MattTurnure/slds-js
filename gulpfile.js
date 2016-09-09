var gulp = require('gulp'),
    sass = require('gulp-sass'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    pump = require('pump'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    nunjucksRender = require('gulp-nunjucks-render'),
    data = require('gulp-data'),
    fs = require('fs'),
    htmlmin = require('gulp-htmlmin'),
    postcss = require('gulp-postcss'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('autoprefixer'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload;

var sassOptions = {
    defaultEncoding: 'UTF-8',
    lineNumbers: true,
    outputStyle: 'compressed',
    precision: 8
};

gulp.task('html', function () {
    return gulp.src('src/**/*.+(html|nunjucks)')
        .pipe(data(function () {
            return JSON.parse(fs.readFileSync('./src/mocks.json'));
        }))
        .pipe(nunjucksRender({
            path: ['src']
        }))
        // output files in app folder
        .pipe(gulp.dest('dist/unminified'))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('sass', function () {
    gulp.src('src/assets/scss/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(postcss([autoprefixer({
            browsers: ['last 2 versions']
        })]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/assets/styles'))
        .pipe(browserSync.stream());
});

gulp.task('demo-scripts', function (cb) {
    pump([
        gulp.src([
            'node_modules/prismjs/prism.js'
        ]),
        concat('demo.js'),
        gulp.dest('dist/assets/demo/js')
    ], cb);
});

gulp.task('vendor-scripts', function (cb) {
    pump([
        gulp.src([
            'node_modules/moment/moment.js',
            'node_modules/moment/locale/*.js'
        ]),
        concat('vendor.js'),
        gulp.dest('dist/assets/vendor/js')
    ], cb);
});

gulp.task('scripts', function (cb) {
    pump([
        gulp.src([
            'src/assets/js/**/*.js'
        ]),
        babel({
            presets: ['es2015']
        }),
        concat('main.js'),
        gulp.dest('dist/assets/js'),
        uglify(),
        rename('main.min.js'),
        gulp.dest('dist/assets/js')
    ], cb);
});


gulp.task('fonts', function () {
    return gulp.src([
            'src/assets/fonts/**/*'
        ])
        .pipe(gulp.dest('dist/assets/fonts'));
});

gulp.task('slds-assets', function (cb) {
    pump([
        gulp.src('node_modules/@salesforce-ux/design-system/assets/**/*'),
        gulp.dest('dist/assets')
    ], cb);
});

gulp.task('video', function () {
    return gulp.src('src/assets/video/*')
        .pipe(gulp.dest('dist/assets/video'));
});

gulp.task('images', function () {
    return gulp.src('src/assets/images/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/assets/images'));
});

gulp.task('build', ['html', 'sass', 'demo-scripts', 'vendor-scripts', 'scripts', 'video', 'images', 'fonts', 'slds-assets']);

gulp.task('default', ['build']);

gulp.task('serve', [], function () {
    browserSync.init({
        notify: false,
        server: {
            baseDir: './dist'
        }
    });

    gulp.watch('src/**/*.html', ['html']);
    gulp.watch('src/mocks.json', ['html']);
    gulp.watch('src/assets/scss/**/*.scss', ['sass']);
    gulp.watch('src/assets/js/**/*.js', ['scripts']);
    gulp.watch('dist/assets/images/**/*', ['images']);

    gulp.watch('dist/**/*.html').on('change', reload);
    gulp.watch('dist/assets/js/main.js').on('change', reload);
});
