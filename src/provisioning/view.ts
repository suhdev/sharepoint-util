export interface Aggregation{
    name:string;
    type:string;
}
export interface View {
    name:string;
    displayName:string; 
    defaultView?:boolean; 
    mobileView?:boolean; 
    type:string;
    useAbsoluteUrl?:boolean;
    viewFields?:string[]; 
    rowLimit?:number;
    jsLink?:string[]; 
    xslLink?:string;
    toolbar?: "FreeForm" |"Standard";
    aggregations?:Aggregation[];
    position?:"After";
    newFormUrl?:string;
    editFormUrl?:string; 
    displayFormUrl?:string;
}