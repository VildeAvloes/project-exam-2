import { useState } from "react";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function VenueGallery({
  media = [],
  fallbackAlt = "Venue image",
}) {
  const images = media.filter((image) => image?.url);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const isSingle = images.length === 1;

  if (!images.length) {
    return (
      <div className="venue-hero-image-placeholder d-flex align-items-center justify-content-center">
        <span className="text-muted">No image available</span>
      </div>
    );
  }

  const activeImage = images[activeIndex];

  function openGallery(index) {
    setActiveIndex(index);
    setIsOpen(true);
  }

  function closeGallery() {
    setIsOpen(false);
  }

  function showPrevious() {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }

  function showNext() {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }

  return (
    <>
      <div
        className={`venue-gallery ${isSingle ? "venue-gallery--single" : ""}`}
      >
        {isSingle ? (
          <button
            type="button"
            className="venue-gallery__single"
            onClick={() => openGallery(0)}
          >
            <img
              src={images[0].url}
              alt={images[0].alt || fallbackAlt}
              className="venue-gallery__single-image"
            />
          </button>
        ) : (
          <>
            <button
              type="button"
              className="venue-gallery__main"
              onClick={() => openGallery(0)}
            >
              <img
                src={images[0].url}
                alt={images[0].alt || fallbackAlt}
                className="venue-gallery__main-image"
              />
            </button>

            <div className="venue-gallery__thumbs">
              {images.slice(1, 5).map((image, index) => {
                const realIndex = index + 1;

                return (
                  <button
                    key={`${image.url}-${realIndex}`}
                    type="button"
                    className="venue-gallery__thumb"
                    onClick={() => openGallery(realIndex)}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || fallbackAlt}
                      className="venue-gallery__thumb-image"
                    />
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {isOpen && (
        <div className="venue-lightbox" role="dialog" aria-modal="true">
          <button
            type="button"
            className="venue-lightbox__close"
            onClick={closeGallery}
            aria-label="Close image gallery"
          >
            <FiX />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              className="venue-lightbox__nav venue-lightbox__nav--prev"
              onClick={showPrevious}
              aria-label="Previous image"
            >
              <FiChevronLeft />
            </button>
          )}

          <img
            src={activeImage.url}
            alt={activeImage.alt || fallbackAlt}
            className="venue-lightbox__image"
          />

          {images.length > 1 && (
            <button
              type="button"
              className="venue-lightbox__nav venue-lightbox__nav--next"
              onClick={showNext}
              aria-label="Next image"
            >
              <FiChevronRight />
            </button>
          )}
        </div>
      )}
    </>
  );
}
