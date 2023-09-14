import { createBody, createHead, useDevMode } from "../../../../atoms";
import { EventSourcePolyfill } from "event-source-polyfill";
import { BASE_URL, TEST_URL } from "../../constants";
import type { DataType, StatusCallback } from "./types";
import { formatters, parsers } from "./utils";

const EVENT_COUNT_LIMIT = 5 + 1;

/** Receives a callback to execute on stream ending. Return true if all ok. */
export const executeSlots = async (
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
      throw new Error("No body or head found.");
    }
    // Maps
    const stores = { html: createBody, css: createHead };
    const sections = { html: body, css: head };
    const streamData = { html: "", css: "" };
    // Reset states
    Object.values(stores).forEach(store => store.set(""));
    Object.values(sections).forEach(section => (section.innerHTML = ""));
    var eventCount = 0;
    // Stream
    const message_type = useDevMode.get() ? "dev" : "prod";
    const eventStream = new EventSourcePolyfill(`${TEST_URL}${query}&message_type=${message_type}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    eventStream.addEventListener("message", async e => {
      if (signal.aborted) {
        console.log("ABORTED_STREAM");
        eventStream.close();
        callback(false, undefined);
        return;
      }
      const { type, data }: { type: DataType | "error"; data: string } = JSON.parse(e.data);
      // DELETE ME
      // console.log(data);
      console.log(type, data);
      if (type === "error") {
        console.log("ERROR_STREAM", data);
        sections["html"].innerHTML = `<div>${data}</div>`;
        // eventStream.close();
        callback(false, undefined);
        return;
      }
      if (data === "[DONE]") {
        eventCount += 1;
        stores[type].set(formatters[type](streamData[type]));
        if (eventCount >= EVENT_COUNT_LIMIT) {
          console.log("END");
          console.log("END_STREAM", eventCount);
          // Update HTML with images.
          sections.html.innerHTML = formatters.html(streamData.html);
          eventStream.close();
          callback(true, stores);
          return;
        }
      } else {
        // console.log(data);
        streamData[type] += data;
        sections[type].innerHTML = parsers[type](streamData[type], message_type === "prod");
      }
    });
    eventStream.addEventListener("open", () => {
      console.log("OPEN_STREAM");
    });
    eventStream.addEventListener("error", e => {
      console.log("ERROR_STREAM", e);
      eventStream.close();
      callback(false, undefined);
    });
  };
};
