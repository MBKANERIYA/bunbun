# Changelog
## 2026-06-22 — Made Chatbot Clothing Type A Custom Field
**What**: Replaced the chatbot "Clothing type" dropdown with a free text input.
**Why**: Uploaded outfits are not limited to saree, lehenga, skirt, or daily outfit, so shoppers need to describe the clothing item in their own words.
**Impact**: The chatbot now accepts arbitrary clothing types such as kurti, dupatta, gown, blouse piece, or any user-entered description.
**Files Changed**: `FrontEnd/src/Component/ChatbotWidget.jsx`, `knowledge-base/changelog.md`, `knowledge-base/chatbot.md`, `knowledge-base/active-context.md`
**Tests**: `npm test --prefix BackEnd` pass; `npm run lint --prefix FrontEnd` pass; `npm run build --prefix FrontEnd` pass.
**Commit**: `pending`

- Kept the same `answers.outfitType` payload contract while making the visible control editable.
- Added user-friendly placeholder examples instead of a fixed option list.

## 2026-06-22 — Replaced Chatbot Hex Color Autofill With Plain Color Names
**What**: Changed the chatbot clothing-photo color autofill from raw hex codes to shopper-friendly color names.
**Why**: Average customers do not know what values like `#e0e0e0` mean, so the stylist form should read like a person describing clothing colors.
**Impact**: The visible "Main colors you see" field now uses names such as light grey, olive, charcoal, and cream. The backend still receives exact swatch hex hints separately for AI context.
**Files Changed**: `FrontEnd/src/Component/ChatbotWidget.jsx`, `knowledge-base/changelog.md`, `knowledge-base/chatbot.md`, `knowledge-base/active-context.md`
**Tests**: `npm test --prefix BackEnd` pass; `npm run lint --prefix FrontEnd` pass; `npm run build --prefix FrontEnd` pass.
**Commit**: `pending`

- Added a color-name mapper for locally extracted image swatches.
- Kept swatch circles visible while replacing the editable input's developer-facing values with plain-language color descriptions.

## 2026-06-22 — Added Atomesus Chatbot Product Suggestions
**What**: Added a customer-facing chatbot for AI-assisted product suggestions using Atomesus text reasoning, plus a disabled AI Try-On placeholder.
**Why**: The site needs a shop-assistant style chatbot that can guide customers toward top product matches while respecting the Atomesus-only provider decision and upload privacy rules.
**Impact**: Customer pages now show a floating chatbot launcher. Product suggestions require login and `ATOMESUS_API_KEY` for AI ranking; deterministic fallback suggestions are returned if Atomesus is unavailable. AI Try-On is visibly unavailable until Atomesus documents image generation/editing APIs.
**Files Changed**: `BackEnd/Controllers/Chatbot.Controller.js`, `BackEnd/Routes/Chatbot.Route.js`, `BackEnd/Services/Atomesus.Services.js`, `BackEnd/Services/StylistRecommendation.Services.js`, `BackEnd/Middleware/chatbotUpload.js`, `FrontEnd/src/Component/ChatbotWidget.jsx`, `FrontEnd/src/utils/chatbotApi.js`, `FrontEnd/src/Style/ChatbotWidget.css`, `FrontEnd/src/App.jsx`, `BackEnd/tests/atomesusService.test.js`, `BackEnd/tests/stylistRecommendation.test.js`, `BackEnd/tests/userRoutes.test.js`, `knowledge-base/chatbot.md`
**Tests**: `npm test --prefix BackEnd` pass; `npm run lint --prefix FrontEnd` pass; `npm run build --prefix FrontEnd` pass; `npm ci --prefix FrontEnd --dry-run` pass.
**Commit**: `pending`

- Implemented `/v1/chatbot/suggestions` with authenticated temp image upload, Atomesus prompt construction, product ID validation, and fallback ranking.
- Mounted a responsive chatbot widget on non-admin pages with login gate, photo color hints, smart styling questions, top-5 result cards, privacy note, and disabled AI Try-On state.
- Added backend tests for Atomesus error handling, product type filtering, invalid AI ID rejection, fallback recommendations, and the missed profile ownership route guard.
- Corrected stale KB Vercel adapter documentation from `/api/v1/[...path].js` to `/api/index.js`.

## 2026-06-22 — Completed Security Fix Review Follow-Up
**What**: Fixed the missed profile ownership protection and removed an accidental frontend dependency introduced during the security/lint pass.
**Why**: Review of the other agent's changes showed profile read/update routes were still not owner-checked and `FrontEnd/package.json` had an unnecessary `bunbun-clothing-root` file dependency.
**Impact**: Profile read/update APIs now require the authenticated owner or admin. Frontend install remains reproducible without linking the root package into the frontend package.
**Files Changed**: `BackEnd/Routes/User.Routes.js`, `BackEnd/package.json`, `FrontEnd/package.json`, `FrontEnd/package-lock.json`, `BackEnd/tests/userRoutes.test.js`
**Tests**: `npm test --prefix BackEnd` pass; `npm ci --prefix FrontEnd --dry-run` pass; `npm run lint --prefix FrontEnd` pass; `npm run build --prefix FrontEnd` pass.
**Commit**: `pending`

