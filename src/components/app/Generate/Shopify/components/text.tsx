import type { ISchemaItem } from "../interface/shopify";

const TextComp = ({data, settings, handleChangeFields, sendSettingsFunc}: {data: ISchemaItem, settings: any, handleChangeFields: (e: any) => void, sendSettingsFunc: () => void}) => {

    return (
        <div className="form-floating mb-2">
            <input 
                type="text" 
                onBlur={sendSettingsFunc}
                onChange={(e) => handleChangeFields(e)}
                name={data.id} 
                className="form-control" 
                value={settings[data.id]} 
            />
            <label>{data.label}</label>
        </div>
    )

} 

export default TextComp;