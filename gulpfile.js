const gulp = require('gulp'),
    less = require('gulp-less'),
    minifyCss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync').create(),
    del = require('del'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename');

//启动默认
gulp.task('default', () => {
    // gulp.start(['clean'])
    return runSequence(['clean'], ['build'], ['serve', 'watch']);
})

// 编译less
gulp.task('fsLess', () => {
    gulp.src(['src/less/**/*.less', '!src/less/**/{reset,test}.less'])
        .pipe(less())
        .on('error', function(e) {
            console.log(e);
        })
        .pipe(autoprefixer({
            browsers: [
                'last 22 versions',
                'Android >= 4.0',
                'last 5 Chrome versions',
                'last 5 Explorer versions',
                'last 3 Safari versions',
                'Firefox >= 20',
                'iOS 7',
                'Firefox ESR',
                'Explorer >= 8',
                'Opera >= 42',
                'Safari >= 8',
                'last 5 FirefoxAndroid versions',
                'last 5 ChromeAndroid versions',
                'last 5 ExplorerMobile versions'
            ],
            cascade: false
        }))
        .pipe(gulp.dest('./src/stylesheets/'));

});

//合并css
gulp.task('hbLess', () => {
    gulp.src('src/stylesheets/index.css')
        // 合并文件
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./dist/stylesheets/'))
        .pipe(rename({ suffix: '.min' }))
        //压缩样式文件
        .pipe(minifyCss({ outSourceMap: false }))
        //输出压缩文件到指定目录
        .pipe(gulp.dest('./dist/stylesheets/'));
});

// 入口
gulp.task('build', function(callback) {
    return runSequence(['fsLess', 'hbLess', 'staticFiles'], callback);
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