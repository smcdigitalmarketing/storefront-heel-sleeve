import { useState } from "react";

import { Badge } from "~/components/ui/badge";
import { getPaymentMethodIconUrl } from "~/lib/payment-icons";
import type { PaymentMethodLabel } from "~/lib/storefront-shop";

export function PaymentMethodIcon({ method }: { method: PaymentMethodLabel }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const src = getPaymentMethodIconUrl(method);

  if (!src || src === failedSrc) {
    return (
      <Badge variant="outline" className="max-w-full wrap-anywhere">
        {method}
      </Badge>
    );
  }

  return (
    <img
      src={src}
      alt={method}
      title={method}
      width={38}
      height={24}
      className="block h-6 w-[38px]"
      // An SSR image can fail before hydration attaches onError, so also check on mount.
      ref={(img) => {
        if (img?.complete && img.naturalWidth === 0) setFailedSrc(src);
      }}
      onError={() => setFailedSrc(src)}
    />
  );
}
