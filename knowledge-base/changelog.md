# Changelog

## 2026-06-03 â€” Add Guest Cart & Checkout Login Requirement
**What**: Implemented the ability for users to add products to their cart without logging in, and forced a login prompt when trying to checkout. Guest carts are synced to the backend upon login.
**Why**: User requested "without login add to cart functionality. login needed at check out page" to reduce friction when browsing and adding items.
**Files Changed**: `CartContext.jsx`, `Address.jsx`
- Rewrote `CartContext.jsx` to store items in `localStorage` (`guestCart`) when no `userId` is present.
- Updated `addToCart` to fetch product details on-the-fly for the guest cart so the UI displays correctly.
- Added `syncGuestCart` logic in `useEffect` to merge the guest cart into the backend `cart` when the user successfully logs in.
- Updated `Address.jsx` (Checkout page) to check for `userId`. If not authenticated, alerts the user and redirects to the homepage.

## 2026-06-03 â€” Update Website Favicon
**What**: Changed the website favicon from the default Vite SVG to `b_fav.png`.
**Why**: User requested to use `b_fav.png` as the favicon to match the brand identity.
**Files Changed**: `FrontEnd/index.html`
- Updated the `<link rel="icon">` tag to point to `/b_fav.png` and updated the `type` attribute to `image/png`.

## 2026-06-02 â€” Fix 413 Content Too Large on Vercel Product Upload
**What**: Increased body-parser JSON limit from 100KB default to 10MB and hardened frontend error handling for Vercel's 413 response shape.
**Why**: When adding a product with multiple images, the JSON payload (containing Cloudinary URLs + form data) exceeded body-parser's 100KB default limit, causing a 413 error. Vercel returns 413 errors as `{code, message}` objects â€” when this object was passed directly to React state and rendered as JSX, it caused React Error #31 ("Objects are not valid as a React child").
**Files Changed**: `BackEnd/App.js`, `FrontEnd/src/Pages/AdminPanel.jsx`
- Added `{ limit: '10mb' }` to `bodyParser.json()` and added `bodyParser.urlencoded({ extended: true, limit: '10mb' })`.
- Rewrote the `handleAddProduct` catch block to safely extract string error messages from any error response shape (Vercel 413 `{code, message}`, standard API `{error}`, or fallback `err.message`), preventing objects from being rendered as React children.

## 2026-06-01 â€” Update Primary Theme Color
**What**: Replaced the various blue (`#2c3e50`) and purple (`#5345B9`) primary colors with a consistent dark charcoal (`#333333`) across the entire site.
**Why**: To ensure visual consistency and match the clean, premium aesthetic set by the main navigation header.
**Files Changed**: `ProductCard.css`, `ProductPage.css`, `Cart.css`, `CartSidebar.css`, `Collection.css`, `Summary.css`, `AddressForm.css`, `LoginModel.css`, `Footer.jsx`
- Updated CSS variables (`--primary-color`, `--primary-hover`) from blue/purple hex values to charcoal/dark-gray hex values.
- Updated hardcoded inline styles and background colors to match the new dark charcoal theme.
## 2026-06-01 â€” Set Global Font Family to Poppins
**What**: Enforced the `Poppins` font family across the entire website.
**Why**: To standardize the typography and ensure a consistent, modern look on all pages.
**Files Changed**: `FrontEnd/src/index.css`
- Imported the `Poppins` font from Google Fonts.
- Applied it globally to all elements using the `*` selector with `!important` to override any page-specific fonts.

## 2026-06-01 â€” Fix Multer Uploads for Serverless/Vercel
**What**: Changed `multer` upload destination from local `../public/images` folder to the OS temporary directory (`os.tmpdir()`).
**Why**: Vercel and other serverless environments have a read-only filesystem (EROFS), meaning attempting to save images to `../public` crashes the API. Writing to `/tmp` allows the image to be temporarily stored so Cloudinary can process it.
**Files Changed**: `Middleware/multer.js`
- Replaced `fs.mkdirSync` logic with `require('os').tmpdir()`.

