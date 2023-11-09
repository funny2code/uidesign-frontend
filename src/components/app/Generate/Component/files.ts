export const files = {
    src:{
        directory:{
            'App.tsx': {
                file: {
                  contents: `
                  function App({ children }: any) {
                    return (
                      <>
                        <div className="text-center mt-10">{children}</div>
                      </>
                    );
                  }
                  
                  export default App;                  
                  `,
                },
            },
            'component0.tsx': {
            file: {
                contents: 
`const Component = () => {
  return "";
};

export default Component;`,
            },
            },
            'component1.tsx': {
                file: {
                    contents: 
`const Component = () => {
  return "";
};

export default Component;`,
                },
            },
            'component2.tsx': {
                file: {
                    contents: 
`const Component = () => {
  return "";
};

export default Component;`,
                },
            },
            'index.css': {
            file: {
                contents: `
                @tailwind base;
                @tailwind components;
                @tailwind utilities;
                `,
            },
            },
            'main.tsx': {
                file: {
                    contents: `
                    import React from "react";
                    import ReactDOM from "react-dom/client";
                    import App from "./App.tsx";
                    import "./index.css";
                    import Component0 from "./component0.tsx";
                    import Component1 from "./component1.tsx";
                    import Component2 from "./component2.tsx";
                    import { createBrowserRouter, RouterProvider } from "react-router-dom";

                    const router = createBrowserRouter([
                    {
                        path: "/0",
                        element: (
                        <App>
                            <Component0 />
                        </App>
                        ),
                    },
                    {
                        path: "/1",
                        element: (
                        <App>
                            <Component1 />
                        </App>
                        ),
                    },
                    {
                        path: "/2",
                        element: (
                        <App>
                            <Component2 />
                        </App>
                        ),
                    },
                    ]);

                    ReactDOM.createRoot(document.getElementById("root")!).render(
                    <React.StrictMode>
                        <RouterProvider router={router} />
                    </React.StrictMode>
                    );
                    `,
                },
            },
            'vite-env.d.ts': {
            file: {
                contents: `
                /// <reference types="vite/client" />
                `,
            },
            },
        }
    },

    'index.html': {
      file: {
        contents: `
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Vite + React + TS</title>
          </head>
          <body>
            <div id="root"></div>
            <script type="module" src="/src/main.tsx"></script>
          </body>
        </html>
        `,
      },
    },
    'package.json': {
        file: {
          contents: `
          {
            "name": "vite-react-typescript-starter",
            "private": true,
            "version": "0.0.0",
            "type": "module",
            "scripts": {
              "dev": "vite",
              "build": "tsc && vite build",
              "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
              "preview": "vite preview"
            },
            "dependencies": {
              "class-variance-authority": "^0.7.0",
              "clsx": "^2.0.0",
              "lucide-react": "^0.274.0",
              "react": "^18.2.0",
              "react-dom": "^18.2.0",
              "react-router-dom": "^6.15.0",
              "tailwind-merge": "^1.14.0",
              "tailwindcss-animate": "^1.0.7"
            },
            "devDependencies": {
              "@types/node": "^20.5.9",
              "@types/react": "^18.2.18",
              "@types/react-dom": "^18.2.7",
              "@typescript-eslint/eslint-plugin": "^6.2.1",
              "@typescript-eslint/parser": "^6.2.1",
              "@vitejs/plugin-react": "^4.0.4",
              "autoprefixer": "^10.4.15",
              "eslint": "^8.46.0",
              "eslint-plugin-react-hooks": "^4.6.0",
              "eslint-plugin-react-refresh": "^0.4.3",
              "postcss": "^8.4.29",
              "tailwindcss": "^3.3.3",
              "typescript": "^5.0.2",
              "vite": "^4.4.9"
            }
          }
          `,
        },
      },
    'postcss.config.js': {
    file: {
        contents: `
        export default {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
        }
        `,
    },
    },
    'tailwind.config.js': {
    file: {
        contents: `
        /** @type {import('tailwindcss').Config} */
        module.exports = {
        darkMode: ["class"],
        content: [
            './pages/**/*.{ts,tsx}',
            './components/**/*.{ts,tsx}',
            './app/**/*.{ts,tsx}',
            './src/**/*.{ts,tsx}',
            ],
        theme: {},
        plugins: [require("tailwindcss-animate")],
        }`,
    },
    },
    'tsconfig.json': {
    file: {
        contents: `
        {
        "compilerOptions": {
            "target": "ES2020",
            "useDefineForClassFields": true,
            "lib": ["ES2020", "DOM", "DOM.Iterable"],
            "module": "ESNext",
            "skipLibCheck": true,
        
            /* Bundler mode */
            "moduleResolution": "bundler",
            "allowImportingTsExtensions": true,
            "resolveJsonModule": true,
            "isolatedModules": true,
            "noEmit": true,
            "jsx": "react-jsx",
        
            /* Linting */
            "strict": true,
            "noUnusedLocals": true,
            "noUnusedParameters": true,
            "noFallthroughCasesInSwitch": true,
        
            "baseUrl": ".",
            "paths": {
            "@/*": ["./src/*"]
            }
        },
        "include": ["src"],
        "references": [{ "path": "./tsconfig.node.json" }]
        }
        `,
    },
    },
    'tsconfig.node.json': {
    file: {
        contents: `
        {
        "compilerOptions": {
            "composite": true,
            "skipLibCheck": true,
            "module": "ESNext",
            "moduleResolution": "bundler",
            "allowSyntheticDefaultImports": true
        },
        "include": ["vite.config.ts"]
        }
        `,
    },
    },
    'vite.config.ts': {
      file: {
        contents: `
        import path from "path";
        import react from "@vitejs/plugin-react";
        import { defineConfig } from "vite";
        
        export default defineConfig({
          plugins: [react()],
          resolve: {
            alias: {
              "@": path.resolve(__dirname, "./src"),
            },
          },
        });
        `,
      },
    },
  };