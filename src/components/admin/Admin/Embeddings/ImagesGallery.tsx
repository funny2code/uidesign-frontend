import React from "react";
import type { SimilarityResults } from "../../../../client";

interface Props {
  images: SimilarityResults[];
}

const ImagesGallery = ({ images }: Props) => {
  return (
    <div className="row">
      {images[0].similar.map((d, i) => (
        <div key={`${d.uri}-${i}`} className="col-4">
          <img
            key={`${d.uri}-${i}`}
            src={`https://app.uidesign.ai/images/${d.uri}`}
            className="img-fluid"
          />
        </div>
      ))}
    </div>
  );
};
export default ImagesGallery;
