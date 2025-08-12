// api/webhooks/stripe.js
import Stripe from "stripe";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const buf = Buffer.concat(chunks);

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.client_reference_id;
    console.log("Pago TEST OK:", orderId);
    // TODO: aquí llama a tu n8n y guarda en histórico
    // await fetch("https://TU_N8N/webhook/...", { method:"POST", headers:{'Content-Type':'application/json'}, body: JSON.stringify({ orderId, tipo:'blog_test' }) });
  }

  res.status(200).end();
}