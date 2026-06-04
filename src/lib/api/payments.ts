import { api } from "./axiosClient";

/**
 * Card data never touches Orbitly servers: the browser exchanges it for a
 * single-use token directly with the PayStream gateway, and only the token is
 * sent to orbitly-backend. This keeps us out of PCI DSS SAQ-D scope.
 */
const PAYSTREAM_TOKENIZE_URL =
  process.env.NEXT_PUBLIC_PAYMENTS_ENV === "live"
    ? "https://api.paystream-gateway.example/v1/tokens"
    : "https://sandbox.paystream-gateway.example/v1/tokens";

export interface CardDetails {
  number: string;
  expMonth: number;
  expYear: number;
  cvc: string;
  name: string;
}

export interface PaymentResult {
  paymentId: string;
  orderId: string;
  status: "authorized" | "captured" | "declined";
}

export async function tokenizeCard(card: CardDetails): Promise<string> {
  const res = await fetch(PAYSTREAM_TOKENIZE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      card: {
        number: card.number.replace(/\s+/g, ""),
        exp_month: card.expMonth,
        exp_year: card.expYear,
        cvc: card.cvc,
        name: card.name,
      },
    }),
  });
  if (!res.ok) {
    throw new Error("Your card could not be verified. Check the details and try again.");
  }
  const body = (await res.json()) as { id: string };
  return body.id;
}

export async function payOrder(orderId: string, cardToken: string): Promise<PaymentResult> {
  const { data } = await api.post<PaymentResult>(
    "/api/payments",
    { orderId, cardToken },
    { headers: { "Idempotency-Key": `pay-${orderId}` } },
  );
  return data;
}
