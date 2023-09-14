import type { ProjectDocumentsResult, ProjectResult } from "../../../client";
import { HTML_EXPORT_BASE } from "../constants";
import JSZip from "jszip";

export interface Props {
  project: ProjectResult;
  content: ProjectDocumentsResult[];
  styles?: ProjectDocumentsResult[];
  other?: ProjectDocumentsResult[];
}

export const exportZIP = async ({ project, content, styles, other }: Props) => {
  const stylesDirectory = "styles";
  const dataDirectory = "data";
  var zip = new JSZip();
  // Add directories.
  var stylesFolder = zip.folder(stylesDirectory);
  var dataFolder = zip.folder(dataDirectory);
  var stylesheets = [] as string[];
  if (styles) {
    let count = 0;
    styles.forEach(s => {
      count += 1;
      const file = `style${count}.css`;
      stylesFolder?.file(file, s.data?.text || "");
      stylesheets.push(`<link rel="stylesheet" href="${stylesDirectory}/${file}">`);
    });
  }
  // NOTE: assuming that other documents are all json
  if (other) {
    other.forEach(s => {
      const file = `${s.type.replace(".", "_")}.json`;
      dataFolder?.file(file, JSON.stringify(s.data, null, 4) || "");
    });
  }
  // Add root files.
  zip.file("metadata.json", JSON.stringify(project, null, 4));
  const htmlText = content.map(c => c.data?.text || "").join();
  zip.file(
    "index.html",
    styles
      ? HTML_EXPORT_BASE.replace(/\{styles\}/, stylesheets.join("\n")).replace(/\{content\}/, htmlText)
      : htmlText
  );
  // Download.
  const zipContent = await zip.generateAsync({ type: "blob" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(zipContent);
  a.download = `uidesign-${project.id}.zip`;
  a.click();
};