## 2026-06-01 â€” Fix Category Import for Vercel Deployment
**What**: Fixed an import bug causing product addition to fail in production on Vercel.
**Why**: Vercel/Serverless environments had an issue resolving the `Category.Model` via a direct nested require statement, causing the backend API to throw an error when trying to add a product to a category. 
**Files Changed**: `Product.Controller.js`, `Category.Model.js`
- Imported `categorySchema` directly from the `../Models` index inside `Product.Controller.js` instead of directly requiring the file.
- Used `mongoose.models.Category || mongoose.model(...)` in `Category.Model.js` to prevent `OverwriteModelError` during Vercel's hot-reloading/serverless instantiations.

## 2026-06-01 â€” Add Category Model for Database Grouping
**What**: Created a `Category` collection in the database to group products by category matching the requested `categories` -> `products` array structure.
**Why**: To properly categorize and index products logically in the database instead of relying solely on loose strings inside the product schema.
**Files Changed**: `Category.Model.js` (new), `index.js`, `Product.Controller.js`
- Created `Category.Model.js` with slug, title, description, and an array of `products` (references to `productSchema`).
- Seeded "Blouse" and "Shapewear" categories directly into MongoDB.
- Updated `addProduct` and `deleteProduct` in `Product.Controller.js` to automatically push/pull the Product's Object ID into/from the corresponding Category document upon creation/deletion.

## 2026-06-01 â€” Add Sticky Product Info on Scroll
**What**: Made the product details column sticky on desktop to support scrolling through large image grids.
**Why**: When viewing multiple images in the 2x2 grid, users need the Add to Cart button and product info to remain visible as they scroll down the images.
**Files Changed**: `ProductPage.css`
- Added `align-items: start;` to `.product-grid-unique`.
- Added `position: sticky; top: 80px;` to `.product-info-unique`.

## 2026-06-01 â€” Show All Product Images with Gallery
**What**: Replaced the 2-column image grid on the Product Details page with a main image viewer + scrollable thumbnail strip.
**Why**: Products can have multiple images; users should see all of them with the main image displayed prominently first.
**Files Changed**: `ProductDetails.jsx`, `ProductPage.css`
- Built `allImages` array from `product.image` (first) + `product.images` array.
- Added `selectedImage` state â€” clicking a thumbnail updates the main image.
- Active thumbnail gets a border highlight; inactive ones are slightly dimmed.
- CSS uses flexbox for horizontal scrollable thumbnails.

## 2026-06-01 â€” Add Size Selection to Product Page
**What**: Added L/XL/XXL/XXXL size selector above the Add to Cart button on the Product Details page.
**Why**: Users need to choose a size before adding products to cart.
**Files Changed**: `ProductDetails.jsx`, `CartContext.jsx`, `Cart.jsx`, `Cart.Controller.js`, `Cart.Model.js`
- Added size selector buttons (L, XL, XXL, XXXL) with active state styling.
- Validation prevents Add to Cart / Buy Now without selecting a size first.
- `addToCart` in CartContext now passes the selected size to the backend.
- Cart Controller matches both productId and size when checking for duplicate items.
- Cart Model updated `size` field type from Number to String.
- Cart UI now displays the selected size next to each item.

## 2026-06-01 â€” Move Product Description Layout
**What**: Repositioned the product description to sit above the "Product Details" accordion.
**Why**: To improve visual hierarchy, placing the main product description immediately visible before the collapsible specific details.
**Files Changed**: `ProductDetails.jsx`
- Extracted the product description from inside the "PRODUCT DETAILS" accordion.
- Rendered the description above the accordion block.

## 2026-06-01 â€” Add Product Details Accordion
**What**: Updated the "Product Details" page to use an accordion-style layout for product information.
**Why**: To improve readability and match the requested design for displaying specific product attributes cleanly.
**Files Changed**: `ProductDetails.jsx`, `ProductPage.css`
- Added state in `ProductDetails.jsx` to toggle active accordion sections.
- Created dynamic accordion sections (Product Details, Return & Exchange, Shipping, Seller Info, Help).
- Updated `ProductPage.css` to add styling for accordion headers, content, chevrons, and removed bullets for a cleaner list.

