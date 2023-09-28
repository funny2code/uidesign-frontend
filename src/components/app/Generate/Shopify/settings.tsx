import type { ISchemaItem, ISettingsDataItem } from './interface/shopify';
import ColorSchemeGroup from './components/color-scheme-group';
import ColorSchema from './components/color-schema';
import TextComp from './components/text';
import RangeComp from './components/range';
import ColorComp from './components/color';
import SelectComp from './components/select';
import RichtextComp from './components/richtext';
import CheckboxComp from './components/checkbox';

const Settings = ({ data, schema, handleChangeFields, sendSettingsFunc }: { data: ISettingsDataItem, schema: ISchemaItem[], handleChangeFields: (e: any) => void, sendSettingsFunc: () => void }) => {

    return (
        <>
            {
                schema && schema.map((schemaItem, index) => {
                    if (schemaItem.type === 'color_scheme_group') {
                        return <ColorSchemeGroup
                            key={schemaItem.type + "_" + index}
                            data={schemaItem}
                            settings={data}
                            handleChangeFields={handleChangeFields}
                            sendSettingsFunc={sendSettingsFunc}
                        />
                    } else if (schemaItem.type === 'color_scheme') {
                        return <ColorSchema
                            key={schemaItem.type + "_" + index}
                            data={schemaItem}
                            settings={data}
                            handleChangeFields={handleChangeFields}
                            sendSettingsFunc={sendSettingsFunc}
                        />
                    } else if (schemaItem.type === 'color') {
                        return <ColorComp
                            key={schemaItem.type + "_" + index}
                            data={schemaItem}
                            settings={data}
                            filedName={undefined}
                            handleChangeFields={handleChangeFields}
                            sendSettingsFunc={sendSettingsFunc}
                        />
                    } else if (schemaItem.type === 'text') {
                        return <TextComp
                            key={schemaItem.type + "_" + index}
                            data={schemaItem}
                            settings={data}
                            handleChangeFields={handleChangeFields}
                            sendSettingsFunc={sendSettingsFunc}
                        />
                    } else if (schemaItem.type === 'select') {
                        return <SelectComp 
                            key={schemaItem.type + "_" + index}
                            data={schemaItem}
                            settings={data}
                            handleChangeFields={handleChangeFields}
                            sendSettingsFunc={sendSettingsFunc}
                        />
                    } else if (schemaItem.type === 'range') {
                        return <RangeComp
                            key={schemaItem.type + "_" + index}
                            data={schemaItem}
                            settings={data}
                            handleChangeFields={handleChangeFields}
                            sendSettingsFunc={sendSettingsFunc}
                        />
                    } else if (schemaItem.type === 'checkbox') {
                        return <CheckboxComp
                            key={schemaItem.type + "_" + index}
                            data={schemaItem}
                            settings={data}
                            handleChangeFields={handleChangeFields}
                            sendSettingsFunc={sendSettingsFunc}
                        />
                    } else if (schemaItem.type === 'richtext' || schemaItem.type === 'textarea') {
                        return <RichtextComp
                            key={schemaItem.type + "_" + index}
                            data={schemaItem}
                            settings={data}
                            handleChangeFields={handleChangeFields}
                            sendSettingsFunc={sendSettingsFunc}
                        />
                    } else {
                        return (<input key={schemaItem.type + "_" + index} type="hidden" name={schemaItem.id} value={data[schemaItem.id]}/>)
                    }
                })
            }
        </>
    )
}
export default Settings;