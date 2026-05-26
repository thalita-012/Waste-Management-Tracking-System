import { Request, Response } from 'express';
import { PaymentService } from '../services/PaymentService';

export class PaymentController {
  private paymentService = new PaymentService();

  createPayment = async (req: Request, res: Response) => {
    try {
      const { orderId, amount } = req.body;

      const payment = await this.paymentService.createBakongPayment(
        orderId,
        amount
      );

      return res.status(201).json({
        success: true,
        data: payment,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  verifyPayment = async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;

      const result = await this.paymentService.verifyPayment(orderId);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
}