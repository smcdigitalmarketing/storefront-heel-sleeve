import {
  filterEquals,
  formatMoney,
  getFilterRemovalUrl,
  getSortByValue,
  isFilterInputActive,
  parseCollectionParams,
  parseSortByValue,
  serializeCollectionParams,
  type CollectionState,
  type MoneyV2,
  type ProductFilter,
} from "@shopify/hydrogen";
import {
  useCollection,
  useCollectionActions,
  useCollectionForm,
} from "@shopify/hydrogen/react";
import {
  CheckIcon,
  FunnelIcon,
  SquareCheckIcon,
  SquareIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Link, useFetcher, useLocation } from "react-router";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { FieldSet } from "~/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { Label } from "~/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "~/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Spinner } from "~/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { DEFAULT_MONEY_LOCALE, formatPrice } from "~/lib/money";
import { cn } from "~/lib/utils";

export type SortOption = {
  label: string;
  value: string;
};

export const COLLECTION_SORT_OPTIONS: SortOption[] = [
  { label: "Featured", value: getSortByValue("COLLECTION_DEFAULT", false) },
  { label: "Best selling", value: getSortByValue("BEST_SELLING", false) },
  { label: "Alphabetically, A–Z", value: getSortByValue("TITLE", false) },
  { label: "Alphabetically, Z–A", value: getSortByValue("TITLE", true) },
  { label: "Price, low to high", value: getSortByValue("PRICE", false) },
  { label: "Price, high to low", value: getSortByValue("PRICE", true) },
  { label: "Date, old to new", value: getSortByValue("CREATED", false) },
  { label: "Date, new to old", value: getSortByValue("CREATED", true) },
];

export const SEARCH_SORT_OPTIONS: SortOption[] = [
  { label: "Relevance", value: getSortByValue("RELEVANCE", false) },
  { label: "Price, low to high", value: getSortByValue("PRICE", false) },
  { label: "Price, high to low", value: getSortByValue("PRICE", true) },
];

export type BrowseFilterValue = {
  id: string;
  label: string;
  count: number;
  input?: string | null;
  swatch?: {
    color?: string | null;
    image?: {
      previewImage?: {
        url?: string | null;
        altText?: string | null;
      } | null;
    } | null;
  } | null;
};

export type BrowseFilter = {
  id: string;
  label: string;
  type?: string | null;
  presentation?: string | null;
  values: readonly BrowseFilterValue[];
};

export type BrowsePageInfo = {
  hasNextPage: boolean;
  endCursor?: string | null;
};

type LoadMoreResponse<T> = {
  products: readonly T[];
  pageInfo: BrowsePageInfo;
  dataSearch: string;
};

type BrowseParams = Pick<CollectionState, "filters" | "sortKey" | "reverse">;

/** One filter value that maps to a single URL param, like a native checkbox. */
type FacetOption = {
  value: BrowseFilterValue;
  filter: ProductFilter;
  name: string;
  paramValue: string;
  isActive: boolean;
};

const FILTER_SHEET_ID = "collection-filters";
const PRICE_MIN_PARAM = "filter.v.price.gte";
const PRICE_MAX_PARAM = "filter.v.price.lte";

function currentSortValue(state: CollectionState): string | undefined {
  return state.sortKey
    ? getSortByValue(state.sortKey, state.reverse)
    : undefined;
}

function parseFilterInput(input: string): ProductFilter | null {
  try {
    return JSON.parse(input) as ProductFilter;
  } catch {
    return null;
  }
}

function filterParamEntries(
  filter: ProductFilter,
): Array<{ name: string; value: string }> {
  return Array.from(
    serializeCollectionParams({
      filters: [filter],
      sortKey: undefined,
      reverse: false,
    }),
    ([name, value]) => ({ name, value }),
  );
}

function hiddenInputsFromParams(
  params: URLSearchParams,
  exclude = new Set<string>(),
) {
  return Array.from(params).flatMap(([name, value], index) => {
    if (exclude.has(name)) return [];
    return (
      <input
        type="hidden"
        key={`${name}-${value}-${index}`}
        name={name}
        value={value}
      />
    );
  });
}