## 2026-06-01 â€” Make All Product Fields Mandatory
**What**: Updated the "Add Product" form in the Admin Dashboard to enforce required validation on all fields.
**Why**: Prevent incomplete product entries from being saved to the database.
**Files Changed**: `AdminPanel.jsx`
- Added the `required` attribute to all input and textarea fields across the Basic Info, Pricing, Common Details, Blouse Details, and Shapewear Details sections.

## 2026-06-01 â€” Add Shapewear Fields to Admin Dashboard
**What**: Updated Admin Dashboard "Add Product" form to be driven by category (Blouse vs Shapewear) and added Shapewear-specific fields.
**Why**: The admin needs a streamlined way to add Shapewear products with their specific attributes (waist, hip, etc.) distinct from Blouses.
**Files Changed**: `Product.Model.js`, `AdminPanel.jsx`
- Added 7 new fields to `Product.Model.js` (`bottomColor`, `bottomFabric`, `bottomLength`, `bottomWork`, `waistType`, `bottomHip`, `bottomWaist`).
- Restructured `AdminPanel.jsx` to force the user to select the "Category" first.
- The form conditionally renders specific sections and dynamic placeholders based on whether "Blouse" or "Shapewear" is selected.
- Moved common fields (`SKU`, `Type`, `Wash And Care`, `Weight`) into a "Common Details" section.

## 2026-06-01 â€” Fix Vercel Runtime Crash
**What**: Added `razorpay` to root package.json and fixed `api/index.js` url parsing.
**Why**: The live Vercel API was returning 500 FUNCTION_INVOCATION_FAILED because `razorpay` was missing from the root dependencies causing a module load crash, and the Vercel rewrite configuration lost the original path.
**Files Changed**: `package.json`, `api/index.js`, `vercel.json`
- Added `razorpay` to root `package.json` to fix runtime `MODULE_NOT_FOUND` error on Vercel
- Modified `vercel.json` rewrites to use capture groups to forward URLs correctly to `/api/index.js` without losing the original path.
- Updated `api/index.js` to restore original path from `x-invoke-path` header, gracefully handle init errors, and ensure `req.url` matches expected Express routes.

## 2026-05-28 â€” Fix Vercel Serverless Deployment
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
- Implemented dynamic global cart discount calculation in `Cart.jsx` and `OrderSummery.jsx` according to promotional tiers (10% off > â‚¹2999, 15% off > â‚¹4999, 20% off > â‚¹9999).
- **Payment Gateway:** Added Razorpay integration. Created backend routes (`/create-order` and `/verify-payment`) and integrated the Razorpay checkout overlay in `OrderSummery.jsx` when proceeding to payment.

## 2026-05-29 â€” Admin Panel & User Registration
**What**: Built a full admin panel at `/admin` and added user registration to the login modal
**Why**: Store owner needs to manage products from a dashboard; new customers need to create accounts
**Files Changed**: `AdminPanel.jsx`, `Admin.css`, `App.jsx`, `Product.Model.js`, `LoginModel.jsx`, `LoginModel.css`
- Created `AdminPanel.jsx` with hardcoded admin credentials (admin/admin123), session-based auth via sessionStorage
- Admin dashboard shows a product listing table with image thumbnails, SKU, type, pricing, and category
- "Add Product" form includes all fields: title, description, images, SKU, type, blouse details (type, color, fabric, work, sleeve length, bust size, length), wash & care, sales package, weight
- Extended `Product.Model.js` with 13 new fields (sku, productType, blouseType, blouseColor, blouseFabric, blouseWork, sleeveLength, bustSize, blouseLength, washAndCare, salesPackage, weight, images array)
- Implemented actual Image File Upload for products. Modified Admin form to send `multipart/form-data`, attached `multer` middleware to `/addProduct`, and utilized existing `cloudinary` configuration to dynamically upload product thumbnails and gallery images to the cloud.
- Added live image preview generation for both the main image and multiple additional images.
- Upgraded the "Additional Images" logic to allow *incremental* multi-file uploading (adding more images sequentially without replacing the previous ones) and added remove (âœ•) buttons for each individual thumbnail.
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
- Registration form captures firstName, lastName, email, password, mobileNumber, and optional gender â€” matches existing `/v1/User/Register` backend endpoint
- Added CSS for register form (`.form-row-inline`, `.auth-switch-text`, `.success-message`) in `LoginModel.css`
- **Product Deletion Feature:**
  - Backend: Added `deleteProduct` in `Product.Services.js`, `deleteProduct` controller in `Product.Controller.js`, and `DELETE /v1/product/deleteProduct/:id` route in `Product.Routes.js`.
  - Frontend: Added a "Delete" button next to "Edit" in `AdminPanel.jsx`'s product table with a native browser confirmation prompt (`window.confirm`).
  - Styled `.admin-delete-btn` and `.admin-action-btns` in `Admin.css`.
