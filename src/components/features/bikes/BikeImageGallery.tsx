import { useState, type FC } from "react";
import type { BikeImageDto } from "../../../types/bike.types";
import "./bikes.css";

interface BikeImageGalleryProps {
  images: BikeImageDto[];
}

const BikeImageGallery: FC<BikeImageGalleryProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Sort: thumbnail first
  const sorted = [...images].sort(
    (a, b) => (b.isThumbnail ? 1 : 0) - (a.isThumbnail ? 1 : 0),
  );

  if (sorted.length === 0) {
    return (
      <div className="gallery">
        <img
          src="/assets/images/placeholder-bike.png"
          alt="No image"
          className="gallery-main-image"
        />
      </div>
    );
  }

  return (
    <div className="gallery">
      <div className="gallery-main">
        <img
          src={sorted[activeIndex]?.mediaUrl}
          alt="Bike"
          className="gallery-main-image"
        />
      </div>

      {sorted.length > 1 && (
        <div className="gallery-thumbnails">
          {sorted.map((img, i) => (
            <img
              key={img.mediaId}
              src={img.mediaUrl}
              alt={`Thumbnail ${i + 1}`}
              className={`gallery-thumb ${i === activeIndex ? "active" : ""}`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BikeImageGallery;
