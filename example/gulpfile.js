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
            //����ϳɺ�ĸ�Ŀ¼
            baseDir: 'dist',
            //css�ļ�����ϳɺ�Ĵ��Ŀ¼��base�����������base��  'dist/assets/css'
            cssDir: 'assets/css',
            //js�ļ�����ϳɺ�Ĵ��Ŀ¼��base�����������base��  'dist/assets/js'
            jsDir: 'assets/js',
            //Ϊ����htmlҳ��������ȷ�����Ӧ�ϳɺ���ļ���
            //��Ҫ�Ժϳɺ�д���·�����й��ˣ�
            //filterPath���ǹ���Ŀ¼�ģ��úϳɺ���ļ�����ڱ�����htmlĿ¼����
            filterPath: 'dist/'
        }))
        .pipe(gulp.dest('dist'));

});

gulp.task('default', ['build.css', 'build.js', 'build.html']);