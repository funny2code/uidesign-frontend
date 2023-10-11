import { useSession } from "../../../auth/useSession";
import type { Tokens } from "../../../auth/storage";
import { useState, useEffect } from "react";
import { SectionElement } from "./Section";
import { SectionComponents } from "./SectionComponents";

const Messages = () => {
  // Auth
  const { getSession } = useSession();
  const sections = {
    dev: "dev",
    prod: "prod",
    styles_system: [6, 7, 8, 9, 10].map(i => `styles_slot_${String(i).padStart(2, "0")}`),
    styles_templates: ["styles_base", "styles_modifier"],
    content_system: ["content_slots", "content_component"],
    content_components: "content_slot",
  };
  const [section, setSection] = useState<string | null>(() => sections.dev);
  // Flow
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const CATEGORIES = {
    dev: "dev",
    prod: "prod",
  };
  const DESCRIPTION = {
    [CATEGORIES.dev]: "Updates dev mode clients.",
    [CATEGORIES.prod]: "Updates production (including plugin if using latest stream).",
  };
  useEffect(() => {
    getSession().then(tokens => {
      setTokens(tokens);
    });
  }, []);
  return (
    <>
      <section className="designer-window hstack flex-grow-1" style={{ overflow: "auto" }}>
        <section className="vstack gap-2 p-0" style={{ marginTop: "-2px", marginLeft: "-2px" }}>
          <ul className="nav nav-tabs">
            {Object.keys(sections).map(s => (
              <li
                className={`nav-link text-dark ${s === section ? "active" : ""}`}
                style={{ cursor: "pointer" }}
                key={s}
                onClick={() => setSection(s)}
              >
                {s.replace("_", " ")}
              </li>
            ))}
          </ul>
          <section className="pb-4 px-4">
            {section === sections.dev && tokens && (
              <SectionElement
                category={CATEGORIES.dev}
                description={DESCRIPTION[CATEGORIES.dev]}
                tokens={tokens}
                values={[CATEGORIES.dev + "_html", CATEGORIES.dev + "_css"]}
              />
            )}
            {section === sections.prod && tokens && (
              <SectionElement
                category={CATEGORIES.prod}
                description={DESCRIPTION[CATEGORIES.prod]}
                tokens={tokens}
                values={[CATEGORIES.prod + "_html", CATEGORIES.prod + "_css"]}
              />
            )}
            {section === "styles_system" && tokens && (
              <SectionElement
                category={"styles"}
                description={"Updates slots system messages."}
                tokens={tokens}
                values={sections.styles_system}
              />
            )}
            {section === "styles_templates" && tokens && (
              <SectionElement
                category={"styles templates"}
                description={"Updates base and modifier templates for styles."}
                tokens={tokens}
                values={sections.styles_templates}
                hasPreMessage={false}
              />
            )}
            {section === "content_components" && tokens && (
              <SectionComponents
                category={"content"}
                description={"Updates content slots."}
                tokens={tokens}
                values={sections.content_components}
              />
            )}
            {section === "content_system" && tokens && (
              <SectionElement
                category={"content system"}
                description={"Updates content slots system."}
                tokens={tokens}
                values={sections.content_system}
              />
            )}
          </section>
        </section>
      </section>
    </>
  );
};

export default Messages;
