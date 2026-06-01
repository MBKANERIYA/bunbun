# Changelog

## 2026-06-01 — Set Global Brand Colors Across Entire Website
**What**: Updated the primary color to `#5345B9` and secondary/hover color to `#FE9A60` across all CSS files and JSX components.
**Why**: To establish a consistent brand identity throughout the website.
**Files Changed**: `index.css`, `ProductPage.css`, `ProductCard.css`, `Cart.css`, `CartSidebar.css`, `Collection.css`, `LoginModel.css`, `AddressForm.css`, `Summary.css`, `UserProfileModel.css`, `Header.css`, `Footer.jsx`, `ProductCard.jsx`
- Centralized CSS variables (`--primary-color`, `--primary-hover`, `--secondary-color`, `--accent-color`) in `index.css`.
- Replaced all hardcoded `#2c3e50`, `#34495e`, `#343a40` → `#5345B9`.
- Replaced all hardcoded `#e74c3c`, `#c0392b`, `#7f8c8d` → `#FE9A60`.
- Replaced `#8E44AD` in Header.css → `#5345B9`.
- Updated inline styles in `Footer.jsx` and `ProductCard.jsx`.

## 2026-06-01 — Set Global Font Family to Poppins
**What**: Enforced the `Poppins` font family across the entire website.
**Why**: To standardize the typography and ensure a consistent, modern look on all pages.
**Files Changed**: `FrontEnd/src/index.css`
- Imported the `Poppins` font from Google Fonts.
- Applied it globally to all elements using the `*` selector with `!important` to override any page-specific fonts.

## 2026-06-01 — Fix Multer Uploads for Serverless/Vercel
**What**: Changed `multer` upload destination from local `../public/images` folder to the OS temporary directory (`os.tmpdir()`).
**Why**: Vercel and other serverless environments have a read-only filesystem (EROFS), meaning attempting to save images to `../public` crashes the API. Writing to `/tmp` allows the image to be temporarily stored so Cloudinary can process it.
**Files Changed**: `Middleware/multer.js`
- Replaced `fs.mkdirSync` logic with `require('os').tmpdir()`.

## 2026-06-01 — Fix Category Import for Vercel Deployment
**What**: Fixed an import bug causing product addition to fail in production on Vercel.
**Why**: Vercel/Serverless environments had an issue resolving the `Category.Model` via a direct nested require statement, causing the backend API to throw an error when trying to add a product to a category. 
**Files Changed**: `Product.Controller.js`, `Category.Model.js`
- Imported `categorySchema` directly from the `../Models` index inside `Product.Controller.js` instead of directly requiring the file.
- Used `mongoose.models.Category || mongoose.model(...)` in `Category.Model.js` to prevent `OverwriteModelError` during Vercel's hot-reloading/serverless instantiations.

## 2026-06-01 — Add Category Model for Database Grouping
**What**: Created a `Category` collection in the database to group products by category matching the requested `categories` -> `products` array structure.
**Why**: To properly categorize and index products logically in the database instead of relying solely on loose strings inside the product schema.
**Files Changed**: `Category.Model.js` (new), `index.js`, `Product.Controller.js`
- Created `Category.Model.js` with slug, title, description, and an array of `products` (references to `productSchema`).
- Seeded "Blouse" and "Shapewear" categories directly into MongoDB.
- Updated `addProduct` and `deleteProduct` in `Product.Controller.js` to automatically push/pull the Product's Object ID into/from the corresponding Category document upon creation/deletion.

## 2026-06-01 — Add Sticky Product Info on Scroll
**What**: Made the product details column sticky on desktop to support scrolling through large image grids.
**Why**: When viewing multiple images in the 2x2 grid, users need the Add to Cart button and product info to remain visible as they scroll down the images.
**Files Changed**: `ProductPage.css`
- Added `align-items: start;` to `.product-grid-unique`.
- Added `position: sticky; top: 80px;` to `.product-info-unique`.

## 2026-06-01 — Show All Product Images with Gallery
**What**: Replaced the 2-column image grid on the Product Details page with a main image viewer + scrollable thumbnail strip.
**Why**: Products can have multiple images; users should see all of them with the main image displayed prominently first.
**Files Changed**: `ProductDetails.jsx`, `ProductPage.css`
- Built `allImages` array from `product.image` (first) + `product.images` array.
- Added `selectedImage` state — clicking a thumbnail updates the main image.
- Active thumbnail gets a border highlight; inactive ones are slightly dimmed.
- CSS uses flexbox for horizontal scrollable thumbnails.

## 2026-06-01 — Add Size Selection to Product Page
**What**: Added L/XL/XXL/XXXL size selector above the Add to Cart button on the Product Details page.
**Why**: Users need to choose a size before adding products to cart.
**Files Changed**: `ProductDetails.jsx`, `CartContext.jsx`, `Cart.jsx`, `Cart.Controller.js`, `Cart.Model.js`
- Added size selector buttons (L, XL, XXL, XXXL) with active state styling.
- Validation prevents Add to Cart / Buy Now without selecting a size first.
- `addToCart` in CartContext now passes the selected size to the backend.
- Cart Controller matches both productId and size when checking for duplicate items.
- Cart Model updated `size` field type from Number to String.
- Cart UI now displays the selected size next to each item.

