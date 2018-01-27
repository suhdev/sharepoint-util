import { TermSet } from './termset';
export interface TermGroup {
    name: string;
    id?: string;
    termSets: TermSet[];
    contributors: string[] | any[];
    managers: string[] | any[];
}