- Added `tokenVeryfy` and `isOwner` to `/v1/User/UserProfile/:id` and `/v1/User/updateUser/:id`.
- Added a backend route-level regression test so profile authorization cannot quietly regress.
- Kept the `jquery` lockfile sync fix while removing the accidental root package dependency from the frontend manifest.

## 2026-06-22 — Secured Project, Recalculated Payments, Fixed Guest Checkout & Linting Errors
**What**: Secured backend routes with authenticated resource ownership checking, calculated Razorpay payment amounts strictly on the server, fixed database schema crashes on guest checkouts, resolved package-lock issues, and fixed all eslint compilation warnings/errors.
**Why**: Fix critical vulnerabilities, payment validation issues, guest order failures, and restore build stability.
**Files Changed**: `BackEnd/Middleware/jwtVeryfy.js`, `BackEnd/Routes/Product.Routes.js`, `BackEnd/Routes/Cart.Route.js`, `BackEnd/Routes/Wishlist.Routes.js`, `BackEnd/Routes/Address.Route.js`, `BackEnd/Routes/Order.Route.js`, `BackEnd/Routes/Payment.Route.js`, `BackEnd/Models/Order.Model.js`, `BackEnd/Controllers/Order.Controller.js`, `FrontEnd/src/Pages/OrderSummery.jsx`, `FrontEnd/src/utils/apiConfig.js`, `FrontEnd/src/Component/CartContext.jsx`, `FrontEnd/src/Component/WishlistContext.jsx`, `FrontEnd/src/Pages/ProductDetails.jsx`, `FrontEnd/src/Pages/Address.jsx`, `FrontEnd/src/Component/LoginModel.jsx`, `FrontEnd/src/Pages/Contact.jsx`, `FrontEnd/src/Component/BlogAdmin.jsx`, `FrontEnd/package-lock.json`, `FrontEnd/package.json`

