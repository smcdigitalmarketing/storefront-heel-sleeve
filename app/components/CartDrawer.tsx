import { ShopPayButton } from "@shopify/hydrogen/react";
import {
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode, type SubmitEvent } from "react";
import { Link } from "react-router";

import { Alert, AlertAction, AlertDescription } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ButtonGroup } from "~/components/ui/button-group";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { Input } from "~/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "~/components/ui/item";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { Skeleton } from "~/components/ui/skeleton";
import { useCart, useCartForm } from "~/lib/cart";
import {
  CART_DRAWER_ID,
  configureOpenCartAction,
  useDrawer,
} from "~/lib/cart-drawer";
import { formatPrice } from "~/lib/money";
import { cn } from "~/lib/utils";

import { publishCartViewed } from "./AnalyticsTrackers";

// Focus lands here when the last line is removed, since the removed line held focus.
const CART_DRAWER_FOCUS_ID = "cart-drawer-heading";

export function CartErrorBanner() {
  const errors = useCart((state) => state.errors);
  const [dismissedAt, setDismissedAt] = useState(0);
  const messages = useMemo(() => {
    const lines = [...errors.lines.values()].flatMap(
      (group) => group.userErrors,
    );
    return [...errors.network, ...errors.cart.userErrors, ...lines].map(
      (error) => error.message,
    );
  }, [errors]);

  if (messages.length === 0 || errors.lastUpdatedAt <= dismissedAt) return null;

  return (
    <Alert variant="destructive" role="alert">
      <AlertDescription>
        {messages.map((message) => (
          <p key={message}>{message}</p>
        ))}
      </AlertDescription>
      <AlertAction>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Dismiss"
          onClick={() => setDismissedAt(errors.lastUpdatedAt)}
        >
          <XIcon aria-hidden="true" />
        </Button>
      </AlertAction>
    </Alert>
  );
}

function hasPendingCost(pending: {
  cost?: boolean;
  discountCodes: Set<string>;
  lines: Set<string>;
}): boolean {
  return (
    pending.cost ?? (pending.lines.size > 0 || pending.discountCodes.size > 0)
  );
}

function useCartStatusMessage(): string {
  const pending = useCart((state) => state.pending);
  const revalidating = useCart(
    (state) => "revalidating" in state && state.revalidating === true,
  );
  const networkErrors = useCart((state) => state.errors.network);
  const isPending = hasPendingCost(pending) || revalidating;
  const [sawPending, setSawPending] = useState(false);

  useEffect(() => {
    if (isPending) setSawPending(true);
  }, [isPending]);

  if (isPending) return "Updating cart totals";
  if (sawPending && networkErrors.length === 0) return "Cart totals updated";
  return "";
}

type CartLineView = {
  id: string;
  quantity: number;
  cost: { totalAmount: { amount: string; currencyCode: string } };
  attributes?: Array<{ key: string; value: string | null }>;
  merchandise?: {
    title?: string | null;
    selectedOptions?: Array<{ name: string; value: string }> | null;
    image?: { url: string; altText?: string | null } | null;
    product?: { title?: string | null; handle?: string | null } | null;
  } | null;
};

