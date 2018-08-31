
"use strict";

const gulp = require("gulp"),
    rimraf = require("rimraf"),
    fs = require("fs"),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify"),
    runSequence = require('run-sequence'),
    path = require('path'),
    manifest = require('gulp-manifest'),
    webpack = require('webpack'),
    gutil = require('gulp-util'),
    merge = require('merge2'),
    fxpCoreDevWebpackConfig = require('./webpack/fxpcore.config'),
    fxpCoreProdWebpackConfig = require('./webpack/fxpcore.prod.config'),
    ng2DevWebpackConfig = require('./webpack/ng2.config'),
    ng2ProdWebpackConfig = require('./webpack/ng2.prod.config');
    
var clean = require('gulp-clean');

var ts = require("gulp-typescript");

const wwwrootFolder = "./../Microsoft.PS.FXP.FDN.UIPackageBuilder/wwwroot";
const scriptsFolder = wwwrootFolder + "/scripts";
const servicesFolder = "./src/" + "js/services/**/*.ts";
const telemetryFolder = "./src/" + "js/telemetry/**/*.ts";
const constantFolder = "./src/" + "js/constants/**/*.ts";
const interfacesFolder = "./src/" + "js/interfaces/**/*.ts";

/* For sake of development purpose, this task is useful */
gulp.task("default", function (callback) {
    runSequence ("cleanup", 
                 "copyBootstrap4",
                ["adalIFrameJs-min", "ng2deps", "ng2deps-min", "externalDeps", "externalDeps-min"], 
                ["buildApp-Dev", "buildApp-Prod"], 
                ["manifest"],
                ["cleandts"],
                ["generateTypings", "bundleSdks"],
                ["publishTypings"],
                function() {
                    callback();
                    console.log("Done.");
                });
});

gulp.task("copyBootstrap4", ["cleanBootstrap4"], function(callback){
    return gulp.src("./package_version/node_modules/bootstrap/**/*")
               .pipe(gulp.dest('./node_modules/bootstrap-v4'));
});

gulp.task('cleanBootstrap4', function (callback) {
    rimraf('./node_modules/bootstrap-v4', callback);
});

gulp.task("publishTypings", function(callback){
    gulp.src("./dist/typings/**/*.ts")
        .pipe(concat("index.d.ts"))
        .pipe(gulp.dest('./../Microsoft.PS.FXP.NpmFeeds/FxpServices'));

}); 
gulp.task('cleandts', function (callback) {
    rimraf("./dist/typings", callback);
});
gulp.task("bundleSdks", function(){
    return gulp.src([
              './node_modules/@fxp/confitsdk/**/*.d.ts',
              './node_modules/@fxp/flightingsdk/**/*.d.ts'
             ])
        .pipe(concat('sdks.d.ts'))
        .pipe(gulp.dest('./dist/typings'));
}); 
gulp.task('generateTypings', function () {
    const typescript = ts.createProject("tsconfig.typings.json"); 
    const confitSdkFolder = "";
    const flightingSdkFolder = ""; 
    var tsResult = gulp
    .src([servicesFolder,telemetryFolder,constantFolder,interfacesFolder])
    .pipe(typescript());

    return merge(
        tsResult.dts
            .pipe(concat('FxpServices.d.ts'))
            .pipe(gulp.dest('./dist/typings'))
    );
});
gulp.task("buildApp-Dev", function(callback){
    runSequence(["buildCoreDev", "buildNg2Dev"], function(){
        callback();
        console.log("Application build - Dev completed. ");
    });
})
gulp.task("buildApp-Prod", function(callback){
    runSequence(["buildNg2Prod", "buildCoreProd"], function(){
        callback();
        console.log("Application build - Prod completed. ");
    });
})
gulp.task('manifest', function (callback) {
    gulp.src([wwwrootFolder + "/**/*"])
        .pipe(manifest({
            hash: true,
            preferOnline: true,
            network: ['fxpbootconfig.json', '*'],
            filename: 'app.manifest',
            exclude: ['app.manifest', 'fxpbootconfig.json']

        }))
        .pipe(gulp.dest(wwwrootFolder));
    callback();
    console.log("manifest completed");
});

