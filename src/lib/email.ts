import { formatOrderReference, formatPrice } from "@/lib/utils";

type EmailPayload = {
  to: string | string[];
  subject: string;
  html: string;
};

type OrderEmailItem = {
  name: string;
  quantity: number;
  price: number;
};

type OrderEmailData = {
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  barangay: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  paymentMethod: string;
  paymentReference: string;
  notes: string;
  total: number;
  items: OrderEmailItem[];
};

function getResendApiKey() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("Missing RESEND_API_KEY");
  }

  return key;
}

function getNotificationEmail() {
  return process.env.ORDER_NOTIFICATION_EMAIL ?? "kaneandkaori@gmail.com";
}

function getFromEmail() {
  return process.env.ORDER_FROM_EMAIL ?? "Kane & Kaori <onboarding@resend.dev>";
}

async function sendEmail(payload: EmailPayload) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getResendApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: getFromEmail(),
      ...payload,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Resend error: ${text}`);
  }
}

function renderItems(items: OrderEmailItem[]) {
  return items
    .map(
      (item) =>
        `<li>${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}</li>`,
    )
    .join("");
}

function renderAddress(order: OrderEmailData) {
  return [
    order.address,
    order.barangay,
    `${order.city}, ${order.province} ${order.postalCode}`.trim(),
    order.country,
  ]
    .filter(Boolean)
    .join("<br />");
}

export async function sendNewOrderNotification(order: OrderEmailData) {
  const reference = formatOrderReference(order.orderId);

  await sendEmail({
    to: getNotificationEmail(),
    subject: `New Kane & Kaori Order ${reference}`,
    html: `
      <h2>New order received</h2>
      <p><strong>Reference:</strong> ${reference}</p>
      <p><strong>Customer:</strong> ${order.customerName}</p>
      <p><strong>Email:</strong> ${order.email}</p>
      <p><strong>Phone:</strong> ${order.phone}</p>
      <p><strong>Payment:</strong> ${order.paymentMethod}${
        order.paymentReference ? ` (${order.paymentReference})` : ""
      }</p>
      <p><strong>Total:</strong> ${formatPrice(order.total)}</p>
      <p><strong>Delivery address:</strong><br />${renderAddress(order)}</p>
      <p><strong>Order notes:</strong> ${order.notes || "None"}</p>
      <h3>Items</h3>
      <ul>${renderItems(order.items)}</ul>
    `,
  });
}

export async function sendShippedOrderEmail(order: OrderEmailData) {
  if (!order.email) {
    return;
  }

  const reference = formatOrderReference(order.orderId);

  await sendEmail({
    to: order.email,
    subject: `Your Kane & Kaori order ${reference} has shipped`,
    html: `
      <h2>Your order is on the way</h2>
      <p>Hi ${order.customerName},</p>
      <p>Your Kane & Kaori order has been marked as <strong>Shipped</strong>.</p>
      <p><strong>Reference:</strong> ${reference}</p>
      <p><strong>Total:</strong> ${formatPrice(order.total)}</p>
      <h3>Items</h3>
      <ul>${renderItems(order.items)}</ul>
      <p>We will contact you if there are any delivery updates.</p>
    `,
  });
}
