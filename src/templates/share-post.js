import React from 'react'

import {
    LinkedinShareButton,
    TwitterShareButton,
    TwitterIcon,
    LinkedinIcon
  } from "react-share";
  const styles = theme => ({
    share: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "1em 0 0",
      [`@media (min-width: ${theme.mediaQueryTresholds.M}px)`]: {
        flexDirection: "row"
      }
    },
    links: {
      display: "flex",
      flexDirection: "row",
      "& .SocialMediaShareButton": {
        margin: "0 .8em",
        cursor: "pointer"
      }
    },
    label: {
      fontSize: "1.2em",
      margin: "0 1em 1em",
      [`@media (min-width: ${theme.mediaQueryTresholds.M}px)`]: {
        margin: "0 1em"
      }
    }
  });
  const iconSize = 36;
  class SharePost extends React.Component {
      render(){
        const title = this.props.title;
        const excerpt = this.props.excerpt;
        let url = '';
        if (typeof window !== `undefined`) {
            url = window.location.href;
        }
        return (<div style={{
            display: 'flex',
            flexDirection: 'row',
            verticalAlign: 'middle'
        }}>
        <div style={{
             display: 'flex',
             justifyContent: 'center',
             flexDirection: 'column',
             textAlign: 'center',
             paddingRight: '1rem'
        }} >SHARE</div>
        <div style={{
            display: 'flex',
            height: '100%'
        }}>
          <TwitterShareButton url={url} title={title}>
            <TwitterIcon round size={iconSize} />
          </TwitterShareButton>
          <LinkedinShareButton url={url} title={title} description={excerpt}>
            <LinkedinIcon round size={iconSize} />
          </LinkedinShareButton>
        </div>
      </div>);
      }
  }

  export default SharePost;