gulp.task("cleanup", function (cb) {
    rimraf(wwwrootFolder, cb);
});

gulp.task("adalIFrameJs-min", function () {
    var jsFiles = getDependencies().adalIFrameJs;
    validateAppDependencies(jsFiles);
    return gulp.src(jsFiles)
        .pipe(concat("adalIFrame-min.js"))
        .pipe(uglify())
        .pipe(gulp.dest(scriptsFolder));
});

gulp.task("ng2deps", function () {
    var jsFiles = getDependencies().ng2dependencies;
    validateAppDependencies(jsFiles);
	return gulp.src(jsFiles)
		.pipe(concat("ng2dependencies.bundle.js"))
		.pipe(gulp.dest(scriptsFolder + '/dev/external'));
});

gulp.task("ng2deps-min", function () {
    var jsFiles = getDependencies().ng2dependencies;
    validateAppDependencies(jsFiles);
	return gulp.src(jsFiles)
        .pipe(concat("ng2dependencies.bundle.min.js"))
        .pipe(uglify())
		.pipe(gulp.dest(scriptsFolder + '/prod/external'));
});

gulp.task("externalDeps", function () {
    var jsFiles = getDependencies().headerJs;
    validateAppDependencies(jsFiles);
    return gulp.src(jsFiles)
        .pipe(concat("externalDependencies.bundle.js"))
        .pipe(gulp.dest(scriptsFolder + "/dev/external"));
});

gulp.task("externalDeps-min", function () {
    var jsFiles = getDependencies().headerJs;
    validateAppDependencies(jsFiles);
    return gulp.src(jsFiles)
        .pipe(concat("externalDependencies.bundle.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest(scriptsFolder + "/prod/external"));
});

gulp.task("buildCoreDev", function(callBack){
    webpack(fxpCoreDevWebpackConfig, function (err, stats) {
        if (err)
            throw new gutil.PluginError('webpack:build', err);
            gutil.log('[webpack:build] Completed\n' + stats.toString({
                assets: true,
                chunks: false,
                chunkModules: false,
                colors: true,
                hash: false,
                timings: false,
                version: false
            }));
        callBack();
    });
});

gulp.task("buildCoreProd", function(callBack) {
    webpack(fxpCoreProdWebpackConfig, function (err, stats) {
        if (err)
            throw new gutil.PluginError('webpack:build', err);
            gutil.log('[webpack:build] Completed\n' + stats.toString({
                assets: true,
                chunks: false,
                chunkModules: false,
                colors: true,
                hash: false,
                timings: false,
                version: false
            }));
        callBack();
    });
});

//ng2DevWebpackConfig

gulp.task("buildNg2Dev", function(callBack) {
    webpack(ng2DevWebpackConfig, function (err, stats) {
        if (err)
            throw new gutil.PluginError('webpack:build', err);
            gutil.log('[webpack:build] Completed\n' + stats.toString({
                assets: true,
                chunks: false,
                chunkModules: false,
                colors: true,
                hash: false,
                timings: false,
                version: false
            }));
        callBack();
    });
});

gulp.task("buildNg2Prod", function(callBack) {
    webpack(ng2ProdWebpackConfig, function (err, stats) {
        if (err)
            throw new gutil.PluginError('webpack:build', err);
            gutil.log('[webpack:build] Completed\n' + stats.toString({
                assets: true,
                chunks: false,
                chunkModules: false,
                colors: true,
                hash: false,
                timings: false,
                version: false
            }));
        callBack();
    });
});
/* Start Development server end*/
var configJson = null;
function getDependencies() {
    if (configJson != null) return configJson;
    var config = fs.readFileSync("./appdependencies.json", 'utf-8');
    config = config.replace(/^\uFEFF/, '');
    configJson = JSON.parse(config.toString());
    return configJson;
}

function validateAppDependencies(fileCollection){
    fileCollection.forEach(function(element) {
        var filePath = path.join(__dirname, element);
        if (!fs.existsSync(filePath)) {
          console.log("Missing File: " + filePath);
          throw "Missing file";
        }
    });
    
}



