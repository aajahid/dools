import { nativeImage } from "electron";

export type Programs = {
    filename       : string;
    shortcutDetails: Electron.ShortcutDetails;
}

export interface DoolsPlugin {
    name       : string;
    path       : string;
    description: string;
    author     : string;
    key        : string;
}

export interface PluginProps {
    query: string;
}

export interface Dictionary<T> {
    [Key: string]: T;
}

export type ProgramIcon = null | string;