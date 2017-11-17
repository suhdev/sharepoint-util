import { DataRow } from './datarow';
import { Security } from './security';
import { Folder } from './folder';
import { UserCustomAction } from './usercustomaction';
export interface List {
    title: string;
    description: string;
    documentTemplate: any;
    onQuickLaunch?: any;
    templateType?: number;
    enableVersioning?: boolean;
    forceCheckout?: boolean;
    removeExistingContentTypes?: boolean;
    url: string;
    contentTypes?: string[];
    createDefaultView?: boolean;
    contentTypeIds?: string[];
    dataRows?: DataRow[];
    fieldDefaults?: {
        [idx: string]: any;
    };
    security?: Security;
    folders?: Folder[];
    userCustomActions?: UserCustomAction[];
}
