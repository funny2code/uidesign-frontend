import { OpenAPI, V2DocumentsService } from "../../../../client";
import type { SectionComponentProps, ComponentData } from "./types";
import { useSession } from "../../../auth/useSession";
import type { Tokens } from "../../../auth/storage";
import { FormComponent } from "./FormComponent";
import { useState, useEffect } from "react";
import { useRef } from "react";

const LIMIT = 40;
const componentTypes: { name: string; value: string }[] = [
  {
    name: "lumina",
    value: "content_slot",
  },
  {
    name: "tailwind",
    value: "tailwind_component",
  },
  {
    name: "mobile",
    value: "mobile_component",
  },
];
export const SectionComponents = ({
  category,
  description,
  tokens,
  values,
  hasPreMessage = true,
}: SectionComponentProps) => {
  const { getSession } = useSession();
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [selected, setSelected] = useState<ComponentData | null>(null);
  const [componentType, setComponentType] = useState<{ name: string; value: string }>(componentTypes[0]);
  const [token, setTokens] = useState<Tokens>(tokens);
  const ref = useRef<HTMLInputElement>(null);
  const fetchSpecificComponent = async (id?: string) => {
    if (id) {
      const session = await getSession();
      OpenAPI.TOKEN = session.id_token;
      setTokens(session);
      const res = await V2DocumentsService.readUserDocumentV2UserDocumentsIdGet(id);
      setSelected(res.result as ComponentData);
    }
  };
  const fetchComponentNames = async (id?: string) => {
    const session = await getSession();
    OpenAPI.TOKEN = session.id_token;
    setTokens(session);
    const res = await V2DocumentsService.readUserDocumentsV2UserDocumentsGet(
      0,
      LIMIT,
      // @ts-ignore
      componentType.value,
      true
    );
    res.result.sort((a, b) => {
      const aIndex = values.indexOf(a.tags[0]);
      const bIndex = values.indexOf(b.tags[0]);
      return aIndex - bIndex;
    });
    const config = res.result as ComponentData[];
    setComponents(config);
    await fetchSpecificComponent(id || config[0].id);
  };
  const deleteComponent = async (id: string) => {
    const session = await getSession();
    OpenAPI.TOKEN = session.id_token;
    setTokens(session);
    await V2DocumentsService.deleteUserDocumentV2UserDocumentsIdDelete(id);
    await fetchComponentNames();
  };
  const createComponent = async (name: string) => {
    const session = await getSession();
    OpenAPI.TOKEN = session.id_token;
    setTokens(session);
    const res = await V2DocumentsService.createUserDocumentV2UserDocumentsPost({
      name: name,
      public: true,
      url: "",
      img_url: "",
      description: name,
      // @ts-ignore TODO: update client
      type: componentType.value,
      tags: [name],
      data: {
        config: JSON.stringify(
          {
            name: "Component",
            description: "Component Description",
            elements: [],
          },
          null,
          2
        ),
        markup: "<section>\n</section>",
      },
    });
    await fetchComponentNames(res.id);
  };
  useEffect(() => {
    fetchComponentNames();
    console.log(componentType);
  }, [componentType]);
  return (
    <section className="vstack gap-1">
      <span className="form-text">Content Components {`(max ${LIMIT} per page)`}</span>
      <div className="hstack gap-2">
        <div className="w-50">
          {
            <select
              className="form-select"
              value={selected?.id}
              onChange={e => {
                const id = e.target.value;
                fetchSpecificComponent(id);
              }}
            >
              {components.length > 0 &&
                components.map((doc, i) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
            </select>
          }
        </div>
        <div className="w-25">
          <select
            className="form-select"
            value={componentType.name}
            onChange={e =>
              setComponentType(prev => {
                const sel = componentTypes.find(val => val.name === e.target.value);
                return { name: e.target.value, value: sel?.value || prev.value };
              })
            }
          >
            {componentTypes.map((val, i) => (
              <option key={i} value={val.name}>
                {val.name}
              </option>
            ))}
          </select>
        </div>
        <div className="hstack gap-2">
          <button
            className="btn btn-secondary"
            onClick={() => {
              createComponent("Component");
            }}
          >
            New
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              if (confirm(`Delete ${selected?.name}?`)) {
                deleteComponent(selected?.id || "");
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
      <section
        ref={ref}
        className={`${hasPreMessage ? "vstack" : "hstack"} gap-2`}
        style={{ width: "100%", height: "100%", overflow: "scroll" }}
      >
        {selected && ref?.current && (
          <FormComponent
            key={selected.id}
            category={componentType.name}
            tokens={token}
            doc={selected}
            acallback={async (id: string) => {
              await fetchComponentNames(id);
            }}
            width={ref.current.clientWidth}
            height={ref.current.clientHeight}
          />
        )}
      </section>
    </section>
  );
};
