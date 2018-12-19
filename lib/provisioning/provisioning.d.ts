import { SharePointSite } from './sharepointsite';
import { Field } from './field';
import { Dictionary } from 'lodash';
import { ContentType } from './contenttype';
import { List } from './List';
import { TermGroup } from './termgroup';
import { TermSet } from './termset';
export interface ProvisionOptions {
    copyInterfaces?: boolean;
}
export interface SiteConfig {
    spHost?: string;
    url?: string;
}
export interface CleanAction {
    name: string;
    value: string;
    fn: (generator?: any) => void;
}
export interface CleanConfig {
    fields: Dictionary<Field>;
    contentTypes: Dictionary<ContentType>;
    lists: Dictionary<List>;
    termGroups: Dictionary<TermGroup>;
    termSets: Dictionary<TermSet>;
    cleanActions: CleanAction[];
    errors: string[];
}
export interface TransformConfig {
    outputDir?: string;
    rootDir?: string;
    srcDir?: string;
    interfacesDir?: string;
    templatesPaths?: string[];
    consumeContentType?: (name: string, id: string) => void;
    options?: ProvisionOptions;
}
export declare function createTransformer(config: TransformConfig): {
    setConfig: ({ outputDir, rootDir, srcDir, interfacesDir, templatesPaths, consumeContentType }: TransformConfig) => Promise<void>;
    transform: ({ spHost, url }: SiteConfig, site: SharePointSite) => Promise<void>;
    validate: (site: any) => CleanConfig;
    readonly errors: string[];
};
