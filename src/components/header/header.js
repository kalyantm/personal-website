import { Link } from "gatsby"
import { Sun, Moon } from "react-feather"
import PropTypes from "prop-types"
import React from "react"

import "./header.scss"
import styled from "styled-components"

const ToggleButton = styled.button`
  padding: 0;
`

const Header = ({ siteTitle, toggleTheme, theme }) => (
  <header
    style={{
      padding: `30px 30px`,
      borderBottom: `1px solid #ddd`,
    }}
  >
    <h1>
      <Link className="header-text" to="/">
        {siteTitle}
      </Link>
    </h1>
    <nav style={{ textAlign: `right` }}>
      <Link to="/about">About</Link>

      <ToggleButton type="button" onClick={toggleTheme}>
        {theme === "dark" ? <Sun fill="#eceff4" /> : <Moon fill="#2e3440" />}
      </ToggleButton>
    </nav>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
