export const getOptions = async (project_type: string) => {
  const subpath = project_type.replace("tree/", "").replace("emanation-ai/", "");
  const url = `https://cdn.uidesign.ai/build/${subpath}/index.default.json`;
  const res = await fetch(url);
  const data = await res.json();
  return Object.keys(data) as string[];
};

export function toTitleCase(str: string) {
  // Split the string into words
  const words = str.split(" ");

  // Capitalize the first letter of each word and make the rest of the letters lowercase
  const titleCaseWords = words.map(word => {
    // Check if the word is an acronym (in all uppercase)
    if (word === word.toUpperCase()) {
      return word;
    } else {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
  });

  // Join the words back together into a single string
  const titleCaseStr = titleCaseWords.join(" ");

  return titleCaseStr;
}
