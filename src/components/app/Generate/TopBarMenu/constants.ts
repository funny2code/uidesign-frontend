import type { UIDesignAdminPage, UIDesignPage } from "./types";

export const PAGES: Record<UIDesignPage, UIDesignPage> = {
  Old: "Old",
  Copy: "Copy",
  Remix: "Remix",
};
export const ADMIN_PAGES: Record<UIDesignAdminPage, UIDesignAdminPage> = {
  Shopify: "Shopify",
  Build: "Build",
  Create: "Create",
  Components: "Components",
};

export type PagesType = UIDesignPage | UIDesignAdminPage;
