import OpenAI from "openai";

export type MakeComponentResponse = {
  "success": boolean,
  "data": string
}

const makeComponent =async (userInput: string): Promise<MakeComponentResponse> => {
    const openai = new OpenAI({
        apiKey: import.meta.env.PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });
      
    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: 
        [
          {
            "role": "system",
            "content": "As a skilled developer, please create a professional and stylish React component code.\n \
            Ensure that the code is clean, structured, and follows best practices.\n \
            Use a functional component with an arrow function, and assume that Tailwind CSS is installed. \n \
            Component doesn't have props. \n \
            Must provide only code."
          },
          {
            "role": "user",
            "content": userInput
          }
        ],
        temperature: 0,
        max_tokens: 1024,
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