- **Deployment Fixes:**
  - Resolved Vercel Out of Memory (OOM) error during `npm install` by removing an unused circular dependency (`"bunbun-clothing-root": "file:.."`) from the `FrontEnd/package.json` file.
  - Optimized the root `package.json` postinstall script to use `--no-audit --no-fund` to further reduce memory usage during Vercel builds.

## 2026-06-01 â€” Add Blouse Size Details Table
**What**: Added a dynamic size details table for the Blouse category in the admin panel and fetched/displayed these specific size measurements on the Product Details page. Made Sleeve Length and Blouse Work optional fields.
**Why**: To provide precise sizing information (Bust, Waist, Shoulder, Length) for different blouse sizes and show it contextually on the product page when a size is selected.
**Files Changed**: `Product.Model.js`, `Product.Controller.js`, `AdminPanel.jsx`, `ProductDetails.jsx`
- Added `sizeDetails` array of objects to `Product.Model.js`.
- Updated `Product.Controller.js` to parse `sizeDetails` JSON from `req.body`.
- Added a 4-row input table in `AdminPanel.jsx` to collect precise size measurements for L, XL, XXL, XXXL.
- Made all Blouse Specific Details fields (Blouse Type, Color, Fabric, Work, Sleeve Length, Bust Size, Blouse Length, Sales Package) optional in the form.
- Updated `ProductDetails.jsx` to dynamically render specific Bust, Waist, Shoulder, and Length measurements based on the user's selected size.
- Fixed a JSX element syntax error in `AdminPanel.jsx` by wrapping adjacent conditional elements in a React Fragment (`<>...</>`).

## 2026-06-01 â€” Rebrand to Bunbun Clothing
**What**: Renamed all instances of "Navdhaaga" to "Bunbun Clothing" across the codebase.
**Why**: User requested to update the website's branding to "Bunbun Clothing".
**Files Changed**: `App.jsx`, `Footer.jsx`, `Header.jsx`, `LoginModel.jsx`, `About.jsx`, `AdminPanel.jsx`, `BunbunClothingGold.jsx` (renamed from `NadhaagaGold.jsx`), `OrderSummery.jsx`, `PrivacyPolicy.jsx`, `ProductDetails.jsx`, `TermAndCondition.jsx`, `package.json`, etc.
- Executed global find-and-replace for `Navdhaaga`, `navdhaaga`, and `NAVDHAAGA`.
- Renamed the frontend React component file `NadhaagaGold.jsx` to `BunbunClothingGold.jsx`.

## 2026-06-01 â€” Persist Add Product Form State
**What**: Modified the Admin Panel to save the active tab, product form data, and edit state across page refreshes.
**Why**: Prevent accidental data loss if the admin refreshes the page midway through adding or editing a complex product (with many size details, etc.).
**Files Changed**: `AdminPanel.jsx`
- Initialized `activeTab`, `formData`, and `editProductId` states from `sessionStorage` (if present).
- Added `useEffect` hooks to synchronize state changes back into `sessionStorage`.

## 2026-06-04 — SEO-friendly product URLs
**What**: Removed product ID from product details page URL.
**Why**: To improve SEO by relying solely on product title slugs.
**Files Changed**: backend/Models/Product.Model.js, backend/Controllers/Product.Controller.js, backend/Routes/Product.Routes.js, frontend/src/App.jsx, frontend/src/Pages/ProductDetails.jsx, frontend/src/Pages/OrderSummery.jsx, frontend/src/Component/Cart.jsx, frontend/src/Component/ProductCard.jsx, frontend/src/Component/CartSidebar.jsx
- Added slug field to Product.Model.js.
- Created and ran migration script to generate slugs for all existing products.
- Updated addProduct and updateProduct to generate slugs dynamically.
- Created new route singleProductBySlug/:slug to fetch products via slug.
- Removed id param from frontend routes and updated all navigation logic to use product.slug.

