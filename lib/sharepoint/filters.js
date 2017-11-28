"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filters_1 = require("../util/filters");
const crypto_1 = require("crypto");
const builtin_1 = require("./builtin");
const logger_1 = require("../util/logger");
function getJsTypeForField(fieldType) {
    fieldType = fieldType.toLowerCase();
    switch (fieldType) {
        case 'note':
        case 'text':
        case 'html':
            return 'string';
        case 'boolean':
            return 'boolean';
        case 'integer':
        case 'number':
        case 'double':
        case 'decimal':
            return 'number';
        case 'lookup':
        case 'user':
        case 'taxonomyfieldtype':
            return 'CommonType';
        case 'lookupmulti':
        case 'taxonomyfieldtypemulti':
        case 'usermulti':
            return 'CommonType[]';
        case 'datetime':
        case 'date':
            return 'Date';
        default:
            return 'string';
    }
}
exports.getJsTypeForField = getJsTypeForField;
function isTaxonomyField(field) {
    // return true; 
    // console.log(`field`,field);
    return filters_1.getAttr(field, 'type') === 'TaxonomyFieldType' ||
        filters_1.getAttr(field, 'type') === 'TaxonomyFieldTypeMulti'; //.toLowerCase().indexOf('taxonomy') !== -1; 
}
exports.isTaxonomyField = isTaxonomyField;
function getFieldId(field) {
    var t = (field.ID || field.Id || field.id || field.iD);
    if (t) {
        return `${t}`;
    }
    return 'xyzzxyey-xxzz-yxyx-zxyx-xxyyzzxyzxyz'.replace(/[xyz]/g, (e, m) => {
        return Math.round(Math.random() * 15).toString(16);
    });
}
exports.getFieldId = getFieldId;
function generateGuid() {
    return 'xyzzxyey-xxzz-yxyx-zxyx-xxyyzzxyzxyz'.replace(/[xyz]/g, (e, m) => {
        return Math.round(Math.random() * 15).toString(16);
    });
}
exports.generateGuid = generateGuid;
function booleanToUpper(b) {
    return b ? "TRUE" : "FALSE";
}
exports.booleanToUpper = booleanToUpper;
function generateTaxonomyFieldId(id) {
    var nId = crypto_1.createHash('md5').update(id).digest("hex");
    nId = `${nId.substr(0, 8)}-${nId.substr(8, 4)}-${nId.substr(12, 4)}-${nId.substr(16, 4)}-${nId.substr(20)}`;
    return `{${nId}}`;
}
exports.generateTaxonomyFieldId = generateTaxonomyFieldId;
function getFieldType(type) {
    return builtin_1.FieldTypes[type.toLowerCase()];
}
exports.getFieldType = getFieldType;
function validateContentType(contentType) {
    var val = true;
    if (!contentType.id) {
        val = false;
        logger_1.log(`Content Type Validation`, `id for content type ${contentType.name} is missing.`);
    }
    if (!contentType.name) {
        val = false;
        logger_1.log(`Content Type Validation`, `name for content type ${contentType.id} is missing.`);
    }
    if (!contentType.description) {
        val = false;
        logger_1.log(`Content Type Validation`, `description for content type ${contentType.description} is missing.`);
    }
    if (!contentType.group) {
        val = false;
        logger_1.log(`Content Type Validation`, `group for content type ${contentType.group} is missing.`);
    }
    return val;
}
exports.validateContentType = validateContentType;
function validateField(field) {
    var val = true;
    return val;
}
exports.validateField = validateField;
