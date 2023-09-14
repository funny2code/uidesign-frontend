import type { ISettingsData, ISchemaItem } from './interface/shopify';
import ColorSchemeGroup from './components/color-scheme-group';
import ColorSchema from './components/color-schema';
import TextComp from './components/text';
import RangeComp from './components/range';
import ColorComp from './components/color';
import SelectComp from './components/select';
import RichtextComp from './components/richtext';
import CheckboxComp from './components/checkbox';

const Settings = ({ data, schema, handleChangeFields }: { data: ISettingsData, schema: ISchemaItem[], handleChangeFields: (e: any) => void }) => {

    const settings = data.presets?.Default;

    return (
        <>
            {
                schema && schema.map((schemaItem, index) => {
                    if (schemaItem.type === 'color_scheme_group') {
                        return <ColorSchemeGroup
                            key={schemaItem.type + "_" + index}
                            data={schemaItem}
                            settings={settings}
                            handleChangeFields={handleChangeFields}
                        />
                    } else if (schemaItem.type === 'color_scheme') {
                        return <ColorSchema
                            key={schemaItem.type + "_" + index}
                            data={schemaItem}
                            settings={settings}
                            handleChangeFields={handleChangeFields}
                        />
                    } else if (schemaItem.type === 'color') {
                        return <ColorComp
                            key={schemaItem.type + "_" + index}
                            data={schemaItem}
                            settings={settings}
                            filedName={undefined}
                            handleChangeFields={handleChangeFields}
                        />
                    } else if (schemaItem.type === 'text') {
                        return <TextComp
                            key={schemaItem.type + "_" + index}
                            data={schemaItem}
                            settings={settings}
                            handleChangeFields={handleChangeFields}
                        />
                    } else if (schemaItem.type === 'select') {
                        return <SelectComp 
                            key={schemaItem.type + "_" + index}
                            data={schemaItem}
                            settings={settings}
                            handleChangeFields={handleChangeFields}
                        />
                    } else if (schemaItem.type === 'range') {
                        return <RangeComp
                            key={schemaItem.type + "_" + index}
                            data={schemaItem}
                            settings={settings}
                            handleChangeFields={handleChangeFields}
                        />
                    } else if (schemaItem.type === 'checkbox') {
                        return <CheckboxComp
                            key={schemaItem.type + "_" + index}
                            data={schemaItem}
                            settings={settings}
                            handleChangeFields={handleChangeFields}
                        />
                    } else if (schemaItem.type === 'richtext' || schemaItem.type === 'textarea') {
                        return <RichtextComp
                            key={schemaItem.type + "_" + index}
                            data={schemaItem}
                            settings={settings}
                            handleChangeFields={handleChangeFields}
                        />
                    } else {
                        return (<input key={schemaItem.type + "_" + index} type="hidden" name={schemaItem.id} value={settings[schemaItem.id]}/>)
                    }
                })
            }
        </>
    )
}
export default Settings;