## 2026-06-05 - Added mobile hero image
**What**: Added mobile-specific image in home page hero section.
**Why**: To display a distinct hero banner for mobile users.
**Files Changed**: `FrontEnd/src/Pages/HomePage.jsx`
- Implemented HTML `<picture>` element to serve a mobile-specific image (`sfvc_1_yae3sr.png`) on screens <= 768px while maintaining the existing desktop banner.

## 2026-06-05 - Added hero section slider
**What**: Converted home page hero section to a slider and added a second slide.
**Why**: To allow displaying multiple promotional banners dynamically.
**Files Changed**: `FrontEnd/src/Pages/HomePage.jsx`
- Wrapped the existing hero image in a `react-responsive-carousel` component.
- Added the newly provided second image (`jfythg_owjoqg.png`) as the second slide in the carousel.

## 2026-06-05 - Fixed Carousel CSS Conflict
**What**: Fixed a CSS conflict causing the new hero slider to disappear.
**Why**: Existing `.slider` and `.slide` classes from a custom marquee were globally overriding `react-responsive-carousel`'s default classes, collapsing the hero images to 0 height.
**Files Changed**: `FrontEnd/src/Pages/HomePage.jsx`, `FrontEnd/src/Style/HomePage.css`
- Renamed `.slider` and `.slide` to `.icon-slider` and `.icon-slide` across the homepage custom marquees to ensure standard carousel styles apply without interference.

## 2026-06-05 - Added mobile image for second hero slide
**What**: Configured a mobile-specific image for the second slide in the home page hero carousel.
**Why**: To ensure the second slide is properly optimized for mobile viewing.
**Files Changed**: `FrontEnd/src/Pages/HomePage.jsx`
- Wrapped the second slide's image in an HTML `<picture>` element and added `<source media="(max-width: 768px)">` using the new mobile asset (`jfyg_vqmwqn.png`).

## 2026-06-05 — Fixed mobile dropdown toggle & reordered header layout
**What**: Fixed the Shop dropdown not toggling on mobile; reordered the mobile header to place the hamburger toggle on the left, logo centered, and action icons on the right.
**Why**: The Shop dropdown was missing `data-bs-toggle="dropdown"` so it never opened on tap. The mobile header layout needed to match standard e-commerce UX with a centered logo.
**Files Changed**: `FrontEnd/src/Component/Header.jsx`, `FrontEnd/src/Style/Header.css`
- Added `dropdown-toggle` class and `data-bs-toggle="dropdown"` to the Shop nav link for proper Bootstrap mobile dropdown behavior.
- Refactored mobile CSS to use `display: none`/`display: block` instead of opacity/visibility for the dropdown menu.
- Used flexbox `order` properties to rearrange header elements on mobile: toggler (order 1, left), logo (order 2, absolute-centered), icons (order 3, right), collapse (order 4, full-width below).

## 2026-06-05 — Rebuilt mobile menu as full-screen overlay
**What**: Replaced Bootstrap collapse-based mobile nav with a custom full-screen slide-in overlay panel (inspired by sudathi.com).
**Why**: To provide a premium, clean mobile navigation UX with proper sub-menu slide-in transitions.
**Files Changed**: `FrontEnd/src/Component/Header.jsx`, `FrontEnd/src/Style/Header.css`
- Added `mobileMenuOpen` and `activeSubmenu` state to Header component.
- Built a slide-in panel (`mobile-menu-panel`) with dark backdrop overlay.
- Panel header has close (×) button on left and cart icon on right.
- Main menu items listed vertically with uppercase text; items with sub-menus show a → arrow.
- "SHOP" and "COLLECTIONS" have slide-in sub-menus with a ← BACK button.
- Desktop navbar remains unchanged (collapse nav hidden on mobile via `display: none !important`).
- Added all overlay/panel CSS: slide animations, sub-menu transitions, hover effects, and desktop hide rule.

