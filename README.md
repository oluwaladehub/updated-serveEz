ProjectVerify: Detailed Technical Architecture and Stack
The ProjectVerify platform will be built as a modern, responsive Next.js web application with a robust backend on Supabase. The frontend will use Next.js (React) for fast performance and SEO-friendly rendering
leobit.com
supabase.com
, combined with the Shadcn UI component library (built on Tailwind CSS) for accessible, customizable UI. Supabase will provide the database (PostgreSQL), authentication, and file storage—all in a unified backend-as-a-service
dev.to
supabase.com
. This stack offers rapid development: for example, the new Supabase UI Library (built on Shadcn/UI) lets us drop in ready-made sign-up, login, and upload components directly into a Next.js app
supabase.com
supabase.com
. Shadcn UI is “extremely practical and well-designed” (per one developer) and allows copying component code into our project for full customization
guillaumeduhan.medium.com
supabase.com
. Tailwind’s mobile-first CSS ensures layouts adapt easily across screen sizes
tailwindcss.com
tailwindcss.com
. Supabase’s new UI library (built on shadcn/ui) provides ready-made components (here, a Sign-Up form) that can be dropped into a Next.js app
supabase.com
.
Frontend (Next.js + Shadcn UI + Tailwind)
Next.js (React) – Chosen for its blend of client-side and server-side rendering, Next.js enables both pre-rendering (SSG) and server-side rendering (SSR), resulting in fast load times and SEO-friendly pages
leobit.com
supabase.com
. It supports the latest React features (like the App Router and Server Components) and has built-in API routes/middleware for custom server logic. Next.js is well-supported by Vercel (for hosting) and the large React ecosystem, with automatic code splitting, optimized image handling, and a stable release cycle backed by Vercel
leobit.com
supabase.com
. For example, Next.js’s versatile rendering means pages can be either statically built at deploy or generated on demand, giving both performance and fresh data.
Shadcn UI + Tailwind CSS – We will use the Shadcn UI library (an open-source, Tailwind-based React component library) for the user interface. Shadcn UI is “a set of beautifully-designed, accessible components”
ui.shadcn.com
 and has been a top project in the JS community for its flexibility
