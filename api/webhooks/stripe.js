const Stripe = require("stripe");
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
  const chunks = []; for await (const c of req) chunks.push(c);
  const buf = Buffer.concat(chunks);
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e) { return res.status(400).send(`Webhook error: ${e.message}`); }
  if (event.type === "checkout.session.completed") {
    const orderId = event.data.object.client_reference_id;
    console.log("Pago TEST OK:", orderId);
  }
  res.status(200).end();
};
