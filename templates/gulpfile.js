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
    mkdirp = require('mkdirp'),
    nunjucks = require('nunjucks'), 
    nunjucksTask = require('gulp-nunjucks'), 
    concat = require('gulp-concat'), 
    sass = require('gulp-sass'), 
    uglify = require('gulp-uglify'), 
    rename = require('gulp-rename'),
    cwd = process.cwd(),
    autoprefixer = require('gulp-autoprefixer'), 
    configFilePath = `${cwd}/config/project.json`;
let isDebug = args.dev ? true : false,
    isVerbose = args.verbose ? true : false,
    isPrototyping = args.prototype?true:false,
    liveUpdate = args.liveUpdate?true:false,
    prototypes = [],
    prototypeDefinitionCache = {}; 
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
    prototypeDir:'./prototype',
    masterPageTemplatesDir:'./templates/masterpage', 
    pageLayoutTemplatesDir:'./templates/pagelayout',
    prototypeTemplatesDir:'./templates/prototypes', 
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

var uploadingPrototypes = false;

function initNunjucks(config){
    var env = nunjucks.configure([path.resolve(cwd,config.templatesDir),
        path.resolve(cwd, config.masterPageTemplatesDir),
        path.resolve(cwd, config.pageLayoutTemplatesDir)],{
        noCache:true
    });
}

function updateConfigFromArgs(config,args){
    config.env = args.dev?'dev':(args.env || config.env || 'dev'); 
    isDebug = config.env === 'dev';
    config.sassDir = args.sassDir || config.sassDir || './sass';
    config.srcDir = args.srcDir || config.srcDir ||  './src'; 
    config.distDir = args.distDir || config.distDir ||  './dist';
    config.spHost = args.spHost || config.spHost || 'https://tenant.sharepoint.com/'; 
    config.cssDistDir = args.cssDistDir || config.cssDistDir ||  './dist/css';
    config.jsDistDir = args.jsDistDir || config.jsDistDir ||  './dist/js';
    config.siteCollectionUrl = config.spHost.endsWith('/') ? `${config.spHost}${config.url}` : `${config.spHost}/${config.url}`;
    config.templatesDir = args.templatesDir || config.templatesDir || './templates'; 
    config.provisioningDir = args.provisioningDir || config.provisioningDir || './deploy';  
    config.masterPageTemplatesDir = args.masterPageTemplatesDir || config.masterPageTemplatesDir || './templates/masterpages'; 
    config.pageLayoutTemplatesDir = args.pageLayoutTemplatesDir || config.pageLayoutTemplatesDir || './templates/pagelayouts'; 
    config.prototypeDir = args.prototypeDir || config.prototypeDir || './prototype'; 
    config.prototypeTemplatesDir = args.prototypeTemplatesDir || config.prototypeTemplatesDir || './templates/prototypes';
    config.siteAssetsDrive = args.siteAssetsDrive || config.siteAssetsDrive; 
    config.prototypeServerUrl = args.prototypeServerUrl || config.prototypeServerUrl || null; 
    config.styleLibraryDrive = args.styleLibraryDrive || config.styleLibraryDrive; 
    config.masterpageCatalogDrive = args.masterpageCatalogDrive || config.masterpageCatalogDrive; 
    if (config.styleLibraryDrive){
        try {
            fs.readdirSync(config.styleLibraryDrive+":\\");
        }catch(err){
            logVerbose('init', 'Style library drive is not connected');
            config.styleLibraryDrive = null; 
        }
    }
    if (config.siteAssetsDrive) {
        try {
            fs.readdirSync(config.siteAssetsDrive + ":\\");
        } catch (err) {
            logVerbose('init', 'Site assets library drive is not connected');
            config.siteAssetsDrive = null;
        }
    }
    if (config.masterpageCatalogDrive) {
        try {
            fs.readdirSync(config.masterpageCatalogDrive + ":\\");
        } catch (err) {
            logVerbose('init', 'Master page catalog drive is not connected');
            config.masterpageCatalogDrive = null;
        }
    }
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
        webpackConfig.output = webpackConfig.output || {};
        try{
            webpackConfig.output.path = path.resolve(cwd, config.jsDistDir);
            webpackCompiler = webpack(webpackConfig); 
        }catch(err){
            logError('init',`An error has occured while initializing Webpack ${err.message}`)
        }
    }else {
        logError('init', 
            `Could not find webpack configuration file at ${path.resolve(cwd, 'webpack.config.js')}`);
    }
}

