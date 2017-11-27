export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.substr(1);
}

export function lowerize(str: string) {
    return str.charAt(0).toLowerCase() + str.substr(1);
}

export function removeSpaces(str: string) {
    return str.replace(/[\s]+/g, '');
}

export function parenthesize(str: string) {
    return `{${str}}`;
}

export function getAttr(field: any, ...fieldNames: string[]) {
    var name = null;
    var val = fieldNames.find((e, i) => {
        return ((name = e) && typeof field[name] !== "undefined") ||
            ((name = e.toLowerCase()) && typeof field[name] !== "undefined") ||
            ((name = lowerize(e)) && typeof field[lowerize(e)] !== "undefined") ||
            ((name = capitalize(e)) && typeof field[capitalize(e)] !== "undefined") ||
            ((name = e.toUpperCase()) && typeof field[e.toUpperCase()] !== "undefined");
    });
    if (val) {
        return field[name];
    }
    return undefined;
}

export function hasAttr(field: any, ...fieldNames: string[]) {
    var found = fieldNames.find((e, i) => {
        return typeof field[e] !== "undefined" ||
            typeof field[e.toLowerCase()] !== "undefined" ||
            typeof field[lowerize(e)] !== "undefined" ||
            typeof field[capitalize(e)] !== "undefined" ||
            typeof field[e.toUpperCase()] !== "undefined";
    });
    if (found) {
        return true;
    }
    return false;
}

export function isString(val:any){
    return typeof val === 'string'; 
}

export function isObject(val:any){
    return typeof val === "object";
}

export function hasItems(obj:any,...fieldNames:string[]){
    let val = getAttr(obj,...fieldNames); 
    return (val && val.length > 0)?true:false; 
}