import { Security } from './security';
export interface Folder {
    children?: Folder[];
    name: string;
    security?: Security;
}
