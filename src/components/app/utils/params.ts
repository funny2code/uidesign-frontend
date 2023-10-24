export interface IConfigParams {
  theme_id?: string;
  pages?: string;
  globals?: string;
}

export const parseConfigParams = (prompt: string, config: IConfigParams) => {
  let queryParams = `?prompt=${prompt}`;
  queryParams += Object.entries(config).reduce((acc, [key, value]) => {
    return value ? acc + `&${key}=${value}` : acc;
  }, "");
  return queryParams;
};