## 2026-06-05 — Curved mobile hero banner
**What**: Added rounded corners and padding to the mobile hero banner.
**Why**: To match the premium curved aesthetic requested by the user for mobile viewing.
**Files Changed**: `FrontEnd/src/Style/HomePage.css`
- Added `12px` padding to `.topBanner` on mobile (`max-width: 768px`) to create spacing from the screen edges.
- Applied `border-radius: 16px` and `overflow: hidden` to `.topBanner .carousel .slider-wrapper` and the banner images to create the curved effect.

## 2026-06-05 — Increased mobile header size
**What**: Scaled up the logo, icons, and toggler size on mobile devices.
**Why**: The header elements were previously too small and hard to interact with on mobile screens.
**Files Changed**: `FrontEnd/src/Style/Header.css`
- Increased `.logo-img` dimensions from `100x56px` to `130x72px` on tablets, and from `80x44px` to `120x65px` on smaller phones.
- Scaled up the action icons `.icon-btn` padding and font size to `1.4rem`.
- Enlarged the `.navbar-toggler` hamburger icon for better touch targets.

## 2026-06-05 — Switched to lined header icons
**What**: Replaced the solid FontAwesome icons in the header with lined versions using `lucide-react`.
**Why**: To meet the user's request for lined icons, providing a lighter and more modern aesthetic.
**Files Changed**: `FrontEnd/src/Component/Header.jsx`
- Removed `@fortawesome/free-solid-svg-icons` imports.
- Imported `Heart, Search, ShoppingBag, X, User, ChevronRight, ChevronLeft` from `lucide-react`.
- Replaced all `<FontAwesomeIcon icon={fa...} />` instances with their corresponding Lucide components.

## 2026-06-05 — Removed profile icon from header
**What**: Removed the "My Account" (User) icon button from the desktop header.
**Why**: User requested to remove the profile icon from the header.
**Files Changed**: `FrontEnd/src/Component/Header.jsx`
- Removed the `<button>` containing the `<User />` icon that toggled the login/profile modal.

## 2026-06-05 — Adjusted mobile slider icon sizes
**What**: Scaled down the trust badge icons (e.g., "3,000+ Styles") in the marquee slider for mobile views.
**Why**: User requested to make the slider icons smaller on mobile devices to better fit the screen and match design references.
**Files Changed**: `FrontEnd/src/Pages/HomePage.jsx`, `FrontEnd/src/Style/HomePage.css`
- Removed the inline `style={{ width: "150px" }}` from the slider images in `HomePage.jsx` to allow CSS media queries to properly control their sizing.
- Reduced `.icon-slide` and `.icon-slide img` width to `80px` for tablets (`max-width: 768px`) and `60px` for mobile phones (`max-width: 480px`) in `HomePage.css`.
- Adjusted `.icon-slide-track` widths accordingly to maintain smooth continuous scrolling animations.

## 2026-06-05 — Increased mobile slider icon sizes
**What**: Scaled up the trust badge icons slightly in the marquee slider for mobile views.
**Why**: User found the previously set sizes too small.
**Files Changed**: `FrontEnd/src/Style/HomePage.css`
- Increased `.icon-slide` and `.icon-slide img` width to `110px` for tablets (`max-width: 768px`) and `90px` for mobile phones (`max-width: 480px`).
- Adjusted `.icon-slide-track` widths accordingly.

## 2026-06-05 — Mobile menu slide-in direction
**What**: Changed the mobile overlay menu to slide in from the left side instead of the right side.
**Why**: User requested the menu toggle from the left side of the screen.
**Files Changed**: `FrontEnd/src/Style/Header.css`
- Modified `.mobile-menu-panel` to use `left: 0` and `transform: translateX(-100%)`.

## 2026-06-08 — Firebase Mobile OTP Login
**What**: Integrated Firebase Phone Authentication to send real SMS OTPs for free (10,000/mo). Replaced custom OTP logic.
**Why**: User wanted to send actual OTPs to phones for free without setting up a paid SMS gateway.
**Files Changed**: `backend/Controllers/User.Controller.js`, `backend/Routes/User.Routes.js`, `FrontEnd/src/Component/LoginModel.jsx`, `FrontEnd/src/utils/firebase.js`
- **Frontend**: Installed `firebase` SDK. Configured `firebase.js`. Updated `LoginModel.jsx` to use `signInWithPhoneNumber` and `RecaptchaVerifier` (invisible reCAPTCHA). The form now expects a 6-digit OTP from Firebase.
- **Backend**: Added `firebaseLogin` controller that takes a verified `mobileNumber`, auto-creates the user if needed, and returns our custom JWT token. This keeps the rest of the application's auth logic unchanged.
- **Routes**: Added `POST /v1/User/firebase-login`.

