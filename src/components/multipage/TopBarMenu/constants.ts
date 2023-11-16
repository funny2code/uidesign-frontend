import type { UIDesignAdminPage, UIDesignPage } from "./types";

// page objects now use strict literal keys and a route name for value

export const PAGES: Record<UIDesignPage, string> = {
  Components: "/",
};
export const ADMIN_PAGES: Record<UIDesignAdminPage, string> = {
  Old: "/old",
  Copy: "/copy",
  Remix: "/remix",
  Shopify: "/shopify",
  Build: "/build",
  Create: "/create",
};

export type PagesType = UIDesignPage | UIDesignAdminPage;
