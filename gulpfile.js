var gulp = require('gulp');
var bs = require('browser-sync').create();
var sass = require('gulp-sass');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var runSequence = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('browser-sync', function(){
    bs.init({
        server: {
            baseDir: "./dist/"
        }
    })
})

gulp.task('sass', function () {
    return gulp.src('src/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/css'))

    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(autoprefixer('last 2 versions', 'ie 8', 'ie 9'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/css'))

    .pipe(bs.reload({stream: true})); // prompts a reload after compilation
});

gulp.task('useref', function(){
    return gulp.src('src/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

gulp.task('images', function(){
    return gulp.src('src/images/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function(){
    return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
})

gulp.task('clean:dist', function(){
    return del.sync('dist');
})

/*  
gulp.task('cache:clear', function(callback){
    return cache.clearAll(callback)
})
*/

gulp.task('watch', ['browser-sync', 'sass'], function(){
    gulp.watch('src/scss/*.scss', ['sass']);
    gulp.watch('src/*.html').on('change', bs.reload);
});

gulp.task('default', function(callback){
    runSequence(['sass', 'browser-sync', 'watch']),
    callback
})

gulp.task('build', function(callback){
    runSequence('clean:dist',
    ['sass', 'useref', 'images', 'fonts'],
    callback
    )
})
