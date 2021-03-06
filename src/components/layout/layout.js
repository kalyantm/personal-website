import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import { ThemeProvider } from "styled-components"

import Header from "../header/header"
import Footer from "../footer/footer"

import "./layout.scss"
import { createGlobalStyle } from "styled-components"

import { light, dark } from "../../styled-components/themes"

const GlobalStyle = createGlobalStyle`
  body {
    background: ${props => props.theme.bgColor};
    color: ${props => props.theme.textColor};
    max-width: 800px;
    margin: 0 auto;
    font-size: 16px;
  }

  h1,h2,h3,h4,h5,p,a {
    color: ${props => props.theme.textColor};
  }

  article {
    color: ${props => props.theme.textColor};
    h1, h2, h3, h4, p {
     color: ${props => props.theme.textColor};
    }
  }

  code {
    display: block;
    overflow-y: scroll;
    max-width: 700px;
    background: #eee;
    padding: 1em;
    font-family: "Source Code Pro", monospace;
    font-size: 13px;
    line-height: 20px;
    border-radius: 2px;
    border-radius: 2px;
  }
`

const Layout = ({ children, headless }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
          author
          description
        }
      }
    }
  `)

  const [darkMode, setDarkMode] = React.useState(false)

  const toggleTheme = () => {
    setDarkMode(!darkMode)
  }

  return (
    <ThemeProvider theme={darkMode ? dark : light}>
      <GlobalStyle />
      {headless ? null : (
        <Header
          theme={darkMode ? "dark" : "light"}
          toggleTheme={toggleTheme}
          siteTitle={data.site.siteMetadata.title}
          description={data.site.siteMetadata.description}
        />
      )}
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 800,
        }}
      >
        <section>
          <article>{children}</article>
        </section>
        <Footer title={data.site.siteMetadata.author} />
      </div>
    </ThemeProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
