export interface Security {
    copyRoleAssignments?: boolean;
    clearScores?: boolean;
    roles?: {
        [idx: string]: string;
    };
    roleAssignments?: {
        [idx: string]: string;
    };
}
