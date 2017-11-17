export declare class XmlFormatter {
    constructor(options?: IXmlFormatterOptions);
    newLine: string;
    indentPattern: string;
    splitNamespaces: boolean;
    format(xml: string): string;
    minify(xml: string, removeComments?: boolean): string;
    private _getIndent(level, trailingValue?);
    private _stripLineBreaks(xml);
}
export interface IXmlFormatterOptions {
    preferSpaces?: boolean;
    tabSize?: number;
    newLine?: string;
    splitNamespaces?: boolean;
}
