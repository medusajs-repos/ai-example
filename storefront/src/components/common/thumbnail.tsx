import { clx } from "@medusajs/ui"

type ThumbnailProps = {
  thumbnail?: string | null;
  alt: string;
  className?: string;
}

export const Thumbnail = ({ thumbnail, alt, className }: ThumbnailProps) => {
  return (
    <>
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={alt}
          className={clx(
            "w-20 h-20 object-cover bg-secondary-bg",
            className
          )}
        />
      ) : (
        <div className={clx(
          "w-20 h-20 bg-secondary-bg flex items-center justify-center",
          className
        )}>
          <span className="txt-xsmall text-secondary-text">No image</span>
        </div>
      )}
    </>
  )
}