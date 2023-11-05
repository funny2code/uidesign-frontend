export const SYSTEM_PROMPT = [
    "As a skilled developer, please create professional and stylish React component code.\n \
    Ensure that the code is clean, structured, and follows best practices.\n \
    Use functional component with an arrow function, and assume that Tailwind CSS is installed.\n \
    Component doesn't have props. Provide only code. Don't need else words.\n \
    ",
    "As a skilled developer, please update professional and stylish React component code.\n \
    Ensure that the code is clean, structured, and follows best practices.\n \
    Use functional component with an arrow function, and assume that Tailwind CSS is installed.\n \
    Component doesn't have props.\n \
    "
]

export const EXTRA_USER_PROMPT = 
"make me 3 different versions of above component with different style"

export const ENGINE_TYPE = [
    {
        name: "GPT 3.5 Turbo",
        value: "gpt-3.5-turbo",
    },
    {
        name: "GPT 4",
        value: "gpt-4",
    }
];

export const BASE_PROJECT: string = "emanation-ai/vite-ts-react-shadcn-tw/tree/component-base";

export enum STAGE{
    First,
    Second,
    Last
}

export const LIST_COUNT = 3;