## 2026-06-15 — Added Social Media Links to Footer
**What**: Wrapped the social media icons in `Footer.jsx` with active hyperlinks to Bunbun Clothing's official profiles.
**Why**: The user requested that the Facebook, Instagram, Pinterest, and YouTube footer icons be connected to their respective social media pages.
**Files Changed**: `FrontEnd/src/Component/Footer.jsx`
## 2026-06-15 — Updated Shipping Policy
**What**: Completed the implementation of the `ShippingPolicy.jsx` page with new content.
**Why**: The user provided a new Shipping Policy detailing free shipping availability, 3-5 day processing time, and 5-7 day standard delivery timelines for Bunbun Clothing.
**Files Changed**: `FrontEnd/src/Pages/ShippingPolicy.jsx`
## 2026-06-15 — Updated Return and Exchange Policy
**What**: Completed the implementation of the `ReturnPolicy.jsx` page with new legal content.
**Why**: The user provided a new Return and Exchange policy establishing a strict 7-day no-refund, exchange/replacement-only policy for damaged goods specific to Bunbun Clothing.
**Files Changed**: `FrontEnd/src/Pages/ReturnPolicy.jsx`
## 2026-06-15 — Updated Terms and Conditions
**What**: Completely rewrote the `TermAndCondition.jsx` page with newly provided legal content.
**Why**: The user provided a comprehensive, updated Terms and Conditions text specific to Bunbun Clothing, including liability limitations, governing law, and legal compliance.
**Files Changed**: `FrontEnd/src/Pages/TermAndCondition.jsx`
## 2026-06-15 — Updated Privacy Policy
**What**: Completely rewrote the `PrivacyPolicy.jsx` page with newly provided legal content.
**Why**: The user provided a comprehensive, updated Privacy Policy text with new legal definitions, cookie policies, and data retention details specific to Bunbun Clothing.
**Files Changed**: `FrontEnd/src/Pages/PrivacyPolicy.jsx`
## 2026-06-15 — Fixed Express 5 Catch-All Route Crash
**What**: Updated the catch-all React Router wildcard from `app.get("*")` to `app.get(/.*/)`.
**Why**: Express 5 uses a newer version of `path-to-regexp` which strictly forbids unnamed `*` parameters in string paths, causing a `TypeError: Missing parameter name at 1` crash on backend startup. Switched to native regex to bypass `path-to-regexp` parsing.
**Files Changed**: `BackEnd/App.js`
## 2026-06-12 — Advanced Blog Management & SEO Integration
**What**: Completely redesigned the "Add Blog" admin panel and extended the backend `Blog` model to support advanced formatting, SEO metadata, and dynamic content rendering.
**Files Changed**: `BackEnd/Models/Blog.Model.js`, `BackEnd/Controllers/Blog.Controller.js`, `BackEnd/Routes/Blog.Routes.js`, `FrontEnd/src/Component/BlogAdmin.jsx`, `FrontEnd/src/Component/BlogContentRenderer.jsx`, `FrontEnd/src/Pages/AdminPanel.jsx`
- **Database Model**: Extended `blogSchema` to include `author`, `readTime`, `slug`, `metaTitle`, `metaDescription`, `keywords`, and `canonicalUrl`.
- **Backend API**: Added endpoints to handle edits (`PUT /updateBlog/:id`), deletions (`DELETE /deleteBlog/:id`), and inline image uploads (`POST /uploadImage`) for markdown editing.
- **Admin Interface**: Implemented an advanced `BlogAdmin` component inspired by modern CMS platforms (e.g., Sanity/Notion). Includes a "Split" view, "Live Preview", inline markdown toolbar, auto-slug generation, and SEO parameter tabs.
- **Frontend Renderer**: Created `BlogContentRenderer` component to parse and safely render markdown syntax (`##`, `**`, `![]()`, `[]()`) directly within the preview and main UI.
## 2026-06-12 — Added "Add Blog" Functionality to Admin Panel
**What**: Created a new admin panel tab and backend route to allow administrators to add new blog posts.
**Why**: The user requested the ability to add new blogs directly from the admin dashboard instead of relying on seed scripts.
**Files Changed**: `BackEnd/Controllers/Blog.Controller.js`, `BackEnd/Routes/Blog.Routes.js`, `FrontEnd/src/Pages/AdminPanel.jsx`, `knowledge-base/changelog.md`
- **Backend API**: Added `addBlog` controller function which utilizes existing Cloudinary and Multer configurations to handle image uploads and save new blogs to MongoDB. Added `POST /addBlog` route.
- **Frontend Dashboard**: Added a "📝 Add Blog" tab to the Admin sidebar. Created a full form capturing Title, Category, Excerpt, Content, and Cover Image. The form submits using `axios` with `multipart/form-data`.
## 2026-06-12 — Integrated Blog Data with MongoDB
**What**: Moved the blog data from hardcoded frontend dummy data to the MongoDB backend. Created Mongoose schema, controller, and routes for fetching blogs, and seeded the database. 
**Why**: The user requested that the blog data be stored and fetched from the database instead of being statically coded in the frontend.
**Files Changed**: `BackEnd/Models/Blog.Model.js`, `BackEnd/Controllers/Blog.Controller.js`, `BackEnd/Routes/Blog.Routes.js`, `BackEnd/Routes/index.js`, `BackEnd/seed_blogs.js`, `FrontEnd/src/Pages/Blog.jsx`, `FrontEnd/src/Pages/BlogDetails.jsx`
- **Backend API**: Created `Blog.Model` with fields matching the existing structure. Created `getAllBlogs` and `getSingleBlog/:id` endpoints. 
- **Seeding**: Added a `seed_blogs.js` script and executed it to load the initial 6 blogs into the database.
- **Frontend Integration**: Updated `Blog.jsx` and `BlogDetails.jsx` to fetch data asynchronously via `axios.get` from the `/v1/blog` endpoints. Added loading spinners to both pages. Removed references to `zDummyData`.

## 2026-06-12 — Added Blog Details Page
**What**: Implemented a `BlogDetails.jsx` page that dynamically displays the full content of a blog post based on its ID from the URL. Refactored the `Blog.jsx` data into a centralized `blogData.js` file and wrapped blog cards with React Router links to navigate to the detailed view.
**Why**: The user requested that clicking on a blog post on the blog page opens a dedicated details page for that article.
**Files Changed**: `FrontEnd/src/Pages/BlogDetails.jsx` (new), `FrontEnd/src/zDummyData/blogData.js` (new), `FrontEnd/src/Pages/Blog.jsx`, `FrontEnd/src/App.jsx`
- **BlogDetails.jsx**: Created a responsive layout for individual blog posts, reading the ID from `useParams()`. Displays full article content, large header image, categories, and a "Back to all blogs" link.
- **blogData.js**: Extracted the hardcoded array from `Blog.jsx` and added a rich `content` field for each blog post to serve the details page.
- **Blog.jsx**: Now imports `blogData` and wraps each blog card in a `<Link to={\`/blog/\${post.id}\`}>`.
- **App.jsx**: Added lazy-loaded route for `/blog/:id` pointing to the new `BlogDetails` component.

## 2026-06-12 — Added Blog Page and Footer Navigation
**What**: Created a new `/blog` page with a beautiful UI displaying 6 dummy blog posts related to sarees, fashion, and the textile industry. Updated the Footer to use React Router `<Link>` for internal navigation instead of standard anchor tags.
**Why**: User requested a new blog page populated with 6 random product/industry related blogs and a functional navigation link from the footer.
**Files Changed**: `FrontEnd/src/Pages/Blog.jsx`, `FrontEnd/src/Component/Footer.jsx`
- **Blog.jsx**: Replaced placeholder component with a Bootstrap-styled responsive grid of 6 blog cards featuring cover images, categories, publish dates, excerpts, and hover effects. Used `useEffect` to scroll to top on mount.
- **Footer.jsx**: Refactored `<a>` tags in the INFORMATION and CUSTOMER CARE columns to use `<Link>` components to ensure seamless single-page application navigation without full page reloads.

