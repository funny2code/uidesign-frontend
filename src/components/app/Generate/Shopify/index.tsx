import { STYLES } from "../Create/constants";
import { shopifyBody, shopifyHead } from "../../../../atoms";
import { parseConfigParams } from "../../utils/params";
import { useSession } from "../../../auth/useSession";
import { useState, useRef, useEffect } from "react";
import type { IValue, ISopifyPages } from "../Create/types";
import { initFrame } from "../../utils/frame";
import InputBar from "../components/InputBarShopify";
import { executeShopify, getThemeNamesAndPages, updateShopitTheme } from "../commands";
import { MAKE_UI_API_VIEW } from "../../constants";
// import { SHOPIFY_PAGES } from './constants';

import type { ISchema, ISettingsData } from "./interface/shopify";
import { initFrameShopify } from "./iframe";
import Settings from "./settings";
import type { StatusCallback } from "../commands/types";

const Shopify = () => {
  // Auth
  const { getSession } = useSession();
  // Flow
  const [processing, setProcessing] = useState(false);
  const [input, setInput] = useState("");
  const [themeId, setThemeId] = useState<string>("64dcd06b0db1077c79970cec");
  const [page, setPage] = useState<string>("index&settings=style");
  const [shopifyPage, setShopifyPage] = useState<ISopifyPages[] | []>([]);
  const [shopifyThemes, setShopifyThemes] = useState<ISopifyPages[] | []>([]);
  const [isSettingsData, setSettingsData] = useState<ISettingsData | undefined>(undefined);
  const [isSettingsSchema, setSettingsSchema] = useState<ISchema[] | []>([]);
  const [filterSchema, setFilterSchema] = useState<ISchema[] | []>([]);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [controller, setController] = useState<AbortController | undefined>(undefined);

  async function initGenerate() {
    const iframeSection = sectionRef.current;
    if (!iframeSection) return;
    if (controller && processing) {
      controller.abort();
      setProcessing(false);
      initFrame(sectionRef.current);
      return;
    }
    const tokens = await getSession();
    if (!tokens) throw new Error("Relogin please.");
    const control = new AbortController();
    setController(control);
    setProcessing(true);
    const queryParams = parseConfigParams(input, {
      theme_id: themeId,
      page: page,
    });
    if (!isSettingsData?.presets?.Default) return;
    await executeShopify(
      control.signal,
      queryParams,
      tokens.id_token,
      `${MAKE_UI_API_VIEW}?id=${themeId}&page=${page}`,
      themeId,
      isSettingsData?.presets?.Default,
      async (ok: boolean, html) => {
        console.log(html, "DAV");
        if (html && typeof html === "string") initFrame(iframeSection, html);
        setProcessing(false);
      }
    );
  }
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await initGenerate();
  };

  const handlePageChange = async (e: any) => {
    if (!e) return;
    try {
      const iframeSection = sectionRef.current;
      const pageValue = e.target.value;
      setPage(pageValue);
      const splitSchema =
        STYLES[pageValue] &&
        isSettingsSchema.filter((s: ISchema) => STYLES[pageValue].includes(s.name.toLowerCase()));
      setFilterSchema(splitSchema || []);
      if (!isSettingsData?.presets?.Default) return;
      const html = await updateShopitTheme(
        `${MAKE_UI_API_VIEW}?id=${themeId}&page=${pageValue}`,
        themeId,
        isSettingsData.presets?.Default
      );
      if (!iframeSection) return;
      if (html) initFrame(iframeSection, html);
    } catch (err) {
      console.log(err);
    }
  };

  const handleThemeChange = async (e: any) => {
    if (!e) return;
    try {
      let id = e.target.value;
      const iframeSection = sectionRef.current;
      setThemeId(id);
      const getShopify = await getThemeNamesAndPages(id);
      const { pages, themeNames, settingsData, settingsSchema } = getShopify?.response || {};
      const resPages = pages?.length && pages;
      resPages?.length && resPages.push({ _id: resPages[0]._id + "3", name: "index&settings=style" });
      resPages?.length && setShopifyPage(resPages);
      themeNames?.length && setShopifyThemes(themeNames);
      settingsData && setSettingsData(settingsData);
      settingsSchema?.length && setSettingsSchema(settingsSchema);
      const splitSchema =
        STYLES[page] &&
        settingsSchema.filter((s: ISchema) => STYLES[page].includes(s.name.toLowerCase()));
      setFilterSchema(splitSchema || []);
      if (!iframeSection) return;
      initFrameShopify(iframeSection, `${MAKE_UI_API_VIEW}?id=${id}&page=${page}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangeFields = (e: any) => {
    const { name, value, checked, type } = e.target;
    setSettingsData(prevSettings => {
      if (!prevSettings?.presets?.Default) return;
      const splitName = name.split(".");
      if (splitName.length === 1) {
        return {
          ...prevSettings,
          presets: {
            ...prevSettings.presets,
            Default: {
              ...prevSettings.presets.Default,
              [name]: type === "checkbox" ? checked : value,
            },
          },
        };
      } else if (splitName.length === 4) {
        return {
          ...prevSettings,
          presets: {
            ...prevSettings.presets,
            Default: {
              ...prevSettings.presets.Default,
              [splitName[0]]: {
                ...prevSettings.presets.Default[splitName[0]],
                [splitName[1]]: {
                  ...prevSettings.presets.Default[splitName[0]][splitName[1]],
                  [splitName[2]]: {
                    ...prevSettings.presets.Default[splitName[0]][splitName[1]][splitName[2]],
                    [splitName[3]]: value,
                  },
                },
              },
            },
          },
        };
      }
    });

    setIsDisabled(false);
  };

  // Generate
  useEffect(() => {
    (async () => {
      try {
        const getShopify = await getThemeNamesAndPages();
        const { pages, themeNames, settingsData, settingsSchema } = getShopify?.response || {};
        const resPages = pages?.length && pages;
        resPages?.length && resPages.push({ _id: resPages[0]._id + "3", name: "index&settings=style" });
        resPages?.length && setShopifyPage(resPages);
        themeNames?.length && setShopifyThemes(themeNames);
        settingsData && setSettingsData(settingsData);
        settingsSchema?.length && setSettingsSchema(settingsSchema);
        const splitSchema =
          STYLES[page] &&
          settingsSchema.filter((s: ISchema) => STYLES[page].includes(s.name.toLowerCase()));
        setFilterSchema(splitSchema);
      } catch (err) {}
    })();

    const iframeSection = sectionRef.current;
    if (!buttonRef.current || !iframeSection) return;
    const iframeBody = shopifyBody.get();
    const iframeHead = shopifyHead.get();
    if (iframeBody && iframeHead) {
      const iframe = initFrame(iframeSection);
      iframe.onload = () => {
        const body = iframe.contentWindow?.document.body;
        const head = iframe.contentWindow?.document.head;
        if (head) head.innerHTML = iframeHead;
        if (body) body.innerHTML = iframeBody;
      };
    } else {
      const pageHandle = `${MAKE_UI_API_VIEW}?id=${themeId}&page=${page}`;
      initFrameShopify(iframeSection, pageHandle);
    }
  }, []);

  const updateSettings = async () => {
    try {
      const iframeSection = sectionRef.current;
      if (!iframeSection || isDisabled) return;
      if (!isSettingsData?.presets?.Default) return;
      setIsLoading(true);
      const pageHandle = `${MAKE_UI_API_VIEW}?id=${themeId}&page=${page}`;
      const html = await updateShopitTheme(pageHandle, themeId, isSettingsData.presets?.Default);
      if (html) initFrame(iframeSection, html);
      setIsDisabled(true);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <section ref={sectionRef} className="designer-window hstack flex-grow-1">
        <div ref={iframeRef} id="embed" style={{ height: "100%", width: "100%" }}></div>
      </section>
      <form onSubmit={handleSubmit}>
        <InputBar
          input={input}
          setInput={setInput}
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
                isSettingsData &&
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
                                  data={isSettingsData}
                                  schema={item.settings}
                                  handleChangeFields={handleChangeFields}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                )}
              {filterSchema && (
                <div className="position-absolute bottom-0 start-0 col-12">
                  <button
                    type="button"
                    onClick={updateSettings}
                    className="d-flex justify-content-center align-items-center gap-2 col-12 btn btn-primary rounded-0 btn-lg text-uppercase"
                    disabled={isDisabled}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-md" aria-hidden="true"></span>
                        <span className="visually-hidden" role="status">
                          Loading...
                        </span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </InputBar>
      </form>
    </>
  );
};
export default Shopify;
