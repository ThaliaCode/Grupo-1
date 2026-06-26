function CategoryChips({ categories, selectedCategory, onSelect }) {
    // Categorías predefinidas + las de la API
    const defaultCategories = [
        { strCategory: 'All', idCategory: 'all' },
        { strCategory: 'Vegan', idCategory: 'vegan' },
        { strCategory: 'Healthy', idCategory: 'healthy' },
        { strCategory: 'Seafood', idCategory: 'seafood' },
        { strCategory: 'Pasta', idCategory: 'pasta' },
        { strCategory: 'Dessert', idCategory: 'dessert' },
    ];

    // Merge con categorías reales de la API (limitadas a 6 visibles)
    const displayCategories = [
        defaultCategories[0], // All siempre primero
        ...categories.slice(0, 5).map(c => ({ strCategory: c.strCategory, idCategory: c.idCategory }))
    ];

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {displayCategories.map((category) => {
                    const isActive = selectedCategory === category.strCategory;
                    const isAll = category.strCategory === 'All';

                    return (
                        <button
                            key={category.idCategory}
                            onClick={() => onSelect(category.strCategory)}
                            className={`
                flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
                ${isActive
                                    ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/25'
                                    : isAll
                                        ? 'bg-white dark:bg-surface-dark text-brand-neutral dark:text-white border border-border dark:border-border-dark hover:border-brand-primary hover:text-brand-primary'
                                        : 'bg-white dark:bg-surface-dark text-text-secondary border border-border dark:border-border-dark hover:border-brand-secondary hover:text-brand-secondary'
                                }
              `}
                        >
                            {isAll && <span className="font-icons text-sm">grid_view</span>}
                            {category.strCategory}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

export default CategoryChips;