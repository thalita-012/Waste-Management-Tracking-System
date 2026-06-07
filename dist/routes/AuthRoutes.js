"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_js_1 = require("../controllers/AuthController.js");
const AuthMiddleware_js_1 = require("../middlewares/AuthMiddleware.js");
const router = (0, express_1.Router)();
router.post('/register', (req, res) => AuthController_js_1.authController.register(req, res));
router.post('/login', (req, res) => AuthController_js_1.authController.login(req, res));
router.post('/forgot-password', (req, res) => AuthController_js_1.authController.forgotPassword(req, res));
router.post('/reset-password', (req, res) => AuthController_js_1.authController.resetPassword(req, res));
router.get('/profile', AuthMiddleware_js_1.authMiddleware, (req, res) => AuthController_js_1.authController.getProfile(req, res));
router.put('/profile', AuthMiddleware_js_1.authMiddleware, (req, res) => AuthController_js_1.authController.updateProfile(req, res));
exports.default = router;
//# sourceMappingURL=AuthRoutes.js.map