## 2026-06-11 — Updated Slider Icons
**What**: Removed old icons from the continuous scrolling icon slider on the home page and replaced them exclusively with three new icons provided by the user. Adjusted CSS to make icons smaller and properly spaced.
**Why**: The user requested that only the newly provided icons be displayed in the slider, and subsequently asked to reduce their size and increase the spacing between them for a cleaner look.
**Files Changed**: `FrontEnd/src/Pages/HomePage.jsx`, `FrontEnd/src/Style/HomePage.css`
- Replaced the hardcoded repeating array of old `sudathi.com` icons in the `icons` array entirely with the 3 new Cloudinary image URLs, repeated to maintain the slider's continuous scrolling effect.
- Updated `.icon-slide` and `.icon-slide img` CSS rules across desktop and mobile media queries. Set fixed container widths larger than image widths to automatically generate even horizontal spacing between icons. Changed `.icon-slide-track` width to `max-content` for a smoother continuous loop.

## 2026-06-10 — Mobile UI Tweaks & Header Updates
**What**: Updated mobile layout for featured videos and footer columns, and made the Blouse navigation item fetch all blouses on click. Adjusted the video section width to match other sections.
**Why**: User requested 2 videos per row in a mobile slider, side-by-side footer links, the top-level Blouse link to be clickable while removing "All Blouses" from the submenu, and the video section to be full width like other product sliders.
**Files Changed**: `FrontEnd/src/Pages/HomePage.jsx`, `FrontEnd/src/Component/Footer.jsx`, `FrontEnd/src/Component/Header.jsx`
- **HomePage**: Added resize listener to conditionally render a `react-slick` Slider for the "FEATURED PRODUCTS" YouTube shorts on mobile. Set `slidesToShow: 2` to show exactly 2 videos per row. Removed `container-fluid pe-5 ps-5` padding from the video section so it stretches to match the width of other sliders. Kept the Bootstrap grid for desktop.
- **Footer**: Added `col-6` to the "INFORMATION" and "CUSTOMER CARE" columns to ensure they sit side-by-side in a single row on mobile devices.
- **Header**: Replaced the desktop "Blouse" `<a>` toggle with a `<Link>` navigating to `/collections?category=Blouse`, removing `data-bs-toggle="dropdown"`. The dropdown still opens on hover via CSS. Removed "All Blouses" from both the desktop dropdown and mobile submenu.

## 2026-06-09 — My Orders Page & Profile Modal Update
**What**: Added a "My Orders" button to the user profile modal and created a full My Orders page where users can view their order history.
**Why**: Users needed a way to track their placed orders from within the app.
**Files Changed**: `BackEnd/Controllers/Order.Controller.js`, `BackEnd/Routes/Order.Route.js`, `FrontEnd/src/Component/UserProfileModel.jsx`, `FrontEnd/src/Pages/MyOrders.jsx` (new), `FrontEnd/src/Style/MyOrders.css` (new), `FrontEnd/src/Style/UserProfileModel.css`, `FrontEnd/src/App.jsx`
- **Backend**: Added `getUserOrders` controller that fetches orders by `userId` with product details populated, sorted newest-first. Added `GET /v1/order/user/:userId` route.
- **Profile Modal**: Added "My Orders" as the first navigation link. Switched from `<a>` tags to `<button>` elements with `useNavigate` for proper SPA navigation (no full page reloads). Modal closes before navigating.
- **My Orders Page**: Created `MyOrders.jsx` with expandable order cards showing product thumbnails preview, color-coded status badges with icons, price breakdown, delivery address, and payment details. Clicking items navigates to the product page. Includes empty state, loading spinner, and login-required state.
- **CSS**: Created `MyOrders.css` with premium warm neutral design, smooth slide-down animation for expanded cards, responsive layout for mobile. Updated `UserProfileModel.css` to properly style button-based navigation links.
- **Routing**: Added `/my-orders` route in `App.jsx`.

## 2026-06-09 — Header Navigation Spacing
**What**: Increased the gap between navigation items in the desktop header.
**Why**: The user requested more space between the top-level navigation links to make the header look less cluttered and more spread out.
**Files Changed**:
- `FrontEnd/src/Style/Header.css`: Changed `.navbar-nav` gap property from `1.5rem` to `2.5rem`.

## 2026-06-09 — Cart Sidebar Mobile Optimization
**What**: Reordered the elements within the mobile Cart Sidebar to push the "Recent View" section to the bottom.
**Why**: The user reported that displaying the recently viewed items at the top of the cart drawer on small screens pushed the actual cart contents and checkout buttons down too far.
**Files Changed**:
- `FrontEnd/src/Style/CartSidebar.css`: Modified the `@media (max-width: 768px)` query to switch `.cart-sidebar-body` from a grid layout to a flex column layout, leveraging the CSS `order` property to force `.cart-sidebar-content` above `.recently-viewed-list`.

