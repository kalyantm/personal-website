import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout/layout"
import SEO from "../components/seo/seo"

import { BlogLink, BlogTitle, PrePost } from "../styled-components/index"
import { ThemeProvider } from "styled-components"

import { light, dark } from "../styled-components/themes"

export default ({ data }) => {
  const preferDarkMode = window.localStorage.getItem("prefer-dark-mode")
  const [darkMode, setDarkMode] = React.useState(
    preferDarkMode === "true" ? true : false
  )

  const toggleTheme = () => {
    setDarkMode(!darkMode)
    window.localStorage.setItem("prefer-dark-mode", !darkMode)
  }

  return (
    <ThemeProvider theme={darkMode ? dark : light}>
      <Layout toggleTheme={toggleTheme}>
        <SEO title="Home" />
        {data.allMarkdownRemark.edges.map(({ node }) => (
          <div key={node.id}>
            <BlogLink to={node.fields.slug}>
              <BlogTitle>{node.frontmatter.title}</BlogTitle>
            </BlogLink>
            <PrePost>
              <span>
                {new Date(node.frontmatter.date).toDateString().toUpperCase()}
              </span>
              <span>{node.timeToRead} MIN READ</span>
            </PrePost>
            <p>{node.excerpt}</p>
          </div>
        ))}
      </Layout>
    </ThemeProvider>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          id
          timeToRead
          frontmatter {
            date
            title
            description
          }
          excerpt
          fields {
            slug
          }
        }
      }
    }
  }
`
