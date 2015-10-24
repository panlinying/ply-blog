//------------------ply-2015-10-08----------------------------------------
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require("browser-sync").create(),
    reload = browserSync.reload;
//------------------------------------------
//买手端
gulp.task('buyer', function(){
    gulp.src('./buyer/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('buyer.js'))
        .pipe(rename('buyer.min.js'))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('./buyer/libs'));
});
//scss-to-css 
gulp.task('buyer-sass',function(){
    gulp.src('./buyer/css/login.scss')
	.pipe(plumber())
	.pipe(sourcemaps.init())	
	.pipe(sass())
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest('./buyer/css'));
});
//------------------------------------------
//品牌端
//gulp.task('brand', function(){
//    gulp.src('./brand/js/*.js')
//        .pipe(concat('brand.js'))
//        .pipe(gulp.dest('./brand/js'))
//        .pipe(rename('brand.min.js'))
//        .pipe(uglify({mangle: false}))
//        .pipe(gulp.dest('./brand/libs'));
//});
//------------------------------------------
//browserSync
//gulp.task('broswer-sync',function(){
//    browserSync.init({
//	server:{
//	    baseDir:"./front_end"}
//   });	
//});
gulp.task('browser-sync',function(){
    browserSync.init({
        proxy:"http://127.0.0.1:8000"
    });
});
//------------------------------------------
//scss-to-css 
gulp.task('brand-sass',function(){
    gulp.src('./front_end/css/mySass/sass/*.scss')
	.pipe(plumber())
	.pipe(sourcemaps.init())	
	.pipe(sass())
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest('./front_end/css'))
	.pipe(browserSync.stream({match:'**/*.css'}));
});
//------------------------------------------
//default task
gulp.task('default',function(){
    gulp.run('browser-sync');
    gulp.run('brand-sass');
    gulp.run('buyer-sass');
    gulp.watch('./front_end/css/mySass/sass/*.scss',function(){
	gulp.run('brand-sass');
    });
    gulp.watch('./buyer/css/login.scss',function(){
	gulp.run('buyer-sass');
    });
    gulp.watch('./front_end/*.html').on('change',reload);
});
//------------------------------------------	

