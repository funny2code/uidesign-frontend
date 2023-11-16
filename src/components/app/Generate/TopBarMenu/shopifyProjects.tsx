import { useSession } from "../../../auth/useSession";
import { OpenAPI, PROJECT_TYPE, V2ProjectsService } from "../../../../client";
import { useEffect, useState } from "react";

const ShopifyProjects = ({ setProject }: {setProject: (e:any) => void }) => {
    
    const [projects, setProjects] = useState<any[] | []>([]);
    const [currentProjectId, setCurrentProjectId] = useState<string>("none");

    const onChangeHandle = async (e:any) => {
        if(!e) return;
        const {value} = e.target;
        if(value !== "none"){
            const { getSession } = useSession();
            const tokens = await getSession();
            OpenAPI.TOKEN = tokens.id_token;
            setCurrentProjectId(value);
            const data = await V2ProjectsService.readUserProjectDocumentsV2UserProjectsIdDocumentsGet(value);
            if(data?.result?.length > 0) setProject(data.result)
        } else {    
            setCurrentProjectId("none");
            setProject([]);
        }
    } 

    useEffect(() => {
        const init = async () => {
            const { getSession } = useSession();
            const tokens = await getSession();
            OpenAPI.TOKEN = tokens.id_token;
            const data = await V2ProjectsService.readUserProjectsV2UserProjectsGet(undefined, 25, PROJECT_TYPE.SHOPIFY);
            if(data?.result) setProjects(data.result);
        }
        init();
    }, [])

  return (
    <>
        {  projects?.length > 0 &&
            <select 
                onChange={onChangeHandle}
                value={currentProjectId} 
                className="form-select" 
                aria-label="Shopify Projects"
                style={{width: 'auto', height: '62px'}}>
                    <option key="none" value="none">Selecte Project</option>
                {
                    projects.map((project) => (
                        <option key={project.id} value={project.id}>{project.name}</option>
                    ))
                }
            </select>
        }
    </>
  );
};

export default ShopifyProjects;