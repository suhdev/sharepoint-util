import { Security } from './security';
export interface DataRow {
    data: {
        [idx: string]: any;
    };
    security: Security;
}