function log(operation,msg){
    console.log(`${colors.magenta(new Date().toISOString())} - ${colors.blue(operation)} - ${colors.gray(msg)}`);
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

function getFileData(file){
    const fileName = file.path; 
    if (prototypeDefinitionCache[fileName]){
        return prototypeDefinitionCache[fileName]; 
    }
    if ((fileName.indexOf(`${path.sep}prototypes`) !== -1) && (path.extname(fileName) === '.njk' || path.extname(fileName) === '.html')){
        let definition = {
            baseName:path.basename(fileName,path.extname(fileName)),
            dirName:path.dirname(fileName)
        }; 
        const fileDefinitionPath = path.resolve(path.dirname(fileName), path.basename(fileName, path.extname(fileName)))+'.json'; 
        if (fs.existsSync(fileDefinitionPath)){
            try{
                definition = require(fileDefinitionPath);
                definition.baseName = path.basename(fileName, path.extname(fileName));
                definition.dirName = path.dirname(fileName);
                prototypes.push(definition);
            }catch(err){
                logError(`getFileData`,`Could not load definition for prototype ${err.message}`);
            }
        }
        
        return prototypeDefinitionCache[fileName] = Object.assign({}, {
            config,
            env: process.env,
            definition,
            prototypes
        });
    }
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
            path.resolve(cwd, config.sassDir, '**/*.scss'),
            '!'+path.resolve(cwd,config.sassDir,'./prototypes/**')]),
        sass({
            compress: !isDebug
        }),
        autoprefixer(),
        gulp.dest(path.resolve(cwd, config.cssDistDir))
    ]; 
    logVerbose('sass:compile', `Sass files will be written to ${path.resolve(cwd, config.cssDistDir)}`);
    if (config.siteAssetsDrive && isDebug){
        logVerbose('sass:compile', `Sass files to be written to mapped drives at ${(path.resolve(config.siteAssetsDrive+':\\',
            config.deploymentDir,
            config.cssDistDir.split('/').pop()))}`);
        if (fs.existsSync(path.resolve(config.siteAssetsDrive + ':\\',
            config.deploymentDir,
            config.cssDistDir.split('/').pop()))){
            tasks.push(gulp.dest(path.resolve(config.siteAssetsDrive+':\\',
                config.deploymentDir,
                config.cssDistDir.split('/').pop())));
        }
    }
    // if (isPrototyping){
    //     logVerbose('sass:compile', `Compiling sass files into prototype output directory ${path.resolve(config.prototypeDir, './css')}`);
    //     // tasks.push(gulp.dest(path.resolve(config.prototypeDir,'./css')));
    // }
    pump(tasks,(err)=>{
        if (err){
            logError('sass:compile',`an error has occured while compiling sass files ${err.message}`);
            cb(err);
            return; 
        }
        logVerbose('sass:compile',`finished compiling sass files successfully.`);
        if (isPrototyping){
            logVerbose('sass:compile', `Compiling prototype sass files into prototype output director ${path.resolve(config.prototypeDir, './css')}`);
            pump([gulp.src(path.resolve(cwd, config.cssDistDir, '*.css')),
            gulp.dest(path.resolve(cwd, config.prototypeDir, 'css'))], () => {
                logVerbose('sass:compile', `Finished copying main css into prototype css directory`);
            });
            logVerbose('sass:compile', `Attempting to compile prototypes sass files into prototype output director ${path.resolve(config.prototypeDir, './css')}`);
            pump([
                gulp.src([
                    path.resolve(cwd, config.sassDir, './prototypes/*.scss'),
                    path.resolve(cwd, config.sassDir, './prototypes/**/*.scss')]),
                sass({
                    compress:!isDebug,
                }),
                autoprefixer(),
                gulp.dest(path.resolve(cwd,config.prototypeDir,'css'))],
                (err)=>{
                    if (err){
                        logError('sass:compile',`An error has occured while compiling prorotypes sass files: ${err.message}`);
                    }else {
                        logVerbose('sass:compile',`Finished compiling prototypes sass files`);
                    }
                    cb(err);
                });
        }else {
            cb(err);
        }
    }); 
});

