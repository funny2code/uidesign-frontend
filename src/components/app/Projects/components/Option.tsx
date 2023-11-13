import type { IOptions } from "../Create/types";

const OptionElement = ({ title, values, selected, setSelected, horizontal = true }: IOptions) => {
  return (
    <li className="my-1 row px-3 pt-1">
      <span style={{ cursor: "pointer" }}>{title}</span>
      <ul
        className={`list-group ${horizontal ? "list-group-horizontal" : ""} gap-2 pt-2 px-2`}
        style={{ overflow: "auto" }}
      >
        {values.map((value, i) => (
          <li
            key={value.name}
            onClick={() => setSelected(value)}
            style={{
              listStyleType: "none",
              cursor: "pointer",
            }}
          >
            <button
              type={"button"}
              className={`btn btn-outline-secondary text-dark ${
                selected?.name === value.name ? "active border" : ""
              }`}
              style={{ fontSize: "0.9rem" }}
            >
              {value.name}
            </button>
          </li>
        ))}
      </ul>
    </li>
  );
};
export default OptionElement;
