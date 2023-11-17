import { useState, useEffect, useRef, Fragment } from "react";
import { useSession } from "../../auth/useSession.tsx";
import { useStore } from '@nanostores/react';
import { grapesIframeDoc } from '../../../atoms.ts'

const GrapesEditor = () => {
    const iframeDoc = useStore(grapesIframeDoc);
    console.log("Atom store value: ", iframeDoc)
    /*
    let iframeSection = sectionRef.current;
    iframeSection.innerHTML = "";
    let iframe = document.createElement("iframe");
    iframe.width = "100%";
    iframe.height = "600px";
    iframe.srcdoc = html_text;
    iframeSection.appendChild(iframe);
    */
    return (
        <section className="designer-window hstack flex-grow-1">
          <iframe
            srcDoc={iframeDoc}
            title="Grapes Editor"
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        </section>
    )
}

export default GrapesEditor;