gulp.task('sass:watch', (cb) => {
    logVerbose('sass:watch', `Watching for sass file changes on ${path.resolve(cwd, config.sassDir, './*.scss')}`);
    logVerbose('sass:watch', `Watching for sass file changes on ${path.resolve(cwd, config.sassDir, './**/*.scss')}`);
    gulp.watch([path.resolve(cwd, config.sassDir,'./*.scss'),
    path.resolve(cwd, config.sassDir, './**/*.scss')], ['sass:compile']);
});

gulp.task('lib:download',(cb)=>{
    mkdirp(path.resolve(cwd, `${config.libDir}`),(err)=>{
        if (err){
            logError('lib:download',
                `An error has occured while creating lib folder at ${config.libDir}: ${err.message}`);
            cb(err);
            return; 
        }
        
        logVerbose('lib:download','downloading library files');
        var files = config.cdn.filter((fU) => {
            if (!args.force) {
                return !fs.existsSync(path.resolve(cwd, config.libDir, getFileNameFromUrl(fU)))
            }
            return true;
        }); 
        var count = 0; 
        if (!files.length){
            cb(); 
            return; 
        }
        
        function done(fileUrl){
            count++; 
            logVerbose('lib:download', `finished downloading library file ${fileUrl}`);
            if (count === files.length){
                logVerbose('lib:download', 'downloading libraries finished successfully'); 
                cb(); 
            }
        }
        files.map((fileUrl)=>{
            logVerbose('lib:download', `downloading library file ${fileUrl}`);
            pump([
                request(fileUrl),
                fs.createWriteStream(path.resolve(cwd, config.libDir, getFileNameFromUrl(fileUrl)))
            ],(err)=>{
                if (err){
                    logError('lib:download', 
                    `an error has occured while downloading file ${fileUrl}. ${err.message}`);
                }
                done(fileUrl); 
            });
        });
        
    }); 
});

gulp.task('lib:compile:js',(cb)=>{
    logVerbose('lib:compile:js', 'compiling library js files');
    let files = config.cdn.map((fileUrl) => {
            return getFileNameFromUrl(fileUrl)
        })
        .filter((e) => {
            return path.extname(e) === '.js';
        })
        .map((e)=>{
            return path.resolve(cwd,config.libDir,e); 
        }); 
    if (!files.length){
        cb(); 
        return; 
    }
    return pump(
        [gulp.src(files),
        concat('vendor.js'),
        gulp.dest(path.resolve(cwd,config.jsDistDir))],
        (err)=>{
            if (err){
                logError('lib:compile:js', 
                    `an error has occured while compiling library js files ${err.message}`);
                cb(err);
                return; 
            }
            if (isPrototyping){
                logVerbose('lib:compile:js',`Protoyping mode detected, copying vendor files into prototype folder`);
                pump(
                    [gulp.src(path.resolve(cwd,config.jsDistDir,'*.js')),
                    gulp.dest(path.resolve(cwd,config.prototypeDir,'js'))],(err)=>{
                        if (err){
                            logError('lib:compile:js', `An error has occured while copying vendor files into prototype directory: ${err.message}`);
                            cb(err); 
                            return; 
                        }
                        logVerbose('lib:compile:js',`Finished copying vendor js files into prototype directory`);
                        logVerbose('lib:compile:js', 'Finished compiling library js files successfully'); 
                    }
                )
            }else {
                logVerbose('lib:compile:js','Finished compiling library js files successfully'); 
            }
        }
    );
});


