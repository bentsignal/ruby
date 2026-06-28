import type { PostDisplayAspectRatio } from "@acme/config/posts";
import {
  getPostDisplayAspectRatioValue,
  POST_DISPLAY_ASPECT_RATIOS,
} from "@acme/config/posts";
import { cn } from "@acme/std/cn";

import { useCreateStore } from "../store";

export function AspectRatioField() {
  const displayAspectRatio = useCreateStore(
    (store) => store.displayAspectRatio,
  );
  const itemCount = useCreateStore((store) => store.items.length);
  const setDisplayAspectRatio = useCreateStore(
    (store) => store.setDisplayAspectRatio,
  );

  if (itemCount <= 1) return null;

  return (
    <section className="flex flex-col gap-2">
      <p className="text-foreground text-sm font-semibold">Post shape</p>
      <div className="grid max-w-md grid-cols-3 gap-2">
        {POST_DISPLAY_ASPECT_RATIOS.map((ratio) => {
          const isSelected = displayAspectRatio === ratio;

          return (
            <button
              aria-pressed={isSelected}
              className={cn(
                "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border p-3 text-sm font-semibold transition",
                isSelected &&
                  "border-primary bg-primary/10 text-primary shadow-sm",
              )}
              key={ratio}
              onClick={() => setDisplayAspectRatio(ratio)}
              type="button"
            >
              <span
                className={cn(
                  "border-muted-foreground/40 bg-muted/70 flex items-center justify-center rounded-sm border",
                  isSelected && "border-primary/70 bg-primary/15",
                )}
                style={getShapeStyle(ratio)}
              >
                <span className="bg-background/80 size-1.5 rounded-full" />
              </span>
              {ratio}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function getShapeStyle(ratio: PostDisplayAspectRatio) {
  const width = 58;
  const height = width / getPostDisplayAspectRatioValue(ratio);
  return { height, width };
}
