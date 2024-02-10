import styled from '@emotion/styled'
import { Paper } from '@mui/material'

export const Page = styled.main`
  padding: 1rem;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5rem;
`

export const MessageList = styled(Paper)`
  width: 95%;
  padding: 1.5rem;
  max-width: 1440px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  @media print {
    *,
    *:before,
    *:after {
      background: transparent !important;
      color: #000 !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }

    a,
    a:visited {
      text-decoration: underline;
    }

    a[href]:after {
      content: ' (' attr(href) ')';
    }

    abbr[title]:after {
      content: ' (' attr(title) ')';
    }

    a[href^='#']:after,
    a[href^='javascript:']:after {
      content: '';
    }

    pre,
    blockquote {
      border: 1px solid #999;
      page-break-inside: avoid;
    }

    thead {
      display: table-header-group;
    }

    tr,
    img {
      page-break-inside: avoid;
    }

    img {
      max-width: 100% !important;
    }

    p,
    h2,
    h3 {
      orphans: 3;
      widows: 3;
    }

    h2,
    h3 {
      page-break-after: avoid;
    }
  }

  @media screen and (min-width: 32rem) and (max-width: 48rem) {
    html {
      font-size: 15px;
    }
  }

  @media screen and (min-width: 48rem) {
    html {
      font-size: 16px;
    }
  }

  body {
    line-height: 1.85;
  }

  p,
  .splendor-p {
    font-size: 1rem;
    margin-bottom: 1.3rem;
  }

  h1,
  .splendor-h1,
  h2,
  .splendor-h2,
  h3,
  .splendor-h3,
  h4,
  .splendor-h4 {
    margin: 1.414rem 0 0.5rem;
    font-weight: inherit;
    line-height: 1.42;
  }

  h1,
  .splendor-h1 {
    margin-top: 0;
    font-size: 3.998rem;
  }

  h2,
  .splendor-h2 {
    font-size: 2.827rem;
  }

  h3,
  .splendor-h3 {
    font-size: 1.999rem;
  }

  h4,
  .splendor-h4 {
    font-size: 1.414rem;
  }

  h5,
  .splendor-h5 {
    font-size: 1.121rem;
  }

  h6,
  .splendor-h6 {
    font-size: 0.88rem;
  }

  small,
  .splendor-small {
    font-size: 0.707em;
  }

  /* https://github.com/mrmrs/fluidity */

  img,
  canvas,
  iframe,
  video,
  svg,
  select,
  textarea {
    max-width: 100%;
  }

  @import url(http://fonts.googleapis.com/css?family=Merriweather:300italic,300);

  html {
    font-size: 18px;
    max-width: 100%;
  }

  body {
    color: #444;
    font-family: 'Merriweather', Georgia, serif;
    margin: 0;
    max-width: 100%;
  }

  /* === A bit of a gross hack so we can have bleeding divs/blockquotes. */

  div {
    width: 100%;
  }

  div img {
    width: 100%;
  }

  blockquote p {
    font-size: 1.5rem;
    font-style: italic;
    margin: 1rem auto 1rem;
    max-width: 48rem;
  }

  li {
    margin-left: 2rem;
  }

  /* Counteract the specificity of the gross *:not() chain. */

  h1 {
    padding: 4rem 0 !important;
  }

  /*  === End gross hack */

  p {
    height: auto;
    line-height: 1.45;
  }

  pre,
  code {
    font-family: Menlo, Monaco, 'Courier New', monospace;
  }

  pre {
    font-size: 0.8rem;
    overflow-x: auto;
    padding: 1.125em;
  }

  a,
  a:visited {
    color: #3498db;
  }

  a:hover,
  a:focus,
  a:active {
    color: #2980b9;
  }
`

export const Message = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  padding-bottom: 1rem;

  p {
    margin: 0;
  }
`

export const MessageTimestamp = styled.time`
  font-size: 0.75rem;
`

export const MessageWrap = styled.div`
  padding-bottom: 2rem;
`

export const Form = styled.form`
  width: 95%;
  max-width: 1440px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;

  .MuiFormControl-root {
    margin-bottom: 2rem;
  }
`

export const MessageScreen = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-flow: wrap;
  position: relative;
  @media screen and (max-width: 750px) {
    flex-direction: column;
    align-items: center;
  }
`

export const GroupSelectAndInput = styled.div`
  flex-grow: 0;
  height: 50vh;
  position: sticky;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  top: 0;
  @media screen and (max-width: 750px) {
    flex-grow: 1;
    width: 100%;
    height: unset;
  }
`

export const MessagesAndInput = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: 750px) {
    width: 100%;
  }
`
