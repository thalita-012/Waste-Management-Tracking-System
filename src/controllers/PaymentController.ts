import type { Request, Response } from "express";
import { PaymentService } from "../services/PaymentService.js";

export class PaymentController {
  private paymentService = new PaymentService();

  createPayment = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { orderId, amount } = req.body;

      if (typeof orderId !== "string" || orderId.trim().length === 0) {
        return res.status(400).json({ success: false, message: "orderId is required" });
      }
      if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
        return res.status(400).json({ success: false, message: "amount must be a positive number" });
      }

      const payment = await this.paymentService.createBakongPayment(
        orderId,
        amount
      );

      return res.status(201).json({
        success: true,
        data: payment,
      });
    } catch (error: unknown) {
      return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  };

  verifyPayment = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { orderId } = req.params;

      if (typeof orderId !== "string" || orderId.trim().length === 0) {
        return res.status(400).json({ success: false, message: "orderId is required" });
      }

      const result = await this.paymentService.verifyPayment(orderId);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: unknown) {
      return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  };
}
