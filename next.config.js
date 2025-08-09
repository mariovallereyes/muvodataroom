const sub = "/alteredventures/muvodataroom";
/** @type {import('next').NextConfig} */
module.exports = {
  // Keep subpath in production; for local testing, set NEXT_PUBLIC_BASEPATH!=1
  basePath: process.env.NEXT_PUBLIC_BASEPATH === "1" ? sub : "",
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASEPATH === "1" ? sub : "",
  },
};