import type { ISchemaItem } from "../interface/shopify";

const ColorComp = ({ data, settings, filedName, handleChangeFields }: { data: ISchemaItem, settings: any, filedName: string | undefined, handleChangeFields: (e: any) => void }) => {

    return (
        <div className="row align-items-center m-0 mb-1 p-0">
            <div className="col-9 p-0">
                <div className="form-floating">
                    <input type="text" className="form-control" name={`${filedName}.${data.id}`} onChange={handleChangeFields} value={settings[data.id]} />
                    <label>{data.label}</label>
                </div>
            </div>
            <div className="col-3 p-0">
                <input type="color" style={{height: "58px", width: "100%"}} className="form-control form-control-color" id={data.id} onChange={handleChangeFields} name={`${filedName}.${data.id}`} value={settings[data.id]} />
            </div>
        </div>
    )

}

export default ColorComp;