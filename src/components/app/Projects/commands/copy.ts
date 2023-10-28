import { copyHTML, copyCSS } from "../../../../atoms";
import { HTML_COPY_URL } from "../../constants";
import { DOCUMENT_TYPE } from "../../../../client";
import type { StatusCallback } from "./types";

/** Start async function execution */
export const executeCopy = async (
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
      const res = await fetch(`${HTML_COPY_URL}${query}`, {
        signal: signal,
      });
      if (!res.ok) {
        throw new Error("Failed to copy.");
      }
      const siteHTML = await res.text();
      body.innerHTML = siteHTML;
      copyHTML.set(siteHTML);
      copyCSS.set("");
      callback(true, {
        [DOCUMENT_TYPE.HTML]: copyHTML,
        [DOCUMENT_TYPE.CSS]: copyCSS,
      });
    } catch (err) {
      console.log(err);
      callback(false, undefined);
      return;
    }
  };
  return;
};
