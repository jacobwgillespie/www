import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import {GlobalStyle} from './GlobalStyle'

const Header = styled.header.attrs({
  children: <Link href="/">Jacob Gillespie</Link>,
})`
  font-variant: small-caps;
  font-weight: 500;
  font-size: 1.61111111em;
  line-height: 1.72413793em;
  margin-top: 0.86206897em;
  margin-bottom: 1.5em;

  a,
  a:visited {
    color: inherit;
    position: relative;
    text-decoration: none;
    text-shadow: 2px 2px white, 2px -2px white, -2px 2px white, -2px -2px white;
  }

  a::after {
    background: #d73a49;
    background: linear-gradient(
      90deg,
      #d73a49 0%,
      #d73a49 20%,
      #ffd33d 20%,
      #ffd33d 40%,
      #28a745 40%,
      #28a745 60%,
      #0366d6 60%,
      #0366d6 80%,
      #6f42c1 80%
    );
    bottom: 4px;
    content: '';
    height: 4px;
    left: 0;
    position: absolute;
    width: 100%;
    z-index: -1;
  }
`

const Footer = styled.footer.attrs({
  children: <>Copyright &copy; {new Date().getFullYear()} Jacob Gillespie. All Rights Reserved.</>,
})`
  margin-top: 1.5em;
  font-size: small;
  color: #333;
  border-top: 1px solid #efefef;
  padding-top: 1.5em;
`

export const Layout = ({title, children}) => {
  return (
    <div>
      <GlobalStyle />
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
