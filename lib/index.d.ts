import { SharePointSite } from './provisioning/sharepointsite';
export interface ProvisionOptions {
    copyInterfaces?: boolean;
}
export interface ProvisionConfig {
    site?: SharePointSite;
    spHost?: string;
    url?: string;
    outputDir?: string;
    rootDir?: string;
    srcDir?: string;
    interfacesDir?: string;
    templatesPath?: string;
    options?: ProvisionOptions;
}