## 2026-06-08 — Add Sign In Icon to Desktop Header
**What**: Added a user account icon to the desktop header next to the search icon.
**Why**: User requested a sign-in button on the main header for desktop users.
**Files Changed**: `FrontEnd/src/Component/Header.jsx`
- Added the `<User />` icon as a button within the `.header-icons` container, utilizing the existing `handleAccountClick` function. Hidden on mobile (`d-none d-lg-block`) to favor the new mobile menu login button.

## 2026-06-08 — Expand YouTube Shorts Section
**What**: Updated the "FEATURED PRODUCTS" shorts section to display 5 videos instead of 4, keeping them all in a single row.
**Why**: User requested 5 videos in the grid, duplicating one of the existing videos to test the layout.
**Files Changed**: `FrontEnd/src/Pages/HomePage.jsx`
- Changed the grid classes from `.col-6 .col-md-3` to use Bootstrap 5's `.row-cols-md-5` with auto-flowing columns `.col`.
- Added a 5th iframe matching the first YouTube short.

## 2026-06-08 — Header UI Polish & Login Button
**What**: Removed the default border and focus outline from the mobile menu hamburger toggle. Added a prominent Login/Register button to the bottom of the mobile slide-out menu.
**Why**: User requested removing the border from the toggle button and adding a login/logout button only in the mobile dropdown at the bottom.
**Files Changed**: `FrontEnd/src/Component/Header.jsx`, `FrontEnd/src/Style/Header.css`
- Added `border: none !important; box-shadow: none !important;` to `.navbar-toggler` in `Header.css`.
- Transformed `.mobile-menu-body` into a flex column in `Header.css`.
- Appended a fixed bottom `div` containing a Login / Profile button in `Header.jsx` that dynamically checks `localStorage` for `authToken`.

## 2026-06-08 — Hide YouTube Shorts UI
**What**: completely removed YouTube's default UI elements (titles, logos, pause buttons) from the Shorts on the homepage.
**Why**: User requested a clean, uninterrupted viewing experience showing only the video.
**Files Changed**: `FrontEnd/src/Style/HomePage.css`
- Added `pointer-events: none` to the `.short-video-card iframe` to prevent mouse hover/click interactions from triggering YouTube's player UI.
- Added `transform: scale(1.25)` to the iframe to crop out the persistent top channel title and bottom YouTube watermark.

## 2026-06-08 — Update YouTube Shorts Settings
**What**: Configured YouTube Shorts on the homepage to auto-play, loop, mute, and hide player controls.
**Why**: User requested shorts to automatically play without showing YouTube controls or IDs for a cleaner viewing experience.
**Files Changed**: `FrontEnd/src/Pages/HomePage.jsx`
- Added URL query parameters (`autoplay=1`, `mute=1`, `controls=0`, `modestbranding=1`, `rel=0`, `loop=1`, `playlist={ID}`, `playsinline=1`) to all four iframe `src` attributes.

## 2026-06-08 — Add YouTube Shorts Section
**What**: Added a "Featured Shorts" section on the home page above the "Recently Viewed" section containing 4 embedded YouTube shorts.
**Why**: User requested to embed specific YouTube shorts.
**Files Changed**: `FrontEnd/src/Pages/HomePage.jsx`, `FrontEnd/src/Style/HomePage.css`
- Added an embedded iframe grid for four YouTube Shorts in `HomePage.jsx`.
- Added `.short-video-card` in `HomePage.css` for consistent aspect ratio and hover effects.

