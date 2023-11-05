import OpenAI from "openai";
import { EXTRA_USER_PROMPT, LIST_COUNT, STAGE } from "../Component/constants";
import { WebContainer } from "@webcontainer/api";

type makeComponentRequest = {
  webcontainer: WebContainer,
  engineType:string,
  systemPrompt:string,
  input: string,
  apiKey: string,
  stage: STAGE,
  selectedComponent: number
}
const makeComponent = async ({webcontainer, engineType, systemPrompt, input, apiKey, stage, selectedComponent}:makeComponentRequest): Promise<boolean> => {
    const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });
    const selectedFile = await webcontainer.fs.readFile(`src/component${selectedComponent}.tsx`, 'utf-8');
    if(!selectedFile) return false;
console.log(stage)
    const response = await openai.chat.completions.create({
        model: engineType,
        messages: 
        [
          {
            "role": "system",
            "content": systemPrompt
          },
          {
            "role": "user",
            "content": (stage !== STAGE.First ? selectedFile + "\n \ " : "") + input + (stage === STAGE.First ? EXTRA_USER_PROMPT : "")
          }
        ],
        temperature: 0,
      });
      if(!(response?.choices && response?.choices.length))  
      return false;

      const content = response?.choices[0]?.message?.content;
      if(!content) return false

      const regex = /```jsx(.*?)```/gs;
      const matches = content.match(regex);
      const length = matches?.length;

      if(stage != STAGE.First){
        if(length)
        await webcontainer.fs.writeFile(`/src/component0.tsx`, matches[0].replace(/```/g, '').replace('jsx\n', ''));
        else await webcontainer.fs.writeFile(`/src/component0.tsx`, content);
        return true;
      }

      if(!length) return false

      if(length == LIST_COUNT)
      for(let i = 0; i < LIST_COUNT; i++)
        await webcontainer.fs.writeFile(`/src/component${i}.tsx`, matches[i].replace(/```/g, '').replace('jsx\n', ''));

      if(length == 1)
        for(let i = 0; i < LIST_COUNT; i++)
          await webcontainer.fs.writeFile(`/src/component${i}.tsx`, matches[0].replace(/```/g, '').replace('jsx\n', ''));

      return true
}

export default makeComponent;