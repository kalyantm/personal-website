import React from "react"
import { useStaticQuery, graphql } from "gatsby"

import Layout from "../components/layout/layout"
import SEO from "../components/seo/seo"

import { Divider } from "../styled-components/index"
import { SocialLinks } from "../styled-components/about"

const About = () => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          bio {
            intro
            product
            current
          }
        }
      }
    }
  `)
  const {
    siteMetadata: { bio },
  } = data.site

  const socials = []
  return (
    <Layout>
      <SEO title="About" description="About Me" />
      <p>{bio.intro}</p>
      <p>{bio.product}</p>
      <p>{bio.current}</p>
      <SocialLinks>
        {socials.map(social => {
          if (socials.length === 1)
            return <a href={social.url}>{social.icon}</a>
          return (
            <div key={social.url}>
              {socials.lastIndexOf(social) === socials.length - 1 ? null : (
                <Divider />
              )}
            </div>
          )
        })}
      </SocialLinks>
    </Layout>
  )
}

export default About