## 2026-06-09 — Mobile Cart Layout Refactor
**What**: Completely redesigned the mobile view of the Shopping Cart items.
**Why**: The user reported that the cart layout was poor on mobile devices. The previous layout stacked the image above the text and centered everything, making the items take up excessive vertical space.
**Files Changed**:
- `FrontEnd/src/Style/Cart.css`: Refactored the `@media (max-width: 576px)` query. Implemented `display: contents` on the product info wrapper to allow children to participate directly in a new 3-column CSS grid. The product image is now pinned to the left side, with details, price, and quantity controls compactly stacked on the right, and the delete button neatly positioned in the top-right corner.

## 2026-06-09 — Blouse Navigation Dropdown
**What**: Converted the top-level "Blouse" navigation link into a dropdown menu containing "Plain Blouse" and "Kalamkari Blouse".
**Why**: The user wanted quicker, direct access to the new blouse subcategories directly from the main header navigation on both desktop and mobile.
**Files Changed**:
- `FrontEnd/src/Component/Header.jsx`: Changed the `nav-item` for Blouse to a `dropdown` in the desktop view, adding sub-links with `subcategory` query params. Updated the mobile side-drawer to trigger a dedicated "BLOUSE" slide-in submenu.

## 2026-06-09 — Simplified Login Modal Layout
**What**: Removed the blue informational left panel from the Login Modal and centered the form with the Bunbun logo at the top.
**Why**: The user requested a cleaner, more focused login experience by stripping away the side panel and keeping only the interactive right panel.
**Files Changed**:
- `FrontEnd/src/Component/LoginModel.jsx`: Removed the `<div className="modal-left-panel">` section entirely and injected the `bunbun_logo.png` above the form title.
- `FrontEnd/src/Style/LoginModel.css`: Removed the 40/60 CSS grid layout from `.modal-content` and set a fixed max-width of 450px to perfectly center the standalone form.

## 2026-06-09 — Indian Pincode Auto-Fill
**What**: Integrated the free Indian Postal Pincode API (`api.postalpincode.in`) into the address entry form.
**Why**: The user requested that typing a 6-digit Indian PIN code automatically populate the City, State, and Country fields to speed up the checkout process.
**Files Changed**: `FrontEnd/src/Pages/Address.jsx`
- Updated the `handleChange` function to listen for exactly 6 digits in the `postalCode` input.
- Added a GET request to the Pincode API to fetch the corresponding District, State, and Country data, automatically mapping it to the form's state.

## 2026-06-09 — Combo Discount Implementation
**What**: Replaced the global subtotal-based percentage discounts (10%, 15%, 20%) with specific "Buy 2" combo offers.
**Why**: The user requested new pricing models: 2 Plain Blouses for ₹629, 2 Kalamkari Blouses for ₹799, and 2 Shapewear for ₹499, with discounts auto-applying in the cart.
**Files Changed**:
- `FrontEnd/src/Component/Cart.jsx` & `FrontEnd/src/Pages/OrderSummery.jsx`: Rewrote the `calculateOrderDiscount` algorithm to scan the cart for qualifying pairs of specific product categories/subcategories and subtract the exact differential amount from the total. Updated the offer banners in the cart sidebar.
- `FrontEnd/src/Component/CartContext.jsx`: Updated the guest cart logic to include `category` and `subcategory` when storing local cart data so that the new combo discounts can also calculate for unregistered users.

## 2026-06-09 — Unified Top Category Card Sizes
**What**: Updated the "Top Categories" section so all cards have a uniform size and aspect ratio matching the "Kurti Set" card.
**Why**: The newly uploaded category images had varying aspect ratios, causing the grid layout to look uneven.
**Files Changed**: `FrontEnd/src/Pages/HomePage.jsx`
- Wrapped all `img` tags in the `<div className="category-card-wrapper">` div to provide rounded corners.
- Added `aspectRatio: "4/5"` and `objectFit: "cover"` inline styles to all images to enforce a strict, uniform aspect ratio.

## 2026-06-09 — Reorganized Top Categories Grid
**What**: Updated the "Top Categories" image links grid on the homepage to remove Palazzo and add specific blouse subcategories.
**Why**: The user requested that the categories highlight the new Plain and Printed (Kalamkari) blouse variations rather than a generic blouse link and a coming soon placeholder for Palazzo.
**Files Changed**: `FrontEnd/src/Pages/HomePage.jsx`
- Removed the Palazzo card.
- Replaced the generic "Blouse" card with two new cards: "Plain Blouse" and "Kalamkari Blouse".
- Updated `onClick` handlers for the new blouse cards to navigate directly to their respective subcategory filters on the collection page.

