import Stripe from "stripe";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const orderId = "ord_" + Date.now();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    success_url: `https://laraia.es/blog.html?paid=1&order_id=${orderId}`,
    cancel_url: `https://laraia.es/blog.html`,
    client_reference_id: orderId
  });

  res.writeHead(303, { Location: session.url });
  res.end();
}
