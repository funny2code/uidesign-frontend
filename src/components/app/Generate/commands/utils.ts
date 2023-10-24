import Parser from "css-simple-parser";
import type { DocumentProcessor } from "./types";

/** Parse text during stream. */
export const parsers: DocumentProcessor = {
  html: (data: string) => {
    // return data;
    const code = data.includes("```") ? data.split(/```.*\n/)[1] : data;
    const html = new DOMParser().parseFromString(code, "text/html");
    return html.body.innerHTML;
  },
  css: (data: string) => {
    return `<style>${Parser.stringify(Parser.parse(data))}</style>`;
  },
};
/** Parse and format at the end of stream. */
export const formatters: DocumentProcessor = {
  html: (data: string) => {
    // return data;
    const code = data.includes("```") ? data.split(/```.*\n/)[1] : data;
    const html = new DOMParser().parseFromString(code, "text/html");
    return html.body.innerHTML;
  },
  css: (data: string) => {
    return Parser.stringify(Parser.parse(data));
  },
};

export const loadingFeedback = (data: string) => {
  return `
  <style>
  body {
    display: flex;
    flex-direction: column; /* Display children in columns */
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
    background-color: #f0f0f0;
  }
  .spinner {
    border: 6px solid rgba(0, 0, 0, 0.1); /* Increase border-width for a chunkier spinner */
    border-left-color: #333;
    border-radius: 50%;
    width: 40px; /* Increase the width for a wider spinner */
    height: 40px; /* Increase the height for a wider spinner */
    animation: spin 1s linear infinite;
    margin: 20px; /* Add margin to the spinner */
    
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .row {
    display: flex; /* Display elements in a row */
    justify-content: center;
    align-items: center;
    margin: 10px 0; /* Add margin between rows */
  }
  .loading-text,
  .data-text {
    font-family: 'Roboto', sans-serif;
    font-size: 1.1rem;
    color: #333;
    margin: 0;
  }
  </style>
  <div class="spinner"></div>
  <p class="row data-text">${data.replace("Group", "")}</p>
  `;
};

export const axiosFile = (): string =>  
"import axios from 'axios'; \n \
export default axios.create({ \n \
  baseURL: import.meta.env.VITE_BASE_URL, \n \
  headers: { \n \
    'Content-type': 'application/json', \n \
    'Authorization': `Bearer " + "${import.meta.env.VITE_API_KEY}`" + "}});"

export const apiFile = (url: string): string =>
"import axios from './axios'; \n \
export const getData = async() => { \n \
    const response = await axios.get('" + url + "'); \n \
    return response.data; \n \
};"

export const envFile = (baseUrl: string) =>
`VITE_BASE_URL=${baseUrl}
VITE_API_KEY=${import.meta.env.PUBLIC_VITE_API_KEY}`

export const tableFile = () : string =>
`import React, { useState, useEffect, ReactElement } from "react";
import { getData } from "../api/api";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { adapt } from "@/a-adapters/adapter";

const ApiTableComponent: React.FC = (): ReactElement => {
  const [apiData, setApiData] = useState<Array<unknown>>([]);
  const getApiData = async () => {
    const response = await getData();
    // const data = adapt(response);

    setApiData(modifyData(response.data));
  };

  //Modify Data to output
  const modifyData = (data: Array<unknown>): Array<unknown> => {
    const timestampKeys = ["available_on", "created"];

    const temp = data.map((item: any, i: number) => {
      for (const key in item) {
        if (Array.isArray(item[key]) || typeof item[key] === "object") {
          delete item[key];
        }
        if (timestampKeys.includes(key)) {
          item[key] = new Date(item[key] * 1000).toLocaleDateString("en-US");
        }
        if (key === "id") {
          item[key] = i + 1;
        }
      }
      return item;
    });
    return temp;
  };

  useEffect(() => {
    getApiData();
  }, []);
  return apiData.length ? (
    <Table>
      <TableCaption>Adaptable component</TableCaption>
      <TableHeader>
        <TableRow>
          {Object.keys(apiData[0]).map((keyItem) => (
            <TableHead key={keyItem}>
              {keyItem === "id" ? "No" : keyItem.toUpperCase()}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {apiData.map((trItem) => (
          <TableRow key={trItem.id}>
            {Object.entries(trItem).map(([key, value]) => (
              <TableCell key={key}>{value}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <></>
  );
};

export default ApiTableComponent;`
