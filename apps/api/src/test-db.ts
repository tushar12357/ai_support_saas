import "dotenv/config";
import { connectDB } from "./db/mongoose.js";
import { Tenant } from "./models/Tenant.js";

await connectDB();

const tenant = await Tenant.create({ name: "Demo Company" });
console.log("Created tenant:", tenant._id);

process.exit(0);
