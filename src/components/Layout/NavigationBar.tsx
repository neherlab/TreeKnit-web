import React from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import {
  Nav as NavBase,
  Navbar as NavbarBase,
  NavbarBrand as NavbarBrandBase,
  NavItem as NavItemBase,
} from 'reactstrap'

import LogoTreeKnitBase from 'src/assets/img/treeknit.svg'

import { Link } from 'src/components/Link/Link'

const navLinksLeft: Record<string, string> = {
  '/': 'Home',
  '/about': 'About',
}

export const Navbar = styled(NavbarBase)`
  position: sticky;
  height: 50px;
  top: 0;
  width: 100%;
  box-shadow: ${(props) => props.theme.shadows.medium};
  margin-bottom: 1rem;
  z-index: 100;
  background-color: ${(props) => props.theme.white};
  opacity: 1;
`

export const Nav = styled(NavBase)`
  margin-bottom: 4px;
  margin-right: auto;
`

export const NavItem = styled(NavItemBase)`
  padding: 0 1rem;
  flex-grow: 0;
  flex-shrink: 0;
`

export const NavLink = styled(Link)<{ $active: boolean }>`
  font-size: 1.1rem;
  color: ${({ $active, theme }) => ($active ? theme.primary : theme.bodyColor)};
  font-weight: ${({ $active }) => $active && 'bold'};
  text-decoration: ${({ $active }) => $active && 'underline'};
`

const NavbarBrand = styled(NavbarBrandBase)`
  height: 100%;
  padding: 0;
`

export const BrandText = styled.span`
  color: ${({ theme }) => theme.bodyColor};
  font-size: 1.66rem;
  font-weight: bold;
  text-align: center;
  vertical-align: middle;
`

const LogoTreeKnit = styled(LogoTreeKnitBase)`
  width: 32px;
  height: 32px;
  margin: 0 1rem;
`

export function NavigationBar() {
  const { pathname } = useRouter()
  return (
    <Navbar light role="navigation">
      <NavbarBrand tag={Link} href="/">
        <LogoTreeKnit />
        <BrandText>{'TreeKnit'}</BrandText>
      </NavbarBrand>
      <Nav>
        {Object.entries(navLinksLeft).map(([url, text]) => {
          return (
            <NavItem key={url}>
              <NavLink href={url} $active={url === pathname}>
                {text}
              </NavLink>
            </NavItem>
          )
        })}
      </Nav>
    </Navbar>
  )
}
