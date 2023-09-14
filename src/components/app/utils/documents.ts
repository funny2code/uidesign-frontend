import { V2ProjectsService } from "../../../client";
import { exportZIP } from "./export";
import sdk from "@stackblitz/sdk";

export const fetchDocuments = async (id: string, preview: boolean = false) => {
  const res = await V2ProjectsService.readUserProjectDocumentsV2UserProjectsIdDocumentsGet(id, preview);
  const documents = res.result;
  return {
    content: documents.filter(d => d.category === "content"),
    styles: documents.filter(d => d.category === "styles"),
    other: documents.filter(d => d.category === "other"),
  };
};
export const exportDocuments = async (id: string) => {
  const res = await V2ProjectsService.readUserProjectV2UserProjectsIdGet(id);
  const documents = await fetchDocuments(id);
  await exportZIP({ project: res.result, ...documents });
};
export const editDocuments = async (id: string) => {
  const { content, styles, other } = await fetchDocuments(id);
  const contentData = content.map(c => c.data?.text || "").join("\n");
  let count = 0;
  const stylesFiles = styles.reduce((pre, cur) => {
    count += 1;
    return {
      ...pre,
      [`styles/style${count}.css`]: cur.data?.text || "",
    };
  }, {});
  // NOTE: assuming all other files are json
  const otherFiles = other.reduce(
    (pre, cur) => ({
      ...pre,
      [`data/${cur.type.split(".")[1] || cur.type}.json`]: JSON.stringify(cur.data || {}, null, 4),
    }),
    {}
  );
  sdk.openProject(
    {
      title: "UI Design",
      description: "UI Design Project",
      template: "javascript",
      files: {
        "index.html": contentData,
        ...stylesFiles,
        ...otherFiles,
        "index.js": Object.keys(stylesFiles)
          .map(f => `import './${f}'`)
          .join("\n"),
      },
      settings: {
        compile: {
          trigger: "auto",
          clearConsole: false,
        },
      },
    },
    {
      newWindow: true,
      openFile: ["index.html"],
    }
  );
};
