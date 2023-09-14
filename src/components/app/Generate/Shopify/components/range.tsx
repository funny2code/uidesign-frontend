import type { ISchemaItem } from "../interface/shopify";

const RangeComp = ({ data, settings, handleChangeFields }: { data: ISchemaItem, settings: any, handleChangeFields: (e: any) => void }) => {

    return (
        <div className="row align-items-center m-0 p-0 mb-2">
            <div className="col-12 p-0 mb-1">
                <label className="form-label">{data.label}</label>
            </div>
            <div className="col-10 p-0">
                <input type="range" className="form-range" onChange={handleChangeFields} name={data.id} value={settings[data.id]} min={data.min} max={data.max} step={data.step} />
            </div>
            <div className="col-2 p-0 text-end">
                <span>{settings[data.id] + data.unit}</span>
            </div>
        </div>
    )

}

export default RangeComp;