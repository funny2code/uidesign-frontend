import OpenAI from "openai";
import { ENGINE_TYPE } from "../Component/constants";

export type MakeComponentResponse = {
  "success": boolean,
  "data": string
}

const makeComponent =async (engineType:string, systemPrompt:string, userInput: string, apiKey: string): Promise<MakeComponentResponse> => {
    const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });
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
        if(engineType == ENGINE_TYPE[0].value)  return {'success': true, data: content}
        const matches = content.match(regex);
        
        if(!(matches && matches.length))  
          return {'success':false, data:''}
        const data = matches[0].replace(/```/g, '').replace('jsx\n', '')
        return {'success': true, data}
      }
      return {'success':false, data:''}

}

export default makeComponent;