export function CartLineItem({
  line,
  emptyCartFocusId,
}: {
  line: CartLineView;
  emptyCartFocusId: string;
}) {
  const { formProps, register } = useCartForm();
  const pendingLines = useCart((state) => state.pending.lines);
  const lineError = useCart((state) => state.errors.lines.get(line.id));
  const merchandise = line.merchandise;
  const product = merchandise?.product;
  const pending = pendingLines.has(line.id);
  const title = product?.title ?? merchandise?.title ?? "Product";
  const optionText = merchandise?.selectedOptions
    ?.map((option: { name: string; value: string }) => option.value)
    .join(" / ");
  const errorId = `cart-line-error-${line.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;

  // Removing a line unmounts the control that holds focus. Move focus to the same
  // control on a neighbouring line (or `emptyCartFocusId`) while the line still exists.
  const moveFocusBeforeRemoval = (event: SubmitEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    if (!form.contains(document.activeElement)) return;
    const intent = event.nativeEvent.submitter?.getAttribute("value");
    const quantity = new FormData(form).get("quantity");
    const removesLine =
      intent === "remove" ||
      (intent === "decrease" && line.quantity <= 1) ||
      (intent === "set" && Number(quantity) <= 0);
    if (!removesLine) return;

    const item = form.closest("li");
    const neighbour = item?.nextElementSibling ?? item?.previousElementSibling;
    const selector =
      intent === "set" ? 'input[name="quantity"]' : `button[value="${intent}"]`;
    const target =
      neighbour?.querySelector<HTMLElement>(selector) ??
      document.getElementById(emptyCartFocusId);
    target?.focus();
  };

  return (
    <li data-testid="cart-line" {...(pending ? { "aria-busy": "true" } : {})}>
      <Item
        size="sm"
        className={cn("items-start px-0", pending && "opacity-60")}
      >
        <ItemMedia variant="image" className="bg-muted size-20">
          {merchandise?.image ? (
            <img
              src={merchandise.image.url}
              alt={merchandise.image.altText ?? title}
              loading="lazy"
            />
          ) : null}
        </ItemMedia>
        <ItemContent>
          <ItemTitle>
            {product?.handle ? (
              <Link to={`/products/${product.handle}`}>{title}</Link>
            ) : (
              title
            )}
          </ItemTitle>
          {optionText ? <ItemDescription>{optionText}</ItemDescription> : null}
          {line.attributes
            ?.filter((attr) => !attr.key.startsWith("_") && attr.value != null)
            .map((attr) => (
              <ItemDescription key={attr.key} className="italic">
                {attr.key}: {attr.value}
              </ItemDescription>
            ))}
          <p className="text-sm">{formatPrice(line.cost.totalAmount)}</p>
          <form
            {...formProps({ beforeSubmit: moveFocusBeforeRemoval })}
            className="mt-2 flex items-center gap-2"
          >
            <Button {...register("set")} />
            <input type="hidden" {...register("lineId", { value: line.id })} />
            <ButtonGroup aria-label={`Quantity for ${title}`}>
              <Button
                type="submit"
                variant="outline"
                size="icon"
                {...register("decrease")}
                aria-label={`Decrease quantity for ${title}`}
              >
                <MinusIcon aria-hidden="true" />
              </Button>
              <Input
                {...register("quantity", {
                  value: line.quantity,
                  interactive: true,
                })}
                className="w-12 text-center"
                aria-label="Quantity"
                aria-describedby={
                  lineError?.userErrors.length ? errorId : undefined
                }
                aria-invalid={lineError?.userErrors.length ? true : undefined}
              />
              <Button
                type="submit"
                variant="outline"
                size="icon"
                {...register("increase")}
                aria-label={`Increase quantity for ${title}`}
              >
                <PlusIcon aria-hidden="true" />
              </Button>
            </ButtonGroup>
            <ItemActions>
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                {...register("remove")}
                aria-label={`Remove ${title}`}
              >
                <Trash2Icon aria-hidden="true" />
              </Button>
            </ItemActions>
          </form>
          {lineError?.userErrors.length ? (
            <p id={errorId} className="text-destructive text-sm" role="alert">
              {lineError.userErrors[0]?.message}
            </p>
          ) : null}
        </ItemContent>
      </Item>
    </li>
  );
}

export function CartEmpty({ action }: { action: ReactNode }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ShoppingBagIcon aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>Your cart is empty.</EmptyTitle>
        <EmptyDescription>
          Looks like you haven&apos;t added anything to your cart yet.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>{action}</EmptyContent>
    </Empty>
  );
}

function CartLines() {
  const loading = useCart((state) => state.loading);
  const lines = useCart((state) => state.data.lines.nodes);

  if (loading) {
    return (
      <div className="flex flex-col gap-4" aria-label="Loading cart">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <CartEmpty
        action={
          <SheetClose asChild>
            <Button asChild variant="outline">
              <Link to="/collections">Continue shopping</Link>
            </Button>
          </SheetClose>
        }
      />
    );
  }

  return (
    <ul role="list" className="divide-border divide-y">
      {lines.map((line) => (
        <CartLineItem
          key={line.id}
          line={line}
          emptyCartFocusId={CART_DRAWER_FOCUS_ID}
        />
      ))}
    </ul>
  );
}

export function CartTotals({ isPending }: { isPending: boolean }) {
  const cart = useCart((state) => state.data);

  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex items-center justify-between font-medium"
        aria-busy={isPending}
      >
        <span>
          Estimated total
          {isPending ? <span aria-hidden="true"> (updating)</span> : null}
        </span>
        <span className={cn("text-base", isPending && "text-muted-foreground")}>
          {formatPrice(cart.cost.totalAmount)}
        </span>
      </div>
      <p className="text-muted-foreground text-xs">
        Taxes and shipping calculated at checkout
      </p>
      {cart.checkoutUrl ? (
        <>
          <ShopPayButton width="100%" borderRadius="8px" />
          <Button asChild size="lg" className="w-full">
            <a href={cart.checkoutUrl}>Checkout</a>
          </Button>
        </>
      ) : null}
    </div>
  );
}

function CartFooter() {
  const hasLines = useCart((state) => state.data.lines.nodes.length > 0);
  const pending = useCart((state) => state.pending);
  const revalidating = useCart(
    (state) => "revalidating" in state && state.revalidating === true,
  );

  if (!hasLines) return null;

  return (
    <>
      <Separator />
      <SheetFooter>
        <CartTotals isPending={hasPendingCost(pending) || revalidating} />
      </SheetFooter>
    </>
  );
}

export function CartDrawer() {
  const [open, setOpen] = useDrawer(CART_DRAWER_ID);
  const totalQuantity = useCart((state) => state.data.totalQuantity);
  const cart = useCart((state) => state.data);
  const statusMessage = useCartStatusMessage();
  const cartRef = useRef(cart);
  cartRef.current = cart;

  useEffect(() => {
    configureOpenCartAction();
  }, []);

  useEffect(() => {
    if (open) publishCartViewed(cartRef.current);
  }, [open]);

  return (
    <>
      <span
        role="status"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
        data-cart-status
      >
        {statusMessage}
      </span>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          id={CART_DRAWER_ID}
          side="right"
          className="w-full gap-0 sm:max-w-md"
          data-testid="cart-drawer"
        >
          <SheetHeader>
            <div
              id={CART_DRAWER_FOCUS_ID}
              tabIndex={-1}
              className="flex items-center gap-2 outline-none"
            >
              <SheetTitle className="text-lg">Cart</SheetTitle>
              <Badge variant="secondary">{totalQuantity}</Badge>
            </div>
            <SheetDescription className="sr-only">
              Items in your cart
            </SheetDescription>
          </SheetHeader>
          <div className="px-4">
            <CartErrorBanner />
          </div>
          <ScrollArea className="min-h-0 flex-1 px-4">
            <CartLines />
          </ScrollArea>
          <CartFooter />
        </SheetContent>
      </Sheet>
    </>
  );
}
