"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nunjucks = require("nunjucks");
const path = require("path");
const fs = require("fs");
const filters_1 = require("../util/filters");
const builtin_1 = require("../sharepoint/builtin");
const xmlformatter_1 = require("../xml/xmlformatter");
const filters_2 = require("../sharepoint/filters");
const util_1 = require("../io/util");
const logger_1 = require("../util/logger");
const util_2 = require("util");
const INTERFACES_DIR = 'interfaces';
const SRC_DIR = 'src';
const OUTPUT_DIR = 'deploy';
const TEMPLATES_DIR = 'templates';
function createTransformer(config) {
    var ctypes = {};
    var fields = {};
    var errors = [];
    var cfg = {
        outputDir: path.resolve(process.cwd(), OUTPUT_DIR),
        templatesPaths: config.templatesPaths || [],
        srcDir: config.srcDir || (config.rootDir && path.resolve(config.rootDir, SRC_DIR))
    };
    var env = nunjucks.configure([path.resolve(__dirname, path.join('..', '..', TEMPLATES_DIR)), ...(cfg.templatesPaths || [])], {
        trimBlocks: true
    });
    async function setConfig({ outputDir, rootDir, srcDir, interfacesDir, templatesPaths }) {
        var cwd = process.cwd();
        var rootdir = rootDir || cwd;
        await util_1.createDirectoryIfNotExist(rootdir, 'Creating Root Directory');
        cfg.outputDir = outputDir || path.resolve(rootdir, 'deploy');
        await util_1.createDirectoryIfNotExist(cfg.outputDir, 'Creating Output Directory');
        cfg.srcDir = srcDir || path.resolve(rootDir || cwd, SRC_DIR);
        await util_1.createDirectoryIfNotExist(cfg.srcDir, 'Creating Source Directory');
        cfg.interfacesDir = interfacesDir || path.resolve(rootDir || cwd, path.join(SRC_DIR, INTERFACES_DIR));
        await util_1.createDirectoryIfNotExist(cfg.interfacesDir, 'Creating Interfaces Directory');
        cfg.templatesPaths = templatesPaths;
        env = nunjucks.configure([...(cfg.templatesPaths || []), path.resolve(__dirname, path.join('..', '..', TEMPLATES_DIR))], {
            trimBlocks: true
        });
        env.addGlobal('hasAttr', filters_1.hasAttr);
        env.addGlobal('getAttr', filters_1.getAttr);
        env.addGlobal('getFieldId', filters_2.getFieldId);
        env.addGlobal('getContentTypeId', getContentTypeId);
        env.addGlobal('getFieldIdByName', getFieldIdByName);
        env.addGlobal('getContentTypeIdByName', getContentTypeIdByName);
        env.addFilter('removeSpaces', filters_1.removeSpaces);
        env.addFilter('parenthesize', filters_1.parenthesize);
        env.addFilter('capitalize', filters_1.capitalize);
        env.addFilter('lowerize', filters_1.lowerize);
        env.addGlobal('hasContentBindings', hasContentBindings);
        env.addGlobal('isTaxonomyField', filters_2.isTaxonomyField);
        env.addGlobal('generateTaxonomyFieldId', filters_2.generateTaxonomyFieldId);
        env.addGlobal('getFieldType', filters_2.getFieldType);
        env.addGlobal('getFilePath', getFilePath);
        env.addGlobal('getConfig', getConfig);
        env.addGlobal('booleanToUpper', filters_2.booleanToUpper);
        env.addGlobal('getJsTypeForField', filters_2.getJsTypeForField);
        env.addGlobal('log', logger_1.log);
        env.addGlobal('isString', filters_1.isString);
        env.addGlobal('isObject', util_2.isObject);
        env.addGlobal('hasItems', filters_1.hasItems);
        env.addGlobal('validateContentType', filters_2.validateContentType);
        env.addGlobal('addError', addError);
    }
    function clearErrors() {
        errors = [];
    }
    function addError(error) {
        errors.push(error);
    }
    function getContentTypeId(contentType) {
        if (builtin_1.BuiltInContentType[contentType.parent]) {
            return builtin_1.BuiltInContentType[contentType.parent] + '00' + filters_1.getAttr(contentType, 'id').replace(/-/g, '');
        }
        return getContentTypeId(ctypes[contentType.parent]).replace(/-/g, '') + '00' + filters_1.getAttr(contentType, 'id').replace(/-/g, '');
    }
    function getContentTypeIdByName(cName) {
        return (ctypes[cName] && getContentTypeId(ctypes[cName])) || 'Error not valid ' + cName;
    }
    function getFieldIdByName(name) {
        if (fields[name]) {
            return `${filters_1.getAttr(fields[name], 'id')}`;
        }
        errors.push(`ERROR no field with name ${name}`);
        return `ERROR no field with name ${name}`;
    }
    function hasContentBindings(list) {
        if (list.contentTypes) {
            var f = list.contentTypes.filter(function (e) {
                return e !== "Item";
            });
            return f.length > 0;
        }
        return list.contentTypeIds && list.contentTypeIds.length > 0;
    }
    function addFileds(fis) {
        fis.forEach((field) => {
            fields[filters_1.getAttr(field, 'name')] = field;
        });
    }
    function addContentTypes(cts) {
        cts.forEach((ct) => {
            ctypes[filters_1.getAttr(ct, 'name')] = ct;
        });
    }
    async function transform({ spHost, url }, site) {
        await setConfig(config);
        errors = [];
        ctypes = {};
        fields = {};
        if (!spHost) {
            logger_1.logError('Transform', 'spHost parameter is missing');
            throw new Error('No spHost provided');
        }
        addFileds(site.fields);
        addContentTypes(site.contentTypes);
        if (filters_1.hasAttr(site, 'files')) {
            let files = filters_1.getAttr(site, 'files');
            files.forEach((file) => {
                if (file.isPageLayout) {
                }
            });
        }
        if (filters_1.getAttr(site, 'subsites')) {
            let subsites = filters_1.getAttr(site, 'subsites');
            subsites.forEach((subsite, i) => {
                if (filters_1.hasAttr(subsite, 'fields')) {
                    addFileds(filters_1.getAttr(subsite, 'fields'));
                }
                if (filters_1.hasAttr(subsite, 'contentTypes')) {
                    addContentTypes(filters_1.getAttr(subsite, 'contentTypes'));
                }
            });
        }
        var postfix = filters_1.getAttr(site, 'version') || '1';
        logger_1.log('Provisioning', `Creating site collection provisioning template ${site.url}`);
        fs.writeFileSync(path.resolve(cfg.outputDir, `./sitecollection-${site.id}-${postfix}.xml`), formatter.format(env.render('ProvisioningTemplate.xml', {
            template: site
        })));
        logger_1.log('Base Interfaces', 'Creating base interfaces');
        createBaseInterfaces(site);
        logger_1.log('List Schemas', 'Creating site collection list schemas');
        createListSchemas(site);
        if (site.subsites) {
            site.subsites.forEach((site) => {
                logger_1.log('Provisioning', `Creating subsite provisioning template ${site.url}`);
                fs.writeFileSync(path.resolve(cfg.outputDir, `./site-${site.id}-${postfix}.xml`), formatter.format(env.render('ProvisioningTemplate.xml', {
                    template: site
                })));
                if (site.lists && site.lists.length > 0) {
                    logger_1.log('List Schemas', `Creating subsite list schemas ${site.url}`);
                    createListSchemas(site);
                }
            });
        }
        site.spHost = site.spHost || spHost;
        if (!site.spHost.endsWith('/')) {
            site.spHost += '/';
        }
        site.url = site.url || url;
        site.siteCollectionUrl = url;
        logger_1.log('Provisioning', `Creating functions.ps1`);
        fs.writeFileSync(path.resolve(cfg.outputDir, `./functions.ps1`), env.render('Functions.ps1.njk', {
            template: site,
            postfix,
            spHost: site.spHost,
            url: site.url,
            libDir: cfg.outputDir
        }));
        logger_1.log('Provisioning', `Creating deploy.ps1`);
        fs.writeFileSync(path.resolve(cfg.outputDir, `./deploy-${postfix}.ps1`), env.render('Deployment.ps1.njk', {
            template: site,
            postfix,
            spHost: site.spHost,
            url: site.url,
        }));
    }
    function getConfig(key) {
        return cfg[key];
    }
    function getFilePath(fileName) {
        return path.resolve(cfg.outputDir, fileName);
    }
    var formatter = new xmlformatter_1.XmlFormatter({
        preferSpaces: true,
    });
    function getBuiltInContentTypeFields(contentTypeName, childFields = []) {
        return [].concat([
            {
                name: "Title",
                type: "Text"
            }
        ], childFields);
    }
    function getFieldsForContentType(contentType, childFields = []) {
        if (!contentType) {
            logger_1.logError('Get Fields For Content Type', `Undefined content type provided`);
            errors.push(`Undefined content type provided`);
            throw new Error(`Content type cannot be undefined`);
        }
        var ff = [].concat(childFields, contentType.fields.map((e) => {
            if (!fields[e]) {
                errors.push('Get Fields For Content Type' + `: Field ${e} does not exist`);
                logger_1.logError('Get Fields For Content Type', `Field ${e} does not exist`);
                throw new Error(`Field ${e} does not exist`);
            }
            return fields[e];
        }));
        if (ctypes[contentType.parent]) {
            return getFieldsForContentType(ctypes[contentType.parent], ff);
        }
        else if (builtin_1.BuiltInContentType[contentType.parent]) {
            return getBuiltInContentTypeFields(contentType.parent, ff);
        }
        else {
            logger_1.log('Error', `Couldn't fint parent content type ${contentType.parent} for contentType ${contentType.name}`);
            return ff;
        }
    }
    function createBaseInterfaces(site) {
        var fileName = `${cfg.interfacesDir}/CommonType.ts`;
        logger_1.log('Creating Base Interfaces', `Creating CommonType.ts at ${fileName}`);
        fs.writeFileSync(fileName, nunjucks.render('CommonType.ts.njk', {}));
        fileName = `${cfg.interfacesDir}/User.ts`;
        logger_1.log('Creating Base Interfaces', `Creating User.ts at ${fileName}`);
        fs.writeFileSync(fileName, nunjucks.render('User.ts.njk', {}));
        fileName = `${cfg.interfacesDir}/ListItemAttachment.ts`;
        logger_1.log('Creating Base Interfaces', `Creating ListItemAttachment.ts at ${fileName}`);
        fs.writeFileSync(fileName, nunjucks.render('ListItemAttachment.ts.njk', {}));
    }
    function createListSchemas(site) {
        site.lists.forEach((e) => {
            var fileName = `${cfg.outputDir}/${site.id}-${e.title}.ts`;
            let tx = {};
            var fields = null;
            var contentTypeName = !e.contentTypes || e.contentTypes.length === 0 ? "Item" : e.contentTypes[0];
            if (contentTypeName !== "Item" && !ctypes[contentTypeName]) {
                logger_1.logError('Content type not found', `Content type ${contentTypeName} does not exist`);
                throw new Error(`Could not find definition for content type ${contentTypeName}.`);
            }
            fields = !e.contentTypes || e.contentTypes.length === 0 ? getBuiltInContentTypeFields("Item") : getFieldsForContentType(ctypes[contentTypeName]);
            fields.forEach((e) => {
                tx[e.name] = e.type;
            });
            logger_1.log('List Schemas', `Creating list schema for list ${e.title}`);
            fs.writeFileSync(fileName, nunjucks.render('ListSchema.ts.njk', {
                listTitle: (e.title),
                schema: JSON.stringify(tx, null, '    ')
            }));
            if (e['interface']) {
                logger_1.log('List Schemas', `Creating interface for list ${e.title}`);
                var interfaceFileName = `${cfg.interfacesDir}/${e['interface']}.ts`;
                fs.writeFileSync(interfaceFileName, nunjucks.render('ListInterface.ts.njk', {
                    fields,
                    list: e
                }));
            }
        });
    }
    return {
        setConfig,
        transform,
        get errors() {
            return errors;
        }
    };
}
exports.createTransformer = createTransformer;