## 2026-06-09 — Plain and Printed Blouses Collection Filters
**What**: Updated the "Plain Blouses Collection" and "Kalamkari Blouses Collection" sections on the homepage to exclusively display "Plain" and "Printed" blouses respectively.
**Why**: The user requested that the blouse sliders differentiate between plain and printed styles, utilizing the new `subcategory` feature.
**Files Changed**: `FrontEnd/src/Pages/HomePage.jsx`
- Changed the Plain Blouses slider filter to `p.category === "Blouse" && p.subcategory === "Plain"`.
- Changed the Printed Blouses slider filter to `p.category === "Blouse" && p.subcategory === "Printed"`.

## 2026-06-09 — Added Blouse Category Selection to Admin Panel
**What**: Added a mandatory radio button group for "Plain" or "Printed" when adding a new Blouse product in the Admin Panel.
**Why**: The user requested a way to categorize blouses into plain or printed designs directly from the product creation form.
**Files Changed**: `FrontEnd/src/Pages/AdminPanel.jsx`
- Tied the new radio buttons to the existing `subcategory` field in the `formData` state.

## 2026-06-09 — Performance Optimizations (Lazy Loading)
**What**: Implemented React lazy loading for all routes and added native lazy loading to heavy media assets.
**Why**: The application was loading all pages and heavy YouTube iframes synchronously on the initial load, leading to high time-to-interactive and UI lagging.
**Files Changed**: `FrontEnd/src/App.jsx`, `FrontEnd/src/Pages/HomePage.jsx`
- Wrapped all routes in `React.lazy` and `Suspense` in `App.jsx` to code-split the Javascript bundle.
- Added `loading="lazy"` to heavy `<iframe>` and `<img>` tags in `HomePage.jsx` to defer loading off-screen media.

## 2026-06-09 — Checkout Flow Enhancements (Clear Cart & Redirect)
**What**: Automated clearing the cart and redirecting the user to the "My Orders" page after a successful checkout.
**Why**: The user requested that products be removed from their cart upon purchase completion and that they be immediately taken to their orders history instead of the homepage.
**Files Changed**: `BackEnd/Controllers/Cart.Controller.js`, `BackEnd/Routes/Cart.Route.js`, `FrontEnd/src/Component/CartContext.jsx`, `FrontEnd/src/Pages/OrderSummery.jsx`
- Added `/clear/:userId` endpoint to the backend to clear a user's cart in the database.
- Added `clearCart` utility function to `CartContext.jsx` to clear both guest and logged-in user carts.
- Modified `OrderSummery.jsx` to invoke `clearCart()` and route to `/my-orders` upon payment success.

## 2026-06-09 — Configured Frontend Environment Variables for Payments
**What**: Created a `.env` file in the `FrontEnd` directory containing `VITE_RAZORPAY_KEY_ID`.
**Why**: The Razorpay Key ID was previously hardcoded in `OrderSummery.jsx`. Using an environment variable makes it secure and easy to swap test credentials for production credentials.
**Files Changed**: `FrontEnd/.env` (new), `FrontEnd/src/Pages/OrderSummery.jsx`
- Added `.env` with the current test key.
- Replaced hardcoded key with `import.meta.env.VITE_RAZORPAY_KEY_ID`.

## 2026-06-09 — Fixed Order Creation Payment Validation Error
**What**: Updated `paymentDetails` structure in `OrderSummery.jsx` and added 'Razorpay' to the `paymentMethod` enum in `Order.Model.js`.
**Why**: The frontend was sending `paymentMethod: "Razorpay"` and `transactionId`, but the schema expected `paymentId` and strictly enforced an enum that did not include 'Razorpay'. This caused a silent validation failure on order creation.
**Files Changed**: `FrontEnd/src/Pages/OrderSummery.jsx`, `BackEnd/Models/Order.Model.js`
- Added 'Razorpay' to the `paymentMethod` enum.
- Corrected payload key from `transactionId` to `paymentId` and explicitly set `paymentStatus: "Completed"`.

## 2026-06-09 — Fixed Order Creation Validation Error
**What**: Updated `OrderSummery.jsx` to map the `cart.product` items into the structure required by `Order.Model.js` before sending the order creation request.
**Why**: The backend order schema required a `price` field for each item, but the frontend was sending the raw `cart.product` array which lacked `price`. This caused a silent Mongoose validation error on the backend (`createOrder` failed with 500), which cascaded to the frontend showing a misleading "Payment verification failed" alert.
**Files Changed**: `FrontEnd/src/Pages/OrderSummery.jsx`
- Transformed `items` array to explicitly extract `productId._id`, `quantity`, `size`, and computed `price` using `parsePrice`.

## 2026-06-09 — Fixed Missing Orders in My Orders
**What**: Updated `OrderSummery.jsx` to use the authenticated user's actual `_id` instead of a hardcoded mock ID during order creation.
**Why**: After a successful checkout, the newly created order was being saved to a hardcoded user ID (`6892e8456c2cbf8ecb95c1ea`), so when the actual user went to their "My Orders" page, the API request (`/v1/order/user/:userId`) couldn't find any orders matching their real ID.
**Files Changed**: `FrontEnd/src/Pages/OrderSummery.jsx`
- Imported `getAuthUser` utility.
- Dynamically retrieved the logged-in `user._id` and passed it in the `orderPayload` for non-guest checkouts.

