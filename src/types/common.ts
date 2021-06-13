import { nativeImage } from "electron";

export type Programs = {
    filename       : string;
    shortcutDetails: Electron.ShortcutDetails;
}


export type ProgramIcon = null | string;