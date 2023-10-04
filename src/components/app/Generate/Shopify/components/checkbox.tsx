import type { ISchemaItem } from "../interface/shopify";

const CheckboxComp = ({ data, settings, handleChangeFields, sendSettingsFunc }: { data: ISchemaItem, settings: any, handleChangeFields: (e: any) => void, sendSettingsFunc: () => void }) => {

    return (
        <div className="form-check form-switch mb-2">
            <input 
                type="checkbox" 
                id={`${data.label.replace(' ', '-').toLowerCase()}-${data.id}`}
                onBlur={sendSettingsFunc} 
                onChange={(e) => handleChangeFields(e)} 
                name={data.id} 
                className="form-check-input" 
                role="switch" 
                checked={settings[data.id]} 
            />
            <label className="form-check-label" htmlFor={`${data.label.replace(' ', '-').toLowerCase()}-${data.id}`}>{data.label}</label>
        </div>
    )

}

export default CheckboxComp;