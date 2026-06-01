<<<<<<< HEAD
import dotenv from 'dotenv';
import app from './app.js';
=======
import dotenv from "dotenv";
import app from "./app.js";
>>>>>>> b7808adb37a07e5f45a60d6aaf8cba3683e41758
dotenv.config();
const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=server.js.map