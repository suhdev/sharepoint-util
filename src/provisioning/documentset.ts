import {Document} from './document';
export interface DocumentSetTemplate {
    welcomePage: string;
    allowedContentTypes: string[];
    defaultDocuments: Document[];
    welcomePageFields?: string[];
    sharedFields?: string[];
}