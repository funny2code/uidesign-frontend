import { EventSourcePolyfill } from "event-source-polyfill";
import { BASE_URL, MAKE_UI_URL, MAKE_UI_API } from "../../constants";
import type { IViewReq, IDownloadReq } from "../Shopify/interface/shopify";

export type DataTypeShopify = "main" | "section";
export type ResType = DataTypeShopify | "error" | "info" | "id";
export type StatusCallback = (status: number, data?: Record<string, any>) => void;
export const executeShopify = async (
  signal: AbortSignal,
  query: string,
  token: string,
  callback: StatusCallback
) => {
  const eventStream = new EventSourcePolyfill(`${BASE_URL}/stream/shopify${query}`, {
    headers: { Authorization: `Bearer ${token}` },
    heartbeatTimeout: 90000,
  });
  eventStream.addEventListener("message", async (e: any) => {
    if (signal.aborted) {
      console.log("ABORTED_STREAM");
      eventStream.close();
      return callback(0, undefined);
    }
    const { type, data }: { type: ResType; data: Record<string, any> } = JSON.parse(e.data);
    if (type === "section") {
      callback(2, data);
    } else if (type === "main") {
      callback(1, data);
    } else if (type === "error") {
      console.log("ERROR_STREAM", data);
      eventStream.close();
      return callback(0, undefined);
    }
    //  else if (type === "id") {
    // shopifyBody.set(body.innerHTML);
    // shopifyHead.set(head.innerHTML);
    // generatedProjectsIds.set({ ...generatedProjectsIds.get(), Shopify: data });
    // console.log("END_STREAM");
    // eventStream.close();
    // return callback(true, stores as any);
    // }
    // else if (type === "main") {
    //   eventStream.close();
    //   return callback(1, data);
    // }
  });
  eventStream.addEventListener("open", () => {
    console.log("START_STREAM");
  });
  eventStream.addEventListener("error", (e: any) => {
    console.log("ERROR_STREAM", e);
    eventStream.close();
    callback(0, undefined);
  });
};

export const getThemeNames = async () => {
  const url = `${MAKE_UI_URL}/api/themenames`;
  const request = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: MAKE_UI_API,
    }
  });
  const response = await request.json();
  return response;
}

export const getTheme = async (id: string) => {
  const url = `${MAKE_UI_URL}/api/theme/${id}`;
  const request = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: MAKE_UI_API,
    }
  });
  const response = await request.json();
  return response;
};

export const updateShopitTheme = async (
  URL: string,
  id: string,
  settings: Record<string, any>,
  main?: Record<string, any>,
  headerGroup?: Record<string, any>,
  footerGroup?: Record<string, any>,
  themeContent?: Record<string, any>
) => {
  const body: IViewReq = {
    theme_id: id,
    settings_data: settings,
    headerGroup: headerGroup,
    footerGroup: footerGroup,
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

export const downloadShopitTheme = async (
  intentId: string,
  id: string,
  settingsData: Record<string, any> | undefined,
  templates: Record<string, any> | undefined
) => {
  const body: IDownloadReq = {
    intentId: intentId,
    theme_id: id,
    settings_data: settingsData,
    templates: templates,
  };

  const response = await fetch(`${MAKE_UI_URL}/api/download`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: MAKE_UI_API,
    },
    body: JSON.stringify(body),
  });

  const blob = await response.blob();
  return blob;
};
