import { type Request, type Response } from 'express';
import { PaymentService } from '../services/PaymentService.js';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService?: PaymentService);
    createPayment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    verifyPayment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getPaymentQr: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    checkBakongAccount: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    decodeKhqr: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    private getCreatePaymentInput;
    private getOrderIdParam;
    private validateCreatePaymentInput;
    private validateOrderId;
    private toCreatePaymentCommand;
    private hasValidationError;
    private normalizeCurrency;
    private toSafePaymentResponse;
    private sendValidationError;
    private handleCreatePaymentError;
    private handlePaymentLookupError;
    private isBakongError;
    private getErrorMessage;
}
//# sourceMappingURL=PaymentController.d.ts.map