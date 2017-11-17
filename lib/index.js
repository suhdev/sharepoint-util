"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nunjucks = require("nunjucks");
const path = require("path");
var env = nunjucks.configure(path.resolve(__dirname, '../templates/'), {});
module.exports = async function ({ site, spHost, url, outputDir, srcDir, interfacesDir, rootDir, templatesPath }) {
    // createTransformer(p).transform(site, {
    //     outputDir: outputdir,
    //     url: url || site.url,
    //     spHost,
    //     rootDir: rootdir,
    //     srcDir,
    //     interfacesDir:interfacesdir,
    // });
};