## 2026-06-01 — Move Product Description Layout
**What**: Repositioned the product description to sit above the "Product Details" accordion.
**Why**: To improve visual hierarchy, placing the main product description immediately visible before the collapsible specific details.
**Files Changed**: `ProductDetails.jsx`
- Extracted the product description from inside the "PRODUCT DETAILS" accordion.
- Rendered the description above the accordion block.

## 2026-06-01 — Add Product Details Accordion
**What**: Updated the "Product Details" page to use an accordion-style layout for product information.
**Why**: To improve readability and match the requested design for displaying specific product attributes cleanly.
**Files Changed**: `ProductDetails.jsx`, `ProductPage.css`
- Added state in `ProductDetails.jsx` to toggle active accordion sections.
- Created dynamic accordion sections (Product Details, Return & Exchange, Shipping, Seller Info, Help).
- Updated `ProductPage.css` to add styling for accordion headers, content, chevrons, and removed bullets for a cleaner list.

## 2026-06-01 — Make All Product Fields Mandatory
**What**: Updated the "Add Product" form in the Admin Dashboard to enforce required validation on all fields.
**Why**: Prevent incomplete product entries from being saved to the database.
**Files Changed**: `AdminPanel.jsx`
- Added the `required` attribute to all input and textarea fields across the Basic Info, Pricing, Common Details, Blouse Details, and Shapewear Details sections.

## 2026-06-01 — Add Shapewear Fields to Admin Dashboard
**What**: Updated Admin Dashboard "Add Product" form to be driven by category (Blouse vs Shapewear) and added Shapewear-specific fields.
**Why**: The admin needs a streamlined way to add Shapewear products with their specific attributes (waist, hip, etc.) distinct from Blouses.
**Files Changed**: `Product.Model.js`, `AdminPanel.jsx`
- Added 7 new fields to `Product.Model.js` (`bottomColor`, `bottomFabric`, `bottomLength`, `bottomWork`, `waistType`, `bottomHip`, `bottomWaist`).
- Restructured `AdminPanel.jsx` to force the user to select the "Category" first.
- The form conditionally renders specific sections and dynamic placeholders based on whether "Blouse" or "Shapewear" is selected.
- Moved common fields (`SKU`, `Type`, `Wash And Care`, `Weight`) into a "Common Details" section.

## 2026-06-01 — Fix Vercel Runtime Crash
**What**: Added `razorpay` to root package.json and fixed `api/index.js` url parsing.
**Why**: The live Vercel API was returning 500 FUNCTION_INVOCATION_FAILED because `razorpay` was missing from the root dependencies causing a module load crash, and the Vercel rewrite configuration lost the original path.
**Files Changed**: `package.json`, `api/index.js`, `vercel.json`
- Added `razorpay` to root `package.json` to fix runtime `MODULE_NOT_FOUND` error on Vercel
- Modified `vercel.json` rewrites to use capture groups to forward URLs correctly to `/api/index.js` without losing the original path.
- Updated `api/index.js` to restore original path from `x-invoke-path` header, gracefully handle init errors, and ensure `req.url` matches expected Express routes.

## 2026-05-28 — Fix Vercel Serverless Deployment
**What**: Configured Vercel deployment correctly to serve backend API and added root package.json
**Why**: The data was not fetching on the live Vercel website because serverless functions were failing to build and environment variables were missing.
**Files Changed**: `vercel.json`, `api/v1/[...path].js`, `api/images/[...path].js`, `package.json`
- Reverted to Vercel's zero-config deployment by simplifying `vercel.json`
- Created a root `package.json` with the necessary backend dependencies so Vercel can compile the `api/` serverless functions.
- Added `build` and `postinstall` scripts to the root `package.json` so Vercel natively builds the frontend.
- Updated `req.url` manipulation inside serverless functions to ensure Express routing resolves `/v1/...` and `/images/...` paths correctly.
- Created `knowledge-base` folder according to standard procedure.
- Updated `vercel.json` SPA fallback rewrite to explicitly exclude `/api/`, `/v1/`, and `/images/` routes using regex `((?!api/|v1/|images/).*)`, preventing the React index.html from shadowing the backend serverless functions.
- Replaced `bcrypt` with `bcryptjs` because the native `bcrypt` module often fails to compile on Vercel's Amazon Linux environment during serverless function deployment.
- Fixed `vercel.json` rewrites to correctly point to the Vercel-mapped endpoint `/api` instead of `/api/index.js`.
- Cleaned up test files and old Next.js style `[...path].js` API routes since they aren't supported in plain Node.js deployments on Vercel.
- **Update:** As per explicit request, completely removed the `api/` folder, root `package.json`, and `vercel.json`. The Vercel serverless integration is now removed, and the root directory strictly contains only the `FrontEnd`, `BackEnd`, and `knowledge-base` folders.
- Implemented dynamic global cart discount calculation in `Cart.jsx` and `OrderSummery.jsx` according to promotional tiers (10% off > ₹2999, 15% off > ₹4999, 20% off > ₹9999).
- **Payment Gateway:** Added Razorpay integration. Created backend routes (`/create-order` and `/verify-payment`) and integrated the Razorpay checkout overlay in `OrderSummery.jsx` when proceeding to payment.

