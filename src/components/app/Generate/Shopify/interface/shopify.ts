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
    Default?: any 
}

export interface ISettingsData {
    current?: string | object,
    presets?: ISettingsDataItem
}

export interface IThemeBody {
    id?: string | undefined,
    themeNames?: boolean,
    pages?: boolean,
    settingsData?: boolean,
    settingsSchema?: boolean
}

export interface IViewReq {
    theme_id?: string,
    settings_data: Record<string, any>,
    main?: Record<string, any>,
    themeContent?: Record<string, any> 
}
