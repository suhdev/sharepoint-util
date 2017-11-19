"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuiltInContentTypeList = ["Item",
    "Document",
    "Event",
    "Issue",
    "Announcement",
    "Link",
    "Contact",
    "Message",
    "Task",
    "Workflow History",
    "Post",
    "Comment",
    "Folder",
    "Person",
    "SharePointGroup",
    "Picture",
    "Master Page",
    "Basic Page",
    "Summary Task",
    "Article Page",
    "Page",
    "System Page",
    "Page Layout",
    "Welcome Page"];
exports.BuiltInContentType = {
    Item: '0x01',
    item: '0x01',
    Document: '0x0101',
    document: '0x0101',
    Event: '0x0102',
    event: '0x0102',
    Issue: '0x0103',
    issue: '0x0103',
    Announcement: '0x0104',
    announcement: '0x0104',
    Link: '0x0105',
    link: '0x0105',
    Contact: '0x0106',
    contact: '0x0106',
    Message: '0x0107',
    message: '0x0107',
    Task: '0x0108',
    task: '0x0108',
    WorkflowHistory: '0x0109',
    workflowhistory: '0x0109',
    'Workflow History': '0x0109',
    Post: '0x0110',
    post: '0x0110',
    Comment: '0x0111',
    comment: '0x0111',
    Folder: '0x0120',
    folder: '0x0120',
    Person: '0x010A',
    person: '0x010A',
    SharePointGroup: '0x010B',
    sharepointgroup: '0x010b',
    Picture: '0x010102',
    picture: '0x010102',
    MasterPage: '0x010105',
    masterpage: '0x010105',
    masterPage: '0x010105',
    'Master Page': '0x010105',
    basicPage: '0x010109',
    BasicPage: '0x010109',
    'Basic Page': '0x010109',
    summaryTask: '0x012004',
    SummaryTask: '0x012004',
    'Summary Task': '0x012004',
    articlePage: '0x010100C568DB52D9D0A14D9B2FDCC96666E9F2007948130EC3DB064584E219954237AF3900242457EFB8B24247815D688C526CD44D',
    ArticlePage: '0x010100C568DB52D9D0A14D9B2FDCC96666E9F2007948130EC3DB064584E219954237AF3900242457EFB8B24247815D688C526CD44D',
    articlepage: '0x010100C568DB52D9D0A14D9B2FDCC96666E9F2007948130EC3DB064584E219954237AF3900242457EFB8B24247815D688C526CD44D',
    'Article Page': '0x010100C568DB52D9D0A14D9B2FDCC96666E9F2007948130EC3DB064584E219954237AF3900242457EFB8B24247815D688C526CD44D',
    page: '0x010100C568DB52D9D0A14D9B2FDCC96666E9F2007948130EC3DB064584E219954237AF39',
    Page: '0x010100C568DB52D9D0A14D9B2FDCC96666E9F2007948130EC3DB064584E219954237AF39',
    systemPage: '0x010100C568DB52D9D0A14D9B2FDCC96666E9F2',
    SystemPage: '0x010100C568DB52D9D0A14D9B2FDCC96666E9F2',
    systempage: '0x010100C568DB52D9D0A14D9B2FDCC96666E9F2',
    'System Page': '0x010100C568DB52D9D0A14D9B2FDCC96666E9F2',
    pageLayout: '0x01010007FF3E057FA8AB4AA42FCB67B453FFC100E214EEE741181F4E9F7ACC43278EE811',
    PageLayout: '0x01010007FF3E057FA8AB4AA42FCB67B453FFC100E214EEE741181F4E9F7ACC43278EE811',
    pagelayout: '0x01010007FF3E057FA8AB4AA42FCB67B453FFC100E214EEE741181F4E9F7ACC43278EE811',
    'Page Layout': '0x01010007FF3E057FA8AB4AA42FCB67B453FFC100E214EEE741181F4E9F7ACC43278EE811',
    welcomePage: '0x010100C568DB52D9D0A14D9B2FDCC96666E9F2007948130EC3DB064584E219954237AF390064DEA0F50FC8C147B0B6EA0636C4A7D4',
    WelcomePage: '0x010100C568DB52D9D0A14D9B2FDCC96666E9F2007948130EC3DB064584E219954237AF390064DEA0F50FC8C147B0B6EA0636C4A7D4',
    welcomepage: '0x010100C568DB52D9D0A14D9B2FDCC96666E9F2007948130EC3DB064584E219954237AF390064DEA0F50FC8C147B0B6EA0636C4A7D4',
    'Welcome Page': '0x010100C568DB52D9D0A14D9B2FDCC96666E9F2007948130EC3DB064584E219954237AF390064DEA0F50FC8C147B0B6EA0636C4A7D4',
};
exports.FieldTypes = {
    text: 'Text',
    string: 'Text',
    number: 'Number',
    Number: 'Number',
    longtext: 'Note',
    note: 'Note',
    int: 'Integer',
    integer: 'Integer',
    long: 'Integer',
    double: 'Number',
    date: 'DateTime',
    dateTime: 'DateTime',
    datetime: 'DateTime',
    DateTime: 'DateTime',
    lookup: 'Lookup',
    computed: 'Computed',
    counter: 'Counter',
    currency: 'Currency',
    file: 'File',
    choice: 'Choice',
    bool: 'Boolean',
    boolean: 'Boolean',
    contenttypeid: 'ContentTypeId',
    lookupmulti: 'LookupMulti',
    user: 'User',
    html: "HTML",
    gridchoice: 'GridChoice',
    multichoice: 'MultiChoice',
    multicolumn: 'MultiColumn',
    guid: 'Guid',
    pageseparator: 'PageSeparator',
    recurrence: 'Recurrence',
    threadindex: 'ThreadIndex',
    threading: 'Threading',
    url: 'URL',
    usermulti: 'UserMulti',
    workfloweventtype: 'WorkflowEventType',
    workflowstatus: 'WorkflowStatus',
    taxonomy: 'TaxonomyFieldType',
    Taxonomy: 'TaxonomyFieldType',
    taxonomyField: 'TaxonomyFieldType',
    TaxonomyField: 'TaxonomyFieldType',
    taxonomyfieldtype: 'TaxonomyFieldType',
    taxonomyFieldType: 'TaxonomyFieldType',
    TaxonomyFieldTypeMulti: 'TaxonomyFieldTypeMulti',
    taxonomyfieldtypemulti: 'TaxonomyFieldTypeMulti',
    taxonomyFieldTypeMulti: 'TaxonomyFieldTypeMulti'
};
exports.TemplateTypesList = ["InvalidType",
    "NoListTemplate",
    "GenericList",
    "DocumentLibrary",
    "Survey",
    "Links",
    "Announcements",
    "Contacts",
    "Events",
    "Tasks",
    "DiscussionBoard",
    "PictureLibrary",
    "DataSources",
    "WebTemplateCatalog",
    "UserInformation",
    "WebPartCatalog",
    "ListTemplateCatalog",
    "XMLForm",
    "MasterPageCatalog",
    "NoCodeWorkflows",
    "WorkflowProcess",
    "WebPageLibrary",
    "CustomGrid",
    "SolutionCatalog",
    "NoCodePublic",
    "ThemeCatalog",
    "DesignCatalog",
    "AppDataCatalog",
    "DataConnectionLibrary",
    "WorkflowHistory",
    "GanttTasks",
    "HelpLibrary",
    "AccessRequest",
    "TasksWithTimelineAndHierarchy",
    "MaintenanceLogs",
    "Meetings",
    "Agenda",
    "MeetingUser",
    "Decision",
    "MeetingObjective",
    "TextBox",
    "ThingsToBring",
    "HomePageLibrary",
    "Posts",
    "Comments",
    "Categories",
    "Facility",
    "Whereabouts",
    "CallTrack",
    "Circulation",
    "Timecard",
    "Holidays",
    "IMEDic",
    "ExternalList",
    "MySiteDocumentLibrary",
    "IssueTracking",
    "AdminTasks",
    "HealthRules",
    "HealthReports",
    "DeveloperSiteDraftApps"];
