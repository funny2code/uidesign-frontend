import { HTML_IFRAME_BASE } from "../constants";

/** Creates a new frame in given HTML section and sets defaults. */
export const initFrame = (iframeSection: HTMLDivElement, HTML: string | undefined = undefined) => {
  iframeSection.innerHTML = "";
  let iframe = document.createElement("iframe");
  iframe.width = "100%";
  iframe.height = "100%";
  iframeSection.appendChild(iframe);
  iframe.srcdoc = HTML ? HTML : HTML_IFRAME_BASE;
  iframe.setAttribute("sandbox", "");
  return iframe;
};
