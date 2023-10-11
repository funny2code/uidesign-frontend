export interface Props {
  text: string;
  callback?: () => void;
}

const Button = ({ text, callback = undefined }: Props) => {
  return (
    <div className="col-6 col-lg-3 my-1">
      <button
        className="btn btn-primary p-2"
        type={callback ? "button" : "submit"}
        onClick={() => callback && callback()}
      >
        {text}
      </button>
    </div>
  );
};

export default Button;
