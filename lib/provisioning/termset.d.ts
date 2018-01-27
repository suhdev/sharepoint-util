import { Term } from './term';
export interface TermSet {
    id: string;
    name: string;
    terms?: Term[];
    isDeprecated?: boolean;
    language?: number;
    lang?: number;
    isNavigation?: boolean;
    navigation?: boolean;
    nav?: boolean;
    linkUrl?: string;
    url?: string;
    link?: string;
    linkTitle?: string;
    linkLabel?: string;
    labels?: {
        [idx: string]: string;
    };
    customProperties?: {
        [idx: string]: string;
    };
    localCustomProperties?: {
        [idx: string]: string;
    };
}
