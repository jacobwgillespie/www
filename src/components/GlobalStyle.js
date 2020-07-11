import {createGlobalStyle} from 'styled-components'

export const GlobalStyle = createGlobalStyle`
html {
  font-size: 18px;
  line-height: 27px;
}

body {
  font-family: 'Iowan Old Style', 'Sitka Text', Palatino, 'Book Antiqua', serif;
  font-size: 1em;
  line-height: 1.5em;
  max-width: 700px;
  padding: 2em;
  padding-left: 150px;
}

@media (max-width: 1000px) {
  body {
  padding-left: 2em;
  margin: 0 auto;
  }
}

h1 {
  font-size: 1.94444444em;
  line-height: 1.54285714em;
  margin-top: 0.77142857em;
  margin-bottom: 1.54285714em;
}

h2 {
  font-size: 1.55555556em;
  line-height: 1.92857143em;
  margin-top: 0.96428571em;
  margin-bottom: 0.96428571em;
}

h3 {
  font-size: 1.27777778em;
  line-height: 1.17391304em;
  margin-top: 1.17391304em;
  margin-bottom: 0em;
}

h4 {
  font-size: 1em;
  line-height: 1.5em;
  margin-top: 1.5em;
  margin-bottom: 0em;
}

h5 {
  font-size: 1em;
  line-height: 1.5em;
  margin-top: 1.5em;
  margin-bottom: 0em;
}

p,
ul,
ol,
hr,
img,
pre,
table,
blockquote {
  margin-top: 0em;
  margin-bottom: 1.5em;
}

ul ul,
ol ol,
ul ol,
ol ul {
  margin-top: 0em;
  margin-bottom: 0em;
}

a,
b,
i,
strong,
em,
small,
code {
  line-height: 0;
}

sub,
sup {
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sup {
  top: -0.5em;
}

sub {
  bottom: -0.25em;
}

a {
  color: #06c;
  text-decoration: none;
}

a:visited {
    color: #06c;
  }

blockquote {
  margin-left: 0;
  padding-left: 1em;
  padding-top: 0.19444444em;
  border-left: 4px solid #000;
}

hr {
  border: 0;
  background-color: #efefef;
  height: 1px;
}

.gatsby-resp-image-wrapper {
  max-width: 100%;
  margin: 0 auto;
  margin-bottom: 1.5em;
  display: block;
}

pre {
  font-family: Hasklig, 'Source Code Pro', 'Courier New', Courier, monospace;
  padding: 2em;
  overflow-x: scroll;
}

p > code {
  background-color: #efefef;
  padding: 0 3px;
}

div.video {
  margin-bottom: 1.5em;
  overflow: hidden;
  padding-top: 56.25%;
  position: relative;
}

div.video iframe {
    border: 0;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }

pre.shiki-unknown {
  background-color: #24292e;
  color: #D1D5DA;
}

`
