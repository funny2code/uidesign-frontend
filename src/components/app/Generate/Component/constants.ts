export const DEFAULT_SYSTEM_PROMPT : string = 
"As a skilled developer, please create a professional and stylish React component code.\n \
Ensure that the code is clean, structured, and follows best practices.\n \
Use a functional component with an arrow function, and assume that Tailwind CSS is installed. \n \
Component doesn't have props. \n \
Must provide only code.";

export const ENGINE_TYPE = [
    {
        name: "GPT3.5",
        value: "gpt-3.5-turbo",
    },
    {
        name: "GPT4",
        value: "gpt-4",
    }
];

export const BASE_PROJECT: string = "emanation-ai/vite-ts-react-shadcn-tw/tree/component-base";