import { ContentType } from './contenttype';
import { Field } from './field';
import { List } from './List';
import { WebSettings } from './websettings';
import { RegionalSettings } from './regionalSettings';
import { Dictionary } from 'lodash';
import { Localization } from './localization';
import { ComposedLook } from './composedLook';
import { Navigation } from './navigation';
import { Command } from './command';
export interface PropertyDefinition {
    value: string;
    overwrite: boolean;
}
export interface ProvisioningFlags {
    useSiteCollectionTermGroup?: boolean;
}
export interface ProvisionPreferences {
    parameters: Dictionary<any>;
    preferences: Dictionary<any>;
}
export interface SharePointSite {
    id: string;
    templatesId: string;
    url: string;
    baseSiteTemplate?: string;
    imagePreviewUrl?: string;
    displayName: string;
    scope?: string;
    description?: string;
    contentTypes?: ContentType[];
    fields?: Field[];
    subsites?: SharePointSite[];
    sitePolicy?: string;
    lists?: List[];
    flags?: ProvisioningFlags;
    setSiteCollectionTermGroupName?: boolean;
    spHost?: string;
    siteCollectionUrl?: string;
    webSettings?: WebSettings;
    localizations: Localization[];
    supportedUILanguages?: string[];
    composedLook?: ComposedLook;
    preConnectCommands?: Command[];
    postConnectCommands?: Command[];
    navigation: Navigation;
    preProvisiongCommands?: Command[];
    postProvisioningCommands?: Command[];
    regionalSettings?: RegionalSettings;
    propertyBagEntries?: Dictionary<string | PropertyDefinition>;
    properties?: Dictionary<string | PropertyDefinition>;
    preferences?: ProvisionPreferences;
}
