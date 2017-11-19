export interface NavLink {
    isExternal?: boolean;
    title: string;
    url?: string;
    items?: NavLink[];
}
export interface StructuralNavigation {
    removeExistingNodes?: boolean;
    items: NavLink[];
}
export interface NavigationItem {
    type: "Managed" | "Structural";
    termStoreId?: string;
    termSetId?: string;
    structural?: StructuralNavigation;
}
export interface Navigation {
    global?: NavigationItem;
    current?: NavigationItem;
}
