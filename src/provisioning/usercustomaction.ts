export const StandardMenuGroupList = [
    'ActionMenu',
    'ActionsMenuForSurvey',
    'SettingsMenuForSurvey',
    'SiteActions' 
];

export enum StandardMenuGroup {
    ActionsMenu = 'ActionMenu', 
    ActionsMenuForSurvey = 'ActionsMenuForSurvey', 
    SettingsMenuForSurvey = 'SettingsMenuForSurvey', 
    SiteActions = 'SiteActions' 
}

export const CustomActionLocationList = ["DisplayFormToolbar", "EditControlBlock", "EditFormToolbar",
    "NewFormToolbar", "ViewToolbar",
    "Microsoft.SharePoint.StandardMenu", "CommandUI.Ribbon.ListView",
    "CommandUI.Ribbon.NewForm", "CommandUI.Ribbon.EditForm",
    "CommandUI.Ribbon.DisplayForm", "CommandUI.Ribbon", "Microsoft.SharePoint.ContentTypeSettings",
    "Microsoft.SharePoint.ContentTypeTemplateSettings", "Microsoft.SharePoint.Create",
    "Microsoft.SharePoint.GroupsPage", "Microsoft.SharePoint.ListEdit",
    "Microsoft.SharePoint.ListEdit.DocumentLibrary", "Microsoft.SharePoint.PeoplePage",
    "Microsoft.SharePoint.SiteSettings", "Microsoft.SharePoint.Administration.Applications",
    "Microsoft.SharePoint.Administration.Backups",
    "Microsoft.SharePoint.Administration.ConfigurationWizards", "Microsoft.SharePoint.Administration.Default",
    "Microsoft.SharePoint.Administration.GeneralApplicationSettings", "Microsoft.SharePoint.Administration.Monitoring",
    "Microsoft.SharePoint.Administration.Security", "Microsoft.SharePoint.Administration.SystemSettings",
    "Microsoft.SharePoint.Administration.UpgradeAndMigration"];

export const ContentTypeSettingsGroupList = ['Fields','General'];
export enum ContentTypeSettingsGroup {
    Fields = 'Fields', 
    General = 'General',    
}

export const CreateGroupList = ['WebPages'];

export enum CreateGroup {
    WebPages = 'WebPages'
}

export const GroupsPageList = ['NewMenu','SettingsMenu'];

export enum GroupsPage {
    NewMenu = 'NewMenu', 
    SettingsMenu = 'SettingsMenu'
}

export const ListEditGroupList = [
    'Communications',
    'GeneralSettings',
    'Permissions'
]; 

export enum ListEditGroup {
    Communications = 'Communications',
    GeneralSettings = 'GeneralSettings', 
    Permissions = 'Permissions'
}

export const DocumentLibraryGroupList = ['GeneralSettings']; 
export enum DocumentLibraryGroup {
    GeneralSettings = 'GeneralSettings', 
}

export const PeoplePageGroupList = [
    'ActionsMenu',
    'NewMenu',
    'SettingsMenu',   
];
export enum PeoplePageGroup {
    ActionsMenu = 'ActionsMenu', 
    NewMenu = 'NewMenu', 
    SettingsMenu = 'SettingsMenu',   
}

export const SiteSettingsGroupList = [
    'Customization',
    'Galleries',
    'SiteAdministration',
    'SiteCollectionAdmin',
    'UsersAndPermissions'
];

export enum SiteSettingsGroup {
    Customization = 'Customization', 
    Galleries = 'Galleries', 
    SiteAdministration = 'SiteAdministration', 
    SiteCollectionAdmin = 'SiteCollectionAdmin', 
    UsersAndPermissions = 'UsersAndPermissions'
}

export enum AdministrationApplicationsGroup {
    Databases = 'Databases', 
    ServiceApplications = 'ServiceApplications', 
    SiteCollections = 'SiteCollections', 
    WebApplications = 'WebApplications', 

}

export enum AdministrationBackupsGroup {
    FarmBackup = 'FarmBackup', 
    GranularBackup = 'GranularBackup',
}

export enum ConfigurationWizardsGroup {
    FarmConfiguration = 'FarmConfiguration', 
}

