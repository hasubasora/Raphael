const gulp = require('gulp'),
    less = require('gulp-less'),
    minifyCss = require('gulp-minify-css'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync').create(),
    del = require('del'),
    rename = require('gulp-rename');

//启动默认
gulp.task('default', () => {
    // gulp.start(['clean'])
    return runSequence(['clean'], ['build'], ['serve', 'watch']);
})

// less
gulp.task('fsLess', () => {
    gulp.src(['src/less/*.less', '!src/less/**/{reset,test}.less'])
        .pipe(less())
        .pipe(gulp.dest('./dist/stylesheets/'))
        .pipe(rename({ suffix: '.min' }))
        //压缩样式文件
        .pipe(minifyCss({ outSourceMap: false }))
        //输出压缩文件到指定目录
        .pipe(gulp.dest('./dist/stylesheets/'));
});

gulp.task('build', function(callback) {
    return runSequence(['fsLess', 'staticFiles'], callback);
});
gulp.task('staticFiles', function() {
    return gulp.src([
            './src/**/*.html',
            './src/images*/**/*.*',
            './src/javascripts*/**/*.js',
            './src/stylesheets*/**/*.css',
        ])
        .pipe(gulp.dest('./dist/'));
})

//监听
gulp.task('watch', () => {
    return gulp.watch([
        './src/**/*.html',
        './src/**/*.less',
        './src/**/*.js'
    ], function() {
        return runSequence(['build'], ['reload']);
    })
})

//清理
gulp.task('clean', (callback) => {
    return del('./dist/', callback);
});

// 刷新
gulp.task('reload', () => {
    return browserSync.reload();
});

// 服务器启动
gulp.task('serve', () => {
    browserSync.init({
        server: './dist',
        port: 9999
    });
});