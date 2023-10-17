import type { UIDesignAdminPage, UIDesignPage } from "./types";

export const PAGES: Record<UIDesignPage, UIDesignPage> = {
  Create: "Create",
  Copy: "Copy",
  Remix: "Remix",
};
export const ADMIN_PAGES: Record<UIDesignAdminPage, UIDesignAdminPage> = {
  Shopify: "Shopify",
  Build: "Build",
  Create2: "Create2",
};

export type PagesType = UIDesignPage | UIDesignAdminPage;
