const gulp = require('gulp'),
    pump = require('pump'),
    fs = require('fs'), 
    url = require('url'), 
    path = require('path'), 
    colors = require('colors'),
    args = require('yargs').argv, 
    request = require('request'), 
    data = require('gulp-data'),
    webpack = require('webpack'),
    nunjucks = require('nunjucks'), 
    nunjucksTask = require('gulp-nunjucks'), 
    concat = require('gulp-concat'), 
    sass = require('gulp-sass'), 
    uglify = require('gulp-uglify'), 
    cwd = process.cwd(),
    configFilePath = `${cwd}/config/project.json`;
let isDebug = args.dev ? true : false,
    isVerbose = args.verbose ? true : false; 

// import * as wp from 'webpack'; 
var config = {
    env:process.env.NODE_ENV || 'dev',
    assetsDir:'./assets', 
    sassDir:'./sass',
    srcDir:'./src', 
    distDir:'./dist', 
    jsDistDir:'./dist/js', 
    cssDistDir:'./dist/css',
    libDir:'./lib', 
    templatesDir:'./templates', 
    masterPageTemplatesDir:'./templates/masterpage', 
    pageLayoutTemplatesDir:'./templates/pagelayout',
    deploymentDir:'Sysdoc',
    provisioningDir:'./deploy',
    cdn:[],
    masterpageCatalogDrive:null, 
    siteAssetsDrive:null, 
    styleLibraryDrive:null,
}; 
var nunjucksEngine = null; 
var webpackConfig = null;
/**
 * @type {wp.Compiler}
 */
var webpackCompiler = null; 
var webpackWatch = null; 

function initNunjucks(config){
    var env = nunjucks.configure([path.resolve(cwd,config.templatesDir),
        path.resolve(cwd, config.masterPageTemplatesDir),
        path.resolve(cwd, config.pageLayoutTemplatesDir)],{
        noCache:true
    });
}

function updateConfigFromArgs(config,args){
    config.env = args.dev || args.env || config.env || 'dev'; 
    isDebug = config.env === 'dev';
    config.sassDir = args.sassDir || config.sassDir || './sass';
    config.srcDir = args.srcDir || config.srcDir ||  './src'; 
    config.distDir = args.distDir || config.distDir ||  './dist';
    config.cssDistDir = args.cssDistDir || config.cssDistDir ||  './dist/css';
    config.jsDistDir = args.jsDistDir || config.jsDistDir ||  './dist/js';
    config.templatesDir = args.templatesDir || config.templatesDir || './templates'; 
    config.deployDir = args.deployDir || config.deployDir || './deploy';  
    config.masterPageTemplatesDir = args.masterPageTemplatesDir || config.masterPageTemplatesDir || './templates/masterpage'; 
    config.pageLayoutTemplatesDir = args.pageLayoutTemplatesDir || config.pageLayoutTemplatesDir || './templates/pagelayout'; 
    config.siteAssetsDrive = args.siteAssetsDrive || config.siteAssetsDrive; 
    config.styleLibraryDrive = args.styleLibraryDrive || config.styleLibraryDrive; 
    config.masterpageCatalogDrive = args.masterpageCatalogDrive || config.masterpageCatalogDrive; 
}

function init(){
    if (fs.existsSync(configFilePath)) {
        config = Object.assign({},config,require(configFilePath));
    }else if (fs.existsSync(path.resolve(cwd,'.yo-rc.json'))){
        var yoConfig = require(path.resolve(cwd, '.yo-rc.json')); 
        config = Object.assign({}, config, yoConfig["generator-sharepoint-app"]||{}); 
    }
    updateConfigFromArgs(config,args); 
    initNunjucks(config);
    if (fs.existsSync(path.resolve(cwd,'webpack.config.js'))){
        webpackConfig = require(path.resolve(cwd, 'webpack.config.js'));
        webpackCompiler = webpack(webpackConfig); 
    }else {
        logError('init', 
            `Could not find webpack configuration file at ${path.resolve(cwd, 'webpack.config.js')}`);
    }
}

