export interface Command {
    
}

export interface CommandParam {
    name:string; 
    value:any; 
    isString?:boolean;
}

export interface CustomCommand extends Command {
    fn:string; 
    params:CommandParam[];
}