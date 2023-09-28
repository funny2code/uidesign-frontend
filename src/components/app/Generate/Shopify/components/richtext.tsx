import type { ISchemaItem } from "../interface/shopify";

const RichtextComp = ({ data, settings, handleChangeFields, sendSettingsFunc }: { data: ISchemaItem, settings: any, handleChangeFields: (e: any) => void, sendSettingsFunc: () => void }) => {

    return (
        <div className="form-floating mb-2">
            <textarea 
                id={`${data.label.replace(' ', '-').toLowerCase()}-${data.id}`} 
                className="form-control" 
                onBlur={sendSettingsFunc}
                onChange={(e) => handleChangeFields(e)} 
                name={data.id} 
                value={settings[data.id]}
            ></textarea>
            <label htmlFor={`${data.label.replace(' ', '-').toLowerCase()}-${data.id}`}>{data.label}</label>
        </div>
    )

}

export default RichtextComp;