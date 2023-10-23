import { useState, useRef, useEffect } from "react";
import { PAGES, ADMIN_PAGES } from "./TopBarMenu/constants";
import type { UIDesignAdminPage, UIDesignPage } from "./TopBarMenu/types";
import TopBarMenu from "./TopBarMenu";
import Shopify from "./Shopify";
import Create from "./Create";
import Old from "./Old";
import Build from "./Build";
import Remix from "./Remix";
import Copy from "./Copy";
import Components from "./Component";

const HEIGHT_OFFSET = 68;
const Generate = () => {
  // Flow
  const [currentPage, setCurrentPage] = useState<UIDesignPage | UIDesignAdminPage>(PAGES.Old);
  const handlePageChange = (page: UIDesignPage | UIDesignAdminPage) => {
    setCurrentPage(page);
  };
  const [runBuild, setRunBuild] = useState(false);
  const stackblitzRef = useRef<HTMLDivElement>(null);
  const otherRef = useRef<HTMLDivElement>(null);
  const pages = {
    [PAGES.Old]: <Old />,
    [PAGES.Copy]: <Copy />,
    [PAGES.Remix]: <Remix />,
    [ADMIN_PAGES.Shopify]: <Shopify />,
    [ADMIN_PAGES.Build]: <></>, // Build
    [ADMIN_PAGES.Create]: <Create />,
    [ADMIN_PAGES.Components]: <Components />,
  };
  useEffect(() => {
    // Load the Stackblitz iframe on this Component's render to avoid re-creating on page change.
    const stackblitz = stackblitzRef.current;
    const other = otherRef.current;
    if (!stackblitz || !other) return;
    if (currentPage === ADMIN_PAGES.Build) {
      const embed = stackblitz.querySelector("#embed");
      if (embed) {
        embed.setAttribute("height", String(other.clientHeight));
      }
      stackblitz.style.display = "block";
      other.style.display = "none";
      stackblitz.style.pointerEvents = "auto";
      other.style.pointerEvents = "none";
      setRunBuild(true);
    } else {
      stackblitz.style.display = "none";
      other.style.display = "block";
      stackblitz.style.pointerEvents = "none";
      other.style.pointerEvents = "auto";
    }
  }, [currentPage]);
  return (
    <section className="designer d-flex flex-column justify-content-between">
      <TopBarMenu currentPage={currentPage} handlePageChange={handlePageChange} />
      <section ref={otherRef} className="d-flex flex-column flex-grow-1">
        {pages[currentPage]}
      </section>
      <section ref={stackblitzRef}>
        {runBuild && stackblitzRef.current && <Build height={800} />}
      </section>
    </section>
  );
};

export default Generate;