gulp.task('lib:compile:css', (cb) => {
    logVerbose('lib:compile:css', 'compiling library css files');
    return pump(
        [gulp.src(config.cdn.map((fileUrl) => {
            return getFileNameFromUrl(fileUrl)
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
    mkdirp(fullPath,(err)=>{
        if (err){
            logError('masterpages:compile', `Could not create folder ${fullPath}`);
            cb(err); 
            return; 
        }
        logVerbose('masterpages:compile', 'Started compiling master page templates');
        logVerbose('masterpages:compile',
            `Loading master page templates ('.master','.njk') from ${path.resolve(cwd, config.masterPageTemplatesDir)}`);
        var tasks = [gulp.src([path.resolve(cwd, config.masterPageTemplatesDir, '*.master'),
        path.resolve(cwd, config.masterPageTemplatesDir, '*.njk'),
        path.resolve(cwd, config.masterPageTemplatesDir, '**/*.master'),
        path.resolve(cwd, config.masterPageTemplatesDir, '**/*.njk')]),
        data(getFileData),
        nunjucksTask.compile({ config },{name:file=>`${path.basename(file.name,path.extname(file.name))}.html`}),
        gulp.dest(path.resolve(cwd, config.provisioningDir))];
        if (isDebug && config.masterpageCatalogDrive) {
            logVerbose('masterpages:compile', 'Adding masterpage catalog drive as a destination');
            tasks.push(gulp.dest(path.resolve(config.masterpageCatalogDrive+':\\')));
        }
        pump(
            tasks,
            (err) => {
                if (err) {
                    logError('masterpages:compile', `An error has occured while compiling master page templates ${err.message}`);
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
    mkdirp(fullPath,(err)=>{
        if (err) {
            logError('pagelayouts:compile', `Could not create folder ${fullPath}`);
            cb(err);
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
        gulp.dest(path.resolve(cwd, config.provisioningDir))];
        if (isDebug && config.masterpageCatalogDrive) {
            logVerbose('pagelayouts:compile', 'Adding masterpage catalog drive as a destination');
            tasks.push(config.masterpageCatalogDrive+':\\');
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
    })
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
            logError('js:compile',
            `Compile stats have errors: ${stats.toString()}`);
            cb();
        }else {
            logVerbose('js:compile','Finished compiling JavaScript files'); 
            if (isPrototyping){
                pump([
                    gulp.src([path.resolve(cwd, config.jsDistDir, '*.js'),
                        path.resolve(cwd, config.jsDistDir, '**/*.js')]),
                    gulp.dest(path.resolve(cwd,config.prototypeDir,'js'))
                ],(err)=>{
                    if (err){
                        logError('js:compile',`Could not copy files to prototye directory: ${err.message}`);
                    }
                });
            }
            if (config.siteAssetsDrive && isDebug){
                pump([
                    gulp.src([path.resolve(cwd,`${config.jsDistDir}/*.js`),
                        [path.resolve(cwd, `${config.distDir}/*.js`)]]),
                    gulp.dest(path.resolve(config.siteAssetsDrive+':\\',
                    config.deploymentDir,
                    'js'))],(err)=>{
                        if (err){
                            logError('js:compile', `An error has occured while pushing files to Site Assets ${path.resolve(config.siteAssetsDrive + ':\\',
                                config.deploymentDir,
                                'js')}`);
                        }
                        cb(err);
                    });
                return;
            }
            cb();
        }
    });
});

gulp.task('js:watch',(cb)=>{
    return gulp.watch([
        path.resolve(cwd,'./src/*.ts'),
        path.resolve(cwd, './src/**/*.ts'),
        path.resolve(cwd, './src/*.tsx'),
        path.resolve(cwd, './src/**/*.tsx')
    ],['js:compile']);
}); 

gulp.task('resources:compile',()=>{
    return gulp.src([
        path.resolve(cwd,`${config.resourcesDir||'./resources'}/*.resx`),
        path.resolve(cwd,`${config.resourcesDir||'./resources'}/*.spfont`),
        path.resolve(cwd,`${config.resourcesDir||'./resources'}/*.spcolor`),
        path.resolve(cwd,`${config.resourcesDir||'./resources'}/**/*.resx`),
        path.resolve(cwd,`${config.resourcesDir||'./resources'}/**/*.spfont`),
        path.resolve(cwd,`${config.resourcesDir||'./resources'}/**/*.spcolor`)])
        .pipe(gulp.dest(path.resolve(cwd,`${config.provisioningDir || './deploy'}`)));
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

gulp.task('prototype:compile', (cb) => {
    const fullPath = path.resolve(cwd, config.masterPageTemplatesDir);
    mkdirp(fullPath, (err) => {
        if (err) {
            logError('prototype:compile', `Could not create folder ${fullPath}`);
            cb(err);
            return;
        }
        logVerbose('prototype:compile', 'Started compiling prototype templates');
        logVerbose('prototype:compile',
            `Loading prototype templates ('.html','.njk') from ${path.resolve(cwd, config.prototypeTemplatesDir)}`);
        var tasks = [gulp.src([path.resolve(cwd, config.prototypeTemplatesDir, '*.html'),
        path.resolve(cwd, config.prototypeTemplatesDir, '*.njk'),
        path.resolve(cwd, config.prototypeTemplatesDir, '**/*.html'),
        path.resolve(cwd, config.prototypeTemplatesDir, '**/*.njk')]),
        data(getFileData),
        nunjucksTask.compile({ config },{
            name:file=>`${path.basename(file.name,path.extname(file.name))}.html`
        }),
        rename({
            extname:'.html'
        }),
        gulp.dest(path.resolve(cwd, config.prototypeDir))];
        pump(
            tasks,
            (err) => {
                if (err) {
                    logError('prototype:compile', `An error has occured while compiling prototype templates ${err.message}`);
                    cb(err);
                    return;
                }
                logVerbose(`prototype:compile`, `Finished compiling prototype templates`);
                cb(err);
            }
        );

    });
});

gulp.task('assets:build',(cb)=>{
    logVerbose(`assets:build`,`Copying asset files`); 
    const srcs = [
        path.resolve(config.assetsDir, '*.png'),
        path.resolve(config.assetsDir, '*.jpg'),
        path.resolve(config.assetsDir, '*.ico'),
        path.resolve(config.assetsDir, '*.svg'),
        path.resolve(config.assetsDir, '*.ttf'),
        path.resolve(config.assetsDir, '*.eot'),
        path.resolve(config.assetsDir, '*.woff'),
        path.resolve(config.assetsDir, '*.woff2'),
        path.resolve(config.assetsDir, '**/*.png'),
        path.resolve(config.assetsDir, '**/*.jpg'),
        path.resolve(config.assetsDir, '**/*.ico'),
        path.resolve(config.assetsDir, '**/*.svg'),
        path.resolve(config.assetsDir, '**/*.ttf'),
        path.resolve(config.assetsDir, '**/*.eot'),
        path.resolve(config.assetsDir, '**/*.woff'),
        path.resolve(config.assetsDir, '**/*.woff2')
    ];
    pump([gulp.src(srcs),
    gulp.dest(path.resolve(config.provisioningDir,config.deploymentDir,'assets'))],(err)=>{
        if (err){
            logError(`assets:build`,`An error has occured while copying files to provision directory assets folder: ${err.message}`);
            cb(err); 
            return; 
        }
        logVerbose('assets:build', `Finished building assets folder to provision directory at: ${path.resolve(config.provisioningDir, config.deploymentDir, 'assets')}`); 
    });
    pump([gulp.src(srcs),
        gulp.dest(path.resolve(config.prototypeDir,'assets'))],(err)=>{
            if (err){
                logError('assets:build',`An error has occured while copying files to prototype assets folder: ${err.message}`);
                cb(err); 
                return; 
            }
            logVerbose('assets:build', `Finished building assets folder for prototypes at: ${path.resolve(config.prototypeDir, 'assets')}`); 
        });
});

gulp.task('prototype:watch',['prototype:compile'],()=>{
    let inputDir = args.inputDir || `${config.templatesDir}`;
    gulp.watch([
        path.resolve(inputDir, '*.njk'),
        path.resolve(inputDir, '**/*.njk'),
        path.resolve(inputDir, '*.html'),
        path.resolve(inputDir, '**/*.html')
    ], ['prototype:compile']);
});

gulp.task('prototype',(cb)=>{
    try{
        isPrototyping = true;
        let express = require('express'); 
        let staticFiles = require('serve-static');
        outputDir = args.output || `${config.prototypeDir}`;
        let inputDir = args.inputDir || `${config.templatesDir}`;
        let port = args.port || 6565; 
        if (isPrototyping) {
            const prototypesSrcDir = path.resolve(cwd, config.srcDir, './prototypes');
            logVerbose('js:compile', `In prototype mode. Attempting to add prototype source files from ${prototypesSrcDir}`);
            try {
                if (fs.existsSync(prototypesSrcDir)) {
                    logVerbose('js:compile', `Prototypes directory ${prototypesSrcDir} exists. Attempting to directory contents`);
                    let prototypes = fs.readdirSync(prototypesSrcDir);
                    prototypes = prototypes.filter((e) => path.extname(e) === '.ts' || path.extname(e) === '.tsx');
                    logVerbose('js:compile', `Prototypes directory content read successfully in total ${prototypes.length} source files`);
                    prototypes.forEach((file) => {
                        logVerbose('js:compile', `Adding prototype source file ${file} to webpack configuration object`);
                        webpackConfig.entry[path.basename(file,path.extname(file))] = path.resolve(prototypesSrcDir, file);
                    });
                    webpackCompiler = webpack(webpackConfig);
                }
            } catch (err) {
                logError(`js:compile`, `An error has occured while reading prototypes directory ${prototypesSrcDir}. Not compiling any prototype source files: ${err.message}`);
            }
        }
        function done(err) {
            if (err) {
                logError(`Prototyping`, `An error has occured while creating prototype folder at ${path.resolve(cwd, inputDir)}: ${err.message}`);
                cb();
                return;
            }
            gulp.start('lib:download');
            gulp.start('lib:compile:js');
            gulp.start('lib:compile:css'); 
            gulp.start('assets:build');
            gulp.start('prototype:watch'); 
            gulp.start('js:watch'); 
            gulp.start('sass:watch');

            let app = express();
            app.use(staticFiles(path.resolve(outputDir)));
            if (fs.existsSync(path.resolve(cwd,'./extension/index.js'))){
                require(path.resolve(cwd, './extension/index.js'))(app,config); 
            }
            app.listen(port,()=>{
                log('Prototyping',`Prototyping server has started on port ${port}. You can access the server on http://localhost:${port}`);
            });

        }
        if (fs.existsSync(path.resolve(cwd, inputDir))) {
            mkdirp(path.resolve(cwd, inputDir), done);
        } else {
            done(null);
        }
    }catch(err){
        console.log(`Prototyping`,`Could not start prototyping server because of missing depenendencies: ${err.message}`)
    } 
});

gulp.task('prototype:upload',(cb)=>{
    uploadingPrototypes = true; 
    const gzip = require('gulp-gzip'),
    tar = require('gulp-tar');
    if (!config.prototypeServerUrl){
        logError('prototype:upload',`Cannot upload your prototypes, no prototyep server has been setup. Use 'yo sharepoint-app' to setup the prototype server`); 
        cb(); 
        return; 
    }
    fs.writeFileSync(path.resolve(cwd,config.prototypeDir,'project.json'),JSON.stringify(config,null,'    '));
    logVerbose('prototype:upload', `Attempting to zip your prototypes to: ${path.resolve(cwd, './zip')}`);
    pump([
        gulp.src([`./${config.prototypeDir}/**`]),
        tar(`${config.name}.tar`),
        gzip(),
        gulp.dest(path.resolve(cwd,'./zip'))
    ],(err)=>{
        if (err){
            logError('prototype:upload', `Could not zip your prototypes to ${path.resolve(cwd, './zip')} because: ${err.message}`);
            cb(err);
            return; 
        }
        logVerbose('prototype:upload', `Attempting to upload your prototypes to: ${config.prototypeServerUrl}`);
        const zipFileName = path.resolve(cwd,'./zip',`${config.name}.tar.gz`);
        const readStream = fs.createReadStream(zipFileName); 
        request.post({
            url: config.prototypeServerUrl + `${config.prototypeServerUrl.endsWith('/')?'':'/'}upload`,
            formData:{
                projectName:config.name,
                prototypes:readStream
            }
        },(err)=>{
            if (err){
                logError('prototype:upload',`Could not upload your prototypes to ${config.prototypeServerUrl} because: ${err.message}`);
                cb(err);
                return; 
            }
            logVerbose('prototype:upload',`Your prototypes have been uploaded to ${config.prototypeServerUrl} successfully`);
        });;

    });
    ;
});


process.on('exit',()=>{
    logVerbose('exit event','Terminating tasks');
    if (webpackWatch){
        webpackWatch.close(()=>{
            logVerbose('exit event','Closing JavaScript watch'); 
        });
    }
})

init(config, args);