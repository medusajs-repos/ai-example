import { clsx } from "clsx";

type ThumbnailProps = {
  thumbnail?: string | null;
  alt: string;
  className?: string;
};

export const Thumbnail = ({ thumbnail, alt, className }: ThumbnailProps) => {
  return (
    <>
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={alt}
          className={clsx("w-20 h-20 object-cover bg-secondary-bg", className)}
        />
      ) : (
        <div
          className={clsx(
            "w-20 h-20 bg-secondary-bg flex items-center justify-center",
            className
          )}
        >
          <span className="text-xs text-secondary-text">No image</span>
        </div>
      )}
    </>
  );
};