## 2026-06-08 — Update Header Navigation Items
**What**: Updated the main navigation items to Shop, Blouse, and Shapewear. Removed Sarees, Ready to Wear Sarees, and Bunbun Clothing Gold.
**Why**: User requested a leaner navigation structure focused on the core categories.
**Files Changed**: `FrontEnd/src/Component/Header.jsx`
- Desktop Nav: Reordered links to `Shop`, `Blouse`, `Shapewear` and removed `Ready to Wear Sarees`, `Bunbun Clothing Gold`, and `Saree`.
- Mobile Nav: Reordered and removed the same links in the main sidebar and the "Shop" submenu.

## 2026-06-08 — Add Recently Viewed Section to Home Page
**What**: Added a "Recently Viewed" section at the bottom of the home page.
**Why**: User requested to add a recently viewed section above the footer on the home page.
**Files Changed**: `FrontEnd/src/Pages/HomePage.jsx`
- Added state for `recentlyViewed` and fetched it from `localStorage` inside `useEffect`.
- Rendered a new `Slider` component mapping over `recentlyViewed` data, displaying `ProductCard` for each item.

## 2026-06-08 — Update Top Categories Images & Labels
**What**: Updated all four "TOP CATEGORIES" cards with a static image, updated their labels (Blouse, Shapewear, Palazzo, Kurti Set), and increased label font size.
**Why**: User requested to use the new image for all top category cards, correct the labels, remove "live now", and enlarge the text for better visibility.
**Files Changed**: `FrontEnd/src/Pages/HomePage.jsx`, `FrontEnd/src/Style/HomePage.css`
- Replaced dynamic `categoryImage` sources with the static Cloudinary URL.
- Added and updated `.category-label` text for all four categories.
- Removed `.category-live-label` from the Shapewear card.
- Increased `.category-label` font size to 1.2rem (desktop) and 0.95rem (mobile) in CSS.

## 2026-06-08 — Replace Saree category cards with Palazzo & Kurti (Coming Soon)
**What**: Replaced the two Saree category cards in the TOP CATEGORIES section with "Palazzo" and "Kurti" cards that have a dark opacity overlay and "Coming Soon" text. Added a "LIVE NOW" label under the Shapewear card.
**Why**: Palazzo and Kurti categories are not yet available, so they display a premium "Coming Soon" overlay matching the previous Sarees Saturday design. The Shapewear card was marked as "LIVE NOW" to indicate it's active.
**Files Changed**: `FrontEnd/src/Pages/HomePage.jsx`, `FrontEnd/src/Style/HomePage.css`
- Replaced Sarees Saturday and Sarees cards with Palazzo and Kurti cards using `.category-card-wrapper` with a `.category-overlay` dark overlay.
- Added `.coming-soon-text` styled with Playfair Display serif font at 1.6rem.
- Added `.category-live-label` in red (#c0392b) for the Shapewear "LIVE NOW" text.
- Added `.category-label` for Palazzo/Kurti card names below the image.
- Added mobile responsive font sizes for overlay and labels.

## 2026-06-08 — Fetch Shapewear products in bestseller section
**What**: Changed the "BESTSELLER SAREES" section product filter from `subcategory === "Georgette Saree"` to `category === "Shapewear"`.
**Why**: The section's banner already showcases shapewear imagery; the product slider needed to match by displaying Shapewear category products.
**Files Changed**: `FrontEnd/src/Pages/HomePage.jsx`
- Updated the `.filter()` call in the bestseller product slider from `p.subcategory === "Georgette Saree"` to `p.category === "Shapewear"`.

## 2026-06-05 — Fixed mobile product slider card display
**What**: Fixed an issue where product cards were squished horizontally and showing multiple cards per view on mobile instead of the intended 1.3 slides.
**Why**: The `d-flex justify-content-center` classes on the `Slider` wrapper `<div>` turned the slider items into flex containers without a defined width constraint, causing the nested `ProductCard` to shrink wrap and rendering the `react-slick` slider width calculations useless.
**Files Changed**: `FrontEnd/src/Pages/HomePage.jsx`
- Removed `d-flex justify-content-center` from the inner wrapper `<div>` mapping for all three `react-slick` instances (`TRENDING NOW`, `BESTSELLER SAREES`, and `EXCLUSIVE COLLECTION`).
- Removed an overlooked inline width style from a second instance of the icon slider (`loopMedia`), allowing the previous mobile CSS sizing to apply everywhere.
