import OpenAI from "openai";
import { ENGINE_TYPE } from "../Component/constants";

export type MakeComponentResponse = {
  "success": boolean,
  "data": string
}

const makeComponent =async (engineType:boolean, systemPrompt:string, userInput: string, apiKey: string): Promise<MakeComponentResponse> => {
    const engine = engineType ? ENGINE_TYPE[0].value : ENGINE_TYPE[1].value;
    const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });
    const response = await openai.chat.completions.create({
        model: engine,
        messages: 
        [
          {
            "role": "system",
            "content": systemPrompt
          },
          {
            "role": "user",
            "content": userInput
          }
        ],
        temperature: 0,
      });
      if(!(response?.choices && response?.choices.length))  
      return {'success':false, data:''}

      const content = response?.choices[0]?.message?.content;
      const regex = /```([^`]+)```/g;

      if(content){
        const matches = content.match(regex);
        
        if(!(matches && matches.length))  
          return {'success':false, data:''}
        const data = matches[0].replace(/```/g, '').replace('jsx', '')
        return {'success': true, data}
      }
      return {'success':false, data:''}

}

export default makeComponent;