import gulp from "gulp";
import gulpLoadPlugins from "gulp-load-plugins";
import del from "del";
import sass from "gulp-sass";
import runSequence from "run-sequence";
import webpackStream from "webpack-stream";
import webpack from "webpack";
import { stream as wiredep } from "wiredep";

const $ = gulpLoadPlugins();

gulp.task("extras", () => {
  return gulp
    .src(
      [
        "app/*.*",
        "app/fonts/**/*.*",
        "app/scripts/**/*.js",
        "app/scripts/**/*.min.css",
        "app/style/**/*.min.css",
        "app/styles/**/*.css",
        "app/_locales/**",
        "!app/scripts.babel",
        "!app/manifest.json",
        "!app/*.html"
      ],
      {
        base: "app",
        dot: true
      }
    )
    .pipe(gulp.dest("dist"));
});

function lint(files, options) {
  return () => {
    return gulp
      .src(files)
      .pipe($.eslint(options))
      .pipe($.eslint.format());
  };
}



gulp.task(
  "lint",
  lint("app/scripts.babel/**/*.js", {
    env: {
      es6: true
    },
    rules: {
      quotes: 0
    },
    parserOptions: {
      sourceType: "module"
    }
  })
);

gulp.task("images", () => {
  return gulp
    .src("app/images/**/*")
    .pipe(
      $.if(
        $.if.isFile,
        $.cache(
          $.imagemin({
            progressive: true,
            interlaced: true,
            // Don't remove IDs from SVGs, they are often used
            // as hooks for embedding and styling
            svgoPlugins: [
              {
                cleanupIDs: false
              }
            ]
          })
        ).on("error", function(err) {
          console.log(err);
          this.end();
        })
      )
    )
    .pipe(gulp.dest("dist/images"));
});

gulp.task("html", () => {
  return gulp
    .src("app/*.html")
    .pipe(
      $.useref({
        searchPath: [".tmp", "app", "."]
      })
    )
    .pipe($.sourcemaps.init())
    .pipe($.if("*.js", $.uglify()))
    .pipe($.sourcemaps.write())
    .pipe(
      $.if(
        "*.html",
        $.htmlmin({
          removeComments: true,
          collapseWhitespace: true
        })
      )
    )
    .pipe(gulp.dest("dist"));
});

gulp.task("chromeManifest", () => {
  return gulp
    .src("app/manifest.json")
    .pipe(
      $.chromeManifest({
        buildnumber: true
      })
    )
    .pipe(
      $.if(
        "*.css",
        $.cleanCss({
          compatibility: "*"
        })
      )
    )
    .pipe($.if("*.js", $.sourcemaps.init()))
    .pipe($.if("*.js", $.uglify()))
    .pipe($.if("*.js", $.sourcemaps.write(".")))
    .pipe(gulp.dest("dist"));
});

gulp.task("babel", () => {
  return gulp
    .src("app/scripts.babel")
    .pipe(
      webpackStream(require("./webpack.config.js"), webpack).on(
        "error",
        function(err) {
          console.log(err);
          this.emit("end");
        }
      )
    )
    .pipe(gulp.dest("app/scripts/"));
});

gulp.task("clean", del.bind(null, [".tmp", "dist"]));

gulp.task("watch", ["lint", "babel"], () => {
  $.livereload.listen();

  gulp
    .watch([
      "app/*.html",
      "app/scripts/**/*.js",
      "app/scripts/**/*.vue",
      "app/images/**/*",
      "app/styles/**/*",
      "app/_locales/**/*.json"
    ])
    .on("change", $.livereload.reload);

  gulp.watch(
    ["app/scripts.babel/**/*.js", "app/scripts.babel/**/*.vue"],
    ["lint", "babel"]
  );
  gulp.watch("bower.json", ["wiredep"]);
});

gulp.task("size", () => {
  return gulp.src("dist/**/*").pipe(
    $.size({
      title: "build",
      gzip: true
    })
  );
});

gulp.task("wiredep", () => {
  gulp
    .src("app/*.html")
    .pipe(
      wiredep({
        ignorePath: /^(\.\.\/)*\.\./
      })
    )
    .pipe(gulp.dest("app"));
});

gulp.task("package", () => {
  const manifest = require("./dist/manifest.json");
  return gulp
    .src("dist/**")
    .pipe($.zip("opendyslexic-" + manifest.version + ".zip"))
    .pipe(gulp.dest("package"));
});

gulp.task("build", cb => {
  runSequence(
    "lint",
    "clean",
    [ "html", "images", "extras"],
    "babel",
    "chromeManifest",
    "size",
    cb
  );
});

gulp.task("default", cb => {
  runSequence("build", cb);
});
