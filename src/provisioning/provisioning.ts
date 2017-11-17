import * as nunjucks from 'nunjucks';
import * as path from 'path';
import * as fs from 'fs';
import * as pretty from 'pretty-data';
import { removeSpaces, parenthesize, capitalize, lowerize, getAttr, hasAttr, isString, hasItems } from '../util/filters';
import { BuiltInContentType, FieldTypes } from '../sharepoint/builtin';
import { XmlFormatter } from '../xml/xmlformatter';
import { SharePointSite } from './sharepointsite';
import { Field } from './field';
import { getJsTypeForField, getFieldId, isTaxonomyField, booleanToUpper, generateTaxonomyFieldId, getFieldType, validateContentType } from '../sharepoint/filters';
import { mkdirp, createDirectoryIfNotExist } from '../io/util';
import { logError, log } from '../util/logger';
import { List } from '../../lib/provisioning/List';
import { ContentType } from '../../lib/provisioning/contenttype';
import { isObject } from 'util';

const INTERFACES_DIR = 'interfaces'; 
const SRC_DIR = 'src'; 
const OUTPUT_DIR = 'deploy'; 
const TEMPLATES_DIR = 'templates'; 

export interface ProvisionOptions {
    copyInterfaces?: boolean;
}

export interface SiteConfig {
    spHost?: string;
    url?: string;
}

export interface TransformConfig {
    outputDir?: string;
    rootDir ?: string;
    srcDir ?: string;
    interfacesDir?:string; 
    templatesPaths?:string[];
    options?:ProvisionOptions; 
}

