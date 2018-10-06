import React from 'react'

// Import typefaces
import 'typeface-montserrat'
import 'typeface-merriweather'

import profilePic from './profile-pic.jpg'
import { rhythm } from '../utils/typography'

class Bio extends React.Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          marginBottom: rhythm(2.5),
        }}
      >
        <img
          src={profilePic}
          alt={`Ashok Dudhade`}
          style={{
            borderRadius: "50%",
            marginRight: rhythm(1 / 2),
            marginBottom: 0,
            width: rhythm(2),
            height: rhythm(2),
          }}
        />
        <p>
          Written by <strong>Ashok Dudhade</strong>.{' '}
          <a href="https://twitter.com/ASHOKDUDHADE">
            Twitter
          </a>
        </p>
      </div>
    )
  }
}

export default Bio
