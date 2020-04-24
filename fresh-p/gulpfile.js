
//Подключение модулей галпа
const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const minify = require('gulp-minify');




//Порядок подключения CSS файлов
/*const cssFiles = [
    './src/css/zero-style.css',
    './src/css/main.css',
    './src/css/media.css',
       
]*/

const cssFiles = [
    './src/css/zero.scss',
    './src/css/main.scss'
       
]

//Порядок подключения JS файлов
const jsFiles = [
    './src/js/lib.js',
    './src/js/main.js'
]


//Таск на стили CSS
function styles() {
    //Шаблон для поиска фалой CSS
    //Все файлы по шаблону './src/css/**/*.css'
    return gulp.src(cssFiles)
    .pipe(sourcemaps.init())
    .pipe(sass())
    //Объединение файлов в один
    .pipe(concat('style.css'))
    //Добавление префиксов
    .pipe(autoprefixer({
        cascade: false
    }))
    //Минификация CSS
    .pipe(cleanCSS({
        level: 2
    }))
    .pipe(sourcemaps.write('./'))
    //Выходная папка для стилей
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
}



//Таск на скрипты JS
function scripts() {
    //Шаблон для поиска фалой js
    //Все файлы по шаблону './src/js/**/*.js'
    return gulp.src(jsFiles)
    .pipe(concat('script.js'))
    .pipe(minify())
    //Выходная папка для скриптов
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream());
}


//Удалить всё в указанной папке
function clean() {
    return del(['build/*'])
}


//
function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    //Следить за CSS файлами
    //gulp.watch('./src/css/**/*.css', styles)
    gulp.watch('./src/css/**/*.scss', styles)
    gulp.watch('./src/css/**/*.sass', styles)
    //Следить за JS файлами
    gulp.watch('./src/js/**/*js', scripts)
    //При изменении HTML запускать синхронизацию
    gulp.watch("./*.html").on('change', browserSync.reload);
}
//Таск, вызывающий функцию styles
gulp.task('styles', styles);
//Таск, вызывающий функцию scripts
gulp.task('scripts', scripts);
//Таск, удаляющий всё из указанной папки
gulp.task('del', clean);
//Такс для отслеживания изменений
gulp.task('watch', watch);
//Таск для удаления файлов в папке build и запуск styles и scripts
gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts)));
//Такс запускает таск build и watch последовательно
gulp.task('dev', gulp.series('build', 'watch'));
