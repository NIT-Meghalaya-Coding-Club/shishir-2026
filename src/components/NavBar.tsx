import React from 'react';
import NavBarItem from './NavBarItem';

const NavBar: React.FC = () => {
    return (
        <nav className="fixed z-50 w-full px-4 py-6">
            <ul className='flex flex-wrap justify-center gap-4 md:gap-6'>
                <NavBarItem to="/" text='Home' />
                <NavBarItem to="/events" text='Events' />
                <NavBarItem to="/competitions" text='Competitions' />
                <NavBarItem to="/schedule" text='Schedule' />
                <NavBarItem to="/sponsors" text='Sponsors' />
                <NavBarItem to="/contact-us" text='Contact Us' />
            </ul>
        </nav>
    );
};

export default NavBar;