import { getAttr } from '../util/filters';
import { createHash } from 'crypto';
import { FieldTypes } from './builtin';
import { log } from '../util/logger';
import { Field } from '../provisioning/field';
import { ContentType } from '../provisioning/contenttype';

export function getJsTypeForField(fieldType: string) {
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

export function isTaxonomyField(field: Field) {
    // return true; 
    // console.log(`field`,field);
    return getAttr(field, 'type') === 'TaxonomyFieldType' || 
        getAttr(field,'type') === 'TaxonomyFieldTypeMulti';//.toLowerCase().indexOf('taxonomy') !== -1; 
}

export function getFieldId(field: any) {
    var t = (field.ID || field.Id || field.id || field.iD);
    if (t) {
        return `${t}`
    }
    return 'xyzzxyey-xxzz-yxyx-zxyx-xxyyzzxyzxyz'.replace(/[xyz]/g, (e, m) => {
        return Math.round(Math.random() * 15).toString(16);
    });
}

export function generateGuid(){
    return 'xyzzxyey-xxzz-yxyx-zxyx-xxyyzzxyzxyz'.replace(/[xyz]/g, (e, m) => {
        return Math.round(Math.random() * 15).toString(16);
    });
}

export function booleanToUpper(b: boolean) {
    return b ? "TRUE" : "FALSE";
}

export function generateTaxonomyFieldId(id) {
    var nId = createHash('md5').update(id).digest("hex");
    nId = `${nId.substr(0, 8)}-${nId.substr(8, 4)}-${nId.substr(12, 4)}-${nId.substr(16, 4)}-${nId.substr(20)}`;
    return `{${nId}}`;
}

export function getFieldType(type: string) {
    return FieldTypes[type.toLowerCase()];
}

export function validateContentType(contentType:ContentType){
    var val = true; 
    if (!contentType.id){
        val = false; 
        log(`Content Type Validation`,`id for content type ${contentType.name} is missing.`)
    }
    if (!contentType.name){
        val = false; 
        log(`Content Type Validation`, `name for content type ${contentType.id} is missing.`)
    }
    if (!contentType.description) {
        val = false; 
        log(`Content Type Validation`, `description for content type ${contentType.description} is missing.`)
    }
    if (!contentType.group) {
        val = false; 
        log(`Content Type Validation`, `group for content type ${contentType.group} is missing.`)
    }
    return val; 
}

export function validateField(field:Field){
    var val = true;

    return val; 
}