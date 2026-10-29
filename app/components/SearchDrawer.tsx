import {
  getPredictiveSearchItemUrl,
  getSearchResultUrl,
} from "@shopify/hydrogen";
import type {
  PredictiveSearchProductItem,
  PredictiveSearchState,
} from "@shopify/hydrogen";
import {
  PredictiveSearchProvider,
  usePredictiveSearch,
  usePredictiveSearchActions,
  usePredictiveSearchForm,
} from "@shopify/hydrogen/react";
import { SearchIcon } from "lucide-react";
import { useRef } from "react";
import { Link, useNavigate } from "react-router";

import { Button } from "~/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "~/components/ui/item";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { Skeleton } from "~/components/ui/skeleton";
import {
  SEARCH_DRAWER_ID,
  closeSearchDrawer,
  useDrawer,
} from "~/lib/cart-drawer";
import { formatPrice } from "~/lib/money";
import { describeSuggestions } from "~/lib/predictive-search";
import { routeTemplates } from "~/lib/route-templates";
import { cn } from "~/lib/utils";

const SEARCH_PAGE_PATH = "/search";
const INPUT_ID = "search-drawer-query";
const RESULTS_ID = "search-drawer-results";

export function SearchDrawer() {
  return (
    <PredictiveSearchProvider searchAction={SEARCH_PAGE_PATH}>
      <SearchSheet />
    </PredictiveSearchProvider>
  );
}

function SearchSheet() {
  const navigate = useNavigate();
  const [open, setOpen] = useDrawer(SEARCH_DRAWER_ID);
  const { clear } = usePredictiveSearchActions();
  const { formProps, register } = usePredictiveSearchForm();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) return;
    // Assigning through the element keeps React's input value tracker in
    // sync. form.reset() bypasses it, so a later paste of the same term
    // would land on the stale tracked value and never fire onChange.
    if (inputRef.current) inputRef.current.value = "";
    clear();
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        id={SEARCH_DRAWER_ID}
        side="right"
        className="w-full gap-0 sm:max-w-md"
        data-testid="search-drawer"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <SheetHeader className="pe-14">
          <SheetTitle className="sr-only">Search</SheetTitle>
          <SheetDescription className="sr-only">
            Suggestions appear as you type
          </SheetDescription>
          <form
            {...formProps({
              "aria-label": "Search",
              onSubmit: (event, term) => {
                event.preventDefault();
                handleOpenChange(false);
                void navigate(
                  getSearchResultUrl({ baseUrl: SEARCH_PAGE_PATH, term }),
                );
              },
            })}
          >
            <Label htmlFor={INPUT_ID} className="sr-only">
              Search products
            </Label>
            <InputGroup className="h-11">
              <InputGroupAddon>
                <SearchIcon aria-hidden="true" />
              </InputGroupAddon>
              <InputGroupInput
                ref={inputRef}
                {...register("query", {
                  id: INPUT_ID,
                  placeholder: "Search",
                  "aria-controls": RESULTS_ID,
                  onKeyDown: (event) => {
                    // Chromium spends the first Escape on clearing a type=search
                    // input, which would stop the sheet's own Escape handling.
                    if (event.key !== "Escape") return;
                    event.preventDefault();
                    handleOpenChange(false);
                  },
                })}
              />
            </InputGroup>
          </form>
        </SheetHeader>
        <SearchSuggestions />
      </SheetContent>
    </Sheet>
  );
}

function SearchSuggestions() {
  const state = usePredictiveSearch();
  const { status, result, term } = state;

  return (
    <ScrollArea className="min-h-0 flex-1">
      <div id={RESULTS_ID} className="p-4" aria-busy={status === "loading"}>
        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {describeSuggestions(state)}
        </p>
        <SuggestionsBody status={status} result={result} />
        {term.length > 0 ? (
          <Button asChild variant="link" className="mt-4 h-11 px-0">
            <Link
              to={getSearchResultUrl({ baseUrl: SEARCH_PAGE_PATH, term })}
              onClick={() => closeSearchDrawer()}
            >
              View all results for “{term}”
            </Link>
          </Button>
        ) : null}
      </div>
    </ScrollArea>
  );
}

type SuggestionsBodyProps = Pick<PredictiveSearchState, "status" | "result">;

function SuggestionsBody({ status, result }: SuggestionsBodyProps) {
  switch (status) {
    case "idle":
      return null;
    case "error":
      return (
        <p role="alert" className="text-destructive text-sm">
          Suggestions are unavailable right now. Use the full search page
          instead.
        </p>
      );
    case "loading":
      if (result.items.products.length === 0) {
        return (
          <div className="flex flex-col gap-2" aria-label="Searching">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        );
      }
      return (
        <SuggestionList
          products={result.items.products}
          term={result.term}
          stale
        />
      );
    case "success":
      if (result.items.products.length === 0) {
        return (
          <p className="text-muted-foreground text-sm">
            No results for “{result.term}”
          </p>
        );
      }
      return (
        <SuggestionList products={result.items.products} term={result.term} />
      );
  }
}

type SuggestionListProps = {
  products: readonly PredictiveSearchProductItem[];
  term: string;
  stale?: boolean;
};

function SuggestionList({
  products,
  term,
  stale = false,
}: SuggestionListProps) {
  return (
    <ul role="list" className={cn("grid gap-1", stale && "opacity-60")}>
      {products.map((product) => (
        <li key={product.id}>
          <SuggestionLink product={product} term={term} />
        </li>
      ))}
    </ul>
  );
}

function SuggestionLink({
  product,
  term,
}: {
  product: PredictiveSearchProductItem;
  term: string;
}) {
  const variant = product.selectedOrFirstAvailableVariant;
  const image = variant?.image ?? null;

  return (
    <Item asChild size="sm">
      <Link
        to={getPredictiveSearchItemUrl(product, {
          routes: routeTemplates,
          term,
        })}
        onClick={() => closeSearchDrawer()}
      >
        <ItemMedia variant="image" className="bg-muted size-12">
          {image !== null ? (
            <img
              src={image.url}
              alt={image.altText ?? ""}
              width={48}
              height={48}
              loading="lazy"
            />
          ) : null}
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="line-clamp-2">{product.title}</ItemTitle>
          {variant !== null ? (
            <ItemDescription>{formatPrice(variant.price)}</ItemDescription>
          ) : null}
        </ItemContent>
      </Link>
    </Item>
  );
}