function activeFilterParams(state: CollectionState) {
  return serializeCollectionParams({
    filters: state.filters,
    sortKey: undefined,
    reverse: false,
  });
}

function buildPathWithRemoval(basePath: string, removal: string): string {
  if (removal === "?") return basePath;

  const [pathname, existingSearch = ""] = basePath.split("?");
  const params = new URLSearchParams(existingSearch);
  const removalParams = new URLSearchParams(
    removal.startsWith("?") ? removal.slice(1) : removal,
  );

  for (const [name, value] of removalParams) params.append(name, value);

  const search = params.toString();
  return search ? `${pathname}?${search}` : pathname;
}

// Links for the no-JavaScript fallbacks. The store's `filter.*` and `sort_by`
// params come from `next`; other params such as `q` are kept, and the
// pagination cursors are dropped so the new browse state starts on page one.
function browseHref(
  pathname: string,
  search: string,
  next: BrowseParams,
): string {
  const params = new URLSearchParams();
  for (const [name, value] of new URLSearchParams(search)) {
    if (name === "sort_by" || name === "after" || name === "before") continue;
    if (name.startsWith("filter.")) continue;
    params.append(name, value);
  }
  for (const [name, value] of serializeCollectionParams(next))
    params.append(name, value);

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function priceFilter(state: CollectionState) {
  return state.filters.find((filter) => filter.price != null)?.price;
}

function money(amount: number, currencyCode: string): MoneyV2 {
  return { amount: String(amount), currencyCode };
}

function describeFilter(filter: ProductFilter, currencyCode: string): string {
  if (filter.available != null)
    return filter.available ? "In stock" : "Out of stock";
  if (filter.productType) return filter.productType;
  if (filter.productVendor) return filter.productVendor;
  if (filter.tag) return filter.tag;
  if (filter.variantOption)
    return filter.variantOption.value ?? filter.variantOption.name;
  if (filter.productMetafield)
    return filter.productMetafield.value ?? filter.productMetafield.key;
  if (filter.variantMetafield)
    return filter.variantMetafield.value ?? filter.variantMetafield.key;
  if (filter.taxonomyMetafield) return filter.taxonomyMetafield.value;
  if (filter.category) return filter.category.id;
  if (filter.price) {
    const min = filter.price.min;
    const max = filter.price.max;
    if (min != null && max != null) {
      return `${formatPrice(money(min, currencyCode))} – ${formatPrice(money(max, currencyCode))}`;
    }
    if (min != null) return `From ${formatPrice(money(min, currencyCode))}`;
    if (max != null) return `Up to ${formatPrice(money(max, currencyCode))}`;
  }
  return "Filter";
}

function activeValueCount(
  filter: BrowseFilter,
  state: CollectionState,
): number {
  if (filter.type === "PRICE_RANGE") return priceFilter(state) ? 1 : 0;
  return filter.values.filter(
    (value) => value.input && isFilterInputActive(state.filters, value.input),
  ).length;
}

function isSwatchFilter(filter: BrowseFilter): boolean {
  return (
    filter.presentation === "SWATCH" ||
    filter.values.some(
      (value) => value.swatch?.color || value.swatch?.image?.previewImage?.url,
    )
  );
}

function isMutuallyExclusive(filter: BrowseFilter, inputName: string): boolean {
  return filter.type === "BOOLEAN" || inputName === "filter.v.availability";
}

function facetOptions(
  filter: BrowseFilter,
  state: CollectionState,
): FacetOption[] {
  return filter.values.flatMap((value) => {
    if (!value.input) return [];
    const parsed = parseFilterInput(value.input);
    if (!parsed) return [];
    const entries = filterParamEntries(parsed);
    if (entries.length !== 1) return [];
    const [{ name, value: paramValue }] = entries;

    return [
      {
        value,
        filter: parsed,
        name,
        paramValue,
        isActive: isFilterInputActive(state.filters, value.input),
      },
    ];
  });
}

/** The active filters after toggling one option, as a checked or unchecked checkbox would submit them. */
function toggledFilters(
  active: ProductFilter[],
  filter: BrowseFilter,
  option: FacetOption,
  options: FacetOption[],
): ProductFilter[] {
  if (option.isActive)
    return active.filter(
      (candidate) => !filterEquals(candidate, option.filter),
    );

  // Single-choice filters replace their siblings that share the same param.
  const replaced = isMutuallyExclusive(filter, option.name)
    ? options
        .filter((sibling) => sibling.name === option.name)
        .map((sibling) => sibling.filter)
    : [];

  return [
    ...active.filter(
      (candidate) =>
        !replaced.some((sibling) => filterEquals(candidate, sibling)),
    ),
    option.filter,
  ];
}

function productCountText(count: number): string {
  return `${count} ${count === 1 ? "product" : "products"}`;
}

/**
 * Filter links for shoppers without JavaScript, where the shadcn controls can't
 * toggle. Render it inside <noscript>, so only the server builds the links.
 */
function FacetOptionLinks({
  filter,
  options,
  state,
}: {
  filter: BrowseFilter;
  options: FacetOption[];
  state: CollectionState;
}) {
  const location = useLocation();

  return (
    <ul className="flex flex-col pt-2">
      {options.map((option) => {
        const Icon = option.isActive ? SquareCheckIcon : SquareIcon;
        const href = browseHref(location.pathname, location.search, {
          filters: toggledFilters(state.filters, filter, option, options),
          sortKey: state.sortKey,
          reverse: state.reverse,
        });

        return (
          <li key={option.value.id}>
            <Link
              to={href}
              rel="nofollow"
              className="focus-visible:ring-ring/50 flex min-h-11 items-center gap-2 rounded-md text-sm outline-none focus-visible:ring-3"
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              <span className="flex-1">{option.value.label}</span>
              <span className="text-muted-foreground text-xs">
                ({option.value.count})
              </span>
              {option.isActive ? (
                <span className="sr-only">, selected</span>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function FacetGroup({
  filter,
  state,
  currencyCode,
}: {
  filter: BrowseFilter;
  state: CollectionState;
  currencyCode: string;
}) {
  const { setFilters } = useCollectionActions();
  const selectedCount = activeValueCount(filter, state);
  const labelId = useId();
  const options =
    filter.type === "PRICE_RANGE" ? [] : facetOptions(filter, state);

  function toggle(option: FacetOption) {
    setFilters(toggledFilters(state.filters, filter, option, options));
  }

  return (
    <AccordionItem value={filter.id}>
      {/* Active values ride along with every submit of the form, like checked checkboxes. */}
      {options
        .filter((option) => option.isActive)
        .map((option) => (
          <input
            type="hidden"
            key={`${option.name}=${option.paramValue}`}
            name={option.name}
            value={option.paramValue}
          />
        ))}
      <AccordionTrigger className="items-center hover:no-underline">
        <span className="inline-flex items-center gap-1.5" aria-hidden="true">
          <span id={labelId} aria-hidden="true">
            {filter.label}
          </span>
          {selectedCount > 0 ? (
            <Badge className="min-w-5 px-1" aria-hidden="true">
              {selectedCount}
            </Badge>
          ) : null}
        </span>
        <span className="sr-only">
          {selectedCount > 0
            ? `${filter.label}, ${selectedCount} selected`
            : filter.label}
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <FacetBody
          filter={filter}
          state={state}
          options={options}
          labelId={labelId}
          currencyCode={currencyCode}
          onToggle={toggle}
        />
      </AccordionContent>
    </AccordionItem>
  );
}

function ListFacet({
  filter,
  state,
  options,
  labelId,
  onToggle,
}: {
  filter: BrowseFilter;
  state: CollectionState;
  options: FacetOption[];
  labelId: string;
  onToggle: (option: FacetOption) => void;
}) {
  const id = useId();

  if (options.length === 0) return null;

  return (
    <FieldSet className="gap-0" aria-labelledby={labelId}>
      <ul className="space-y-1 pt-2 noscript:hidden">
        {options.map((option) => {
          const { value } = option;
          const valueId = `${id}-${encodeURIComponent(value.id)}`;

          return (
            <li
              key={value.id}
              data-testid="facet-option"
              className="flex min-h-11 items-center gap-2"
            >
              <Checkbox
                id={valueId}
                checked={option.isActive}
                aria-labelledby={`${valueId}-label`}
                aria-describedby={`${valueId}-count`}
                onCheckedChange={() => onToggle(option)}
              />
              <Label
                htmlFor={valueId}
                className="min-h-11 flex-1 cursor-pointer leading-snug font-normal"
              >
                <span id={`${valueId}-label`} className="flex-1">
                  {value.label}
                </span>
                <span
                  className="text-muted-foreground text-xs"
                  aria-hidden="true"
                >
                  ({value.count})
                </span>
                <span
                  id={`${valueId}-count`}
                  className="sr-only"
                  aria-hidden="true"
                >
                  {productCountText(value.count)}
                </span>
              </Label>
            </li>
          );
        })}
      </ul>
      <noscript>
        <FacetOptionLinks filter={filter} options={options} state={state} />
      </noscript>
    </FieldSet>
  );
}

function PriceRangeFacet({
  state,
  currencyCode,
}: {
  state: CollectionState;
  currencyCode: string;
}) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const minInput = useRef<HTMLInputElement>(null);
  const maxInput = useRef<HTMLInputElement>(null);
  const idPrefix = useId();
  const minId = `${idPrefix}-price-gte`;
  const maxId = `${idPrefix}-price-lte`;
  const activePrice = priceFilter(state);
  const min = activePrice?.min ?? "";
  const max = activePrice?.max ?? "";
  const currencySymbol = formatMoney(
    { amount: "0", currencyCode },
    { locale: DEFAULT_MONEY_LOCALE },
  ).currencyNarrowSymbol;

  useEffect(() => {
    for (const [input, value] of [
      [minInput.current, min],
      [maxInput.current, max],
    ] as const) {
      if (!input) continue;
      const matches =
        value === ""
          ? input.value === ""
          : input.value !== "" && Number(input.value) === value;
      if (!matches) {
        if (timer.current) clearTimeout(timer.current);
        timer.current = null;
        input.value = String(value);
      }
    }
  }, [min, max]);

  useEffect(() => {
    function restoreHistoryPrice() {
      // Cancel the draft before the history loader settles, even when the price is unchanged.
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
      const { filters } = parseCollectionParams(
        new URLSearchParams(window.location.search),
      );
      const price = filters.find((filter) => filter.price != null)?.price;
      if (minInput.current) minInput.current.value = String(price?.min ?? "");
      if (maxInput.current) maxInput.current.value = String(price?.max ?? "");
    }

    window.addEventListener("popstate", restoreHistoryPrice);
    return () => {
      window.removeEventListener("popstate", restoreHistoryPrice);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function submitAfterTyping(event: React.ChangeEvent<HTMLInputElement>) {
    if (timer.current) clearTimeout(timer.current);
    const form = event.currentTarget.form;
    timer.current = setTimeout(() => form?.requestSubmit(), 350);
  }

  return (
    <div className="min-w-0 pt-2">
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
        <InputGroup className="h-11 min-w-0">
          <InputGroupAddon aria-hidden="true">{currencySymbol}</InputGroupAddon>
          <InputGroupInput
            type="number"
            ref={minInput}
            id={minId}
            aria-label={`Minimum price in ${currencyCode}`}
            name={PRICE_MIN_PARAM}
            min="0"
            step="any"
            placeholder="Min"
            defaultValue={min}
            className="min-w-0"
            onChange={submitAfterTyping}
          />
        </InputGroup>
        <span className="text-muted-foreground text-center text-sm">to</span>
        <InputGroup className="h-11 min-w-0">
          <InputGroupAddon aria-hidden="true">{currencySymbol}</InputGroupAddon>
          <InputGroupInput
            type="number"
            ref={maxInput}
            id={maxId}
            aria-label={`Maximum price in ${currencyCode}`}
            name={PRICE_MAX_PARAM}
            min="0"
            step="any"
            placeholder="Max"
            defaultValue={max}
            className="min-w-0"
            onChange={submitAfterTyping}
          />
        </InputGroup>
      </div>
    </div>
  );
}

function ColorSwatchFacet({
  filter,
  state,
  options,
  labelId,
  onToggle,
}: {
  filter: BrowseFilter;
  state: CollectionState;
  options: FacetOption[];
  labelId: string;
  onToggle: (option: FacetOption) => void;
}) {
  const id = useId();

  if (options.length === 0) return null;

  const activeIds = options
    .filter((option) => option.isActive)
    .map((option) => option.value.id);

  return (
    <FieldSet className="gap-0" aria-labelledby={labelId}>
      <ToggleGroup
        type="multiple"
        variant="outline"
        spacing={2.5}
        value={activeIds}
        className="w-full flex-wrap pt-2 noscript:hidden"
        onValueChange={(nextIds) => {
          const changed = options.find(
            (option) => nextIds.includes(option.value.id) !== option.isActive,
          );
          if (changed) onToggle(changed);
        }}
      >
        {options.map((option) => {
          const { value } = option;
          const imageUrl = value.swatch?.image?.previewImage?.url;
          const color = value.swatch?.color;
          const countId = `${id}-${encodeURIComponent(value.id)}-count`;

          return (
            <ToggleGroupItem
              key={value.id}
              value={value.id}
              data-testid="facet-option"
              aria-label={value.label}
              aria-describedby={countId}
              title={`${value.label} (${value.count})`}
              className="size-11 min-w-11 rounded-full px-0"
            >
              <span
                className="bg-background relative inline-flex size-7 shrink-0 overflow-hidden rounded-full border"
                style={{ backgroundColor: color ?? undefined }}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt=""
                    className="size-full object-cover"
                    loading="lazy"
                  />
                ) : null}
                <span className="bg-foreground/40 absolute inset-0 hidden items-center justify-center group-data-[state=on]/toggle:flex">
                  <CheckIcon
                    className="text-background size-3.5"
                    aria-hidden="true"
                  />
                </span>
              </span>
              <span id={countId} className="sr-only" aria-hidden="true">
                {productCountText(value.count)}
              </span>
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
      <noscript>
        <FacetOptionLinks filter={filter} options={options} state={state} />
      </noscript>
    </FieldSet>
  );
}

function FacetBody({
  filter,
  state,
  options,
  labelId,
  currencyCode,
  onToggle,
}: {
  filter: BrowseFilter;
  state: CollectionState;
  options: FacetOption[];
  labelId: string;
  currencyCode: string;
  onToggle: (option: FacetOption) => void;
}) {
  if (filter.type === "PRICE_RANGE")
    return <PriceRangeFacet state={state} currencyCode={currencyCode} />;
  const props = { filter, state, options, labelId, onToggle };
  if (isSwatchFilter(filter)) return <ColorSwatchFacet {...props} />;
  return <ListFacet {...props} />;
}

function SortLinks({
  sortOptions,
  resolvedSortValue,
  state,
}: {
  sortOptions: SortOption[];
  resolvedSortValue: string;
  state: CollectionState;
}) {
  const location = useLocation();

  return (
    <nav aria-label="Sort by" className="flex flex-wrap items-center gap-1">
      <span className="text-muted-foreground me-1 text-sm">Sort by</span>
      {sortOptions.map((option) => {
        const isActive = option.value === resolvedSortValue;
        const href = browseHref(location.pathname, location.search, {
          filters: state.filters,
          ...parseSortByValue(option.value),
        });

        return (
          <Button
            key={option.value}
            asChild
            variant={isActive ? "secondary" : "ghost"}
            size="sm"
            className="h-11"
          >
            <Link
              to={href}
              rel="nofollow"
              aria-current={isActive ? "true" : undefined}
            >
              {option.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}

export function Toolbar({
  countText,
  defaultSortValue,
  sortOptions,
  extraHiddenInputs,
  filterDrawer,
}: {
  countText: string;
  defaultSortValue: string;
  sortOptions: SortOption[];
  extraHiddenInputs?: ReactNode;
  /** The `FilterDrawer`, which renders its own trigger button here. */
  filterDrawer?: ReactNode;
}) {
  const state: CollectionState = useCollection();
  const { formProps } = useCollectionForm();
  const sortInput = useRef<HTMLInputElement>(null);
  const resolvedSortValue = currentSortValue(state) ?? defaultSortValue;
  const resolvedSortLabel = sortOptions.find(
    (option) => option.value === resolvedSortValue,
  )?.label;
  const hiddenParams = activeFilterParams(state);

  function submitSort(value: string) {
    const input = sortInput.current;
    if (!input) return;
    // The Select has no form field of its own, so the hidden `sort_by` input
    // carries the choice into the same GET form submit as before.
    input.value = value;
    input.form?.requestSubmit();
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex min-w-0 flex-wrap items-center gap-4">
        {filterDrawer}
        <span
          className="text-muted-foreground min-w-0 text-sm wrap-break-word"
          aria-live="polite"
        >
          {countText}
        </span>
      </div>
      <form
        {...formProps()}
        method="get"
        className="flex min-w-0 items-center gap-2 noscript:hidden"
      >
        {hiddenInputsFromParams(hiddenParams)}
        {extraHiddenInputs}
        <input
          type="hidden"
          ref={sortInput}
          name="sort_by"
          value={resolvedSortValue}
        />
        <Label
          htmlFor="sort-by"
          className="text-muted-foreground shrink-0 font-normal whitespace-nowrap"
        >
          Sort by
        </Label>
        <Select value={resolvedSortValue} onValueChange={submitSort}>
          <SelectTrigger
            id="sort-by"
            className="max-w-full font-medium data-[size=default]:h-11"
          >
            <SelectValue>{resolvedSortLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent position="popper" align="end">
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </form>
      <noscript>
        <SortLinks
          sortOptions={sortOptions}
          resolvedSortValue={resolvedSortValue}
          state={state}
        />
      </noscript>
    </div>
  );
}

function FacetGroups({
  availableFilters,
  state,
  currencyCode,
}: {
  availableFilters: readonly BrowseFilter[];
  state: CollectionState;
  currencyCode: string;
}) {
  // Track the closed groups, so every group (including ones that appear later) starts open.
  const [closedIds, setClosedIds] = useState<string[]>([]);
  const filterIds = availableFilters.map((filter) => filter.id);

  return (
    <Accordion
      type="multiple"
      value={filterIds.filter((id) => !closedIds.includes(id))}
      onValueChange={(openIds) =>
        setClosedIds(filterIds.filter((id) => !openIds.includes(id)))
      }
    >
      {availableFilters.map((filter) => (
        <FacetGroup
          key={filter.id}
          filter={filter}
          state={state}
          currencyCode={currencyCode}
        />
      ))}
    </Accordion>
  );
}

export function FacetForm({
  availableFilters,
  currencyCode,
  extraHiddenInputs,
}: {
  availableFilters: readonly BrowseFilter[];
  currencyCode: string;
  extraHiddenInputs?: ReactNode;
}) {
  const state: CollectionState = useCollection();
  const { formProps } = useCollectionForm();
  const sort = currentSortValue(state);

  return (
    <form {...formProps()} method="get">
      {sort ? <input type="hidden" name="sort_by" value={sort} /> : null}
      {extraHiddenInputs}
      <FacetGroups
        key={state.handle}
        availableFilters={availableFilters}
        state={state}
        currencyCode={currencyCode}
      />
      <noscript>
        <Button type="submit" className="mt-4 h-11 px-4">
          Apply filters
        </Button>
      </noscript>
    </form>
  );
}

export function FilterDrawer({
  availableFilters,
  currencyCode,
  extraHiddenInputs,
  id = FILTER_SHEET_ID,
}: {
  availableFilters: readonly BrowseFilter[];
  currencyCode: string;
  extraHiddenInputs?: ReactNode;
  id?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="h-11 px-3 lg:hidden noscript:hidden"
          aria-controls={id}
        >
          <FunnelIcon data-icon="inline-start" aria-hidden="true" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent
        id={id}
        side="left"
        className="w-full gap-0 sm:max-w-md"
        showCloseButton={false}
      >
        <SheetHeader className="flex-row items-center justify-between gap-2 py-2 pe-2">
          <SheetTitle className="text-lg">Filters</SheetTitle>
          <SheetDescription className="sr-only">
            Choose filters to narrow the products
          </SheetDescription>
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-11"
              aria-label="Close"
            >
              <XIcon aria-hidden="true" />
            </Button>
          </SheetClose>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <FacetForm
            availableFilters={availableFilters}
            currencyCode={currencyCode}
            extraHiddenInputs={extraHiddenInputs}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function ActiveFilterChips({
  basePath,
  clearAllTo,
  currencyCode,
}: {
  basePath: string;
  clearAllTo: string;
  currencyCode: string;
}) {
  const state: CollectionState = useCollection();
  if (state.filters.length === 0) return null;

  const currentParams = serializeCollectionParams(state);

  return (
    <div
      className="mb-6 flex flex-wrap items-center gap-2"
      role="region"
      aria-label="Active filters"
    >
      {state.filters.map((filter, index) => {
        const label = describeFilter(filter, currencyCode);
        const removal = getFilterRemovalUrl(currentParams, filter);
        const to = buildPathWithRemoval(basePath, removal);

        return (
          <Button
            key={`${label}-${index}-${removal}`}
            asChild
            variant="secondary"
            className="h-11 rounded-full px-3"
          >
            <Link
              to={to}
              preventScrollReset
              aria-label={`Remove ${label} filter`}
            >
              {label}
              <XIcon data-icon="inline-end" aria-hidden="true" />
            </Link>
          </Button>
        );
      })}
      <Button asChild variant="link" className="h-11 px-2">
        <Link to={clearAllTo} preventScrollReset>
          Clear all
        </Link>
      </Button>
    </div>
  );
}

export function useLoadMore<T>(
  initialNodes: readonly T[],
  initialPageInfo: BrowsePageInfo,
  dataSearch: string,
) {
  const fetcher = useFetcher();
  const [nodes, setNodes] = useState<readonly T[]>(initialNodes);
  const [pageInfo, setPageInfo] = useState<BrowsePageInfo>(initialPageInfo);
  const requestedSearch = useRef<string | null>(null);
  const appendedSearches = useRef(new Set<string>());

  useEffect(() => {
    setNodes(initialNodes);
    setPageInfo(initialPageInfo);
    requestedSearch.current = null;
    appendedSearches.current.clear();
  }, [dataSearch, initialNodes, initialPageInfo]);

  useEffect(() => {
    const data = fetcher.data as LoadMoreResponse<T> | undefined;
    if (!data || data.dataSearch !== requestedSearch.current) return;
    if (appendedSearches.current.has(data.dataSearch)) return;

    appendedSearches.current.add(data.dataSearch);
    requestedSearch.current = null;
    setNodes((current) => [...current, ...data.products]);
    setPageInfo(data.pageInfo);
  }, [fetcher.data]);

  return {
    nodes,
    pageInfo,
    isLoading: fetcher.state !== "idle",
    loadMore: (href: string, nextDataSearch: string) => {
      requestedSearch.current = nextDataSearch;
      fetcher.load(href);
    },
  };
}

export function LoadMore({
  pageInfo,
  loadedCount,
  countLabel,
  isLoading,
  onLoad,
}: {
  pageInfo: BrowsePageInfo;
  loadedCount: number;
  countLabel?: string;
  isLoading: boolean;
  onLoad: (href: string, nextDataSearch: string) => void;
}) {
  const location = useLocation();

  if (!pageInfo.hasNextPage || !pageInfo.endCursor) return null;

  const params = new URLSearchParams(location.search);
  params.set("after", pageInfo.endCursor);
  const nextSearch = params.toString();
  const href = `${location.pathname}?${nextSearch}`;

  return (
    <div className="mt-12 flex flex-col items-center gap-3">
      <p className="text-muted-foreground text-sm">
        {countLabel ?? `Showing ${loadedCount} products`}
      </p>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            {/* A real link to the next page, so it still works without JavaScript. */}
            <Button
              asChild
              variant="outline"
              className={cn(
                "h-11 px-6",
                isLoading && "pointer-events-none opacity-50",
              )}
            >
              <Link
                to={href}
                preventScrollReset
                aria-disabled={isLoading}
                onClick={(event) => {
                  event.preventDefault();
                  if (!isLoading) onLoad(href, nextSearch);
                }}
              >
                {isLoading ? (
                  <>
                    <Spinner data-icon="inline-start" aria-hidden="true" />
                    Loading…
                  </>
                ) : (
                  "Load more"
                )}
              </Link>
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
