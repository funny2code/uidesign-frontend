import React from "react";
import type { SimilarityResults } from "../../../../client";

interface Props {
  images: SimilarityResults[];
}

export const ImagesGallery = ({ images }: Props) => {
  return (
    <>
      {images[0].similar.map((d, i) => (
        <div className="col-4">
          <img
            key={`${d.uri}-${i}`}
            src={`https://app.uidesign.ai/images/${d.uri}`}
            className="img-fluid"
          />
        </div>
      ))}
    </>
  );
};
