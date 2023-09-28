export interface ISchemaOption {
    label: string,
    value: string
}

export interface ISchemaItem {
    type: string,
    id: string,
    label: string,
    default?: string | number | boolean,
    info?: string,
    options?: [ISchemaOption],
    min?: number,
    max?: number,
    unit?: string,
    step?: number,
    definition?: Array<ISchemaItem>
}

export interface ISchema {
    name: string,
    settings?: [ISchemaItem]
}

export interface ISettingsDataItem {
    [key: string]: any;
}

export interface ISettingsData {
    current: string;
    presets: ISettingsDataItem;
}

export interface ThemeContent {
    collection?: Record<string, any>;
}

export interface ITheme {
    settings_data: Record<string, any>;
    templates: {
        [key: string]: Record<string, any>;
    },
    themeContent: ThemeContent;
};

export interface IThemes {
    [key: string]: ITheme;
}

export interface IThemeBody {
    id?: string | undefined;
    themeNames?: boolean;
    currentPage?: string;
    pages?: boolean;
    settingsData?: boolean;
    settingsSchema?: boolean;
}

export interface IViewReq {
    theme_id?: string;
    settings_data: Record<string, any>;
    main?: Record<string, any>;
    themeContent?: Record<string, any>;
}

export interface IDownloadReq {
    theme_id: string;
    settings_data?: Record<string, any>;
    templates?: Record<string, any>;
}