function logVerbose(operation,msg){
    if (isVerbose){
        console.log(`${colors.magenta(new Date().toISOString())} - ${colors.cyan(operation)} - ${colors.green(msg)}`);
    }
}

function logError(operation, msg) {
    console.log(`${colors.red(new Date().toISOString())} - ${colors.red(operation)} - ${colors.red(msg)}`);
}

function getFileNameFromUrl(u){
    const uu = new url.URL(u); 
    const vv = uu.pathname.split('/').pop();
    return vv; 
}

function getFileData(fileName){
    return {
        config,
        env:process.env
    }; 
}

gulp.task('sass:compile',(cb)=>{
    logVerbose('sass:compile','compiling sass files');
    logVerbose('sass:compile', `Searching for sass files at: ${path.resolve(cwd, config.sassDir, '*.scss')}`);
    logVerbose('sass:compile', `Searching for sass files at: ${path.resolve(cwd, config.sassDir, '**/*.scss')}`);
    var tasks = [
        gulp.src([path.resolve(cwd, config.sassDir, '*.scss'),
            path.resolve(cwd, config.sassDir, '**/*.scss')]),
        sass({
            compress: !isDebug
        }),
        gulp.dest(path.resolve(cwd, config.cssDistDir))
    ]; 
    logVerbose('sass:compile', `Sass files will be written to ${path.resolve(cwd, config.cssDistDir)}`);
    if (config.siteAssetsDrive && isDebug){
        logVerbose('sass:compile', `Sass files to be written to mapped drives at ${(path.resolve(config.siteAssetsDrive,
            config.deploymentDir,
            config.cssDistDir.split('/').pop()))}`);
        tasks.push(gulp.dest(path.resolve(config.siteAssetsDrive,
            config.deploymentDir,
            config.cssDistDir.split('/').pop())));
    }
    pump(tasks,(err)=>{
        if (err){
            logError('sass:compile',`an error has occured while compiling sass files ${err.message}`);
            cb(err);
            return; 
        }
        logVerbose('sass:compile',`finished compiling sass files successfully.`);
        cb(err);
    }); 
});

gulp.task('sass:watch', (cb) => {
    gulp.watch([path.resolve(cwd, config.sassDir) + './*.scss',
    path.resolve(cwd, config.sassDir) + './**/*.scss'], ['sass:compile']);
});

gulp.task('lib:download',(cb)=>{
    logVerbose('lib:download','downloading library files');
    return pump(config.cdn.filter((fU)=>{
        if (!args.force){
            return !fs.existsSync(path.resolve(cwd,config.libDir,getFileNameFromUrl(fU)))
        }
        return true; 
    }).map((fileUrl)=>{
        logVerbose('lib:download', `downloading library file ${fileUrl}`);
        return pump([
            request(fileUrl),
            fs.createWriteStream(path.resolve(cwd, config.libDir, getFileNameFromUrl(fileUrl)))
        ],(err)=>{
            if (err){
                logError('lib:download', 
                `an error has occured while downloading file ${fileUrl}. ${err.message}`);
            }
        });
    }),(err)=>{
        if (err){
            logError('lib:download', `an error has occured while downloading files ${err.message}`); 
            cb(err); 
            return; 
        }
        logVerbose('lib:download','downloading libraries finished successfully'); 
        cb(err); 
    });
});

gulp.task('lib:compile:js',(cb)=>{
    logVerbose('lib:compile:js', 'compiling library js files');
    return pump(
        [gulp.src(config.cdn.map((fileUrl)=>{
            return getFileNameFromUrl(getFileNameFromUrl(fileUrl))
        })
        .filter((e)=>{
            return path.extname(e) === '.js';
        })),
        concat('vendor.js'),
        gulp.dest(path.resolve(cwd,config.jsDistDir))],
        (err)=>{
            if (err){
                logError('lib:compile:js', 
                    `an error has occured while compiling library js files ${err.message}`);
                cb(err);
                return; 
            }
            logVerbose('lib:compile:js','Finished compiling library js files successfully'); 
        }
    );
});


