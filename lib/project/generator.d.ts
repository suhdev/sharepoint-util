/// <reference types="lodash" />
import { Dictionary } from 'lodash';
export interface ProjectConfig {
    spHost: string;
    url: string;
    name: string;
    version: string;
    assetsDir: string;
    libDir: string;
    configDir: string;
    env: string;
    srcDir: string;
    sassDir: string;
    useSharePoint: boolean;
    sharePointVersion: 'online' | '2013' | '2016';
    distDir: string;
    distCssDir: string;
    distJsDir: string;
    provisioningDir: string;
    templatesDir: string;
    masterPageTemplatesDir: string;
    pageLayoutTemplatesDir: string;
    templatesExtraConfig: Dictionary<any>;
    deploymentDir: string;
    masterpageCatalogDrive?: string;
    siteAssetsDrive?: string;
    styleLibraryDrive?: string;
    cdn: string[];
}
export declare function createConfigFile(config: ProjectConfig): Promise<void>;
export declare function createDefaultConfigFile(): Promise<void>;
export declare function createProject(name: string, config?: ProjectConfig): void;
