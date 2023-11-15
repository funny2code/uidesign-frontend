export const SYSTEM_PROMPT = {
  Chat: [
    "",
    "As a skilled developer, please create professional and stylish React component code.\n \
        Ensure that the code is clean, structured, and follows best practices.\n \
        Use functional component with an arrow function, and assume that Tailwind CSS is installed.\n \
        Component doesn't have props. Provide only code. Don't need else words.",
    "As a skilled developer, please update professional and stylish React component code.\n \
        Ensure that the code is clean, structured, and follows best practices.\n \
        Use functional component with an arrow function, and assume that Tailwind CSS is installed.\n \
        Component doesn't have props.",
  ],
  Image: [
    "",
    "As a skilled developer, please create professional and stylish React component code as same as image user input\n \
        Ensure that the code is clean, structured, and follows best practices.\n \
        Use functional component with an arrow function, and assume that Tailwind CSS is installed.\n \
        Component doesn't have props. Provide only code. Don't need else words.",
    "As a skilled developer, please update professional and stylish React component code.\n \
        Ensure that the code is clean, structured, and follows best practices.\n \
        Use functional component with an arrow function, and assume that Tailwind CSS is installed.\n \
        Component doesn't have props.",
  ],
};

export const EXTRA_USER_PROMPT = "make me 3 different versions of above component with different style";

export const ENGINE_TYPE = [
  {
    name: "gpt-3.5-turbo-1106",
    value: "gpt-3.5-turbo-1106",
  },
  {
    name: "gpt-3.5-turbo-16k",
    value: "gpt-3.5-turbo-16k",
  },
  // {
  //     name: "gpt-4-32k-0613",
  //     value: "gpt-4-32k-0613",
  // },
  // {
  //     name: "gpt-4-32k",
  //     value: "gpt-4-32k",
  // },
  {
    name: "gpt-4",
    value: "gpt-4",
  },
];

export const PROMPT_TYPE = {
  Image: "Image",
  Chat: "Chat",
};

export const BASE_PROJECT: string = "emanation-ai/vite-ts-react-shadcn-tw/tree/component-base";

export enum STAGE {
  Init,
  First,
  Second,
  Last,
}

export const LIST_COUNT = 3;

export const SUGGEST_PROMPTS_FIRST_CHAT = [
  "Create a navigation bar.",
  "Design a login form.",
  "Develop a search bar.",
  "Build a registration form.",
  "Design a progress bar.",
  "Create a slider component.",
  "Implement a tooltip.",
  "Build an image carousel.",
  "Design a modal popup.",
  "Create an accordion menu.",
  "Build a dropdown menu.",
  "Design a date picker.",
  "Implement a rating system.",
  "Build a toggle switch.",
  "Create a loading spinner.",
  "Design a contact form.",
  "Implement a social media share button.",
  "Build a notification system.",
  "Create a sidebar menu.",
  "Design a profile card.",
  "Implement a checkbox group.",
  "Build a radio button group.",
  "Create a stepper component.",
  "Design a breadcrumb navigation.",
  "Build a tag input.",
  "Implement a file upload component.",
  "Create a progress tracker.",
  "Build a calendar widget.",
  "Design a time picker.",
  "Implement a color picker.",
  "Create a card component.",
  "Build a chat interface.",
  "Design a date range picker.",
  "Implement a treeview.",
  "Build a form validation system.",
  "Create a bar chart.",
  "Design a pie chart.",
  "Implement a line chart.",
  "Build a scatter plot.",
  "Create a radar chart.",
  "Design a doughnut chart.",
  "Implement a gauge chart.",
  "Build a heat map.",
  "Create a table with sorting.",
  "Design a table with pagination.",
  "Implement a table with filtering.",
  "Build a table with draggable columns.",
  "Create a stepper form.",
  "Design a wizard form.",
  "Implement a multi-step form.",
  "Build a responsive grid system.",
  "Create a navbar with dropdowns.",
  "Design a mega menu.",
  "Implement a tabbed interface.",
  "Build a progress steps component.",
  "Create a countdown timer.",
  "Design a feature comparison table.",
  "Implement a product catalog.",
  "Build a product carousel.",
  "Create a testimonial slider.",
  "Design a team member showcase.",
  "Implement an image gallery.",
  "Build a timeline component.",
  "Create a pricing table.",
  "Design a weather widget.",
  "Implement a clock widget.",
  "Build a calculator component.",
  "Create a quiz form.",
  "Design a survey form.",
  "Implement a feedback form.",
  "Build a rating and review system.",
  "Create a newsletter signup form.",
  "Design a navigation drawer.",
  "Implement a floating action button.",
  "Build a user profile page.",
  "Create a user settings page.",
  "Design a dark mode toggle.",
  "Implement a theme switcher.",
  "Build a customizable avatar.",
  "Create a country selector.",
  "Design a language switcher.",
  "Implement a currency converter.",
  "Build a social media feed.",
  "Create a live chat widget.",
  "Design a contact list.",
  "Implement a progress timeline.",
  "Build a document editor.",
  "Create a task list.",
  "Design a note-taking app.",
  "Implement a file manager.",
  "Build a stopwatch component.",
  "Create a timer component.",
  "Design a video player.",
  "Implement an audio player.",
  "Build a code editor.",
  "Create a markdown editor.",
  "Design a calendar scheduler.",
  "Implement a project management board.",
  "Build a Kanban board.",
  "Create a mind map visualization.",
];

