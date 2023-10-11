/** @type {import('next').NextConfig} */

// See: https://blog.logrocket.com/how-to-use-proxy-next-js/
// And: https://nextjs.org/docs/pages/api-reference/next-config-js/rewrites
// No need to 'enable' CORS on the Flask server this way, or explicitly set up
// a proxy on the NextJS dev server. I think with the `rewrites` NextJS proxies
// the requests in the background somewhere/somehow anyway
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/list",
        destination: "http://localhost:3030/list",
      },
      {
        source: "/file",
        destination: "http://localhost:3030/file",
      },
      {
        // Using a 'magic'/short-uuid prefix here, if a directory from which we want to get
        // a md/doc file ever has the same name we're in trouble [:
        source: "/asset0d685bb/:path*",
        destination: "http://localhost:3030/asset/:path*",
      },
    ];
  },
};
module.exports = nextConfig;
