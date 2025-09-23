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
            "w-20 h-20 object-cover rounded bg-ui-bg-subtle",
            className
          )}
        />
      ) : (
        <div className={clx(
          "w-20 h-20 bg-ui-bg-subtle rounded flex items-center justify-center",
          className
        )}>
          <span className="txt-xsmall text-ui-fg-muted">No image</span>
        </div>
      )}
    </>
  )
}