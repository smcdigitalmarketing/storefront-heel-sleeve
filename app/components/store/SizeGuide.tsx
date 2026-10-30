import { RulerIcon } from "lucide-react";
import { useState } from "react";

import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { scoreLabel } from "~/components/brand/score-label";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { SIZE_SOURCE, sizes } from "~/content/catalog";
import { guideSteps } from "~/content/store-pages";
import { cn } from "~/lib/utils";

/** "Size guide" link that opens the chart, next to every size picker. */
export function SizeGuideButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        type="button"
        variant="link"
        onClick={() => setOpen(true)}
        className={cn(scoreLabel, "h-auto min-h-11 gap-1.5 px-0", className)}
      >
        <RulerIcon aria-hidden className="size-4" />
        Size guide
      </Button>
      <SizeGuideDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

export function SizeGuideDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-foreground max-h-[90svh] gap-4 overflow-y-auto rounded-none border-2 p-5 sm:max-w-lg sm:p-6">
        <DialogTitle className="font-heading pr-8 text-2xl font-extrabold uppercase italic">
          Size guide
        </DialogTitle>
        <DialogDescription className="-mt-2">
          Measure around the ankle just above the ankle bone, then check the
          shoe size. Between sizes? Go up one.
        </DialogDescription>
        <SizeTable />
        <ol className="space-y-2 text-sm">
          {guideSteps.map((step, i) => (
            <li key={step.title} className="flex gap-3">
              <span className="bg-foreground text-background flex size-6 shrink-0 items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              <span>
                <strong>{step.title}.</strong> {step.body}
              </span>
            </li>
          ))}
        </ol>
        <PlaceholderTag
          kind="listed"
          label="Sizes as listed by the competitor: confirm with the supplier"
        />
        <p className="text-muted-foreground text-xs">Source: {SIZE_SOURCE}</p>
      </DialogContent>
    </Dialog>
  );
}

/** The size chart: size, shoe size and ankle measurement. */
export function SizeTable({ className }: { className?: string }) {
  return (
    <Table className={className}>
      <TableHeader>
        <TableRow className="border-foreground border-b-2 hover:bg-transparent">
          <TableHead scope="col">Size</TableHead>
          <TableHead scope="col">Shoe size</TableHead>
          <TableHead scope="col">Ankle</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sizes.map((size) => (
          <TableRow key={size.id}>
            <TableHead scope="row" className="font-heading text-lg">
              {size.id}
            </TableHead>
            <TableCell className="whitespace-normal">{size.shoe}</TableCell>
            <TableCell className="whitespace-normal tabular-nums">
              {size.ankle}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
