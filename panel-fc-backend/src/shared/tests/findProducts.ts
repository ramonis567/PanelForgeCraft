import { connectDB } from "../config/db";
import Catalog from "../../features/catalog/Catalog";

(async () => {
    await connectDB();

    const products = await Catalog.find();
    console.log("Products:", products);

    process.exit(0);
})();
