'use client';

import { useContext } from 'react';
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { UserContext } from '../lib/context/user';
 
const Nav = () => {
  const {user} = useContext(UserContext);
  const pathname = usePathname();
 
  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark justify-content-between px-3">
      <div>
        <Link className={`navbar-brand ${pathname === '/' ? 'active' : ''}`} href="/">
          Ticketing
        </Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
      </div>
      <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul className="navbar-nav">
          {!user && (
            <>
              <li className={`nav-item ${pathname === '/sign-up' ? 'active' : ''}`}>
                <Link className="nav-link" href="/sign-up">
                  Sign up
                </Link>
              </li>
              <li className={`nav-item ${pathname === '/sign-in' ? 'active' : ''}`}>
                <Link className="nav-link" href="/sign-in">
                  Sign in
                </Link>
              </li>
            </>
          )}
          {user && (
            <li className={`nav-item ${pathname === '/sign-out' ? 'active' : ''}`}>
              <Link className="nav-link" href="/sign-out">
                Sign out
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Nav;