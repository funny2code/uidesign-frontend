import type { ISchemaItem } from "../interface/shopify";

const SelectComp = ({data, settings, handleChangeFields, sendSettingsFunc}: {data: ISchemaItem, settings: any, handleChangeFields: (e: any) => void, sendSettingsFunc: () => void}) => {

    return (
        <div className="form-floating">
            <select 
                defaultValue={settings[data.id]} 
                id={`${data.label.replace(' ', '-').toLowerCase()}-${data.id}`} 
                className="form-select" name={data.id} 
                onChange={(e) => handleChangeFields(e)}
                onBlur={sendSettingsFunc}
            >
                { data?.options?.map((option,key) => <option key={key} value={option.value}>{option.label}</option>) }
            </select>
            <label htmlFor={`${data.label.replace(' ', '-').toLowerCase()}-${data.id}`}>{data.label}</label>
        </div>
    )

} 

export default SelectComp;