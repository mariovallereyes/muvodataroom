const sub = "/alteredventures/muvodataroom";
/** @type {import('next').NextConfig} */
module.exports = {
  basePath: sub,
  // Serve images as plain files so rewrites/proxy don't break _next/image
  images: { unoptimized: true },
};