import { SharePointSite } from './sharepointsite';
export interface ProvisionOptions {
    copyInterfaces?: boolean;
}
export interface SiteConfig {
    spHost?: string;
    url?: string;
}
export interface TransformConfig {
    outputDir?: string;
    rootDir?: string;
    srcDir?: string;
    interfacesDir?: string;
    templatesPaths?: string[];
    options?: ProvisionOptions;
}
export declare function createTransformer(config: TransformConfig): {
    setConfig: ({outputDir, rootDir, srcDir, interfacesDir, templatesPaths}: TransformConfig) => Promise<void>;
    transform: ({spHost, url}: SiteConfig, site: SharePointSite) => Promise<void>;
    validate: (site: any, ctypes?: {}, fields?: {}, errors?: any[]) => any[];
    clean: (site: any) => string[];
    readonly errors: string[];
};
