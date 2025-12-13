import crypto from "node:crypto";
import midtransClient from "midtrans-client";

// Midtrans Snap API client
export const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY || "",
  clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
});

// Midtrans Core API client (for subscription/recurring)
export const coreApi = new midtransClient.CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY || "",
  clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
});

export interface CreateTransactionParams {
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  itemName: string;
  itemId?: string;
}

/**
 * Create a Snap transaction and get the token/redirect URL
 */
export async function createSnapTransaction(params: CreateTransactionParams) {
  const { orderId, amount, customerName, customerEmail, itemName, itemId } =
    params;

  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount,
    },
    customer_details: {
      first_name: customerName,
      email: customerEmail,
    },
    item_details: [
      {
        id: itemId || orderId,
        price: amount,
        quantity: 1,
        name: itemName,
      },
    ],
    callbacks: {
      finish: `${process.env.NEXT_PUBLIC_APP_URL}/billing?status=finish`,
      error: `${process.env.NEXT_PUBLIC_APP_URL}/billing?status=error`,
      pending: `${process.env.NEXT_PUBLIC_APP_URL}/billing?status=pending`,
    },
  };

  const transaction = await snap.createTransaction(parameter);

  return {
    token: transaction.token,
    redirectUrl: transaction.redirect_url,
  };
}

/**
 * Verify Midtrans notification signature
 */
export function verifySignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string,
): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY || "";

  const expectedSignature = crypto
    .createHash("sha512")
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest("hex");

  return signatureKey === expectedSignature;
}

/**
 * Get transaction status from Midtrans
 */
export async function getTransactionStatus(orderId: string) {
  return (coreApi as any).transaction.status(orderId);
}

/**
 * Format price to Indonesian Rupiah
 */
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
