
export interface Field {
    name: string;
    displayName: string;
    type: string;
    indexed?: boolean;
    required: boolean;
    id: string;
    description: string;
    showInDisplayForm?: boolean;
    showInFileDlg?: boolean;
    height?: number;
    width?: number;
    multi?: boolean;
    mult?: boolean;
    format?: string;
    numLines?: number;
    list?: string;
    formula?: string;
    fieldRefs?: string[];
    sspid?: string;
    termGroupName?: string;
    isPathRendered?: boolean;
    isKeyword?: boolean;
    lcid?: number;
    maxLength?: number;
    percentage?: any;
    max?: number;
    min?: number;
    decimals?: any;
    enableLookup?: any;
    hidden?: boolean;
    commas?: boolean;
    sortable?: boolean;
    overwrite?: boolean;
    showInEditForm?: boolean;
    showInNewForm?: boolean;
    group: string;
    richText?: boolean;
    richTextMode?: string;
    default?: any;
    choices?: string[];

}