supabase.com
. It works by copying component code into our project, so we have complete control over styling and behavior
supabase.com
. Shadcn UI integrates seamlessly with Tailwind CSS, and its components are fully responsive by default. Tailwind uses a mobile-first breakpoint system
tailwindcss.com
, so building layouts that adapt from small (mobile) to large (desktop) is straightforward. (For instance, we might use classes like md:flex to change layouts on medium+ screens
tailwindcss.com
.) By using Shadcn UI, we save time on designing common UI elements (buttons, forms, tables, etc.) because they come pre-styled and accessible
guillaumeduhan.medium.com
supabase.com
. We can also use the official Supabase UI component library (built on Shadcn/UI) to quickly implement things like sign-up and media upload flows
supabase.com
supabase.com
.
Responsive/Mobile Design – The UI will be fully responsive. Tailwind’s utility classes make it easy to adjust styling at different screen widths
tailwindcss.com
tailwindcss.com
. For example, we’ll include the viewport meta tag and use Tailwind breakpoints (sm:, md:, etc.) so components stack or resize appropriately on smartphones, tablets, and desktops. Shadcn components are designed to be responsive (e.g. modal dialogs and menus adapt to screen size), and we will test on common devices to ensure a seamless mobile experience.
UI Screens & Routing – The user-facing app will have pages for signing up/logging in, managing projects, requesting verifications, and viewing project galleries. We’ll leverage Next.js’s file-based routing (App Router or Pages Router) to create these pages. Shadcn UI components will be imported into our React code (with npx shadcn-ui@latest add commands) to build consistent page layouts. For example, a project gallery page may use a responsive Shadcn Grid or Card component to display images. We’ll also include common UI elements (navigation menu, status indicators, modals, etc.) from Shadcn for rapid development.
Backend & Data (Supabase) supabase/ssr
Supabase (Postgres DB + Auth + Storage) – Supabase will serve as our backend platform. It provides a fully managed PostgreSQL database with Row Level Security (RLS), an authentication system, and storage for media files, all accessible via simple APIs
dev.to
supabase.com
. The database will store users, projects, and verification requests. Supabase automatically generates RESTful (and real-time) APIs for each table, so our Next.js app can fetch/update data without writing a custom backend. Crucially, RLS policies ensure each user only sees their own projects/requests. Supabase Auth handles user sign-up/login (email/password) and supports secure practices like email confirmations. We can also enable multi-factor authentication (MFA) – for example, Supabase natively supports TOTP (authenticator apps) and SMS-based second factors
supabase.com
, adding an extra security layer.
File Storage (Photos/Videos) – For media uploads (project photos/videos), we will use Supabase Storage, an S3-compatible service. Each user-uploaded file will be stored in a private bucket, ensuring only that user (and admins) can access it. RLS policies on storage can enforce that only authenticated users can upload or download files for their own projects
supalaunch.com
. From Next.js we’ll call the Supabase JS client: e.g. supabase.storage.from('bucket').upload(path, file) to save a file
supalaunch.com
. Once uploaded, Supabase returns a URL (or path) that we can store in the database. Retrieving media for a project gallery is then as simple as listing URLs via Supabase’s API or directly constructing the CDN URL. Supabase also offers a built-in CDN, so serving images/videos is fast and scalable. (By default buckets are private, but we can set some files public or use expiring signed URLs if needed.)
Real-Time and Edge Functions – Supabase’s real-time features (powered by Postgres replication) let the app auto-refresh data. For example, if an admin marks a request as “Verified”, the user’s dashboard can update instantly via real-time subscriptions. Supabase also offers Edge Functions (serverless TypeScript functions running on Deno at the global edge) for custom logic
supabase.com
. We can use edge functions for tasks like sending emails or integrating with third-party APIs (e.g. Stripe for future escrow)
supabase.com
.)
Authentication & Security – User authentication and data security are paramount. Supabase Auth will store user credentials securely and issue JWTs for sessions. We will store Supabase keys (PROJECT_URL and ANON_KEY) in Next.js’s environment variables (.env.local), not in frontend code
supabase.com
supalaunch.com
. All client calls to Supabase will use the Supabase JS client, which handles tokens and sessions. We can use @supabase/auth-helpers-nextjs for easy Next.js integration (e.g. createClientComponentClient() for client components)
supalaunch.com
. For roles, we start with “user” and “admin” roles; RLS policies will ensure users can only access their own projects/requests. We will also enforce strong password rules and possibly leverage Supabase’s MFA options
supabase.com
. Additionally, we plan 2FA (using Supabase Auth’s SMS or TOTP) for sensitive actions. For compliance, all user data is handled in accordance with relevant privacy regulations (e.g. NDPR), with personal data minimized and encrypted in transit.
Database Schema (Example) – The database might include tables like: users (id, name, email, etc.), projects (id, user_id, title, description, location, etc.), verification_requests (id, project_id, status, timestamp), and media (id, request_id, file_url, type). Supabase’s SQL editor or migration tools let us define these schemas easily. RLS policies (e.g. auth.uid() = user_id) will automatically protect rows so that each user sees only their own projects and requests.
Notifications & Communications
Email Notifications – For emails (e.g. “Verification Completed”), we can use a transactional email API. Resend (by Vercel)
.
In-App Notifications – We may also implement on-screen notifications or email confirmations directly in-app (e.g. a banner or modal). This can be done with client-side React state or by subscribing to Supabase Realtime changes and displaying a toast when a new update arrives.
Responsive & Mobile Design
The entire frontend will follow responsive web design principles. Tailwind CSS, used by Shadcn UI, is inherently mobile-first
tailwindcss.com
. We will design the mobile layout first (e.g. stack cards vertically, use hamburger menus) and then add breakpoint modifiers (sm:, md:, etc.) for larger screens
tailwindcss.com
tailwindcss.com
. All text, buttons, and touch targets will be sized for mobile use. Media queries (via Tailwind) will ensure images scale and columns adapt to screen width. This guarantees that diaspora users can access the dashboard comfortably on phones, tablets, or desktops. All pages will include the standard <meta name="viewport" content="width=device-width, initial-scale=1.0" /> so that mobile browsers render the layout correctly
tailwindcss.com
.
Hosting & Deployment
Frontend (Vercel) – We will host the Next.js app on Vercel (the creator of Next.js). Vercel provides optimized hosting for Next.js with features like automatic static optimization, edge caching, and seamless deployments on push. Every branch or PR can be previewed as a Vercel deployment. Environment variables (Supabase keys) can be securely configured in Vercel’s dashboard.
Backend (Supabase Cloud) – The database, auth, and storage are hosted by Supabase’s managed service. Supabase handles scaling the Postgres database and file storage. We can also deploy Supabase Edge Functions via their CLI. Supabase’s global infrastructure ensures low-latency access for users in Nigeria and around the world.
CI/CD and Monitoring – We will use GitHub (or GitLab) for version control, with automated tests (Jest/React Testing Library) and linting on each commit. Vercel’s integration with the repo allows continuous deployment. For monitoring, we can integrate Sentry or LogRocket in the Next.js app, and use Supabase’s built-in logs or a tool like Sentry for functions.
Additional Considerations
Admin Panel (Future) – Although the initial MVP focuses on the user dashboard, we will design the system so an admin interface can be added later. The same tech stack (Next.js + Shadcn UI) can be reused to build an internal admin panel for assigning and uploading verifications. Meanwhile, status updates can be done directly in the Supabase dashboard or via custom scripts.
Internationalization – For now the app will be in English. In the future, Next.js’s i18n routing or libraries like next-translate can add other languages if needed.
Security & Compliance – We will enforce HTTPS everywhere and use HTTP-only cookies or secure headers for sessions. Supabase Auth tokens are stored securely. Uploaded media is private by default. We will ensure compliance with data protection laws (e.g. minimal PII storage, opt-in communications, user data deletion on request).
Escrow/Payments (Future) – The system is designed so we could integrate a payment or escrow service later (e.g. Stripe or Flutterwave) if the project evolves into holding diaspora funds. At that point, we could use Supabase Edge Functions to handle webhook events or secure backend logic for payment status.
In summary, ProjectVerify will use a modern, well-supported tech stack: Next.js for a high-performance, SEO-friendly frontend; Shadcn UI (with Tailwind) for a beautiful, responsive UI; and Supabase for an integrated backend (auth, database, storage, real-time). This combination lets us move quickly (many features “just work” out of the box
supabase.com
dev.to
) while keeping the codebase clean and customizable. The components and services are open-source or widely adopted, ensuring long-term support. With this architecture, diaspora users can confidently request and view verifications on any device, and the team can securely manage projects behind the scenes.#   v e r i f y  
 