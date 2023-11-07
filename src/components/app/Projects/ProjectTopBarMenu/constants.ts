import type { UIProjectsPage } from "./types";

export const PROJECT_PAGES: Record<UIProjectsPage, UIProjectsPage> = {
  Websites: "Websites",
  Shopifythemes: "Shopifythemes",
  Webapps: "Webapps",
  Emailtemplates: "Emailtemplates",
  Presentations: "Presentations",
  Create: "Create"
};

export type PagesType = UIProjectsPage;
