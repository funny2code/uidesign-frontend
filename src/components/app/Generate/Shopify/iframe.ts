/** Creates a new frame in given HTML section and sets defaults. */

export const initFrameShopify = (iframeSection: HTMLDivElement, src: string | undefined) => {
  iframeSection.innerHTML = "";
  let iframe = document.createElement("iframe");
  iframe.width = "100%";
  iframe.height = "100%";
  iframe.src = src ? src : "https://make-ui.herokuapp.com/api/random/view";
  // "https://make-ui.herokuapp.com/view/6306f8e7db2cbec8c440f780?page=index";
  iframeSection.appendChild(iframe);
  // iframe.srcdoc = "";
  // iframe.setAttribute("sandbox", "");
  // allow cross origin requests
  return iframe;
};
