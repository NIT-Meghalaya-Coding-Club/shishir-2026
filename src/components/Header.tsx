import React from 'react';
import NavBarItem from './NavBarItem';

const Header: React.FC = () => {
    return (
        <nav>
            <ul className='fixed flex w-screen justify-center'>
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

export default Header;