## 2026-06-09 — Fixed Razorpay 401 Unauthorized Error
**What**: Updated the hardcoded Razorpay key in the frontend to match the backend's `RAZORPAY_KEY_ID`.
**Why**: The Razorpay checkout modal was throwing a `401 Unauthorized` error because the frontend was initializing the payment with `rzp_test_Sp9X2smiuL6n0F`, but the order was created on the backend using `rzp_test_Sp8ow2u4uVKQIl`. Razorpay requires the popup initialization key to exactly match the key used to generate the `order_id`.
**Files Changed**: `FrontEnd/src/Pages/OrderSummery.jsx`
- Replaced the hardcoded key with `rzp_test_Sp8ow2u4uVKQIl`.

## 2026-06-09 — Fixed Order Schema Validation Error
**What**: Changed the `size` property type in `Order.Model.js` from `Number` to `String`.
**Why**: During checkout, items with string sizes (e.g., 'L', 'XL') were causing Mongoose validation errors (`castNumber`), resulting in 500 internal server errors and preventing successful checkout.
**Files Changed**: `BackEnd/Models/Order.Model.js`
- Updated `size` type definition to correctly expect String values.

## 2026-06-09 — Admin Orders Dashboard
**What**: Added a new "Orders" tab to the Admin Dashboard allowing the admin to view all customer orders.
**Why**: Admins needed visibility into all customer orders to track sales and manage order statuses.
**Files Changed**: `BackEnd/Controllers/Order.Controller.js`, `BackEnd/Routes/Order.Route.js`, `FrontEnd/src/Pages/AdminPanel.jsx`, `FrontEnd/src/Style/Admin.css`
- Created `getAllOrders` controller logic to fetch all orders sorted by date.
- Added new GET route `/v1/order/getAllOrders`.
- Updated `AdminPanel.jsx` with a new `activeTab` state for 'orders'.
- Added an Orders table view detailing Order ID, Date, Customer Info, Amount, Status, and Payment.
- Styled new `admin-status-badge` dynamically colored based on order state.

## 2026-06-09 — Admin Dashboard Category Filter Cards
**What**: Added 3 clickable stat cards at the top of the admin dashboard — Total Products, Blouses, and Shapewear — that filter the product table by category when clicked.
**Why**: Admin needed a quick overview of product counts per category and the ability to filter the table by clicking.
**Files Changed**: `FrontEnd/src/Pages/AdminPanel.jsx`, `FrontEnd/src/Style/Admin.css`
- Added `categoryFilter` state to toggle between 'all', 'Blouse', and 'Shapewear'.
- Replaced single stat card with 3 cards showing computed counts per category.
- Product table filters based on selected category. Active card gets a blue border highlight with hover lift effect.
- Added `.admin-stat-card.clickable` and `.admin-stat-card.active` CSS styles with transitions and blue accent.

## 2026-06-09 — Admin Product Preview Button
**What**: Added a "Preview" button in the admin dashboard product table that opens the product's live page in a new browser tab.
**Why**: Admins need to quickly preview how a product looks on the storefront without manually navigating.
**Files Changed**: `FrontEnd/src/Pages/AdminPanel.jsx`, `FrontEnd/src/Style/Admin.css`
- Added `Preview` button before `Edit` in the action buttons column, using `window.open` with the product's slug URL and `_blank` target.
- Added `.admin-preview-btn` CSS with blue theme (`#dbeafe` bg, `#1d4ed8` text) to visually distinguish from Edit (gray) and Delete (red).

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

## 2026-06-08 — Guest Checkout (No Login Required)
**What**: Removed the login requirement for checkout. Guest users can now complete the entire purchase flow by providing their name, phone number, and address inline.
**Why**: User requested that the checkout process should work without login. If the user is not logged in, mandatory name and mobile number fields appear alongside the address form.
**Files Changed**: `FrontEnd/src/Pages/Address.jsx`, `FrontEnd/src/Pages/OrderSummery.jsx`
- **Address.jsx**: Removed `userId` check redirect. Added `isGuest` flag. When guest, auto-opens the form with `Full Name` and `Mobile Number` fields (mandatory). Address is stored locally instead of saved to DB. Guest sees a confirmation card with an "Edit Details" button after submitting.
- **OrderSummery.jsx**: Accepts `isGuest` prop. Uses guest name/phone for Razorpay prefill and passes `guestInfo` in the order payload.

## 2026-06-08 — Customer Reviews Section on Homepage
**What**: Added a "WHAT OUR CUSTOMERS SAY" section below "THE SAREE STORE" on the homepage, showing real customer reviews in a slider.
**Why**: User requested that customer-added reviews be displayed on the homepage for social proof.
**Files Changed**: `backend/Controllers/Rating.Controller.js`, `backend/Routes/Rating.Routes.js`, `FrontEnd/src/Pages/HomePage.jsx`, `FrontEnd/src/Style/HomePage.css`
- **Backend**: Added `getAllReviews` controller that fetches all reviews across all products, flattens them into a single array sorted by newest first (limited to 20).
- **Route**: Registered `GET /v1/rating/getAllReviews`.
- **Frontend**: Added reviews state, fetch call, and a Slick slider section with review cards showing avatar (first letter of name), star rating, review text, and product name.
- **CSS**: Added premium review card styles with hover effects, gradient avatars, gold star colors, and mobile responsiveness.

