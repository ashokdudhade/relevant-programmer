import React from 'react';
import './style.scss';
import { OutboundLink } from 'gatsby-plugin-google-analytics'
import { useMixpanel } from 'gatsby-plugin-mixpanel'


function Share({ title, url }) {
  const mixpanel = useMixpanel();

  const encodedURL = encodeURI(url);
  const text = encodeURI(title);
  return (
    <div className="shareWrapper">
      <p>
        <span>Share This Post
        </span>
        <span className="shareIconContainer">
          <OutboundLink
            onClick={() => mixpanel.track("ShareTwitterClicked")}
            className="shareButton"
            href={`https://twitter.com/intent/tweet?text=${text}&url=${encodedURL}`}
            target="_blank"
            aria-label="Share on Twitter"
            rel="noopener noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
            </svg>
          </OutboundLink>
          <OutboundLink
            onClick={() => mixpanel.track("ShareLinkedInClicked")}

            className="shareButton"
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedURL}&title=${text}`}
            target="_blank"
            aria-label="Share on LinkedIn"
            rel="noopener noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </OutboundLink>
        </span>
      </p>
    </div>
  );
}

export default Share;