export type CustomActionLocation = "DisplayFormToolbar" | "EditControlBlock" | "EditFormToolbar" |
    "NewFormToolbar" | "ViewToolbar" |
    "Microsoft.SharePoint.StandardMenu" | "CommandUI.Ribbon.ListView" |
    "CommandUI.Ribbon.NewForm" | "CommandUI.Ribbon.EditForm" |
    "CommandUI.Ribbon.DisplayForm" | "CommandUI.Ribbon" | "Microsoft.SharePoint.ContentTypeSettings" |
    "Microsoft.SharePoint.ContentTypeTemplateSettings" | "Microsoft.SharePoint.Create" |
    "Microsoft.SharePoint.GroupsPage" | "Microsoft.SharePoint.ListEdit" |
    "Microsoft.SharePoint.ListEdit.DocumentLibrary" | "Microsoft.SharePoint.PeoplePage" |
    "Microsoft.SharePoint.SiteSettings" | "Microsoft.SharePoint.Administration.Applications" |
    "Microsoft.SharePoint.Administration.Backups" |
    "Microsoft.SharePoint.Administration.ConfigurationWizards" | "Microsoft.SharePoint.Administration.Default" |
    "Microsoft.SharePoint.Administration.GeneralApplicationSettings" | "Microsoft.SharePoint.Administration.Monitoring" |
    "Microsoft.SharePoint.Administration.Security" | "Microsoft.SharePoint.Administration.SystemSettings" |
    "Microsoft.SharePoint.Administration.UpgradeAndMigration"; 

export type CustomActionRight = "ViewListItems" |
    "EmptyMask" |
    "AddListItems" |
    "EditListItems" |
    "DeleteListItems" |
    "ApproveItems" |
    "OpenItems" |
    "ViewVersions" |
    "DeleteVersions" |
    "CancelCheckout" |
    "ManagePersonalViews" |
    "ManageLists" |
    "ViewFormPages" |
    "AnonymousSearchAccessList" |
    "Open" |
    "ViewPages" |
    "AddAndCustomizePages" |
    "ApplyThemeAndBorder" |
    "ApplyStyleSheets" |
    "ViewUsageData" |
    "CreateSSCSite" |
    "ManageSubwebs" |
    "CreateGroups" |
    "ManagePermissions" |
    "BrowseDirectories" |
    "BrowseUserInfo" |
    "AddDelPrivateWebParts" |
    "UpdatePersonalWebParts" |
    "ManageWeb" |
    "AnonymousSearchAccessWebLists" |
    "UseClientIntegration" |
    "UseRemoteAPIs" |
    "ManageAlerts" |
    "CreateAlerts" |
    "EditMyUserInfo" |
    "EnumeratePermissions" |
    "FullMask";
export interface UserCustomAction {
    name: string;
    description: string;
    requiredAdmin?: "Delegated" | "Farm" | "Machine"; 
    controlAssembly?:string; 
    controlClass?:string;
    controlSrc?:string;
    registrationType?: "None" | "List" | "ContentType" | "ProgId" | "FileType";
    registrationId?: string;
    /**
     * For a complete list have a look at https://msdn.microsoft.com/en-us/library/office/bb802730.aspx
     */
    location?: CustomActionLocation; 
    sequence?: number;
    showInLists?:boolean;
    requireSiteAdministrator?:boolean;
    showInReadOnlyContentTypes?:boolean;
    showInSealedContentTypes?:boolean;
    uIVersion?:number;
    featureId?:string;
    imageUrl?:string;
    addParamsToUrl?:boolean;
    commandUIExtensionFile?:string;
    groupId?: StandardMenuGroup | ContentTypeSettingsGroup | CreateGroup | GroupsPage | 
    ListEditGroup | DocumentLibraryGroup | PeoplePageGroup | SiteSettingsGroup | 
    AdministrationApplicationsGroup | AdministrationBackupsGroup | ConfigurationWizardsGroup;
    rights?: CustomActionRight[];
    scriptBlock?:string;
    scriptSrc?:string; 
    rootWebOnly?:boolean;
    title?: string;
    url?: string;
    enabled?: boolean;
}