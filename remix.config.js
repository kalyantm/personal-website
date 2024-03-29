/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  appDirectory: "app",
  assetsDirectory: "public/build",
  publicPath: "/build/",
  serverBuildDirectory: "api/_build",
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: [".*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
  serverModuleFormat: "cjs",
  serverDependenciesToBundle: [
    /^@uppy.*/,
    /^nanoid.*/,
    /^rehype.*/,
    /^remark.*/,
    /^unified.*/,
    /^hast.*/,
    /^unist.*/,
    /^s.*/,
    /^html.*/,
    /^character.*/,
    "ccount",
    "property-information",
    "vfile-location",
    "vfile-message",
    "comma-separated-tokens",
    "web-namespaces",
    "@sindresorhus/slugify",
    "lowlight",
    "marked",
    // 'hast-util-to-text',
    // 'unist-util-visit',
    // 'hast-util-to-html',
    "bail",
    // 'hast-util-from-parse5',
    "trough",
    "vfile",
    "fault",
    // 'unist-util-visit-parents',
    // 'hast-util-is-element',
    "is-plain-obj",
    "rehype-highlight",
    "zwitch",
  ],
};
