export interface Term {
    id: string;
    name: string;
    customProperties?: {
        [idx: string]: string;
    };
    localCustomProperties?: {
        [idx: string]: string;
    };
    linkUrl?: string;
    url?: string;
    link?: string;
    linkTitle?: string;
    linkLabel?: string;
}
