import { useState } from 'react';

function Navbar({ currentView, onNavigate, favoritesCount }) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDark, setIsDark] = useState(false);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 

    const toggleDarkMode = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle('dark');
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            sessionStorage.setItem('home-search', searchQuery.trim());
            onNavigate('explore');
            // El query se puede pasar vía estado global o URL params
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const navLinks = [
        { id: 'home', label: 'GourmetConnect' },
        { id: 'explore', label: 'Explore' },
        { id: 'favorites', label: 'Favorites' },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-surface/90 dark:bg-surface-dark/90 backdrop-blur-md border-b border-border dark:border-border-dark transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* ─── Logo / Home ─── */}
                    <button
                        onClick={() => onNavigate('home')}
                        className="flex items-center gap-2 group"
                    >
                        <span className="font-icons text-brand-primary text-2xl">restaurant</span>
                        <span className={`text-lg font-bold tracking-tight transition-colors ${currentView === 'home'
                                ? 'text-brand-primary'
                                : 'text-brand-neutral dark:text-white group-hover:text-brand-primary'
                            }`}>
                            GourmetConnect
                        </span>
                    </button>

                    {/* ─── Links Centrales ─── */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.slice(1).map((link) => (
                            <button
                                key={link.id}
                                onClick={() => onNavigate(link.id)}
                                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${currentView === link.id
                                        ? 'text-brand-primary bg-brand-primary/10'
                                        : 'text-text-secondary dark:text-gray-400 hover:text-brand-neutral dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                                    }`}
                            >
                                {link.label}
                                {link.id === 'favorites' && favoritesCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {favoritesCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* ─── Iconos de Acción ─── */}
                    <div className="flex items-center gap-2">
                        {/* Búsqueda */}
                        <div className="relative">
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="p-2 rounded-lg text-text-secondary dark:text-gray-400 hover:text-brand-primary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                            >
                                <span className="font-icons text-xl">search</span>
                            </button>

                            {/* Dropdown de búsqueda */}
                            {isSearchOpen && (
                                <form
                                    onSubmit={handleSearchSubmit}
                                    className="fixed left-2 right-2 top-16 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-72 z-50 bg-surface dark:bg-surface-dark rounded-xl shadow-xl border border-border dark:border-border-dark p-3 animate-in fade-in slide-in-from-top-2"
                                >
                                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 rounded-lg px-3 py-2">
                                        <span className="font-icons text-text-muted text-lg">search</span>
                                        <input
                                            type="text"
                                            placeholder="Search recipes..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="flex-1 bg-transparent text-sm text-text-primary dark:text-white placeholder-text-muted outline-none"
                                            autoFocus
                                        />
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Modo Oscuro */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg text-text-secondary dark:text-gray-400 hover:text-brand-primary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            <span className="font-icons text-xl">
                                {isDark ? 'light_mode' : 'dark_mode'}
                            </span>
                        </button>

                        {/* Menú móvil (hamburger) */}
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-text-secondary dark:text-gray-400 hover:text-brand-primary hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                            <span className="font-icons text-xl">
                                    {isMobileMenuOpen ? 'close' : 'menu'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

                         {/* ─── Menú móvil desplegable ─── */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-border dark:border-border-dark bg-surface dark:bg-surface-dark px-4 py-3 flex flex-col gap-1">
                    {navLinks.slice(1).map((link) => (
                        <button
                            key={link.id}
                            onClick={() => {
                                onNavigate(link.id);
                                setIsMobileMenuOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                                currentView === link.id
                                    ? 'text-brand-primary bg-brand-primary/10'
                                    : 'text-text-secondary dark:text-gray-400 hover:text-brand-neutral dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                            }`}
                        >
                            {link.label}
                            {link.id === 'favorites' && favoritesCount > 0 && (
                                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 bg-brand-primary text-white text-[10px] font-bold rounded-full">
                                    {favoritesCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}


            {/* Overlay para cerrar búsqueda al hacer click fuera */}
            {isSearchOpen && (
                <div
                    className="fixed inset-0 z-[-1]"
                    onClick={() => setIsSearchOpen(false)}
                />
            )}
        </nav>
    );
}

export default Navbar;