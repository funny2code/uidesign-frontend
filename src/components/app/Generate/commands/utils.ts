import Parser from "css-simple-parser";
import type { DataType, DocumentProcessor, StatusCallback } from "./types";

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
