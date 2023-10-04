import type { ISchemaItem } from "../interface/shopify";

const ColorSchema = ({data, settings, handleChangeFields, sendSettingsFunc}: {data: ISchemaItem, settings: any, handleChangeFields: (e: any) => void, sendSettingsFunc: () => void}) => {

    return (
        <div className="py__settings-item">
            <div className="py__settings-item-header">
                <label>{data.label}</label>
            </div>
            <div className="py__comp-select">
                <select 
                    defaultValue={settings[data.id]} 
                    name={data.id} 
                    data-type="select" 
                    onBlur={sendSettingsFunc}
                    onChange={(e) => handleChangeFields(e)}
                >
                    { Object.keys(settings.color_schemes).map((color,key) => <option key={key} value={color}>{color}</option>) }
                </select>
            </div>
        </div>
    )

} 

export default ColorSchema;