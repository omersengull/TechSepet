// app/api/create-payment-intent/route.js
import Stripe from 'stripe';

const secretKey = process.env.SECRET_KEY;
if (!secretKey) {
  throw new Error('Stripe Secret Key environment variable is missing!');
}

const stripe = new Stripe(secretKey, {
  apiVersion: '2022-11-15', // daha yaygın & stabil bir versiyon önerisi
});

export async function POST(request) {
  try {
    // Eğer tutarı client'tan alıyorsanız:
    const {
      amount
    } = await request.json();
    // Varsayılan tutar 100 cent (örneğin) veya gönderilen amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount || 100,
      currency: 'usd',
    });

    return new Response(JSON.stringify({
      clientSecret: paymentIntent.client_secret
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({
      error: 'Ödeme intenti oluşturulamadı'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      },
    });
  }
}