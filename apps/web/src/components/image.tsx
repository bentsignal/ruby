import { Image as UnpicImage } from "@unpic/react";

type ImageProps = Omit<
  React.ComponentProps<typeof UnpicImage>,
  "layout" | "width" | "height"
> & {
  width?: number;
  height?: number;
  layout?: "fixed" | "constrained";
};

export function Image({
  height = 64,
  layout = "fixed",
  width = 64,
  ...props
}: ImageProps) {
  if (layout === "constrained") {
    return (
      <UnpicImage
        layout="constrained"
        width={width}
        height={height}
        {...props}
      />
    );
  }

  return <UnpicImage layout="fixed" width={width} height={height} {...props} />;
}
