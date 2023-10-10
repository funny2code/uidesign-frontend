import { DOCUMENT_TYPE, PROJECT_TYPE } from "../../../../../client";
//
interface Props {
  value: string;
  setValue: (value: DOCUMENT_TYPE | PROJECT_TYPE) => void;
  section: string;
  allowAny?: boolean;
}

const InputType = ({ value, setValue, section, allowAny = false }: Props) => {
  return (
    <div className="col-6 col-lg-3">
      <div className="input-group">
        <span className="input-group-text">Type</span>
        <select
          className="form-select"
          value={value}
          onChange={e => setValue(e.target.value as DOCUMENT_TYPE)}
        >
          {allowAny && <option value={"Any"}>Any</option>}
          {section === "documents"
            ? Object.entries(DOCUMENT_TYPE).map(([k, v]) => (
                <option key={k} value={v}>
                  {v}
                </option>
              ))
            : section === "projects"
            ? Object.entries(PROJECT_TYPE).map(([k, v]) => (
                <option key={k} value={v}>
                  {v}
                </option>
              ))
            : null}
        </select>
      </div>
    </div>
  );
};

export default InputType;
