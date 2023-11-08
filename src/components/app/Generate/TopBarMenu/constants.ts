import type { UIDesignAdminPage, UIDesignPage } from "./types";

export const PAGES: Record<UIDesignPage, UIDesignPage> = {
  Components: "Components",
};
export const ADMIN_PAGES: Record<UIDesignAdminPage, UIDesignAdminPage> = {
  Old: "Old",
  Copy: "Copy",
  Remix: "Remix",
  Shopify: "Shopify",
  Build: "Build",
  Create: "Create",
};

export type PagesType = UIDesignPage | UIDesignAdminPage;