gulp.task('lib:compile:css', (cb) => {
    logVerbose('lib:compile:css', 'compiling library css files');
    return pump(
        [gulp.src(config.cdn.map((fileUrl) => {
            return getFileNameFromUrl(getFileNameFromUrl(fileUrl))
        })
            .filter((e) => {
                return path.extname(e) === '.css';
            })),
        concat('vendor.css'),
        gulp.dest(path.resolve(cwd, config.cssDistDir))],
        (err) => {
            if (err) {
                logError('lib:compile:css',
                    `an error has occured while compiling library css files ${err.message}`);
                cb(err);
                return;
            }
            logVerbose('lib:compile:css', 'Finished compiling library css files successfully');
        }
    );
});



gulp.task('masterpages:compile',(cb)=>{
    const fullPath = path.resolve(cwd, config.masterPageTemplatesDir); 
    fs.exists(fullPath,(exists)=>{
        if (exists){
            logError('masterpages:compile', `Folder ${fullPath} does not exist`);
            cb(new Error(`Folder ${fullPath} does not exist`));
            return; 
        }
        logVerbose('masterpages:compile','Started compiling master page templates');
        var tasks = [gulp.src([path.resolve(cwd, config.masterPageTemplatesDir, '*.masterpage'),
            path.resolve(cwd, config.masterPageTemplatesDir, '*.njk'),
            path.resolve(cwd, config.masterPageTemplatesDir, '**/*.masterpage'),
            path.resolve(cwd, config.masterPageTemplatesDir, '**/*.njk')]),
            data(getFileData),
            nunjucksTask.compile({ config }),
            gulp.dest(path.resolve(cwd, config.deployDir))];
        if (isDebug && config.masterpageCatalogDrive){
            logVerbose('masterpages:compile', 'Adding masterpage catalog drive as a destination'); 
            tasks.push(gulp.dest(path.resolve(config.masterpageCatalogDrive)));
        }
        pump(
            tasks,
            (err)=>{
                if (err){
                    logError('masterpages:compile',`An error has occured while compiling master page templates ${err.message}`);
                    cb(err); 
                    return; 
                }
                logVerbose(`masterpages:compile`, `Finished compiling master page templates`);
                cb(err);
            }
        );
    });
});

gulp.task('masterpages:watch', (cb) => {
    logVerbose('masterpages:watch', 'Started watch for master page templates');
    gulp.watch([path.resolve(cwd, config.masterPageTemplatesDir) + './*.masterpage',
        path.resolve(cwd, config.masterPageTemplatesDir) + './**/*.masterpage',
        path.resolve(cwd, config.masterPageTemplatesDir) + './*.njk',
        path.resolve(cwd, config.masterPageTemplatesDir) + './**/*.njk'
    ], ['masterpages:compile']);
});

gulp.task('pagelayouts:compile', (cb) => {
    const fullPath = path.resolve(cwd, config.pageLayoutTemplatesDir);
    fs.exists(fullPath, (exists) => {
        if (exists) {
            logError('pagelayouts:compile', `Folder ${fullPath} does not exist`);
            cb(new Error(`Folder ${fullPath} does not exist`));
            return;
        }
        logVerbose('pagelayouts:compile', 'Started compiling page layout templates');
        var tasks = [gulp.src([path.resolve(cwd, config.pageLayoutTemplatesDir, '*.aspx'),
            path.resolve(cwd, config.pageLayoutTemplatesDir, '*.njk'),
            path.resolve(cwd, config.pageLayoutTemplatesDir, '**/*.aspx'),
            path.resolve(cwd, config.pageLayoutTemplatesDir, '**/*.njk')]),
            data((file) => {
                return {
                    config,
                    env: process.env
                };
            }),
            nunjucksTask.compile({ config }),
            gulp.dest(path.resolve(cwd, config.deployDir))]; 
        if (isDebug && config.masterpageCatalogDrive){
            logVerbose('pagelayouts:compile','Adding masterpage catalog drive as a destination'); 
            tasks.push(config.masterpageCatalogDrive);
        }
        pump(
            tasks,
            (err) => {
                if (err) {
                    logError('pagelayouts:compile', `An error has occured while compiling page layout templates ${err.message}`);
                    cb(err);
                    return;
                }
                logVerbose(`pagelayouts:compile`, `Finished compiling page layout templates`);
                cb(err);
            }
        );
    });
});

