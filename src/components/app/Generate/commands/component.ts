import axios  from "axios";
import { LIST_COUNT, STAGE, PROMPT_TYPE } from "../Component/constants";
import { WebContainer } from "@webcontainer/api";

type makeComponentRequest = {
  webcontainer: WebContainer,
  engineType:string,
  systemPrompt:string,
  input: string,
  stage: STAGE,
  selectedComponent: number
  promptType: PromptType
  image: string
}

export type PromptType = "Chat" | "Image";

const apiUrl = import.meta.env.PUBLIC_OPENAI_URL;

const makeComponent = async ({webcontainer, engineType, systemPrompt, input, stage, selectedComponent, promptType, image}:makeComponentRequest): Promise<boolean> => {

    const selectedFile = await webcontainer.fs.readFile(`src/component${selectedComponent}.tsx`, 'utf-8');

    const params = {
      engineType,
      systemPrompt,
      input,
      stage,
      selectedFile,
      promptType,
      image
    };

    let response;

    try {
      const result = await axios.post(apiUrl, params)
      response = result.data
    } catch (error) {
      return false;
    }

    if(!response.success) return false;

    if(promptType == PROMPT_TYPE.Image && stage == STAGE.First){
      await webcontainer.fs.writeFile(`/src/component0.tsx`, response.data[0]);
      return true;
    }else{
      const packageJson = await webcontainer.fs.readFile(`package.json`, 'utf-8');
      const newModules = getNewModules(response.data[0], packageJson)

      let moduleLength = newModules.length;
      for(let i = 0; i < moduleLength; i++){
        const installProcess = await webcontainer.spawn("npm", ["install", newModules[i]]);
        const installExitCode = await installProcess.exit;
        if (installExitCode !== 0) {
          throw new Error("Unable to run npm install");
        }
      }

      if(stage != STAGE.First){
        await webcontainer.fs.writeFile(`/src/component0.tsx`, response.data[0]);
        return true;
      }

      if(response.data.length == LIST_COUNT){
        for(let i = 0; i < LIST_COUNT; i++)
          await webcontainer.fs.writeFile(`/src/component${i}.tsx`, response.data[i]);
        return true
      }

      if(response.data.length == 1){
        for(let i = 0; i < LIST_COUNT; i++)
          await webcontainer.fs.writeFile(`/src/component${i}.tsx`, response.data[0]);
        return true
      }

      return true
    }
}

export const getNewModules = (code: string, packageJson: string): string[] => {
  const packageData = JSON.parse(packageJson);
  const { dependencies, devDependencies } = packageData;
  const importRegex = /import\s+(?:[\w{},*\s]+)\s+from\s+['"]([^'"]+)['"]/g;
  const npmModules = [];
  let match;
  while ((match = importRegex.exec(code)) !== null) {
    const importedModuleName = match[1];
    if (!dependencies[importedModuleName] && !devDependencies[importedModuleName]) {
      npmModules.push(importedModuleName);
    }
  }
  return npmModules;
};

export default makeComponent;