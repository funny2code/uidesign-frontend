import type React from "react";
import { type PromptType } from "../commands/component";
import { PROMPT_TYPE, STAGE } from "./constants";
import ImageUploading, { type ImageListType } from "react-images-uploading";

interface CodingBuddyProps extends React.PropsWithChildren {
  setPromptType: React.Dispatch<React.SetStateAction<PromptType>>;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  setStage: React.Dispatch<React.SetStateAction<STAGE>>;
  promptType: PromptType;
  stage: STAGE;
  handleImageChange: (imageList: ImageListType) => void;
  images: never[];
  processing: boolean;
}

const CodingBuddy = ({
  setPromptType,
  setInput,
  promptType,
  stage,
  setStage,
  handleImageChange,
  images,
  processing,
}: CodingBuddyProps): React.ReactElement => {
  const codingBuddyInit = (
    <>
      <p className="fs-5">Hey there! What can I help you build today?</p>
      <div className="d-flex flex-row gap-2 flex-wrap">
        <div
          className="btn btn-primary bg-info border-0"
          onClick={() => {
            setPromptType("Image"), setStage(STAGE.First);
          }}
        >
          Turn Image to Code
        </div>
        <div
          className="btn btn-primary bg-info border-0"
          onClick={() => {
            setPromptType("Chat"), setStage(STAGE.First);
          }}
        >
          Build a simple component
        </div>
        <div className="btn btn-primary bg-info border-0">Something else</div>
      </div>
      <div className="text-end pt-2">🤖Coding Buddy</div>
    </>
  );

  const codingBuddyFirstImage = (
    <>
      <ImageUploading value={images} onChange={handleImageChange}>
        {({ imageList, onImageUpload }) => (
          <div className="d-flex flex-row gap-3">
            <button
              className="btn btn-secondary h-50"
              onClick={e => {
                e.preventDefault();
                onImageUpload();
              }}
            >
              Upload image
            </button>
            {imageList.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image.dataURL} alt="" width="250" />
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
      <p className="fs-5">
        Upload the image you want to use. Then type in your prompt and press send to generate something
        visual :)
      </p>
      <div className="text-end pt-2">🤖Coding Buddy</div>
    </>
  );

  const codingBuddyFirstChat = (
    <>
      <p className="fs-5">
        Type in your prompt to describe your component and press send to generate you want :)
      </p>
      <div className="text-end pt-2">🤖Coding Buddy</div>
    </>
  );

  const codingBuddySecond = (
    <>
      <p className="fs-5">
        Choose your best one and update the component by type in prompts or edit code.
      </p>
      <div className="text-end pt-2">🤖Coding Buddy</div>
    </>
  );

  const codingBuddyLast = (
    <>
      <p className="fs-5">Update the component by type in prompts or edit code.</p>
      <div className="text-end pt-2">🤖Coding Buddy</div>
    </>
  );

  const suggestPromptsFirstImage = [
    "Build a simple component",
    "Build a simple component",
    "Something else",
  ];
  const suggestPromptsFirstChat = ["Make a button", "Make a menu", "Make a table"];

  const suggestPromptsSecond = [
    "Make button bigger",
    "Make background gradient",
    "Make background transparent",
  ];

  let codingBuddy;
  let suggestedPrompts;
  if (stage === STAGE.Init) codingBuddy = codingBuddyInit;
  if (stage === STAGE.First && promptType == PROMPT_TYPE.Image) {
    codingBuddy = codingBuddyFirstImage;
    suggestedPrompts = suggestPromptsFirstImage;
  }
  if (stage === STAGE.First && promptType == PROMPT_TYPE.Chat) {
    codingBuddy = codingBuddyFirstChat;
    suggestedPrompts = suggestPromptsFirstChat;
  }
  if (stage === STAGE.Second) {
    codingBuddy = codingBuddySecond;
    suggestedPrompts = suggestPromptsSecond;
  }
  if (stage === STAGE.Last) {
    codingBuddy = codingBuddyLast;
    suggestedPrompts = suggestPromptsSecond;
  }

  return (
    <div
      className="text-light position-absolute w-100 d-flex justify-content-center bg-transparent"
      style={{ bottom: "12vh" }}
    >
      <div className="w-50">
        {processing ? (
          <div
            className="text-center py-2 rounded-5 w-75 mx-auto z-2"
            style={{ backgroundColor: "#ffffff25" }}
          >
            ✨ Generating your design ✨
          </div>
        ) : (
          <>
            <div className="p-3 rounded " style={{ backgroundColor: "#082730aa" }}>
              {codingBuddy}
            </div>
            <div className="pt-2">
              {suggestedPrompts ? (
                <>
                  <p>Suggested Prompts</p>
                  <div className="d-flex flex-row gap-2 flex-wrap">
                    {suggestedPrompts?.map(item => (
                      <div className="btn btn-primary bg-info border-0" onClick={() => setInput(item)}>
                        {item}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CodingBuddy;
