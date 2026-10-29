import { gql } from "@shopify/hydrogen/customer-account";
import { ChevronLeftIcon, ChevronRightIcon, PackageIcon } from "lucide-react";
import { Link, useNavigation } from "react-router";

import { Alert, AlertDescription } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { customerAccountContext } from "~/lib/customer-account";
import { formatPrice } from "~/lib/money";
import { cn } from "~/lib/utils";

import type { Route } from "./+types/account";

const ORDERS_PAGE_SIZE = 10;

const ACCOUNT_QUERY = gql(`
  query AccountPage($first: Int, $after: String, $last: Int, $before: String) {
    customer {
      firstName
      lastName
      emailAddress {
        emailAddress
      }
      orders(
        first: $first
        after: $after
        last: $last
        before: $before
        sortKey: PROCESSED_AT
        reverse: true
      ) {
        nodes {
          id
          name
          processedAt
          financialStatus
          statusPageUrl
          totalPrice {
            amount
            currencyCode
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`);

const dateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
});

export function meta({}: Route.MetaArgs) {
  return [{ title: "Account · CORE" }];
}

export async function loader({ context, request }: Route.LoaderArgs) {
  const customerAccount = context.get(customerAccountContext);
  if (!customerAccount) return { status: "unavailable" } as const;

  const { client, session, sessionManager, requestContext } = customerAccount;
  // Reading the token marks the response as personalized, so it is never cached.
  const accessToken = await session.getOrRefreshAccessToken(
    sessionManager,
    requestContext,
  );
  const searchParams = new URL(request.url).searchParams;
  if (!accessToken) {
    return {
      status: "signed-out",
      loginFailed: searchParams.get("login") === "failed",
    } as const;
  }

  const before = searchParams.get("before");
  const variables = before
    ? { last: ORDERS_PAGE_SIZE, before }
    : { first: ORDERS_PAGE_SIZE, after: searchParams.get("after") };

  try {
    const { data, errors } = await client.graphql(ACCOUNT_QUERY, {
      accessToken,
      variables,
    });
    if (errors || !data.customer) {
      return {
        status: "error",
        message: errors?.[0]?.message ?? "Customer not found.",
      } as const;
    }
    return { status: "signed-in", customer: data.customer } as const;
  } catch {
    return {
      status: "error",
      message: "We couldn't load your account. Try again later.",
    } as const;
  }
}

export default function AccountRoute({ loaderData }: Route.ComponentProps) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto w-full max-w-7xl flex-1 px-4 py-12"
    >
      <h1 className="font-heading mb-8 text-4xl font-semibold tracking-tight md:text-5xl">
        Account
      </h1>
      {loaderData.status === "unavailable" ? <Unavailable /> : null}
      {loaderData.status === "signed-out" ? (
        <SignIn loginFailed={loaderData.loginFailed} />
      ) : null}
      {loaderData.status === "error" ? (
        <>
          <Alert variant="destructive">
            <AlertDescription>{loaderData.message}</AlertDescription>
          </Alert>
          <LogoutForm />
        </>
      ) : null}
      {loaderData.status === "signed-in" ? (
        <Customer customer={loaderData.customer} />
      ) : null}
    </main>
  );
}

function Unavailable() {
  return (
    <section aria-labelledby="unavailable-heading">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold tracking-tight">
            <h2 id="unavailable-heading">
              Customer Accounts aren&apos;t set up
            </h2>
          </CardTitle>
          <CardDescription className="max-w-xl text-base">
            Customer Accounts need a real store, <code>SHOP_ID</code>,{" "}
            <code>PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID</code>,{" "}
            <code>SESSION_SECRET</code>, and HTTPS (use{" "}
            <code>npm run dev:https</code> locally).
          </CardDescription>
        </CardHeader>
      </Card>
    </section>
  );
}

