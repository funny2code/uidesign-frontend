import React from "react";

interface Props {
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
}

const Input = ({ value, setValue, placeholder }: Props) => {
  return (
    <div className="col-6 col-lg-3">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          onChange={e => setValue(e.target.value)}
          value={value}
        />
      </div>
    </div>
  );
};

export default Input;
