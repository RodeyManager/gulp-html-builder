/**
 * Created by Rodey on 2015/11/6.
 */

var gulp        = require('gulp'),
    watch       = require('gulp-watch'),
    del         = require('del'),
    htmlBuilder = require('../index');

gulp.task('build.css', function(){

    //del.sync(['../assets/css/**/*.js']);
    gulp.src('src/buildCss.html')
        .pipe(htmlBuilder({
            cssDir: 'dist/assets/css',
            filterPath: 'dist/'
        }))
        .pipe(gulp.dest('dist'));

});

gulp.task('build.js', function(){

    //del.sync(['../assets/js/**/*.js']);
    gulp.src('src/buildJs.html')
        .pipe(htmlBuilder({
            jsDir: 'dist/assets/js',
            filterPath: 'dist/',
            attrs: { async: 'true', defer: 'defer', charset: 'utf-8' }
        }))
        .pipe(gulp.dest('dist'));

});

gulp.task('build.html', function(){

    gulp.src('src/build.html')
        .pipe(htmlBuilder({
            //编译合成后的根目录
            baseDir: 'dist',
            //css文件编译合成后的存放目录，base存在则相对于base：  'dist/assets/css'
            cssDir: 'assets/css',
            //js文件编译合成后的存放目录，base存在则相对于base：  'dist/assets/js'
            jsDir: 'assets/js',
            //为了在html页面中能正确引入对应合成后的文件，
            //需要对合成后写入的路径进行过滤，
            //filterPath就是过滤目录的，让合成后的文件相对于编译后的html目录查找
            filterPath: 'dist/'
        }))
        .pipe(gulp.dest('dist'));

});

gulp.task('clean', function(){

    del.sync(['dist/assets/**/*']);

});

gulp.task('watch', function(){

    gulp.watch('src/**/*', ['clean', 'build.css', 'build.js', 'build.html']);

});

gulp.task('default', ['clean', 'build.css', 'build.js', 'build.html', 'watch']);