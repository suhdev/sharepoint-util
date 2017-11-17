import { ContentType } from './contenttype';
import { Field } from './field';
import { List } from './List';
import { WebSettings } from './websettings';
import { RegionalSettings } from './regionalSettings';
import { Dictionary } from 'lodash';
import { Localization } from './localization';
import { ComposedLook } from './composedLook';
import { Command } from '../../lib/provisioning/command';
export interface PropertyDefinition {
    value:string; 
    overwrite:boolean;
}
export interface SharePointSite {
    id: string;
    templatesId: string;
    url:string;
    baseSiteTemplate?:string;
    imagePreviewUrl?:string;
    displayName:string;
    scope?:string;
    description?:string;
    contentTypes?: ContentType[];
    fields?: Field[];
    subsites?:SharePointSite[];
    sitePolicy?:string;
    lists?:List[];
    setSiteCollectionTermGroupName?:boolean;
    spHost?:string;
    siteCollectionUrl?:string;
    webSettings?:WebSettings; 
    localizations:Localization[]; 
    supportedUILanguages?:string[];
    composedLook?:ComposedLook;
    preConnectCommands?:Command[]; 
    postConnectCommands?:Command[];
    preProvisiongCommands?:Command[]; 
    postProvisioningCommands?:Command[];
    regionalSettings?: RegionalSettings;
    propertyBagEntries?: Dictionary<string | PropertyDefinition>;
    properties?:Dictionary<string|PropertyDefinition>; 

}