export function createTransformer(config:TransformConfig) {
    var ctypes = {};
    var fields = {};
    var errors:string[] = [];

    var cfg: TransformConfig = {
        outputDir: path.resolve(process.cwd(),OUTPUT_DIR),
        templatesPaths:config.templatesPaths || [],
        srcDir: config.srcDir || (config.rootDir && path.resolve(config.rootDir,SRC_DIR)) 
    };
    var env:nunjucks.Environment = nunjucks.configure([path.resolve(__dirname, path.join('..', '..', TEMPLATES_DIR)),...(cfg.templatesPaths||[])], {
        trimBlocks: true
    });

    async function setConfig({outputDir,rootDir,srcDir,interfacesDir,templatesPaths}:TransformConfig){
        var cwd = process.cwd();
        var rootdir = rootDir || cwd;
        await createDirectoryIfNotExist(rootdir, 'Creating Root Directory');
        cfg.outputDir = outputDir || path.resolve(rootdir ,'deploy');
        await createDirectoryIfNotExist(cfg.outputDir,'Creating Output Directory'); 
        cfg.srcDir = srcDir || path.resolve(rootDir || cwd, SRC_DIR);
        await createDirectoryIfNotExist(cfg.srcDir, 'Creating Source Directory'); 
        cfg.interfacesDir = interfacesDir || path.resolve(rootDir || cwd, path.join(SRC_DIR,INTERFACES_DIR));
        await createDirectoryIfNotExist(cfg.interfacesDir, 'Creating Interfaces Directory'); 
        cfg.templatesPaths = templatesPaths; 
        env = nunjucks.configure([...(cfg.templatesPaths || []),path.resolve(__dirname, path.join('..', '..', TEMPLATES_DIR))], {
            trimBlocks: true
        });
        env.addGlobal('hasAttr', hasAttr);
        env.addGlobal('getAttr', getAttr);
        env.addGlobal('getFieldId', getFieldId);
        env.addGlobal('getContentTypeId', getContentTypeId);
        env.addGlobal('getFieldIdByName', getFieldIdByName);
        env.addGlobal('getContentTypeIdByName', getContentTypeIdByName);
        env.addFilter('removeSpaces', removeSpaces);
        env.addFilter('parenthesize', parenthesize);
        env.addFilter('capitalize', capitalize);
        env.addFilter('lowerize', lowerize);
        env.addGlobal('hasContentBindings', hasContentBindings);
        env.addGlobal('isTaxonomyField', isTaxonomyField);
        env.addGlobal('generateTaxonomyFieldId', generateTaxonomyFieldId);
        env.addGlobal('getFieldType', getFieldType);
        env.addGlobal('getFilePath', getFilePath);
        env.addGlobal('getConfig', getConfig);
        env.addGlobal('booleanToUpper', booleanToUpper);
        env.addGlobal('getJsTypeForField', getJsTypeForField);
        env.addGlobal('log', log);
        env.addGlobal('isString',isString); 
        env.addGlobal('isObject',isObject); 
        env.addGlobal('hasItems',hasItems);
        env.addGlobal('validateContentType', validateContentType);
        env.addGlobal('addError',addError);
    }
    
    function clearErrors(){
        errors = []; 
    }

    function addError(error){
        errors.push(error);
    }

    function getContentTypeId(contentType) {
        if (BuiltInContentType[contentType.parent]) {
            return BuiltInContentType[contentType.parent] + '00' + getAttr(contentType, 'id').replace(/-/g, '');
        }
        return getContentTypeId(ctypes[contentType.parent]).replace(/-/g, '') + '00' + getAttr(contentType, 'id').replace(/-/g, '');
    }

    function getContentTypeIdByName(cName) {
        return (ctypes[cName] && getContentTypeId(ctypes[cName])) || 'Error not valid ' + cName;
    }

    function getFieldIdByName(name: string) {
        if (fields[name]) {
            return `${getAttr(fields[name], 'id')}`;
        }
        errors.push(`ERROR no field with name ${name}`);
        return `ERROR no field with name ${name}`
    }

    function hasContentBindings(list: any) {
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
            fields[getAttr(field, 'name')] = field;
        });
    }

    function addContentTypes(cts) {
        cts.forEach((ct) => {
            ctypes[getAttr(ct, 'name')] = ct;
        });
    }

    async function transform({spHost,url}:SiteConfig, site: SharePointSite) {
        await setConfig(config);
        errors = [];
        ctypes = {};
        fields = {};
        if (!spHost){
            logError('Transform','spHost parameter is missing')
            throw new Error('No spHost provided');
        }
        addFileds(site.fields);
        addContentTypes(site.contentTypes);
        if (hasAttr(site, 'files')) {
            let files = getAttr(site, 'files');
            files.forEach((file) => {
                if (file.isPageLayout) {

                }
            })
        }
        if (getAttr(site, 'subsites')) {
            let subsites = getAttr(site, 'subsites');
            subsites.forEach((subsite, i) => {
                if (hasAttr(subsite, 'fields')) {
                    addFileds(getAttr(subsite, 'fields'));
                }
                if (hasAttr(subsite, 'contentTypes')) {
                    addContentTypes(getAttr(subsite, 'contentTypes'));
                }
            })
        }
        var postfix = getAttr(site, 'version') || '1';
        log('Provisioning', `Creating site collection provisioning template ${site.url}`);
        fs.writeFileSync(path.resolve(cfg.outputDir, `./sitecollection-${site.id}-${postfix}.xml`), formatter.format(env.render('ProvisioningTemplate.xml', {
            template: site
        })));
        log('Base Interfaces', 'Creating base interfaces');
        createBaseInterfaces(site); 
        log('List Schemas', 'Creating site collection list schemas');
        createListSchemas(site);
        if (site.subsites) {
            site.subsites.forEach((site) => {
                log('Provisioning', `Creating subsite provisioning template ${site.url}`);
                fs.writeFileSync(path.resolve(cfg.outputDir, `./site-${site.id}-${postfix}.xml`), formatter.format(env.render('ProvisioningTemplate.xml', {
                    template: site
                })));
                if (site.lists && site.lists.length > 0) {
                    log('List Schemas', `Creating subsite list schemas ${site.url}`)
                    createListSchemas(site);
                }
            });
        }
        site.spHost = site.spHost || spHost;
        if (!site.spHost.endsWith('/')){
            site.spHost += '/';
        }
        site.url = site.url || url;
        site.siteCollectionUrl = url;
        log('Provisioning', `Creating functions.ps1`);
        fs.writeFileSync(path.resolve(cfg.outputDir, `./functions.ps1`), env.render('Functions.ps1.njk', {
            template: site,
            postfix,
            spHost: site.spHost,
            url: site.url,
            libDir: cfg.outputDir
        }));

        log('Provisioning', `Creating deploy.ps1`);
        fs.writeFileSync(path.resolve(cfg.outputDir, `./deploy-${postfix}.ps1`), env.render('Deployment.ps1.njk', {
            template: site,
            postfix,
            spHost:site.spHost,
            url:site.url,
        }));
    }

    function getConfig(key: string) {
        return cfg[key];
    }

    function getFilePath(fileName: string) {
        return path.resolve(cfg.outputDir, fileName);
    }

    var formatter = new XmlFormatter({
        preferSpaces: true,
    });

    function getBuiltInContentTypeFields(contentTypeName: string, childFields = []) {
        return [].concat([
            {
                name: "Title",
                type: "Text"
            }
        ], childFields);
    }

    function getFieldsForContentType(contentType:ContentType, childFields = []) {
        if (!contentType){
            logError('Get Fields For Content Type',`Undefined content type provided`);
            errors.push(`Undefined content type provided`);
            throw new Error(`Content type cannot be undefined`);
        }
        var ff = [].concat(childFields, contentType.fields.map((e) => {
            if (!fields[e]) {
                errors.push('Get Fields For Content Type'+`: Field ${e} does not exist`);
                logError('Get Fields For Content Type',`Field ${e} does not exist`);
                throw new Error(`Field ${e} does not exist`);
            }
            return fields[e];
        }));
        if (ctypes[contentType.parent]) {
            return getFieldsForContentType(ctypes[contentType.parent], ff);
        } else if (BuiltInContentType[contentType.parent]) {
            return getBuiltInContentTypeFields(contentType.parent, ff);
        } else {
            log('Error', `Couldn't fint parent content type ${contentType.parent} for contentType ${contentType.name}`);
            return ff;
        }
    }

    function createBaseInterfaces(site:SharePointSite){
        var fileName = `${cfg.interfacesDir}/CommonType.ts`;
        log('Creating Base Interfaces',`Creating CommonType.ts at ${fileName}`);
        fs.writeFileSync(fileName, nunjucks.render('CommonType.ts.njk', {}));
        fileName = `${cfg.interfacesDir}/User.ts`;
        log('Creating Base Interfaces', `Creating User.ts at ${fileName}`);
        fs.writeFileSync(fileName, nunjucks.render('User.ts.njk', {}));
        fileName = `${cfg.interfacesDir}/ListItemAttachment.ts`;
        log('Creating Base Interfaces', `Creating ListItemAttachment.ts at ${fileName}`);
        fs.writeFileSync(fileName, nunjucks.render('ListItemAttachment.ts.njk', {}));

    }

    function createListSchemas(site: SharePointSite) {
        site.lists.forEach((e:List) => {
            
            var fileName = `${cfg.outputDir}/${site.id}-${e.title}.ts`;
            let tx = {};
            var fields: any[] = null;
            var contentTypeName = !e.contentTypes || e.contentTypes.length === 0 ? "Item" : e.contentTypes[0];
            if (contentTypeName !== "Item" && !ctypes[contentTypeName]){
                logError('Content type not found',`Content type ${contentTypeName} does not exist`);
                throw new Error(`Could not find definition for content type ${contentTypeName}.`);
            }
            fields = !e.contentTypes || e.contentTypes.length === 0 ? getBuiltInContentTypeFields("Item") : getFieldsForContentType(ctypes[contentTypeName]);
            fields.forEach((e) => {
                tx[e.name] = e.type;
            });
            log('List Schemas',`Creating list schema for list ${e.title}`);
            fs.writeFileSync(fileName,
                nunjucks.render('ListSchema.ts.njk', {
                    listTitle: (e.title),
                    schema: JSON.stringify(tx, null, '    ')
                }));
            if (e['interface']) {
                log('List Schemas',`Creating interface for list ${e.title}`)
                var interfaceFileName = `${cfg.interfacesDir}/${e['interface']}.ts`;
                fs.writeFileSync(interfaceFileName, nunjucks.render('ListInterface.ts.njk', {
                    fields,
                    list: e
                }));
            }
        })
    }
    
    
    return {
        setConfig,
        transform,
        get errors(){
            return errors;
        }
    };
    
}