var ListTemplateType;
(function (ListTemplateType) {
    ListTemplateType[ListTemplateType["InvalidType"] = -1] = "InvalidType";
    ListTemplateType[ListTemplateType["NoListTemplate"] = 0] = "NoListTemplate";
    ListTemplateType[ListTemplateType["GenericList"] = 100] = "GenericList";
    ListTemplateType[ListTemplateType["DocumentLibrary"] = 101] = "DocumentLibrary";
    ListTemplateType[ListTemplateType["Survey"] = 102] = "Survey";
    ListTemplateType[ListTemplateType["Links"] = 103] = "Links";
    ListTemplateType[ListTemplateType["Announcements"] = 104] = "Announcements";
    ListTemplateType[ListTemplateType["Contacts"] = 105] = "Contacts";
    ListTemplateType[ListTemplateType["Events"] = 106] = "Events";
    ListTemplateType[ListTemplateType["Tasks"] = 107] = "Tasks";
    ListTemplateType[ListTemplateType["DiscussionBoard"] = 108] = "DiscussionBoard";
    ListTemplateType[ListTemplateType["PictureLibrary"] = 109] = "PictureLibrary";
    ListTemplateType[ListTemplateType["DataSources"] = 110] = "DataSources";
    ListTemplateType[ListTemplateType["WebTemplateCatalog"] = 111] = "WebTemplateCatalog";
    ListTemplateType[ListTemplateType["UserInformation"] = 112] = "UserInformation";
    ListTemplateType[ListTemplateType["WebPartCatalog"] = 113] = "WebPartCatalog";
    ListTemplateType[ListTemplateType["ListTemplateCatalog"] = 114] = "ListTemplateCatalog";
    ListTemplateType[ListTemplateType["XMLForm"] = 115] = "XMLForm";
    ListTemplateType[ListTemplateType["MasterPageCatalog"] = 116] = "MasterPageCatalog";
    ListTemplateType[ListTemplateType["NoCodeWorkflows"] = 117] = "NoCodeWorkflows";
    ListTemplateType[ListTemplateType["WorkflowProcess"] = 118] = "WorkflowProcess";
    ListTemplateType[ListTemplateType["WebPageLibrary"] = 119] = "WebPageLibrary";
    ListTemplateType[ListTemplateType["CustomGrid"] = 120] = "CustomGrid";
    ListTemplateType[ListTemplateType["SolutionCatalog"] = 121] = "SolutionCatalog";
    ListTemplateType[ListTemplateType["NoCodePublic"] = 122] = "NoCodePublic";
    ListTemplateType[ListTemplateType["ThemeCatalog"] = 123] = "ThemeCatalog";
    ListTemplateType[ListTemplateType["DesignCatalog"] = 124] = "DesignCatalog";
    ListTemplateType[ListTemplateType["AppDataCatalog"] = 125] = "AppDataCatalog";
    ListTemplateType[ListTemplateType["DataConnectionLibrary"] = 130] = "DataConnectionLibrary";
    ListTemplateType[ListTemplateType["WorkflowHistory"] = 140] = "WorkflowHistory";
    ListTemplateType[ListTemplateType["GanttTasks"] = 150] = "GanttTasks";
    ListTemplateType[ListTemplateType["HelpLibrary"] = 151] = "HelpLibrary";
    ListTemplateType[ListTemplateType["AccessRequest"] = 160] = "AccessRequest";
    ListTemplateType[ListTemplateType["TasksWithTimelineAndHierarchy"] = 171] = "TasksWithTimelineAndHierarchy";
    ListTemplateType[ListTemplateType["MaintenanceLogs"] = 175] = "MaintenanceLogs";
    ListTemplateType[ListTemplateType["Meetings"] = 200] = "Meetings";
    ListTemplateType[ListTemplateType["Agenda"] = 201] = "Agenda";
    ListTemplateType[ListTemplateType["MeetingUser"] = 202] = "MeetingUser";
    ListTemplateType[ListTemplateType["Decision"] = 204] = "Decision";
    ListTemplateType[ListTemplateType["MeetingObjective"] = 207] = "MeetingObjective";
    ListTemplateType[ListTemplateType["TextBox"] = 210] = "TextBox";
    ListTemplateType[ListTemplateType["ThingsToBring"] = 211] = "ThingsToBring";
    ListTemplateType[ListTemplateType["HomePageLibrary"] = 212] = "HomePageLibrary";
    ListTemplateType[ListTemplateType["Posts"] = 301] = "Posts";
    ListTemplateType[ListTemplateType["Comments"] = 302] = "Comments";
    ListTemplateType[ListTemplateType["Categories"] = 303] = "Categories";
    ListTemplateType[ListTemplateType["Facility"] = 402] = "Facility";
    ListTemplateType[ListTemplateType["Whereabouts"] = 403] = "Whereabouts";
    ListTemplateType[ListTemplateType["CallTrack"] = 404] = "CallTrack";
    ListTemplateType[ListTemplateType["Circulation"] = 405] = "Circulation";
    ListTemplateType[ListTemplateType["Timecard"] = 420] = "Timecard";
    ListTemplateType[ListTemplateType["Holidays"] = 421] = "Holidays";
    ListTemplateType[ListTemplateType["IMEDic"] = 499] = "IMEDic";
    ListTemplateType[ListTemplateType["ExternalList"] = 600] = "ExternalList";
    ListTemplateType[ListTemplateType["MySiteDocumentLibrary"] = 700] = "MySiteDocumentLibrary";
    ListTemplateType[ListTemplateType["IssueTracking"] = 1100] = "IssueTracking";
    ListTemplateType[ListTemplateType["AdminTasks"] = 1200] = "AdminTasks";
    ListTemplateType[ListTemplateType["HealthRules"] = 1220] = "HealthRules";
    ListTemplateType[ListTemplateType["HealthReports"] = 1221] = "HealthReports";
    ListTemplateType[ListTemplateType["DeveloperSiteDraftApps"] = 1230] = "DeveloperSiteDraftApps";
})(ListTemplateType = exports.ListTemplateType || (exports.ListTemplateType = {}));
exports.ListTemplateTypeByValue = {
    '-1': 'InvalidType',
    '0': 'NoListTemplate',
    '100': 'GenericList',
    '101': 'DocumentLibrary',
    '102': 'Survey',
    '103': 'Links',
    '104': 'Announcements',
    '105': 'Contacts',
    '106': 'Events',
    '107': 'Tasks',
    '108': 'DiscussionBoard',
    '109': 'PictureLibrary',
    '110': 'DataSources',
    '111': 'WebTemplateCatalog',
    '112': 'UserInformation',
    '113': 'WebPartCatalog',
    '114': 'ListTemplateCatalog',
    '115': 'XMLForm',
    '116': 'MasterPageCatalog',
    '117': 'NoCodeWorkflows',
    '118': 'WorkflowProcess',
    '119': 'WebPageLibrary',
    '120': 'CustomGrid',
    '121': 'SolutionCatalog',
    '122': 'NoCodePublic',
    '123': 'ThemeCatalog',
    '124': 'DesignCatalog',
    '125': 'AppDataCatalog',
    '130': 'DataConnectionLibrary',
    '140': 'WorkflowHistory',
    '150': 'GanttTasks',
    '151': 'HelpLibrary',
    '160': 'AccessRequest',
    '171': 'TasksWithTimelineAndHierarchy',
    '175': 'MaintenanceLogs',
    '200': 'Meetings',
    '201': 'Agenda',
    '202': 'MeetingUser',
    '204': 'Decision',
    '207': 'MeetingObjective',
    '210': 'TextBox',
    '211': 'ThingsToBring',
    '212': 'HomePageLibrary',
    '301': 'Posts',
    '302': 'Comments',
    '303': 'Categories',
    '402': 'Facility',
    '403': 'Whereabouts',
    '404': 'CallTrack',
    '405': 'Circulation',
    '420': 'Timecard',
    '421': 'Holidays',
    '499': 'IMEDic',
    '600': 'ExternalList',
    '700': 'MySiteDocumentLibrary',
    '1100': 'IssueTracking',
    '1200': 'AdminTasks',
    '1220': 'HealthRules',
    '1221': 'HealthReports',
    '1230': 'DeveloperSiteDraftApps',
};
