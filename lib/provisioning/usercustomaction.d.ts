export declare const StandardMenuGroupList: string[];
export declare enum StandardMenuGroup {
    ActionsMenu = "ActionMenu",
    ActionsMenuForSurvey = "ActionsMenuForSurvey",
    SettingsMenuForSurvey = "SettingsMenuForSurvey",
    SiteActions = "SiteActions"
}
export declare const CustomActionLocationList: string[];
export declare const ContentTypeSettingsGroupList: string[];
export declare enum ContentTypeSettingsGroup {
    Fields = "Fields",
    General = "General"
}
export declare const CreateGroupList: string[];
export declare enum CreateGroup {
    WebPages = "WebPages"
}
export declare const GroupsPageList: string[];
export declare enum GroupsPage {
    NewMenu = "NewMenu",
    SettingsMenu = "SettingsMenu"
}
export declare const ListEditGroupList: string[];
export declare enum ListEditGroup {
    Communications = "Communications",
    GeneralSettings = "GeneralSettings",
    Permissions = "Permissions"
}
export declare const DocumentLibraryGroupList: string[];
export declare enum DocumentLibraryGroup {
    GeneralSettings = "GeneralSettings"
}
export declare const PeoplePageGroupList: string[];
export declare enum PeoplePageGroup {
    ActionsMenu = "ActionsMenu",
    NewMenu = "NewMenu",
    SettingsMenu = "SettingsMenu"
}
export declare const SiteSettingsGroupList: string[];
export declare enum SiteSettingsGroup {
    Customization = "Customization",
    Galleries = "Galleries",
    SiteAdministration = "SiteAdministration",
    SiteCollectionAdmin = "SiteCollectionAdmin",
    UsersAndPermissions = "UsersAndPermissions"
}
export declare enum AdministrationApplicationsGroup {
    Databases = "Databases",
    ServiceApplications = "ServiceApplications",
    SiteCollections = "SiteCollections",
    WebApplications = "WebApplications"
}
export declare enum AdministrationBackupsGroup {
    FarmBackup = "FarmBackup",
    GranularBackup = "GranularBackup"
}
export declare enum ConfigurationWizardsGroup {
    FarmConfiguration = "FarmConfiguration"
}
export declare type CustomActionLocation = "DisplayFormToolbar" | "EditControlBlock" | "EditFormToolbar" | "NewFormToolbar" | "ViewToolbar" | "Microsoft.SharePoint.StandardMenu" | "CommandUI.Ribbon.ListView" | "CommandUI.Ribbon.NewForm" | "CommandUI.Ribbon.EditForm" | "CommandUI.Ribbon.DisplayForm" | "CommandUI.Ribbon" | "Microsoft.SharePoint.ContentTypeSettings" | "Microsoft.SharePoint.ContentTypeTemplateSettings" | "Microsoft.SharePoint.Create" | "Microsoft.SharePoint.GroupsPage" | "Microsoft.SharePoint.ListEdit" | "Microsoft.SharePoint.ListEdit.DocumentLibrary" | "Microsoft.SharePoint.PeoplePage" | "Microsoft.SharePoint.SiteSettings" | "Microsoft.SharePoint.Administration.Applications" | "Microsoft.SharePoint.Administration.Backups" | "Microsoft.SharePoint.Administration.ConfigurationWizards" | "Microsoft.SharePoint.Administration.Default" | "Microsoft.SharePoint.Administration.GeneralApplicationSettings" | "Microsoft.SharePoint.Administration.Monitoring" | "Microsoft.SharePoint.Administration.Security" | "Microsoft.SharePoint.Administration.SystemSettings" | "Microsoft.SharePoint.Administration.UpgradeAndMigration";
export declare type CustomActionRight = "ViewListItems" | "EmptyMask" | "AddListItems" | "EditListItems" | "DeleteListItems" | "ApproveItems" | "OpenItems" | "ViewVersions" | "DeleteVersions" | "CancelCheckout" | "ManagePersonalViews" | "ManageLists" | "ViewFormPages" | "AnonymousSearchAccessList" | "Open" | "ViewPages" | "AddAndCustomizePages" | "ApplyThemeAndBorder" | "ApplyStyleSheets" | "ViewUsageData" | "CreateSSCSite" | "ManageSubwebs" | "CreateGroups" | "ManagePermissions" | "BrowseDirectories" | "BrowseUserInfo" | "AddDelPrivateWebParts" | "UpdatePersonalWebParts" | "ManageWeb" | "AnonymousSearchAccessWebLists" | "UseClientIntegration" | "UseRemoteAPIs" | "ManageAlerts" | "CreateAlerts" | "EditMyUserInfo" | "EnumeratePermissions" | "FullMask";
export interface UserCustomAction {
    name: string;
    description: string;
    requiredAdmin?: "Delegated" | "Farm" | "Machine";
    controlAssembly?: string;
    controlClass?: string;
    controlSrc?: string;
    registrationType?: "None" | "List" | "ContentType" | "ProgId" | "FileType";
    registrationId?: string;
    /**
     * For a complete list have a look at https://msdn.microsoft.com/en-us/library/office/bb802730.aspx
     */
    location?: CustomActionLocation;
    sequence?: number;
    showInLists?: boolean;
    requireSiteAdministrator?: boolean;
    showInReadOnlyContentTypes?: boolean;
    showInSealedContentTypes?: boolean;
    uIVersion?: number;
    featureId?: string;
    imageUrl?: string;
    addParamsToUrl?: boolean;
    commandUIExtensionFile?: string;
    groupId?: StandardMenuGroup | ContentTypeSettingsGroup | CreateGroup | GroupsPage | ListEditGroup | DocumentLibraryGroup | PeoplePageGroup | SiteSettingsGroup | AdministrationApplicationsGroup | AdministrationBackupsGroup | ConfigurationWizardsGroup;
    rights?: CustomActionRight[];
    scriptBlock?: string;
    scriptSrc?: string;
    rootWebOnly?: boolean;
    title?: string;
    url?: string;
    enabled?: boolean;
}
