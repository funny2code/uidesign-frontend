// https://docs.astro.build/en/core-concepts/sharing-state/
import { WritableAtom, atom } from "nanostores";
import type { VM, ProjectFiles } from "@stackblitz/sdk";
import type { PagesType } from "./components/app/Generate/TopBarMenu/constants";
import type React from "react";
// TODO: Organize
export const createCSS = atom("");
export const createHTML = atom("");
export const createHead = atom("");
export const createBody = atom("");
export const testID = atom("");
export const generatedProjectsIds = atom({} as Record<PagesType, string>);
export const copyCSS = atom("");
export const copyHTML = atom("");
export const remixCSS = atom("");
export const remixHTML = atom("");
export const shopifyHead = atom("");
export const shopifyBody = atom("");
//
export const inputPrompt = atom("");
export const selectedDesignType = atom("");
export const vmState = atom(undefined as VM | undefined);
// ref state
export const vmFilesState = atom(undefined as ProjectFiles | undefined);
//
export const useDevMode = atom(false);
