export async function Stripe(monto) {
  const STRIPE_API_URL = import.meta.env.VITE_STRIPE_API_URL;
  const STRIPE_SECRET_KEY = import.meta.env.VITE_STRIPE_SECRET_KEY;
  const params = new URLSearchParams();
  params.append("success_url", "https://tecnobus.uy/Venta/CompraExitosa");
  params.append("cancel_url", "https://tecnobus.uy/Venta/PagoCancelado");
  params.append("mode", "payment");
  params.append("line_items[0][price_data][currency]", "uyu");
  params.append(
    "line_items[0][price_data][product_data][name]",
    "Pasaje de ómnibus"
  );
  params.append(
    "line_items[0][price_data][unit_amount]",
    String(Math.round(monto * 100))
  ); // en centavos
  params.append("line_items[0][quantity]", "1");

  const response = await fetch(`${STRIPE_API_URL}/v1/checkout/sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = await response.json();

  if (!response.ok || !data.url) {
    throw new Error(
      data?.error?.message || "No se pudo crear la sesión de pago"
    );
  }

  return data.url;
}
