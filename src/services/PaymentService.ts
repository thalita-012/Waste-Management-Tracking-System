import { PaymentRepository } from "../repositories/PaymentRepository.js";

export class PaymentService {
  private paymentRepo = new PaymentRepository();

  async createBakongPayment(orderId: string, amount: number) {
    const apiUrl = process.env.BAKONG_API_URL;
    const apiKey = process.env.BAKONG_API_KEY;
    const merchantId = process.env.BAKONG_MERCHANT_ID;

    if (!apiUrl || !apiKey || !merchantId) {
      throw new Error("Missing Bakong env vars: BAKONG_API_URL, BAKONG_API_KEY, BAKONG_MERCHANT_ID");
    }

    // Example payload
    const payload = {
      merchantId,
      amount,
      currency: 'KHR',
      reference: orderId,
    };

    // Call Bakong API
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(`Bakong create payment failed (${response.status}): ${errorBody}`);
    }

    const responseBody: unknown = await response.json();
    const qrString =
      typeof responseBody === "object" && responseBody !== null && "qrString" in responseBody
        ? (responseBody as { qrString?: unknown }).qrString
        : undefined;

    if (typeof qrString !== "string" || qrString.length === 0) {
      throw new Error("Bakong response missing qrString");
    }

    // Save payment record
    const payment = await this.paymentRepo.create({
      orderId,
      amount,
      currency: 'KHR',
      qrString,
      status: 'PENDING',
    });

    return payment;
  }

  async verifyPayment(orderId: string) {
    const payment = await this.paymentRepo.findByOrderId(orderId);

    if (!payment) {
      throw new Error('Payment not found');
    }

    const apiUrl = process.env.BAKONG_API_URL;
    const apiKey = process.env.BAKONG_API_KEY;

    if (!apiUrl || !apiKey) {
      throw new Error("Missing Bakong env vars: BAKONG_API_URL, BAKONG_API_KEY");
    }

    // Example verification request
    const response = await fetch(`${apiUrl}/check/${encodeURIComponent(orderId)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(`Bakong verify payment failed (${response.status}): ${errorBody}`);
    }

    const responseBody: unknown = await response.json();
    const status =
      typeof responseBody === "object" && responseBody !== null && "status" in responseBody
        ? (responseBody as { status?: unknown }).status
        : undefined;

    const isPaid = status === "PAID";

    if (isPaid) {
      await this.paymentRepo.updateStatus(orderId, 'PAID');
    }

    return {
      orderId,
      paid: isPaid,
    };
  }
}