## 2026-05-29 — Admin Panel & User Registration
**What**: Built a full admin panel at `/admin` and added user registration to the login modal
**Why**: Store owner needs to manage products from a dashboard; new customers need to create accounts
**Files Changed**: `AdminPanel.jsx`, `Admin.css`, `App.jsx`, `Product.Model.js`, `LoginModel.jsx`, `LoginModel.css`
- Created `AdminPanel.jsx` with hardcoded admin credentials (admin/admin123), session-based auth via sessionStorage
- Admin dashboard shows a product listing table with image thumbnails, SKU, type, pricing, and category
- "Add Product" form includes all fields: title, description, images, SKU, type, blouse details (type, color, fabric, work, sleeve length, bust size, length), wash & care, sales package, weight
- Extended `Product.Model.js` with 13 new fields (sku, productType, blouseType, blouseColor, blouseFabric, blouseWork, sleeveLength, bustSize, blouseLength, washAndCare, salesPackage, weight, images array)
- Implemented actual Image File Upload for products. Modified Admin form to send `multipart/form-data`, attached `multer` middleware to `/addProduct`, and utilized existing `cloudinary` configuration to dynamically upload product thumbnails and gallery images to the cloud.
- Added live image preview generation for both the main image and multiple additional images.
- Upgraded the "Additional Images" logic to allow *incremental* multi-file uploading (adding more images sequentially without replacing the previous ones) and added remove (✕) buttons for each individual thumbnail.
- Implemented full "Edit Product" functionality. Added a PUT route (`/updateProduct/:id`) on the backend to handle targeted updates while preserving untouched images. The Admin dashboard now has an "Edit" action button that repopulates the product form, previews existing images, and safely tracks additions/removals of image galleries.
- Updated the "Category" input in the product form to use a predefined `<select>` dropdown (Saree, Blouse, Suit, Lehenga, Kurti, Accessories) instead of manual text entry to prevent typos and ensure data consistency.
- Fixed a bug on the Collection Page where products weren't fetching correctly. Changed backend `/filterProduct` logic to use case-insensitive matching for categories, and added validation in the frontend to correctly compute maximum price filters even if some products have invalid or missing pricing.
- Fixed critical price filter bug: `priceRange` initialized at `0` which filtered out ALL products before `maxPrice` was calculated. Now only applies the filter when the user explicitly sets a range below `maxPrice`.
- Fixed broken `getSingleProduct` controller: was calling `productSchema.findById()` with no argument and had inverted conditional logic (returned 404 when product WAS found).
- Fixed a critical form submission bug in `AdminPanel.jsx` where newly added products were being created as completely empty records in the database. Two root causes:
  1. **Multer v2 null-prototype body:** `multer` v2 creates `req.body` with a null prototype (`Object.create(null)`), which Mongoose's `create()` silently ignores. Fixed by adding `Object.assign({}, req.body)` middleware in `Product.Routes.js`.
  2. **Axios header override:** Removed the hardcoded `Content-Type: multipart/form-data` header in the Axios request, which was overwriting the automatically generated boundary string required by `multer` to parse `FormData` fields.
  3. **Stale server process:** The old backend process was still running on port 4000, preventing the fixed code from taking effect. Killed the old process (PID 8360) and restarted.
- Restructured `App.jsx` with `AppLayout` wrapper to hide store Header/Footer/CartSidebar on `/admin` route
- Added user registration form to `LoginModel.jsx` with toggle between login/register modes
- Registration form captures firstName, lastName, email, password, mobileNumber, and optional gender — matches existing `/v1/User/Register` backend endpoint
- Added CSS for register form (`.form-row-inline`, `.auth-switch-text`, `.success-message`) in `LoginModel.css`
- **Product Deletion Feature:**
  - Backend: Added `deleteProduct` in `Product.Services.js`, `deleteProduct` controller in `Product.Controller.js`, and `DELETE /v1/product/deleteProduct/:id` route in `Product.Routes.js`.
  - Frontend: Added a "Delete" button next to "Edit" in `AdminPanel.jsx`'s product table with a native browser confirmation prompt (`window.confirm`).
  - Styled `.admin-delete-btn` and `.admin-action-btns` in `Admin.css`.
- **Deployment Fixes:**
  - Resolved Vercel Out of Memory (OOM) error during `npm install` by removing an unused circular dependency (`"bunbun-clothing-root": "file:.."`) from the `FrontEnd/package.json` file.
  - Optimized the root `package.json` postinstall script to use `--no-audit --no-fund` to further reduce memory usage during Vercel builds.
