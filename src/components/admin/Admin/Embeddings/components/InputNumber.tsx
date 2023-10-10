interface Props {
  value: number;
  setValue: (value: number) => void;
  // placeholder: string;
  label: string;
}

const InputNumber = ({ value, setValue, label }: Props) => {
  return (
    <div className="col-6 col-lg-3 my-1">
      <div className="input-group">
        <span className="input-group-text">{label}</span>
        <input
          type="number"
          step={0.01}
          max={1.0}
          min={0.0}
          className="form-control"
          onChange={e => setValue(parseFloat(e.target.value))}
          value={value}
        />
      </div>
    </div>
  );
};

export default InputNumber;
