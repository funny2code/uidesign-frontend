export const COLORS = [
  {
    name: "oxford blue",
    value: "#314060",
  },
  {
    name: "light green",
    value: "#A0E8AF",
  },
  {
    name: "black",
    value: "#181818",
  },
  {
    name: "dark gray",
    value: "#444444",
  },
  {
    name: "white",
    value: "#FFFFFF",
  },
  {
    name: "light red",
    value: "#FF6B6B",
  },
  {
    name: "light brown",
    value: "#EDB183",
  },
  {
    name: "light yellow",
    value: "#FFE66D",
  },
];
export const FONT_SIZES = [
  {
    name: "Small",
    value: "small",
  },
  {
    name: "Medium",
    value: "medium",
  },
  {
    name: "Large",
    value: "large",
  },
  {
    name: "Largest",
    value: "extra large",
  },
];
export const FONT_NAMES = [
  {
    name: "Helvetica",
    value: "Helvetica",
  },
  {
    name: "Arial",
    value: "Arial",
  },
  {
    name: "Cambria",
    value: "Cambria",
  },
  {
    name: "Roboto",
    value: "Roboto",
  },
];
export const BORDER_RADIUS = [
  {
    name: "None",
    value: "none",
  },
  {
    name: "Small",
    value: "small",
  },
  {
    name: "Medium",
    value: "medium",
  },
  {
    name: "Large",
    value: "large",
  },
];
export const SPACING_VALUES = [
  {
    name: "Small",
    value: "small",
  },
  {
    name: "Medium",
    value: "medium",
  },
  {
    name: "Large",
    value: "large",
  },
  {
    name: "Largest",
    value: "extra large",
  },
];
export const CSS_CONFIG = [
  {
    name: "Tailwind",
    value: "tailwind",
  },
  {
    name: "Lumina",
    value: "lumina",
  },
];
interface IStyles {
  [key: string]: string;
}
export const STYLES: IStyles = {
  "index&settings=style": "colors, typography, buttons, inputs",
  index:
    "logo, layout, animation, variant pills, content containers, brand information, dropdowns and pop-ups, social media",
  product: "product cards, badges, currency format",
  collection: "collection cards, media",
  blog: "blog cards",
  cart: "drawers, cart",
  search: "search behavior",
};
