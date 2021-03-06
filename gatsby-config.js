const siteMetadata = {
  // Update the following values to what you please
  title: `KTM`,
  description: `Product-Minded Software Engineer. Coffee Enthusiast. In an ideal world, a Pokemon Master.`,
  author: `Simple`,
  // Add your socials here
  bio: {
    intro: `Hi 👋, I'm Kalyan, a software engineer, who spends my time building web
              applications. I also blog about the web and product engineering
              and try my best to create fun, open-source software.`,
    product: `I also have a keen interest in product and love to involve myself in
          breaking down complex, challenging technical roadmaps into reliable,
          usable software.`,
    current: `Currently building the frontend at Saltside Technologies.`,
  },
}

const plugins = [
  `gatsby-plugin-react-helmet`,
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `images`,
      path: `${__dirname}/src/images`,
    },
  },
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `markdowns`,
      path: `${__dirname}/src/posts`,
    },
  },
  `gatsby-transformer-sharp`,
  `gatsby-transformer-remark`,
  `gatsby-plugin-sharp`,
  {
    resolve: `gatsby-plugin-manifest`,
    options: {
      name: `gatsby-starter-simple`,
      short_name: `simple`,
      start_url: `/`,
      background_color: `#fff`,
      theme_color: `#333`,
      display: `minimal-ui`,
      icon: `src/images/simple-icon.png`, // This path is relative to the root of the site.
    },
  },
  {
    resolve: `gatsby-plugin-disqus`,
    options: {
      // replace the shortname with your own
      // how to get Disqus shortname https://help.disqus.com/en/articles/1717111-what-s-a-shortname
      shortname: `simple-blog-7`,
    },
  },
  {
    resolve: "gatsby-plugin-react-svg",
    options: {
      rule: {
        include: /assets/,
      },
    },
  },
  {
    resolve: `gatsby-plugin-google-analytics`,
    options: {
      // The property ID; the tracking code won't be generated without it
      trackingId: "YOUR_GOOGLE_ANALYTICS_TRACKING_ID",
      // Defines where to place the tracking script - `true` in the head and `false` in the body
      head: false,
      // Setting this parameter is optional
      anonymize: true,
      // Setting this parameter is also optional
      respectDNT: true,
      // Avoids sending pageview hits from custom paths
      exclude: ["/preview/**", "/do-not-track/me/too/"],
      // Delays sending pageview hits on route update (in milliseconds)
      pageTransitionDelay: 0,
      // Enables Google Optimize using your container Id
      optimizeId: "YOUR_GOOGLE_OPTIMIZE_TRACKING_ID",
      // Enables Google Optimize Experiment ID
      experimentId: "YOUR_GOOGLE_EXPERIMENT_ID",
      // Set Variation ID. 0 for original 1,2,3....
      variationId: "YOUR_GOOGLE_OPTIMIZE_VARIATION_ID",
      // Any additional optional fields
      sampleRate: 5,
      siteSpeedSampleRate: 10,
      cookieDomain: "example.com",
    },
  },
  `gatsby-plugin-sass`,
  `gatsby-plugin-offline`,
]

module.exports = {
  siteMetadata: siteMetadata,
  pathPrefix: "/gatsby-starter-simple", // REMOVE IF NOT DEPLOYING TO GH-PAGES
  plugins: plugins,
}