gulp.task('pagelayouts:watch', (cb) => {
    logVerbose('pagelayouts:watch','Started watch for page layout templates');
    gulp.watch([path.resolve(cwd, config.pageLayoutTemplatesDir) + './*.aspx',
    path.resolve(cwd, config.pageLayoutTemplatesDir) + './**/*.aspx',
    path.resolve(cwd, config.pageLayoutTemplatesDir) + './*.njk',
    path.resolve(cwd, config.pageLayoutTemplatesDir) + './**/*.njk'
    ], ['pagelayouts:compile']);
});

gulp.task('js:compile',(cb)=>{
    logVerbose('js:compile','Starting to compile JavaScript files'); 
    webpack(webpackConfig,(err,stats)=>{
        if (err){
            cb(err);
            logError('js:compile',
            `An error has occured while compiling JavaScript files: ${err.message}`);
        }else if (stats.hasErrors()){
            cb(new Error(stats.toString()));
            logError('js:compile',
            `An error has occured while compiling JavaScript files: ${stats.toString()}`);
        }else {
            logVerbose('js:compile','Finished compiling JavaScript files'); 
            cb();
        }
    });
});

gulp.task('js:compile',(cb)=>{
    if (!webpackCompiler){
        logError('js:compile',`Could not run webpack this may be due to missing webpack configuration`);
        cb(new Error(`js:compile Could not run webpack this may be due to missing webpack configuration`));
        return; 
    }
    webpackCompiler.run((err,stats)=>{
        if (err){
            logError('js:compile',`An error has occured while compiling JavaScript files: ${err.message}`); 
            cb(err); 
        }else if (stats.hasErrors()){
            logError('js:compile',`An error has occured while compiling JavaScript files: ${stats.toString('minimal')}`)
        }
        logVerbose('js:compile',`Finished compiling JavaScript files`);
        cb(); 
    });
}); 

gulp.task('js:watch',(cb)=>{
    webpackWatch = webpackCompiler.watch({

    },(err,stats)=>{
        logVerbose('js:watch',stats.toString());
        if (err){
            logError('js:watch',`An error has occured on JavaScript watch: ${err.message}`);
            cb(err); 
            return; 
        }else if (stats.hasErrors()){
            logError('js:watch',`An error has occured on JavaScript watch: ${stats.toString('minimal')}`);
        }
        logVerbose('js:watch', `Watching for JavaScript changes running`);
        cb(); 
    }); 
}); 

gulp.task('config:init',(cb)=>{
    logVerbose('config:init', `Creating configuration file at ${path.resolve(cwd, './config.json')}`);
    fs.writeFile(path.resolve(cwd,'./config.json'),JSON.stringify(config),(err)=>{
        if (err){
            logError('config:init', `Could not create configuration file at ${path.resolve(cwd, './config.json')}: ${err.message}`);
            cb(err); 
            return; 
        }
        logVerbose('config:init',`Created configuration file at ${path.resolve(cwd,'./config.json')}`);
    });
}); 

gulp.task('watch',['js:watch','sass:watch','pagelayouts:watch','masterpages:watch']);


process.on('exit',()=>{
    logVerbose('exit event','Terminating tasks');
    if (webpackWatch){
        webpackWatch.close(()=>{
            logVerbose('exit event','Closing JavaScript watch'); 
        });
    }
})

init(config, args);