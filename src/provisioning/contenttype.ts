import { Field } from './field';
import { DocumentSetTemplate } from './documentset';

export interface ContentType {
    name: string;
    group: string;
    parent: string;
    description: string;
    id: string;
    readOnly?: boolean;
    sealed?:boolean;
    overwrite?: boolean;
    hidden?: boolean;
    fieldRefs?: Field[];
    fields?: string[];
    documentSetTemplate?: DocumentSetTemplate;
}