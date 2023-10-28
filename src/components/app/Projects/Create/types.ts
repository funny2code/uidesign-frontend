export interface IValue {
  name: string;
  value: string;
}
export interface IOptions {
  title: string;
  values: IValue[];
  selected: IValue | undefined;
  setSelected: (value: IValue) => void;
  horizontal?: boolean;
}
export interface ISopifyPages {
  _id: string;
  name: string;
}
