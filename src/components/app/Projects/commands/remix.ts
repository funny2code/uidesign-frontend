import { remixHTML, remixCSS } from "../../../../atoms";
import { DOCUMENT_TYPE } from "../../../../client";
import type { StatusCallback } from "./types";

export const PY_API_HOST = "https://uidesign-scrape.herokuapp.com/api";
/** Start async function execution */
export const executeRemix = async (
  iframe: HTMLIFrameElement,
  signal: AbortSignal,
  query: string,
  callback: StatusCallback
) => {
  // Buffered data fetch (non-streamed)
  iframe.onload = async () => {
    const body = iframe.contentWindow?.document.body;
    const head = iframe.contentWindow?.document.head;
    if (!body || !head) return;
    body.innerHTML = "";
    head.innerHTML = "";
    try {
      const res = await fetch(`${PY_API_HOST}${query}`, {
        signal: signal,
      });
      if (!res.ok) {
        throw new Error("Failed to execute.");
      }
      const siteHTML = await res.text();
      if (!siteHTML) {
        callback(false, undefined);
        return;
      }
      body.innerHTML = siteHTML;
      remixHTML.set(siteHTML);
      remixCSS.set("");
      callback(true, { [DOCUMENT_TYPE.HTML]: remixHTML, [DOCUMENT_TYPE.CSS]: remixCSS });
    } catch (err) {
      console.log(err);
      callback(false, undefined);
      return;
    }
  };
  return;
};
