import type { ISchemaItem } from "../interface/shopify";
import ColorComp from "./color";

const ColorSchemeGroup = ({ data, settings, handleChangeFields }: { data: ISchemaItem, settings: any, handleChangeFields: (e: any) => void }) => {
    return (
        <>
            {Object.keys(settings[data.id]).map((item, key) =>
                <div key={key}>
                    <div className="alert alert-primary text-center mb-1" role="alert">
                        {item}
                    </div>
                    <div className="mb-3">
                        {
                            data?.definition?.map((i, index) => {
                                if (i.type === "color" || i.type === "color_background") {
                                    return <ColorComp
                                        key={index}
                                        data={i}
                                        settings={settings[data.id][item].settings}
                                        filedName={`${data.id}.${item}.settings`}
                                        handleChangeFields={handleChangeFields}
                                    />
                                }
                            })
                        }
                    </div>
                </div>
            )}
        </>
    )

}

export default ColorSchemeGroup;