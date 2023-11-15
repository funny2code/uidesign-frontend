import { STYLES } from "../Create/constants";
import { parseConfigParams } from "../../utils/params";
import { useSession } from "../../../auth/useSession";
import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import type { ISopifyPages } from "../Create/types";
import InputBar from "../components/InputBarShopify";
import { executeShopify, getTheme, getThemeNames, updateShopitTheme } from "../commands";
import { MAKE_UI_API_VIEW, MAKE_UI_URL } from "../../constants";
import type { ISchema, IThemes, IViewReq } from "./interface/shopify";
import { downloadShopitTheme } from "../commands/shopify";
import ClipLoader from "react-spinners/ClipLoader";
import { DOCUMENT_TYPE, OpenAPI, PROJECT_TYPE, V2ProjectsService } from "../../../../client";

interface shopifyProps {
  isSaved: boolean,
  setSaved: (e:boolean) => void
  project: any[]
}

export interface shopifyRef {
  saveProjectHandle: () => Promise<void>;
}

const Shopify = (({isSaved, setSaved, project} : shopifyProps) => {
  /* ==================== AUTH AND USER ==================== */ 
  const { getSession, getUserData } = useSession();
  /* ==================== REACT USESTATE CONSTANTS ==================== */ 
  const [isLoading, setLoading] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(true);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isDownload, setIsDownload] = useState<boolean>(false);
  const [input, setInput] = useState("");
  const [themeId, setThemeId] = useState<string>("64dcd06b0db1077c79970cec");
  const [pages, setPages] = useState<string[] | undefined>(undefined);
  const [pageSettings, setPageSettings] = useState<string[]>(["Texts","Images","Settings","Products","Collections","Blogs","Menus"]);
  const [currentPage, setCurrentPage] = useState<string>("index"); 
  const [shopifyThemes, setShopifyThemes] = useState<ISopifyPages[] | undefined>(undefined);
  const [isSettingsSchema, setSettingsSchema] = useState<ISchema[] | []>([]);
  const [isThemes, setIsThemes] = useState<IThemes>({});
  const [iframeContent, setIframeContent] = useState<string>("");
  const [globalPrompt, setGlobalPrompt] = useState<string[]>([]);
  const [pagesPrompt, setPagesPrompt] = useState<string[]>([]);
  const [pagesSettingsPrompt, setPagesSettingsPrompt] = useState<string[]>([]);
  const [userName, setUserName] = useState<string | undefined>(undefined);
  /* ==================== REACT REFS ==================== */ 
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [controller, setController] = useState<AbortController | undefined>(undefined);
  /* ===================================================================================================
  *     GPT REQUEST AND RESPONSE FUNCTION
  * ================================================================================================= */
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

    const createShopifyRequest = {
      "prompt": input,
      "shopify_config": {
        "theme_id": themeId,
        "page": currentPage
      },
      "ai_config": {
        "top_n": 8
      }
    }

    const request = await fetch('https://app.uidesign.ai/generate/v3/shopify/theme', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createShopifyRequest)
    });

    
    const data = await request.json();
    const newUpdate = await updateThemeSettings(data.messages);
    console.log(data.messages, newUpdate, "CHECK DAV NEW");
    setIsThemes((prevThemes:any) => {
      return {
        ...prevThemes,
        [themeId]: {...newUpdate},
      }
    });
    const html = await updateShopitTheme(
      `${MAKE_UI_API_VIEW}?id=${themeId}&page=${currentPage}`,
      themeId,
      newUpdate.settings_data,
      newUpdate.templates[currentPage],
      newUpdate.templates['header_group'],
      newUpdate.templates['footer_group'],
      newUpdate.themeContent
    );
    updateIframeContent(html);
    setProcessing(false);
    setIsDisabled(false);

    // const queryParams = parseConfigParams(input, {
    //   theme_id: themeId,
    //   pages: encodeURIComponent(pagesPrompt.join('+')),
    //   pagesSettings: encodeURIComponent(pagesSettingsPrompt.join('+')),
    //   globals: encodeURIComponent(globalPrompt.join('+'))
    // });

    // await executeShopify(control.signal, queryParams, tokens.id_token, async (ok, data) => {
    //   if (!ok || !data) {
    //     setIsDisabled(false);
    //     setProcessing(false);
    //     return;
    //   }
    //   const { settings_data, main, themeContent, subtype } = data;
    //   // if (ok === 1) {
    //   //   if(Object.keys(main).length > 0){
    //   //     Object.entries(main).forEach(([tkey, template]:[string, any]) => {
    //   //       if(Object.keys(template.sections).length > 0){
    //   //         Object.entries(template.sections).forEach(([skey, section]:[string, any]) => {
    //   //           if(section.blocks && Object.keys(section.blocks).length > 0){
    //   //             Object.entries(section.blocks).forEach(([bkey, block]:[string, any]) => {
    //   //               console.log(isThemes[themeId].templates[tkey][skey][bkey].type, "CHECK DAV");
    //   //               block.type = isThemes[themeId].templates[tkey][skey][bkey].type
    //   //             })
    //   //           }
    //   //         })
    //   //       }
    //   //     })
    //   //   }
    //   // }
    //   // setIsThemes(prevThemes => {
        
    //   //   return {
    //   //     ...prevThemes,
    //   //     [themeId]: {
    //   //       settings_data: isThemes[themeId]?.settings_data,
    //   //       templates: { [currentPage]: main },
    //   //       themeContent: themeContent,
    //   //     },
    //   //   };
    //   // });
    //   console.log(settings_data, "CHECK DAV");
    //   // ok === 2 ? updateIframeContent(html, subtype) : updateIframeContent(html);
      
    //   if (ok === 1) {
    //     setIsThemes(prevThemes => {
    //       return {
    //         ...prevThemes,
    //         [themeId]: {
    //           settings_data: {
    //             ...prevThemes[themeId]?.settings_data,
    //             ...settings_data
    //           },
    //           templates: {
    //             ...prevThemes[themeId]?.templates,
    //             ...main
    //           },
    //           themeContent: {
    //             ...prevThemes[themeId]?.themeContent,
    //             ...themeContent
    //           },
    //           settingsSchema: isSettingsSchema
    //         },
    //       };
    //     });

    //     const html = await updateShopitTheme(
    //       `${MAKE_UI_API_VIEW}?id=${themeId}&page=${currentPage}`,
    //       themeId,
    //       {...isThemes[themeId]?.settings_data, ...settings_data},
    //       main[currentPage] || isThemes[themeId]?.templates[currentPage],
    //       main['header_group'] || isThemes[themeId]?.templates['header_group'],
    //       main['footer_group'] || isThemes[themeId]?.templates['footer_group'],
    //       themeContent || isThemes[themeId]?.themeContent
    //     );
    //     updateIframeContent(html);
    //     setLoading(false);
    //     setProcessing(false);
    //   }
    // });
  }
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await initGenerate();
  };
  /* ===================================================================================================
  *     UPDATE SHOPIFY SETTINGS OBJECT
  * ================================================================================================= */
  const updateThemeSettings = async (messages:any[]) => {
    console.log(messages);
    const newState = { ...isThemes[themeId] };
    console.log(themeId, "THEME ID");
    messages.map(message => {
      const path = message.path;
      const value = message.value;
      let currentLevel:any = newState;
      for (let i = 0; i < path.length - 1; i++) {
        console.log(path[i], currentLevel[path[i]]);
        currentLevel = currentLevel[path[i]];
      }
      currentLevel[path[path.length - 1]] = value;
    })
    return newState;
  };
  /* ===================================================================================================
  *     PAGE CHANGE FUNCTION
  * ================================================================================================= */
  const handlePageChange = async (e: any) => {
    if (!e) return;
    try {
      const pageValue = e.target.value;
      setProcessing(true);
      setCurrentPage(pageValue);
      setLocalThemes(`${userName}-page`, pageValue);
      setLocalThemes(`${userName}-id`, themeId);
      const html = await updateShopitTheme(
        `${MAKE_UI_API_VIEW}?id=${themeId}&page=${pageValue}`,
        themeId,
        isThemes[themeId]?.settings_data,
        isThemes[themeId]?.templates[pageValue],
        isThemes[themeId]?.templates['header_group'],
        isThemes[themeId]?.templates['footer_group'],
        isThemes[themeId]?.themeContent
      );
      updateIframeContent(html);
      setProcessing(false);
    } catch (err) {
      console.log(err);
    }
  };
  /* ===================================================================================================
  *     THEME CHANGE FUNCTION
  * ================================================================================================= */
  const handleThemeChange = async (e: any) => {
    if (!e) return;
    try {
      let id = e.target.value;
      setProcessing(true);
      setThemeId(id);
      setLocalThemes(`${userName}-page`, currentPage);
      setLocalThemes(`${userName}-id`, id);
      await getThemeById(id);
      const html = await updateShopitTheme(
        `${MAKE_UI_API_VIEW}?id=${id}&page=${currentPage}`,
        id,
        isThemes[id]?.settings_data,
        isThemes[id]?.templates[currentPage],
        isThemes[id]?.templates['header_group'],
        isThemes[id]?.templates['footer_group'],
        isThemes[id]?.themeContent
      );
      updateIframeContent(html);
      setLoading(false);
      setProcessing(false);
    } catch (err) {
      console.log(err);
    }
  };

  /* ===================================================================================================
  *     SET LOCAL STORAGE FUNCTION
  * ================================================================================================= */
  const setLocalThemes = (username: string, data:string) => {
    localStorage.setItem(username, data);
  }
  /* ===================================================================================================
  *     GET LOCAL STORAGE FUNCTION
  * ================================================================================================= */
  const getLocalThemes = (username:string) => {
    const data = localStorage.getItem(username);
    return data ? data : undefined;
  }
  /* ===================================================================================================
  *     PROMPT FOR SHOPIFY GLOBAL SETTINGS CHANGE FUNCTION
  * ================================================================================================= */
  const changeGloablPrompt = (event:any) => {
    const { name, checked } = event.target;
    if (checked) {
      setGlobalPrompt((prevCheckedItems) => [...prevCheckedItems, name]);
    } else {
      setGlobalPrompt((prevCheckedItems) =>
        prevCheckedItems.filter((item) => item !== name)
      );
    }
  };
  /* ===================================================================================================
  *     PROMPT FOR SHOPIFY PAGE SETTINGS CHANGE FUNCTION
  * ================================================================================================= */
  const changePagesSettingsPrompt = (event:any) => {
    const { name, checked } = event.target;
    if (checked) {
      setPagesSettingsPrompt((prevCheckedItems) => [...prevCheckedItems, name]);
    } else {
      setPagesSettingsPrompt((prevCheckedItems) =>
        prevCheckedItems.filter((item) => item !== name)
      );
    }
  }
  /* ===================================================================================================
  *     PROMPT FOR SHOPIFY PAGES CHANGE FUNCTION
  * ================================================================================================= */
  const changePagesPrompt = (event:any) => {
    const { name, checked } = event.target;
    if (checked) {
      setPagesPrompt((prevCheckedItems) => [...prevCheckedItems, name]);
    } else {
      setPagesPrompt((prevCheckedItems) =>
        prevCheckedItems.filter((item) => item !== name)
      );
    }
  }
  /* ===================================================================================================
  *     CHANGE GLOBAL SETTINGS FUNCTION
  * ================================================================================================= */
  // const handleChangeFields = async (e: any) => {
  //   if (!e && processing) return;
  //   const { name, value, checked, type } = e.target;
  //   if (!name) return;
  //   const valueByType = type === "checkbox" ? checked : type === "range" ? parseInt(value, 10) : value;
  //   const splitName = name.split(".");
  //   setIsThemes(prevThemes => {
  //     if (splitName.length === 1) {
  //       return {
  //         ...prevThemes,
  //         [themeId]: {
  //           ...prevThemes[themeId],
  //           settings_data: {
  //             ...prevThemes[themeId].settings_data,
  //             [name]: valueByType,
  //           },
  //         },
  //       };
  //     } else if (splitName.length === 4) {
  //       return {
  //         ...prevThemes,
  //         [themeId]: {
  //           ...prevThemes[themeId],
  //           settings_data: {
  //             ...prevThemes[themeId].settings_data,
  //             [splitName[0]]: {
  //               ...prevThemes[themeId].settings_data[splitName[0]],
  //               [splitName[1]]: {
  //                 ...prevThemes[themeId].settings_data[splitName[0]][splitName[1]],
  //                 [splitName[2]]: {
  //                   ...prevThemes[themeId].settings_data[splitName[0]][splitName[1]][splitName[2]],
  //                   [splitName[3]]: valueByType,
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       };
  //     }
  //     return prevThemes;
  //   });
  // };

  // const sendSettingsFunc = async () => {
  //   setProcessing(true);
  //   const html = await updateShopitTheme(
  //     `${MAKE_UI_API_VIEW}?id=${themeId}&page=${currentPage}`,
  //     themeId,
  //     isThemes[themeId]?.settings_data,
  //     isThemes[themeId]?.templates[currentPage],
  //     isThemes[themeId]?.templates['header_group'],
  //     isThemes[themeId]?.templates['footer_group'],
  //     isThemes[themeId]?.templates
  //   );
  //   updateIframeContent(html);
  //   setProcessing(false);
  // };
  /* ===================================================================================================
  *     PROMPT FOR SHOPIFY PAGES CHANGE FUNCTION
  * ================================================================================================= */
  const getThemeById = async (id: string) => {
    const res = await getTheme(id);
    const { templates, settingsData, settingsSchema } = res;
    console.log(settingsData);
    if (templates && Object.keys(templates).length > 0) setPages(Object.keys(templates));
    if (settingsData && isThemes[id] === undefined){
      setIsThemes(prevThemes => {
        return {
          ...prevThemes,
          [id]: {
            settings_data: typeof settingsData.current === "string" ? settingsData.presets[settingsData.current]: settingsData.current,
            templates: templates,
            themeContent: {},
            settingsSchema: settingsSchema
          },
        };
      });
    }
    settingsSchema?.length && setSettingsSchema(settingsSchema.filter((item:any) => item.settings));
  };
  /* ===================================================================================================
  *     FIRST TIME PAGE LOAD FUNCTION
  * ================================================================================================= */
  useEffect(() => {
    (async () => {
      try {
        const tokens = await getSession();
        if (!tokens) throw new Error("Relogin please.");
        const User = getUserData(tokens.id_token);
        if(User) setUserName(User.username);
        const getThemes = getLocalThemes(`${User.username}-themes`);
        const themeNames = await getThemeNames();
        const randomIndex = Math.floor(Math.random() * themeNames.length);
        const randomItem = themeNames[randomIndex];
        setThemeId(randomItem._id);
        const parseThemes = getThemes ? JSON.parse(getThemes) : null;
        setIsThemes(parseThemes);
        if (themeNames?.length) setShopifyThemes(themeNames);
        if(parseThemes && parseThemes[randomItem._id]){ 
          if(parseThemes[randomItem._id]?.settingsSchema) setSettingsSchema(parseThemes[randomItem._id].settingsSchema);
          if(parseThemes[randomItem._id]?.templates) setPages(Object.keys(parseThemes[randomItem._id].templates)); 
          const html = await updateShopitTheme(
            `${MAKE_UI_API_VIEW}?id=${randomItem._id}&page=${currentPage}`,
            randomItem._id,
            parseThemes[randomItem._id]?.settings_data,
            parseThemes[randomItem._id]?.templates[currentPage],
            parseThemes[randomItem._id]?.templates['header_group'],
            parseThemes[randomItem._id]?.templates['footer_group'],
            parseThemes[randomItem._id]?.themeContent
          );
          updateIframeContent(html);
          setLoading(false);
          setProcessing(false);
        } else {
          await getThemeById(randomItem._id);
          const html = await updateShopitTheme(
            `${MAKE_UI_API_VIEW}?id=${randomItem._id}&page=${currentPage}`,
            randomItem._id,
            isThemes[randomItem._id]?.settings_data,
            isThemes[randomItem._id]?.templates[currentPage],
            isThemes[randomItem._id]?.templates['header_group'],
            isThemes[randomItem._id]?.templates['footer_group'],
            isThemes[randomItem._id]?.themeContent
          );
          updateIframeContent(html);
          setLoading(false);
          setProcessing(false);
        }
      } catch (err) {
        console.error(err, "ERROR WHEN START");
      }
    })();
  }, []);
  /* ===================================================================================================
  *     WHEN THEMES IS UPDATED SAVE LOCAL STORAGE
  * ================================================================================================= */
  useEffect(() => {
    setLocalThemes(`${userName}-themes`, JSON.stringify(isThemes));
  }, [isThemes]);
  /* ===================================================================================================
  *     UPDATE IFRAME CONTENT FUNCTION
  * ================================================================================================= */
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
  /* ===================================================================================================
  *     DOWNLOAD THEME FUNCTION
  * ================================================================================================= */
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
    const currentThemeName = shopifyThemes?.filter(theme => theme._id === themeId);
    if(currentThemeName) anchor.download = `${currentThemeName[0].name || "theme"}.zip`;
    anchor.click();
    URL.revokeObjectURL(objectURL);
    setIsDownload(false);
    setProcessing(false);
  };
  /* ===================================================================================================
  *     SAVE PROJECT FUNCTION FUNCTION
  * ================================================================================================= */
  const saveProjectHandle = async () => {
    const tokens = await getSession();
    if (!tokens) throw new Error("Relogin please.");
    OpenAPI.TOKEN = tokens.id_token;
    const data = {
      name: "New Shopify",
      description: "Description",
      public: true,
      url: `${MAKE_UI_URL}/themes/${themeId}?page=${currentPage}`,
      img_url: "",
      tags: ["Shopify"],
      type: PROJECT_TYPE.SHOPIFY,
      data:{
        content: [],
        styles: [],
        other: [
          {
            name: "New Shopify",
            description: "Description",
            public: true,
            url: `${MAKE_UI_URL}/themes/${themeId}?page=${currentPage}`,
            img_url: "",
            tags: ["Shopify"],
            type: DOCUMENT_TYPE.JS,
            data: isThemes[themeId],
          }
        ]
      }
    };
    await V2ProjectsService.createUserProjectV2UserProjectsPost(data);
    setSaved(false)
  }

  useEffect(() => {
    if(isSaved === true){
      saveProjectHandle();
    }
    if(project?.length){
      console.log(project, "CHECK DAV");
    }
  }, [isSaved, project]);

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
          pages={pages}
          page={currentPage}
          handlePageChange={handlePageChange}
          themes={shopifyThemes || undefined}
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
              overflowY: "auto",
            }}
            aria-labelledby="dropdownMenuClickable"
          >
            <div className="position-relative" style={{ paddingBottom: "70px" }}>
            {pages && (
              <div className="p-1">
                <h5 className="mb-1">SELECT PAGE OR PAGES</h5>  
                <div className="btn-group flex-wrap gap-2" role="group" aria-label="Basic checkbox toggle button group">
                  {
                    pages.map((p) => (
                      <div key={p}>
                         <input 
                          type="checkbox" 
                          name={p} 
                          checked={pagesPrompt.includes(p)} 
                          onChange={changePagesPrompt} 
                          className="btn-check" 
                          id={p} 
                        />
                        <label className="btn btn-outline-primary" htmlFor={p}>{p}</label>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}
            {pageSettings && (
              <div className="p-1">
                <h5 className="mb-1">SELECT PROMPTS FOR PAGE OR PAGES</h5>  
                <div className="btn-group flex-wrap gap-2" role="group" aria-label="Basic checkbox toggle button group">
                  {
                    pageSettings.map((p) => (
                      <div key={p}>
                         <input 
                          type="checkbox" 
                          name={p} 
                          checked={pagesSettingsPrompt.includes(p)} 
                          onChange={changePagesSettingsPrompt} 
                          className="btn-check" 
                          id={p} 
                        />
                        <label className="btn btn-outline-primary" htmlFor={p}>{p}</label>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}
            {isSettingsSchema && (
              <div className="p-1">
                <h5 className="mb-1">SELECT STYLE OR STYLES</h5> 
                <div className="btn-group flex-wrap gap-2" role="group" aria-label="Basic checkbox toggle button group">
                  {
                    isSettingsSchema.map((i:any, key:number) => (
                      <div key={key}>
                        <input 
                          type="checkbox" 
                          name={i.name} 
                          checked={globalPrompt.includes(i.name)} 
                          onChange={changeGloablPrompt} 
                          className="btn-check" 
                          id={i.name} 
                        />
                        <label className="btn btn-outline-primary" htmlFor={i.name}>{i.name}</label>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}
            </div>
          </div>
        </InputBar>
      </form>
    </>
  );
});
export default Shopify;
