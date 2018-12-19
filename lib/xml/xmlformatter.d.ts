export declare class XmlFormatter {
    constructor(options?: IXmlFormatterOptions);
    newLine: string;
    indentPattern: string;
    splitNamespaces: boolean;
    format(xml: string): string;
    minify(xml: string, removeComments?: boolean): string;
    private _getIndent;
    private _stripLineBreaks;
}
export interface IXmlFormatterOptions {
    preferSpaces?: boolean;
    tabSize?: number;
    newLine?: string;
    splitNamespaces?: boolean;
}
