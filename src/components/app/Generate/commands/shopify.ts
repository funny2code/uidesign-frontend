import { shopifyBody, shopifyHead, generatedProjectsIds } from "../../../../atoms";
import { EventSourcePolyfill } from "event-source-polyfill";
import type { DataType, StatusCallback } from "./types";
import { BASE_URL, MAKE_UI_URL, MAKE_UI_API, MAKE_UI_API_VIEW } from "../../constants";
import { loadingFeedback } from "./utils";
import type { ISettingsData, IThemeBody, IViewReq } from "../Shopify/interface/shopify";

export type DataTypeShopify = "head" | "body" | "main";
export type ResType = DataTypeShopify | "error" | "info" | "id";
export const executeShopify = async (
  // iframe: HTMLIFrameElement,
  signal: AbortSignal,
  query: string,
  token: string,
  url: string,
  id: string,
  settingsData: any,
  callback: StatusCallback
) => {
  // iframe.onload = async () => {
  //   const body = iframe.contentWindow?.document.body;
  //   const head = iframe.contentWindow?.document.head;
  //   if (!body || !head) {
  //     throw new Error("No body or head found.");
  //   }
  //   // Maps
  //   const stores = { body: shopifyBody, head: shopifyHead };
  //   const sections = { body: body, head: head };
  // Reset states
  // Object.values(stores).forEach(store => store.set(""));
  // Object.values(sections).forEach(section => (section.innerHTML = ""));
  // Stream
  const eventStream = new EventSourcePolyfill(`${BASE_URL}/stream/shopify${query}`, {
    headers: { Authorization: `Bearer ${token}` },
    heartbeatTimeout: 90000,
  });
  eventStream.addEventListener("message", async (e: any) => {
    if (signal.aborted) {
      console.log("ABORTED_STREAM");
      eventStream.close();
      return callback(false, undefined);
    }
    const { type, data }: { type: ResType; data: any } = JSON.parse(e.data);
    if (type === "info") {
      console.log(data);
      // body.innerHTML = loadingFeedback(data);
    } else if (type === "error") {
      console.log("ERROR_STREAM", data);
      eventStream.close();
      return callback(false, undefined);
    } else if (type === "id") {
      // shopifyBody.set(body.innerHTML);
      // shopifyHead.set(head.innerHTML);
      // generatedProjectsIds.set({ ...generatedProjectsIds.get(), Shopify: data });
      // console.log("END_STREAM");
      // eventStream.close();
      // return callback(true, stores as any);
    } else if (type === "main") {
      console.log(data, "CHECK DAV JAN");
      const html = await updateShopitTheme(url, id, settingsData, data.main, data.themeContent);
      if (html) return callback(true, html);
    } else {
      console.log(type, data);
      if (data === "[DONE]") return;
      if (type === "body") {
        // body.innerHTML = data;
      } else if (type === "head") {
        // head.innerHTML = data;
      }
    }
  });
  eventStream.addEventListener("open", () => {
    console.log("START_STREAM");
  });
  eventStream.addEventListener("error", (e: any) => {
    console.log("ERROR_STREAM", e);
    eventStream.close();
    callback(false, undefined);
  });
  // };
};

export const getThemeNamesAndPages = async (id: string | undefined = undefined) => {
  const url = `${MAKE_UI_URL}api/theme`;
  const body: IThemeBody = {
    id: id ? id : undefined,
    themeNames: true,
    pages: true,
    settingsData: true,
    settingsSchema: true,
  };
  const request = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: MAKE_UI_API,
    },
    body: JSON.stringify(body),
  });
  const response = await request.json();
  return response;
};

export const updateShopitTheme = async (
  URL: string,
  id: string | undefined = undefined,
  settings: ISettingsData[] | undefined,
  main: Record<string, any> | undefined = undefined,
  themeContent: Record<string, any> | undefined = undefined
) => {
  if (!settings) return;
  const body: IViewReq = {
    theme_id: id,
    settings_data: settings,
    main: main,
    themeContent: themeContent,
  };
  const request = await fetch(URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: MAKE_UI_API,
    },
    body: JSON.stringify(body),
  });
  const response = await request.text();
  return response;
};
