import type React from "react";
interface ISettingElement extends React.PropsWithChildren {
  title: string;
}

const SettingElement = ({ title, children }: ISettingElement): React.ReactElement => {
  return (
    <div className="d-flex justify-content-start align-items-center my-2 py-1">
      <span className="w-25 ">{title}</span>
      {children}
    </div>
  );
};

export default SettingElement;
