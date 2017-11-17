import * as colors from 'colors/safe';
export function log(operation: string, msg: string) {
    console.log(`[${colors.gray((new Date()).toISOString().substr(11, 8))}]: ${colors.magenta(operation)} - ${colors.cyan(msg)}`);
    return '';
}

export function logError(operation:string, msg:string){
    console.log(`[${colors.gray((new Date()).toISOString().substr(11, 8))}]: ${colors.red(operation)} - ${colors.red(msg)}`);
    return '';
}