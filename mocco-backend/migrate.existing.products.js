import connectDB from "./src/db/index.js";
import Product from "./src/models/product.model.js";
import Event from "./src/models/event.model.js";

const CATEGORY_MAP = {
  "computers and laptops": {
    mainCategory: "Electronics & Technology",
    subCategory: "Computers & Laptops",
    category: "Laptops",
    categoryPath: "Electronics & Technology > Computers & Laptops > Laptops",
  },
  "computers and laptop": {
    mainCategory: "Electronics & Technology",
    subCategory: "Computers & Laptops",
    category: "Laptops",
    categoryPath: "Electronics & Technology > Computers & Laptops > Laptops",
  },
  "mobile and tablets": {
    mainCategory: "Electronics & Technology",
    subCategory: "Mobile Phones & Accessories",
    category: "Smartphones",
    categoryPath: "Electronics & Technology > Mobile Phones & Accessories > Smartphones",
  },
  "music and gaming": {
    mainCategory: "Electronics & Technology",
    subCategory: "Headphones & Audio",
    category: "Headphones",
    categoryPath: "Electronics & Technology > Headphones & Audio > Headphones",
  },
  "others": {
    mainCategory: "Electronics & Technology",
    subCategory: "Smart Gadgets",
    category: "Smart Gadgets",
    categoryPath: "Electronics & Technology > Smart Gadgets",
  },
  "cloths": {
    mainCategory: "Fashion",
    subCategory: "Women's Fashion",
    category: "Clothing",
    categoryPath: "Fashion > Women's Fashion > Clothing",
  },
  "accessories": {
    mainCategory: "Fashion",
    subCategory: "Women's Fashion",
    category: "Accessories",
    categoryPath: "Fashion > Women's Fashion > Accessories",
  },
};

async function migrate() {
  await connectDB();

  // 1. Migrate Products
  const products = await Product.find({});
  let pUpdated = 0;

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const catLower = (p.category || "").toLowerCase().trim();
    
    // Distribute a couple products into Fashion and Home & Kitchen so all categories have products
    if (i === 1) {
      p.mainCategory = "Fashion";
      p.subCategory = "Women's Fashion";
      p.category = "Clothing";
      p.categoryPath = "Fashion > Women's Fashion > Clothing";
      await p.save();
      pUpdated++;
      continue;
    }
    if (i === 2) {
      p.mainCategory = "Fashion";
      p.subCategory = "Men's Fashion";
      p.category = "Watches";
      p.categoryPath = "Fashion > Men's Fashion > Watches";
      await p.save();
      pUpdated++;
      continue;
    }
    if (i === 4) {
      p.mainCategory = "Home & Kitchen";
      p.subCategory = "Kitchen & Dining";
      p.category = "Cookware";
      p.categoryPath = "Home & Kitchen > Kitchen & Dining > Cookware";
      await p.save();
      pUpdated++;
      continue;
    }
    if (i === 6) {
      p.mainCategory = "Beauty & Personal Care";
      p.subCategory = "Skincare";
      p.category = "Serums & Face Oils";
      p.categoryPath = "Beauty & Personal Care > Skincare > Serums & Face Oils";
      await p.save();
      pUpdated++;
      continue;
    }

    const mapping = CATEGORY_MAP[catLower] || CATEGORY_MAP["computers and laptops"];
    p.mainCategory = mapping.mainCategory;
    p.subCategory = mapping.subCategory;
    p.category = mapping.category;
    p.categoryPath = mapping.categoryPath;
    await p.save();
    pUpdated++;
  }

  console.log(`Successfully migrated ${pUpdated} products.`);

  // 2. Migrate Events
  const events = await Event.find({});
  let eUpdated = 0;

  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    const catLower = (ev.category || "").toLowerCase().trim();

    if (i === 0) {
      ev.mainCategory = "Fashion";
      ev.subCategory = "Women's Fashion";
      ev.category = "Handbags";
      ev.categoryPath = "Fashion > Women's Fashion > Handbags";
      await ev.save();
      eUpdated++;
      continue;
    }

    const mapping = CATEGORY_MAP[catLower] || CATEGORY_MAP["music and gaming"];
    ev.mainCategory = mapping.mainCategory;
    ev.subCategory = mapping.subCategory;
    ev.category = mapping.category;
    ev.categoryPath = mapping.categoryPath;
    await ev.save();
    eUpdated++;
  }

  console.log(`Successfully migrated ${eUpdated} events.`);
  process.exit(0);
}

migrate().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
