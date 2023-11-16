import type { UIDesignAdminPage, UIDesignPage } from "./types";

// page objects now use strict literal keys and a route name for value

export const PAGES: Record<UIDesignPage, string> = {
  Components: "/",
  Shopify: "/shopify",
};
export const ADMIN_PAGES: Record<UIDesignAdminPage, string> = {
  Build: "/build",
  Old: "/old",
  Copy: "/copy",
  Remix: "/remix",
  Create: "/create",
};

export type PagesType = UIDesignPage | UIDesignAdminPage;
