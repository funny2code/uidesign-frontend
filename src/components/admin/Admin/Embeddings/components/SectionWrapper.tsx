import React from "react";

const SectionWrapper = ({ children }: React.PropsWithChildren) => {
  return <div className="container-fluid px-4">{children}</div>;
};

export default SectionWrapper;
