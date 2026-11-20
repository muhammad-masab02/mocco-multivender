import connectDB from "./src/db/index.js";
import Event from "./src/models/event.model.js";

async function run() {
  await connectDB();
  const events = await Event.find({}, { name: 1, category: 1, mainCategory: 1, subCategory: 1, categoryPath: 1 }).lean();
  console.log("Total events:", events.length);
  console.log("Events:", events);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
