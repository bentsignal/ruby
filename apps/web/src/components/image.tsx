import { Image as UnpicImage } from "@unpic/react";

type ImageProps = Omit<
  React.ComponentProps<typeof UnpicImage>,
  "layout" | "width" | "height"
> & {
  width?: number;
  height?: number;
};

export function Image({ width = 64, height = 64, ...props }: ImageProps) {
  return <UnpicImage layout="fixed" width={width} height={height} {...props} />;
}
