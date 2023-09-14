import { OpenAPI, V2DocumentsService, DOCUMENT_TYPE } from "../../../../client";
import type { Tokens } from "../../../auth/storage";
import { useState, useEffect, useRef } from "react";
import { Form, ConfigData } from "./Form";
import { FormComponent } from "./FormComponent";

interface SectionElementProps {
    category: string;
    description: string;
    tokens: Tokens;
    values: string[];
    hasPreMessage?: boolean;
}
export const SectionElement = ({category, description, tokens, values, hasPreMessage=true}: SectionElementProps) => {
    const [config, setConfig] = useState<ConfigData[]>([]);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        OpenAPI.TOKEN = tokens.id_token;
        V2DocumentsService.readUserDocumentsV2UserDocumentsGet(
            0, values.length, DOCUMENT_TYPE.ADMIN_CONFIG_FILE, false, 
            undefined, 0.85,
            undefined, undefined, 
            values
        )
        .then(res => {
            // sort results by tag position in values, assuming first tag is value
            res.result.sort((a, b) => {
                const aIndex = values.indexOf(a.tags[0]);
                const bIndex = values.indexOf(b.tags[0]);
                return aIndex - bIndex;
            })
            const config = res.result as ConfigData[];
            setConfig(config);
        })
    }, []);
    return (
        <section className="vstack gap-1">
            <span className="form-text">{description}</span>
            <section 
                ref={ref}
                className={`${hasPreMessage ? 'vstack' : 'hstack'} gap-2`}
                style={{width: '100%', height: '100%', overflow: "scroll"}}
            >
            {
                config.length == values.length && values.map((value, i) => (
                tokens &&
                ref?.current &&
                    <Form
                        key={value}
                        type={value}
                        category={category}
                        tokens={tokens}
                        document={config[i]}
                        hasPreMessage={hasPreMessage}
                        width={ref.current.clientWidth}
                        height={ref.current.clientHeight}
                    />
                ))
            }
            </section>
        </section>
    )
}