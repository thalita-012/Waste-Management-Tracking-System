import { Router } from 'express';
import { TruckController } from '../controllers/TruckController.js';
import { authMiddleware, authorize } from '../middlewares/AuthMiddleware.js';
const router = Router();
const controller = new TruckController();
// Only Admins can manage trucks
router.use(authMiddleware);
router.post('/', authorize(['ADMIN']), controller.create);
router.get('/', controller.getAll); // Drivers and Admins can see trucks
router.get('/:id', controller.getOne);
router.put('/:id', authorize(['ADMIN']), controller.update);
router.delete('/:id', authorize(['ADMIN']), controller.delete);
export default router;
//# sourceMappingURL=truckRoute.js.map