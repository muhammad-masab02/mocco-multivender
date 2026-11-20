import connectDB from "./src/db/index.js";
import Product from "./src/models/product.model.js";
import Category from "./src/models/category.model.js";

async function run() {
  await connectDB();
  const catCount = await Category.countDocuments();
  console.log("Categories in DB:", catCount);

  const products = await Product.find({}, { name: 1, category: 1, mainCategory: 1, subCategory: 1, categoryPath: 1 }).lean();
  console.log("Total products in DB:", products.length);
  console.log("Products list:", products);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
