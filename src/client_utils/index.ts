import { V2ProjectsService, DOCUMENT_TYPE, PROJECT_TYPE } from "../client";
import { OpenAPI } from "../client";

export interface DocumentData {
  type: DOCUMENT_TYPE;
  text: string;
}
export interface SharedData {
  name: string;
  description: string;
  public: boolean;
  url: string;
  img_url: string;
  tags: string[];
}
export const saveProject = async (
  token: string,
  projectType: PROJECT_TYPE,
  sharedData: SharedData,
  contentDocuments: DocumentData[],
  stylesDocuments: DocumentData[],
  otherDocuments?: DocumentData[]
) => {
  OpenAPI.TOKEN = token;
  // Content
  const data = {
    ...sharedData,
    type: projectType,
    data: {
      content: contentDocuments.map(d => ({ ...sharedData, type: d.type, data: { text: d.text } })),
      styles: stylesDocuments.map(d => ({ ...sharedData, type: d.type, data: { text: d.text } })),
      other: otherDocuments?.map(d => ({ ...sharedData, type: d.type, data: { text: d.text } })) || [],
    },
  };
  console.log("DATA: ", data)
  const res = await V2ProjectsService.createUserProjectV2UserProjectsPost(data);
  return res;
};
