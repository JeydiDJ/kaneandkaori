import { formatOrderReference, formatPrice } from "@/lib/utils";
import type { OrderStatus } from "@/types/order";

type EmailPayload = {
  to: string | string[];
  subject: string;
  html: string;
};

type ContactEmailData = {
  name: string;
  email: string;
  subject: string;
  message: string;
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

function getContactNotificationEmail() {
  return process.env.CONTACT_NOTIFICATION_EMAIL ?? getNotificationEmail();
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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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

export async function sendContactFormNotification(contact: ContactEmailData) {
  await sendEmail({
    to: getContactNotificationEmail(),
    subject: `New Contact Form: ${contact.subject}`,
    html: `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(contact.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(contact.email)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(contact.subject)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(contact.message).replace(/\n/g, "<br />")}</p>
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

function getStatusEmailCopy(status: OrderStatus) {
  switch (status) {
    case "Confirmed":
      return {
        subject: "has been confirmed",
        heading: "Your order has been confirmed",
        intro:
          "We have received your order and the team is now preparing it for fulfillment.",
        closing: "We’ll email you again once your order has been packed or shipped.",
      };
    case "Packed":
      return {
        subject: "is packed and ready",
        heading: "Your order is packed",
        intro: "Your Kane & Kaori order has been packed and is queued for dispatch.",
        closing: "We’ll send another update as soon as it is shipped.",
      };
    case "Shipped":
      return {
        subject: "has shipped",
        heading: "Your order is on the way",
        intro: "Your Kane & Kaori order has been marked as shipped.",
        closing: "We will contact you if there are any delivery updates.",
      };
    case "Delivered":
      return {
        subject: "has been delivered",
        heading: "Your order has been delivered",
        intro: "Your Kane & Kaori order has been marked as delivered.",
        closing: "We hope you enjoy your fragrance. Thank you for ordering with us.",
      };
    default:
      return null;
  }
}

export async function sendOrderStatusEmail(order: OrderEmailData, status: OrderStatus) {
  if (!order.email) {
    return;
  }

  const copy = getStatusEmailCopy(status);

  if (!copy) {
    return;
  }

  const reference = formatOrderReference(order.orderId);

  await sendEmail({
    to: order.email,
    subject: `Your Kane & Kaori order ${reference} ${copy.subject}`,
    html: `
      <h2>${copy.heading}</h2>
      <p>Hi ${order.customerName},</p>
      <p>${copy.intro}</p>
      <p><strong>Reference:</strong> ${reference}</p>
      <p><strong>Status:</strong> ${status}</p>
      <p><strong>Total:</strong> ${formatPrice(order.total)}</p>
      <h3>Items</h3>
      <ul>${renderItems(order.items)}</ul>
      <p>${copy.closing}</p>
    `,
  });
}
