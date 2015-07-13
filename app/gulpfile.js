var gulp         = require('gulp'), // Gulp
    jade         = require('gulp-jade'), // Jade
    stylus       = require('gulp-stylus'), // Stylus
    nib =        require('nib'),
    autoprefixer = require('autoprefixer-stylus'), // Autoprefixer
    imagemin     = require('gulp-imagemin'), // Imagemin
    sourcemaps   = require('gulp-sourcemaps'), // Sourcemaps
    concat       = require('gulp-concat'), // Concat
    changed      = require('gulp-changed'), // Changed
    browsersync  = require('browser-sync'); // Browser-Sync


// Aqui configuramos todas las rutas

// Ruta desarrollo
var dev_path =
    {
        styl: 'stylus/',
        jade: 'jade/',
        js:   'js/',
        img:  'img/'
    }

// ruta publica

var public_path =
    {
        css:  '../public_html/',
        html: '../public_html/',
        js:   '../public_html/js/',
        img:  '../public_html/img/'
    }



// Compilamos Jade

gulp.task('jade', function(){
    gulp.src([
            dev_path.jade + '*.jade',
            '!' + dev_path.jade + '_*.jade'
        ])
        .pipe(jade({pretty: true}))
        .on('error', console.log)
        .pipe(gulp.dest(public_path.html))
        .pipe(browsersync.reload({stream: true}));
});

// Compile Stylus

gulp.task('stylus', function(){
    gulp.src([
            dev_path.styl + '*.styl',
            '!' + dev_path.styl + '_*.styl',
            '!' + dev_path.styl + '_*'
        ])
        .pipe(stylus({
            use: [nib(),autoprefixer()],
            compress: true,
            sourcemap: {
                inline: true,
                sourceRoot: dev_path.styl
            }
        }))
        .on('error', console.log)
        .pipe(gulp.dest(public_path.css))
        .pipe(browsersync.reload({stream: true}));
});

// JavaScript
gulp.task('concat', function(){
    gulp.src(dev_path.js + '*.js')
        .pipe(concat('all.js'))
        .on('error', console.log)
        .pipe(gulp.dest(public_path.js))
        .pipe(browsersync.reload({stream: true}));
});

// Minification Images
gulp.task('images', function(){
    gulp.src([dev_path.img + '**/*'])
        .pipe(changed(public_path.img))
        .pipe(imagemin({ progressive: true }))
        .pipe(gulp.dest(public_path.img))
        .pipe(browsersync.reload({stream: true}));
});


// Start Browser-Sync server

gulp.task('browsersync-server', function(){
    browsersync.init(null, {
        server: {baseDir: '../public_html/'},
        open: false,
        notify: false
    });
});


// Api WATCH

gulp.task('watch', function(){
    gulp.watch(dev_path.jade + '**/*.jade', ['jade']);
    gulp.watch(dev_path.styl + '**/*.styl', ['stylus']);
    gulp.watch([dev_path.img + '**/*'], ['images']);
    gulp.watch(dev_path.js + '**/*.js', ['concat']);

    // gulp.watch([dev_path.styl + 'vendor/*', dev_path.js + 'vendor/*'], ['vendor']);
});


// Tarea Default

gulp.task('default', [
    'jade', 'stylus', 'images', 'concat', 'browsersync-server', 'watch',
]);

