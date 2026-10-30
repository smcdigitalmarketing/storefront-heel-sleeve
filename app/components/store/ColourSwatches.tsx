import { Img } from "~/components/brand/Img";
import { SwatchFill } from "~/components/brand/SwatchFill";
import { Button } from "~/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { brand } from "~/content/brand";
import { colourIds, colours, type ColourId } from "~/content/catalog";
import { cn } from "~/lib/utils";

const names = brand.store.colourNames;

function isColourId(value: string): value is ColourId {
  return colourIds.includes(value as ColourId);
}

/** The sleeve's four colourways as square swatches (a black sleeve with its trim stripe). */
export function ColourSwatches({
  value,
  onChange,
  label = `${brand.productName} colour`,
}: {
  value: ColourId;
  onChange: (id: ColourId) => void;
  label?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(next) => {
          if (isColourId(next)) onChange(next);
        }}
        aria-label={label}
        spacing={1}
        className="flex-wrap"
      >
        {colours.map((colour) => (
          <ToggleGroupItem
            key={colour.id}
            value={colour.id}
            aria-label={names[colour.id]}
            title={names[colour.id]}
            className="ring-offset-background data-[state=on]:ring-foreground relative size-11 rounded-none p-0 hover:bg-transparent data-[state=on]:bg-transparent data-[state=on]:ring-2 data-[state=on]:ring-offset-2"
          >
            <SwatchFill colour={colour.swatch} className="absolute inset-1" />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <span className="ms-1 text-sm font-medium">{names[value]}</span>
    </div>
  );
}

/** Decorative studio thumbnails that mirror the swatches (hidden from assistive tech). */
export function ColourThumbs({
  value,
  onChange,
}: {
  value: ColourId;
  onChange: (id: ColourId) => void;
}) {
  return (
    <ul role="list" className="flex flex-wrap gap-2" aria-hidden="true">
      {colours.map((colour) => (
        <li key={colour.id}>
          <Button
            type="button"
            variant="outline"
            tabIndex={-1}
            onClick={() => onChange(colour.id)}
            className={cn(
              "bg-card block size-14 overflow-hidden rounded-none border-2 p-0",
              colour.id === value
                ? "border-foreground"
                : "border-transparent opacity-60 hover:opacity-100",
            )}
          >
            <Img
              image={colour.thumb}
              sizes="56px"
              alt=""
              className="size-full object-contain"
            />
          </Button>
        </li>
      ))}
    </ul>
  );
}
