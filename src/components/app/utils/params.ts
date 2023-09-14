export interface IConfigParams {
  theme_id?: string;
  page?: string;
  font_size?: string;
  font_family?: string;
  spacing_values?: string;
  border_radius?: string;
  background_color?: string;
  style?: string;
}

export const parseConfigParams = (prompt: string, config: IConfigParams) => {
  let queryParams = `?prompt=${prompt}`;
  queryParams += Object.entries(config).reduce((acc, [key, value]) => {
    return value ? acc + `&${key}=${value}` : acc;
  }, "");
  return queryParams;
};