export const SUGGEST_PROMPTS_SECOND = [
  "Increase font size.",
  "Decrease font size.",
  "Change background color to a gradient.",
  "Change color to a gradient.",
  "Add a box shadow to the component.",
  "Apply a border-radius.",
  "Use a different font family.",
  "Adjust letter spacing.",
  "Modify line height.",
  "Change text color to a vibrant shade.",
  "Add a subtle animation to the component.",
  "Update padding and margin.",
  "Implement a hover effect.",
  "Apply a border to the component.",
  "Adjust opacity of the background.",
  "Rotate the component slightly.",
  "Invert the colors.",
  "Create a 3D effect with shadows.",
  "Make the component responsive.",
  "Apply a blur effect.",
  "Apply a hover effect.",
  "Add a background image.",
  "Use a different text alignment.",
  "Apply a grayscale filter.",
  "Adjust the width and height.",
  "Change the cursor on hover.",
  "Implement a pulsating effect.",
  "Create a border gradient.",
  "Use a custom icon or image.",
  "Apply a scale transformation.",
  "Animate the component on click.",
  "Adjust the z-index.",
  "Create a border transition effect.",
  "Use a background pattern.",
  "Apply a contrast filter.",
  "Adjust the opacity on hover.",
  "Rotate the component on hover.",
  "Implement a shake animation.",
  "Add a box shadow on hover.",
  "Apply a transition to font color.",
  "Use a different hover color.",
  "Use a different click color.",
  "Create a ripple effect on click.",
  "Adjust the perspective.",
  "Animate the font color change.",
  "Use a linear gradient background.",
  "Add a glow effect to the component.",
  "Change the font weight.",
  "Apply a saturation filter.",
  "Use a different font style (italic, bold).",
  "Adjust the border width.",
  "Implement a pulsating border effect.",
  "Create a neon glow effect.",
  "Apply a transition to box shadow.",
  "Use a radial gradient background.",
  "Adjust the opacity on scroll.",
  "Change the font color on scroll.",
  "Create a bounce animation.",
  "Use a different text transform.",
  "Apply a jitter effect on hover.",
  "Add a ribbon or badge.",
  "Create a parallax scrolling effect.",
  "Adjust the opacity on click.",
  "Rotate the component on click.",
  "Implement a fade-in animation.",
  "Change the font color randomly.",
  "Apply a blur effect on hover.",
  "Animate the border color change.",
  "Use a different hover font color.",
  "Create a glitch effect.",
  "Apply a ripple effect on hover.",
  "Adjust the component's skew.",
  "Change the font color on focus.",
  "Add a glow effect on hover.",
  "Animate the border radius change.",
  "Use a different hover background.",
  "Create a spin animation.",
  "Apply a transition to letter spacing.",
  "Use a different hover border color.",
  "Add a shadow on scroll.",
  "Change the font color on resize.",
  "Implement a zoom-in animation.",
  "Apply a transition to line height.",
  "Use a different hover text color.",
  "Add a zoom-out animation.",
  "Change the font color on mouseover.",
  "Implement a grow/shrink effect.",
  "Use a different hover box shadow.",
  "Apply a transition to padding.",
  "Create a heartbeat animation.",
  "Adjust the opacity on mouseover.",
  "Rotate the component on mouseover.",
  "Change the font color on context menu.",
  "Apply a shake effect on click.",
  "Use a different hover border radius.",
  "Add a bounce-in animation.",
  "Create a flip animation.",
  "Adjust the opacity on focus.",
  "Adjust the opacity on hover.",
  "Change the font color on double click.",
];

export enum FRAMES {
  Desktop,
  Tablet,
  MobileWide,
  Mobile,
}

export const FRAME_WIDTH = ["100%", "768px", "500px", "375px"];

export const PACKAGE_LOCK_FILE_PATH =
  "https://cdn.uidesign.ai/build/components/default/package-lock.json";
export const NODE_MODULES_FILE_PATH =
  "https://cdn.uidesign.ai/build/components/default/node_modules.zip";

export const BACKEND_API_URL = "https://ui-design-backend-yov2.vercel.app/api";
