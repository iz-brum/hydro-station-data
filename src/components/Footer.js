import React from 'react';

const Footer = ({ siteName = 'HidroInfo' }) => {
    const year = new Date().getFullYear();
    return (
        <footer className="home-footer">
            <p>© {year} {siteName}. Todos os direitos reservados.</p>
        </footer>
    );
};

export default Footer;
