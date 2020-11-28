import { Link } from "gatsby"
import { Sun, Moon } from "react-feather"
import PropTypes from "prop-types"
import React from "react"

import "./header.scss"
import styled from "styled-components"

const ToggleButton = styled.button`
  padding: 8px;
`

const HeaderWrapper = styled.header`
  padding-top: 32px;
  padding-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Nav = styled.nav`
  span {
    &:first-child {
      padding-right: 16px;
    }
  }
  button {
    vertical-align: middle;
  }
`

const Bio = styled.div`
  border-bottom: 1px solid #ddd;
  padding-bottom: 16px;
`

const Header = ({ siteTitle, description, toggleTheme, theme }) => (
  <>
    <HeaderWrapper>
      <h1>
        <Link className="header-text" to="/">
          {siteTitle}
        </Link>
      </h1>
      <Nav>
        <span>
          <Link to="/about">About</Link>
        </span>
        <span>
          <ToggleButton type="button" onClick={toggleTheme}>
            {theme === "dark" ? (
              <Sun fill="#eceff4" />
            ) : (
              <Moon fill="#2e3440" />
            )}
          </ToggleButton>
        </span>
      </Nav>
    </HeaderWrapper>
    <Bio>{description}</Bio>
  </>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
