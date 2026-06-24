function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        { label: 'Recipes', href: '#' },
        { label: 'Chefs', href: '#' },
        { label: 'About Us', href: '#' },
        { label: 'Privacy Policy', href: '#' },
    ];

    return (
        <footer className="bg-white dark:bg-surface-dark border-t border-border dark:border-border-dark transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* ─── Logo + Copyright ─── */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-2">
                            <span className="font-icons text-brand-primary text-xl">restaurant</span>
                            <span className="text-lg font-bold text-brand-primary">
                                GourmetConnect
                            </span>
                        </div>
                        <span className="text-sm text-text-muted">
                            &copy; {currentYear} GourmetConnect. All rights reserved.
                        </span>
                    </div>

                    {/* ─── Links ─── */}
                    <div className="flex items-center gap-6">
                        {footerLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-sm text-text-secondary dark:text-gray-400 hover:text-brand-primary dark:hover:text-white transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;