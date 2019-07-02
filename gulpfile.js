//Constantes para el automatizador de tareas
const gulp = require("gulp")
const pug = require('gulp-pug')
const sass = require("gulp-sass")
const babel = require("gulp-babel")
const autoprefixer = require("gulp-autoprefixer")
const concat = require("gulp-concat")
const uglify = require("gulp-uglify")
const plumber = require("gulp-plumber")

//Constante para el modulo de recarga automática del sitio web al hacer cambios
const browserSync = require('browser-sync')

//Instancia del servidor de desarrollo
const server = browserSync.create()

gulp.task("pug", () => {
    return gulp
        .src("./src/pug/*.pug")
        .pipe(plumber())
        .pipe(
            pug({
                pretty: true,
            }),
        )
        .pipe(gulp.dest("./public/"))
})

//tarea para los estilos de la UX
gulp.task("styles", () => {
    return gulp
        .src('./src/scss/styles.scss')
        .pipe(plumber())
        .pipe(
            sass({
                outputStyle: "compact"
            })
        )
        .pipe(
            autoprefixer({
                browsers: ["last 3 versions"]
            })
        )
        .pipe(gulp.dest('./public/css'))
        .pipe(server.stream())
})

gulp.task("babel", () => {
    return gulp
        .src("./src/js/*.js")
        .pipe(plumber())
        .pipe(
            babel({ presets: ["@babel/preset-env"] })
        )
        .pipe(concat("scripts-min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("./public/js"))
})

//tarea por defecto para que se ejecuten todas
gulp.task('default', () => {
    server.init({
        proxy: "localhost:8080/crud/public"
    })

    //Watchers (vigilantes) para vigilar los cambios y mostrarlos en tiempo real
    //SCSS
    gulp.watch('./src/scss/*.scss', gulp.series('styles'))

    //PUG
    gulp.watch('./src/pug/*.pug', gulp.series('pug')).on('change', server.reload)

    //JS
    gulp.watch("./src/js/*.js", gulp.series('babel')).on('change', server.reload)
})