function SignIn({ loginFailed }: { loginFailed: boolean }) {
  return (
    <section aria-labelledby="sign-in-heading">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold tracking-tight">
            <h2 id="sign-in-heading">Sign in</h2>
          </CardTitle>
          <CardDescription className="max-w-xl text-base">
            Sign in to see your orders.
          </CardDescription>
        </CardHeader>
        <CardContent className="items-start gap-6">
          {loginFailed ? (
            <Alert variant="destructive">
              <AlertDescription>
                We couldn&apos;t sign you in. Try again.
              </AlertDescription>
            </Alert>
          ) : null}
          {/* A plain <a>: the OAuth redirect needs a full page navigation. */}
          <Button asChild className="h-11 px-5">
            <a href="/account/login">Sign in</a>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

function LogoutForm() {
  // A plain <form>: the logout redirect needs a full page navigation.
  return (
    <form method="post" action="/account/logout" className="mt-6">
      <Button type="submit" variant="outline" className="h-11 px-5">
        Log out
      </Button>
    </form>
  );
}

type Customer = Extract<
  Route.ComponentProps["loaderData"],
  { status: "signed-in" }
>["customer"];

function Customer({ customer }: { customer: Customer }) {
  const name = [customer.firstName, customer.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
      <section aria-labelledby="profile-heading">
        <h2
          id="profile-heading"
          className="font-heading mb-3 text-xl font-semibold tracking-tight"
        >
          {name || "Your account"}
        </h2>
        {customer.emailAddress?.emailAddress ? (
          <p className="text-muted-foreground">
            {customer.emailAddress.emailAddress}
          </p>
        ) : null}
        <LogoutForm />
      </section>
      <Orders orders={customer.orders} />
    </div>
  );
}

function Orders({ orders }: { orders: Customer["orders"] }) {
  const navigation = useNavigation();
  const isPaging =
    navigation.state === "loading" &&
    navigation.location?.pathname === "/account";
  const { pageInfo } = orders;

  return (
    <section aria-labelledby="orders-heading">
      <h2
        id="orders-heading"
        className="font-heading mb-4 text-xl font-semibold tracking-tight"
      >
        Orders
      </h2>
      {orders.nodes.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PackageIcon aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>You haven&apos;t placed any orders yet.</EmptyTitle>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild className="h-11 px-5">
              <Link to="/collections">Start shopping</Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <ul
          role="list"
          aria-busy={isPaging}
          className={cn("flex flex-col gap-3", isPaging && "opacity-50")}
        >
          {orders.nodes.map((order) => {
            const status = formatStatus(order.financialStatus);
            return (
              <li key={order.id}>
                <Card size="sm">
                  <CardContent className="flex-row flex-wrap items-center gap-x-6 gap-y-1">
                    <a
                      href={order.statusPageUrl}
                      className="focus-visible:ring-ring/50 rounded-md font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-3"
                    >
                      Order {order.name}
                    </a>
                    <time
                      dateTime={order.processedAt}
                      className="text-muted-foreground text-sm"
                    >
                      {dateFormat.format(new Date(order.processedAt))}
                    </time>
                    {status ? (
                      <Badge
                        variant={
                          order.financialStatus === "PAID"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {status}
                      </Badge>
                    ) : null}
                    <span className="ms-auto text-base font-medium">
                      {formatPrice(order.totalPrice)}
                    </span>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
      {pageInfo.hasPreviousPage || pageInfo.hasNextPage ? (
        <nav
          aria-label="Orders pagination"
          className="mt-6 flex justify-between gap-4"
        >
          {pageInfo.hasPreviousPage && pageInfo.startCursor ? (
            <Button asChild variant="outline" className="h-11 px-5">
              <Link
                to={`?before=${encodeURIComponent(pageInfo.startCursor)}`}
                preventScrollReset
              >
                <ChevronLeftIcon data-icon="inline-start" aria-hidden="true" />
                Newer orders
              </Link>
            </Button>
          ) : (
            <span />
          )}
          {pageInfo.hasNextPage && pageInfo.endCursor ? (
            <Button asChild variant="outline" className="h-11 px-5">
              <Link
                to={`?after=${encodeURIComponent(pageInfo.endCursor)}`}
                preventScrollReset
              >
                Older orders
                <ChevronRightIcon data-icon="inline-end" aria-hidden="true" />
              </Link>
            </Button>
          ) : null}
        </nav>
      ) : null}
    </section>
  );
}

function formatStatus(status: string | null | undefined) {
  if (!status) return "";
  const text = status.toLowerCase().replaceAll("_", " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}
