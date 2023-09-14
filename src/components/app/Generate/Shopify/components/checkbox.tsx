import type { ISchemaItem } from "../interface/shopify";

const CheckboxComp = ({ data, settings, handleChangeFields }: { data: ISchemaItem, settings: any, handleChangeFields: (e: any) => void }) => {

    return (
        <div className="form-check form-switch mb-2">
            <input type="checkbox" id={`${data.label.replace(' ', '-').toLowerCase()}-${data.id}`} onChange={handleChangeFields} name={data.id} className="form-check-input" role="switch" checked={settings[data.id]} />
            <label className="form-check-label" htmlFor={`${data.label.replace(' ', '-').toLowerCase()}-${data.id}`}>{data.label}</label>
        </div>
    )

}

export default CheckboxComp;