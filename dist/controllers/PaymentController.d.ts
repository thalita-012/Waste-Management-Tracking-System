import type { Request, Response } from "express";
export declare class PaymentController {
    private paymentService;
    createPayment: (req: Request, res: Response) => Promise<Response>;
    verifyPayment: (req: Request, res: Response) => Promise<Response>;
}
//# sourceMappingURL=PaymentController.d.ts.map