## 2026-06-08 — Mobile Slider Navigation Hidden
**What**: Removed the left/right slider navigation arrows entirely on mobile devices.
**Why**: User requested that slider nav icons be removed on mobile to keep the interface cleaner (since mobile users can easily swipe).
**Files Changed**: `FrontEnd/src/Style/HomePage.css`
- Added `@media (max-width: 767px)` rule to set `display: none !important;` for `.slick-prev`, `.slick-next`, and `.carousel .control-arrow`.

## 2026-06-08 — Guest Wishlist functionality
**What**: Removed the login requirement for adding items to the wishlist. Non-logged-in users now have their wishlist stored in their browser's `localStorage`.
**Why**: User requested that the wishlist should not require an account. 
**Files Changed**: `FrontEnd/src/Component/WishlistContext.jsx`, `FrontEnd/src/Pages/Wishlist.jsx`, `backend/Controllers/Product.Controller.js`, `backend/Routes/Product.Routes.js`
- **WishlistContext**: Refactored `addToWishlistAPI` and `removeFromWishlistAPI` to use `localStorage` if no user is logged in.
- **Wishlist Page**: Modified to read `localStorage` IDs and fetch the actual product data using a new backend endpoint.
- **Backend API**: Added `getProductsByIds` endpoint to allow fetching the detailed product data required for rendering the wishlist items stored in `localStorage`.

## 2026-06-08 — Refined Slider Navigation Arrows
**What**: Removed background from slider arrows, moved them inside the product slider container, and added text-shadow for better contrast.
**Why**: User requested that only the arrow icon be visible, and then noted it wasn't visible properly (likely due to no background and being positioned outside the layout bounds).
**Files Changed**: `FrontEnd/src/Style/HomePage.css`
- Removed background-color, border-radius, and box-shadow from `.slick-prev` and `.slick-next`.
- Shifted arrows from `left/right: -20px` to `5px` to keep them safely inside the container.
- Added a dark `text-shadow` to the white arrow icons (`:before` elements) so they are clearly visible against any image background.

## 2026-06-08 — Added Slider Navigation Buttons
**What**: Styled the left/right navigation arrows for both the hero carousel and product sliders to be clearly visible on desktop.
**Why**: User requested slider nav buttons on desktop so they can easily click through banners and products.
**Files Changed**: `FrontEnd/src/Style/HomePage.css`
- Added custom CSS for `.slick-prev` and `.slick-next` to make them solid white circles with shadow.
- Made `react-responsive-carousel` arrows visible by default on desktop viewports.

## 2026-06-08 — Mobile Header Layout & Search Fixes
**What**: Restructured the mobile header to group the logo and hamburger menu toggle button together on the left, and fixed search dropdown visibility on mobile.
**Why**: User requested the logo be next to the toggle button on the left. The search suggestions dropdown was also hidden behind other elements on mobile.
**Files Changed**: `FrontEnd/src/Component/Header.jsx`
- Grouped `navbar-toggler` and `navbar-brand` (logo) inside a `d-flex align-items-center` container.
- Increased `search-suggestions-dropdown` z-index to 2500 and added `maxHeight` + `overflowY` to ensure it stays fully visible and scrollable over all mobile content.

## 2026-06-08 — Fix Mongoose OverwriteModelError
**What**: Updated all Mongoose model files to check if the model already exists in memory before defining it.
**Why**: Nodemon hot-reloading was crashing the backend server with `OverwriteModelError: Cannot overwrite \`ModelName\` model once compiled.`
**Files Changed**: `backend/Models/*.js` (Wishlist, User, Product, Rating, Order, Cart, Banner, Address)
- Appended `mongoose.models.ModelName ||` to all `mongoose.model` exports to safely reuse existing schemas during hot reloads.

## 2026-06-08 — Live Product Search Suggestions
**What**: Added live product search suggestions to the header search bar.
**Why**: User requested that typing 2+ letters in the search bar should show a dropdown of product suggestions.
**Files Changed**: `FrontEnd/src/Component/Header.jsx`, `backend/Controllers/Product.Controller.js`, `backend/Routes/Product.Routes.js`
- **Frontend**: Added `searchSuggestions` and `isSearching` state in `Header.jsx`. Created a debounced `useEffect` that calls the backend search API when `searchQuery.length >= 2`. Rendered a dropdown showing product images, names, and prices.
- **Backend**: Added `searchProduct` controller method that performs a case-insensitive regex search on product names and limits results to 5.
- **Routes**: Added `GET /v1/Product/searchProduct`.

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
