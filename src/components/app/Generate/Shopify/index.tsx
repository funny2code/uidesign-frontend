import { STYLES } from "../Create2/constants";
import { parseConfigParams } from "../../utils/params";
import { useSession } from "../../../auth/useSession";
import { useState, useRef, useEffect } from "react";
import type { ISopifyPages } from "../Create2/types";
import InputBar from "../components/InputBarShopify";
import { executeShopify, getThemeNamesAndPages, updateShopitTheme } from "../commands";
import { MAKE_UI_API_VIEW } from "../../constants";
// import { ClipLoader } from "react-spinners";
import type { ISchema, IThemes } from "./interface/shopify";
import Settings from "./settings";
import { downloadShopitTheme } from "../commands/shopify";

import ClipLoader from "react-spinners/ClipLoader";

const Shopify = () => {
  // Auth
  const { getSession } = useSession();
  // Flow
  const [isLoading, setLoading] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(true);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isDownload, setIsDownload] = useState<boolean>(false);

  const [input, setInput] = useState("");
  const [themeId, setThemeId] = useState<string>("64dcd06b0db1077c79970cec");
  const [page, setPage] = useState<string>("index&settings=style");
  const [shopifyPage, setShopifyPage] = useState<ISopifyPages[] | []>([]);
  const [shopifyThemes, setShopifyThemes] = useState<ISopifyPages[] | []>([]);
  const [isSettingsSchema, setSettingsSchema] = useState<ISchema[] | []>([]);
  const [isThemes, setIsThemes] = useState<IThemes>({});
  const [filterSchema, setFilterSchema] = useState<ISchema[] | []>([]);
  const [iframeContent, setIframeContent] = useState<string>("");
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [controller, setController] = useState<AbortController | undefined>(undefined);

  async function initGenerate() {
    if (controller && processing) {
      controller.abort();
      setProcessing(false);
      setIsDisabled(false);
      return;
    }
    const tokens = await getSession();
    if (!tokens) throw new Error("Relogin please.");
    const control = new AbortController();
    setController(control);
    setProcessing(true);
    setIsDisabled(true);

    const queryParams = parseConfigParams(input, {
      theme_id: themeId,
      page: page,
    });

    await executeShopify(control.signal, queryParams, tokens.id_token, async (ok, data) => {
      if (!ok || !data) {
        setIsDisabled(false);
        setProcessing(false);
        return;
      }
      const { main, themeContent, subtype } = data;

      const html = await updateShopitTheme(
        `${MAKE_UI_API_VIEW}?id=${themeId}&page=${page}`,
        themeId,
        isThemes[themeId]?.settings_data,
        main,
        themeContent
      );

      ok === 2 ? updateIframeContent(html, subtype) : updateIframeContent(html);

      if (ok === 1) {
        console.log(ok, main);
        setIsThemes(prevThemes => {
          return {
            ...prevThemes,
            [themeId]: {
              settings_data: isThemes[themeId]?.settings_data,
              templates: { [page]: main },
              themeContent: themeContent,
            },
          };
        });
        setIsDisabled(false);
        setProcessing(false);
      }
    });
  }
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await initGenerate();
  };

  const handlePageChange = async (e: any) => {
    if (!e) return;
    try {
      const pageValue = e.target.value;
      setProcessing(true);
      setPage(pageValue);
      const splitSchema =
        STYLES[pageValue] &&
        isSettingsSchema.filter((s: ISchema) => STYLES[pageValue].includes(s.name.toLowerCase()));
      setFilterSchema(splitSchema || []);
      const html = await updateShopitTheme(
        `${MAKE_UI_API_VIEW}?id=${themeId}&page=${pageValue}`,
        themeId,
        isThemes[themeId]?.settings_data,
        isThemes[themeId]?.templates[pageValue],
        isThemes[themeId]?.themeContent
      );
      updateIframeContent(html);
      setProcessing(false);
    } catch (err) {
      console.log(err);
    }
  };

  const addThemesCall = async (id: string) => {
    const getShopify = await getThemeNamesAndPages(id);
    const { pages, themeNames, settingsData, settingsSchema } = getShopify?.response || {};
    const resPages = pages?.length && pages;
    resPages?.length && resPages.push({ _id: resPages[0]._id + "3", name: "index&settings=style" });
    if (themeNames?.length && Object.keys(isThemes).length === 0) setShopifyThemes(themeNames);
    resPages?.length && setShopifyPage(resPages);
    if (settingsData && isThemes[id] === undefined)
      setIsThemes(prevThemes => {
        return {
          ...prevThemes,
          [id]: {
            settings_data: settingsData.presets[settingsData.current],
            templates: {},
            themeContent: {},
          },
        };
      });
    settingsSchema?.length && setSettingsSchema(settingsSchema);
    const splitSchema =
      STYLES[page] && settingsSchema.filter((s: ISchema) => STYLES[page].includes(s.name.toLowerCase()));
    setFilterSchema(splitSchema || []);
  };

  const handleThemeChange = async (e: any) => {
    if (!e) return;
    try {
      let id = e.target.value;
      setProcessing(true);
      setThemeId(id);
      await addThemesCall(id);
      const html = await updateShopitTheme(
        `${MAKE_UI_API_VIEW}?id=${id}&page=${page}`,
        id,
        isThemes[id]?.settings_data,
        isThemes[id]?.templates[page],
        isThemes[id]?.themeContent
      );
      updateIframeContent(html);
      setProcessing(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangeFields = async (e: any) => {
    if (!e && processing) return;
    const { name, value, checked, type } = e.target;
    if (!name) return;
    const valueByType = type === "checkbox" ? checked : type === "range" ? parseInt(value, 10) : value;
    const splitName = name.split(".");
    setIsThemes(prevThemes => {
      if (splitName.length === 1) {
        return {
          ...prevThemes,
          [themeId]: {
            ...prevThemes[themeId],
            settings_data: {
              ...prevThemes[themeId].settings_data,
              [name]: valueByType,
            },
          },
        };
      } else if (splitName.length === 4) {
        return {
          ...prevThemes,
          [themeId]: {
            ...prevThemes[themeId],
            settings_data: {
              ...prevThemes[themeId].settings_data,
              [splitName[0]]: {
                ...prevThemes[themeId].settings_data[splitName[0]],
                [splitName[1]]: {
                  ...prevThemes[themeId].settings_data[splitName[0]][splitName[1]],
                  [splitName[2]]: {
                    ...prevThemes[themeId].settings_data[splitName[0]][splitName[1]][splitName[2]],
                    [splitName[3]]: valueByType,
                  },
                },
              },
            },
          },
        };
      }
      return prevThemes;
    });
  };

  const sendSettingsFunc = async () => {
    setProcessing(true);
    const html = await updateShopitTheme(
      `${MAKE_UI_API_VIEW}?id=${themeId}&page=${page}`,
      themeId,
      isThemes[themeId]?.settings_data,
      isThemes[themeId]?.templates[page],
      isThemes[themeId]?.templates
    );
    updateIframeContent(html);
    setProcessing(false);
  };

  // Generate
  useEffect(() => {
    (async () => {
      try {
        await addThemesCall(themeId);
        const html = await updateShopitTheme(
          `${MAKE_UI_API_VIEW}?id=${themeId}&page=${page}`,
          themeId,
          isThemes[themeId]?.settings_data,
          isThemes[themeId]?.templates[page],
          isThemes[themeId]?.templates
        );
        updateIframeContent(html);
        setLoading(false);
        setProcessing(false);
      } catch (err) {
        console.error(err, "ERROR WHEN START");
      }
    })();
  }, []);

  const updateIframeContent = (htmlContent: string, section: string | undefined = undefined) => {
    try {
      if (section) {
        const iframeContent = iframeRef?.current?.contentDocument;
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, "text/html");
        if (iframeContent) {
          const oldSection = iframeContent.querySelector(`.section-${section}`);
          const newSection = doc.querySelector(`.section-${section}`);
          if (oldSection && newSection) oldSection.replaceWith(newSection);
          oldSection && oldSection.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      } else {
        setIframeContent(htmlContent);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleThemeDownload = async (e: any) => {
    if (!e) return;
    setIsDownload(true);
    setProcessing(true);
    const blob = await downloadShopitTheme(
      themeId,
      isThemes[themeId].settings_data,
      isThemes[themeId].templates
    );
    const anchor = document.createElement("a");
    const objectURL = URL.createObjectURL(blob);
    anchor.href = objectURL;
    const currentThemeName = shopifyThemes.filter(theme => theme._id === themeId);
    anchor.download = `${currentThemeName[0].name || "theme"}.zip`;
    anchor.click();
    URL.revokeObjectURL(objectURL);
    setIsDownload(false);
    setProcessing(false);
  };

  return (
    <>
      <section ref={sectionRef} className="designer-window hstack flex-grow-1">
        {isLoading ? (
          <div
            style={{
              display: "flex",
              backgroundColor: "#DCDCDC",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <ClipLoader color={"#123abc"} loading={true} size={100} />
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            srcDoc={iframeContent}
            title="My Iframe"
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        )}
      </section>
      <form onSubmit={handleSubmit}>
        <InputBar
          input={input}
          setInput={setInput}
          isDisabled={isDisabled}
          processing={processing}
          placeholder="Describe your design"
          inputRef={inputRef}
          pages={shopifyPage}
          page={page}
          handlePageChange={handlePageChange}
          themes={shopifyThemes}
          themeId={themeId}
          handleThemeChange={handleThemeChange}
          buttonRef={buttonRef}
          isDownload={isDownload}
          downloadTheme={handleThemeDownload}
        >
          <div
            className="dropdown-menu mb-3 p-1 pb-2"
            style={{
              width: "360px",
              transform: "translateX(-50%)",
              height: "400px",
              overflow: "auto",
            }}
            aria-labelledby="dropdownMenuClickable"
          >
            <div className="position-relative" style={{ paddingBottom: "70px" }}>
              {filterSchema &&
                isThemes[themeId]?.settings_data &&
                filterSchema.map(
                  (item: ISchema) =>
                    item.settings && (
                      <div className="my-1 px-3 pt-1" key={item.name}>
                        <div
                          className="accordion"
                          id={`accordion-${item.name.replace(" ", "-").toLowerCase()}`}
                        >
                          <div className="accordion-item">
                            <h2 className="accordion-header">
                              <button
                                className="accordion-button"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#collapseOne-${item.name
                                  .replace(" ", "-")
                                  .toLowerCase()}`}
                                aria-expanded="true"
                                aria-controls={`collapseOne-${item.name
                                  .replace(" ", "-")
                                  .toLowerCase()}`}
                              >
                                {item.name}
                              </button>
                            </h2>
                            <div
                              id={`collapseOne-${item.name.replace(" ", "-").toLowerCase()}`}
                              className="accordion-collapse collapse"
                              data-bs-parent={`#accordion-${item.name.replace(" ", "-").toLowerCase()}`}
                            >
                              <div className="accordion-body px-2">
                                <Settings
                                  data={isThemes[themeId].settings_data}
                                  schema={item.settings}
                                  handleChangeFields={handleChangeFields}
                                  sendSettingsFunc={sendSettingsFunc}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                )}
            </div>
          </div>
        </InputBar>
      </form>
    </>
  );
};
export default Shopify;
