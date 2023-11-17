import { useState, useEffect, useRef, Fragment } from "react";
import { useSession } from "../../auth/useSession.tsx";
import { useStore } from '@nanostores/react';
import { grapesIframeDoc } from '../../../atoms.ts'

const CreateGrapesJs = () => {
    const { getSession } = useSession();
    const sectionRef = useRef<HTMLIFrameElement>(null);
    const project_nameRef = useRef<HTMLInputElement>(null);
    const project_tagRef = useRef<HTMLInputElement>(null);
    const project_descriptionRef = useRef<HTMLTextAreaElement>(null);
    const [privacyValue, setPrivacyValue] = useState("public");
    const [isCreated, setIsCreated] = useState(false);
    const [iframeDoc, setIframeDoc] = useState("");
    const handleChange = (e: any) => {
        setPrivacyValue(e.target.value);
    };

    return (
        <>
        {!isCreated ? (
            <section className="d-flex flex-wrap justify-content-start align-content-start gap-3" >
                <form>
                    <ul className="form-style-1">
                        <li>
                        <label>Name <span className="required">*</span></label>
                        <input type="text" ref={project_nameRef} name="field1" className="field-divided" placeholder="Project Name" />
                        
                        <label>Privacy</label>
                        <select name="field4" className="field-select" onChange={handleChange}>
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                        </li>
                        <li>
                            <label>Tags <span className="required">*</span></label>
                            <input type="email" ref={project_tagRef} name="field3" className="field-long" placeholder="Tag1, Tag2, Tag3" />
                        </li>
                        <li>
                            <label>Description <span className="required">*</span></label>
                            <textarea ref={project_descriptionRef} name="field5" id="field5" className="field-long field-textarea"></textarea>
                        </li>
                        <li>
                            <button 
                                type="button" 
                                className="btn btn-primary"
                                // onClick={ () => alert("ok") }                    
                                onClick = {
                                    async () => {
                                        if (!project_tagRef.current || !project_nameRef.current || !project_descriptionRef.current ) return;
                                        
                                        let tags = project_tagRef.current.value.split(",");

                                        const tokens = await getSession();
                                        // const res = await fetch("http://127.0.0.1:5000/display", {
                                        const res = await fetch("http://3.135.207.187/display", {
                                            method: "POST",
                                            headers: {
                                                'Accept': 'application/json',
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({
                                                refresh_token: tokens.refresh_token,
                                                action: "create_project",
                                                data: {
                                                name: project_nameRef.current.value ?? "test project by grapesjs", 
                                                public: privacyValue == "public" ? true: false,
                                                tags: project_tagRef.current.value.split(",") ?? [],
                                                description: project_descriptionRef.current.value ?? "test_project description", 
                                                context: {}
                                                }
                                            })
                                        }
                                    );
                                    const html_text = await res.text();
                                    console.log("HML: ", html_text)
                                    alert("ok")
                                    setIsCreated(true);
                                    setIframeDoc(html_text);
                                }}
                            >
                                CREATE PROJECT
                            </button>
                        </li>
                    </ul>
                </form>
            </section>
        ) : (
            <section className="designer-window hstack flex-grow-1">
                <iframe
                    ref={sectionRef}
                    srcDoc={iframeDoc}
                    title="Grapes Editor"
                    style={{ width: "100%", height: "100%", border: "none" }}
                />
            </section>
        )}
        </>
    );
};
export default CreateGrapesJs;