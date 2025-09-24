import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  return (
    <div className="flex items-start relative">
      <div className="flex flex-col flex-1 small:mx-16 gap-y-4">
        {images.map((image, index) => {
          return (
            <Container
              key={image.id}
              className="relative aspect-[29/34] w-full overflow-hidden bg-secondary-bg"
              id={image.id}
            >
              {!!image.url && (
                <img
                  src={image.url}
                  className="absolute inset-0 rounded-rounded w-full h-full object-cover"
                  alt={`Product image ${index + 1}`}
                  loading={index <= 2 ? "eager" : "lazy"}
                />
              )}
            </Container>
          )
        })}
      </div>
    </div>
  )
}

export default ImageGallery