/**
 * Created by Rodey on 2015/11/6.
 */

var gulp        = require('gulp'),
    htmlBuilder = require('../index');

gulp.task('build.css', function(){

    gulp.src('src/buildCss.html')
        .pipe(htmlBuilder({
            cssDir: 'dist/assets/js',
            filterPath: 'dist/'
        }))
        .pipe(gulp.dest('dist'));

});

gulp.task('build.js', function(){

    gulp.src('src/buildJs.html')
        .pipe(htmlBuilder({
            jsDir: 'dist/assets/js',
            filterPath: 'dist/'
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

gulp.task('default', ['build.css', 'build.js', 'build.html']);