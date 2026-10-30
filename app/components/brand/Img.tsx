import type { ComponentProps } from "react";

import { images, type ImageId } from "~/content/images";

type ImgProps = Omit<
  ComponentProps<"img">,
  "src" | "srcSet" | "width" | "height" | "id"
> & {
  image: ImageId;
  /** Eager-load with high priority (above-the-fold images only). */
  priority?: boolean;
};

/** A brand image from the registry in content/images.ts, with its srcSet and alt. */
export function Img({
  image,
  priority,
  sizes = "100vw",
  alt,
  ...props
}: ImgProps) {
  const data = images[image];
  return (
    <img
      src={data.src}
      srcSet={data.srcSet}
      sizes={sizes}
      width={data.width}
      height={data.height}
      alt={alt ?? data.alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      {...props}
    />
  );
}
