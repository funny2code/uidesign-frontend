import { createBody, createHead, generatedProjectsIds } from "../../../../atoms";
import { EventSourcePolyfill } from "event-source-polyfill";
import type { DataType, StatusCallback } from "./types";
import { formatters, parsers } from "./utils";
import { BASE_URL } from "../../constants";

export type StreamType = DataType | "error" | "info" | "id" | "head" | "layout";
/** Receives a callback to execute on stream ending. Return true if all ok. */
export const executeCreate = async (
  iframe: HTMLIFrameElement,
  signal: AbortSignal,
  query: string,
  token: string,
  callback: StatusCallback
) => {
  iframe.onload = async () => {
    const body = iframe.contentWindow?.document.body;
    const head = iframe.contentWindow?.document.head;
    if (!body || !head) {
      throw new Error("No body or head found for iframe.");
    }
    const stores = { html: createBody, css: createHead };
    const sections = { html: body, css: head };
    const streamData = { html: {}, css: "" } as Record<string, any>;
    let layout: string[] = [];
    Object.values(stores).forEach(store => store.set(""));
    Object.values(sections).forEach(section => (section.innerHTML = ""));
    const eventStream = new EventSourcePolyfill(`${BASE_URL}/stream/create${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    eventStream.addEventListener("message", async e => {
      if (signal.aborted) {
        console.log("ABORTED_STREAM");
        eventStream.close();
        return callback(false);
      }
      const { type, data }: { type: StreamType; data: any } = JSON.parse(e.data);
      switch (type) {
        case "head":
          head.innerHTML = data;
          streamData.css = data;
          return;
        case "error":
          console.log("ERROR_STREAM", data);
          sections.html.innerHTML = `<div>${data}</div>`;
          return callback(false, undefined);
        case "info":
          return console.log("INFO_STREAM", data);
        case "id":
          generatedProjectsIds.set({ ...generatedProjectsIds.get(), Create: data });
          stores.css.set(streamData.css);
          stores.html.set(
            Object.entries(streamData.html)
              .map(([k, v]) => v)
              .join("\n")
          );
          eventStream.close();
          console.log("END_STREAM", data);
          return callback(true, stores);
        case "layout":
          layout = data;
          data.forEach((name: string) => {
            streamData.html[name] = "";
          });
          return;
        case "html":
          streamData.html[data.name] = data.data;
          sections.html.innerHTML = Object.entries(streamData.html)
            .map(([k, v]) => v)
            .join("\n");
          return;
        case "css":
          streamData.css += parsers.css(data);
          sections.css.innerHTML = streamData.css;
          return;
      }
    });
    eventStream.addEventListener("open", () => {
      console.log("START_STREAM");
    });
    eventStream.addEventListener("error", e => {
      console.log("ERROR_STREAM");
      eventStream.close();
      callback(false, undefined);
    });
  };
};
