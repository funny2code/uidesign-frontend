import React from "react";

interface Props {
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
}

const Input = ({ value, setValue, placeholder, required = false, disabled = false }: Props) => {
  return (
    <div className="col-6 col-lg-3 my-1">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          onChange={e => setValue(e.target.value)}
          value={value}
          required={required}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default Input;
