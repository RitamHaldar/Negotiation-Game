import "dotenv/config"
import app from "./src/app.js";
import { Connecttodb } from "./src/config/database.js";
Connecttodb();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
})
