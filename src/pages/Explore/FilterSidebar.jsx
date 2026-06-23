import { useState } from 'react';

function FilterSidebar({ categories, areas, activeFilters, onFilterChange }) {
    const [ingredientInput, setIngredientInput] = useState(activeFilters.ingredient);
    const [activeCategory, setActiveCategory] = useState(activeFilters.category);
    const [activeArea, setActiveArea] = useState(activeFilters.area);

    const categoryOptions = [
        { id: 'all', label: 'All Recipes' },
        ...categories.map(c => ({ id: c.strCategory, label: c.strCategory }))
    ];

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
        setActiveArea('');
        onFilterChange({
            ...activeFilters,
            category: category,
            area: '',
            search: '',
        });
    };

    const handleAreaClick = (area) => {
        const newArea = activeArea === area ? '' : area;
        setActiveArea(newArea);
        setActiveCategory('All');
        onFilterChange({
            ...activeFilters,
            area: newArea,
            category: 'All',
            search: '',
        });
    };

    const handleIngredientSearch = (e) => {
        e.preventDefault();
        if (ingredientInput.trim()) {
            onFilterChange({
                ...activeFilters,
                ingredient: ingredientInput.trim(),
                category: 'All',
                area: '',
                search: '',
            });
        }
    };

    const clearIngredient = () => {
        setIngredientInput('');
        onFilterChange({
            ...activeFilters,
            ingredient: '',
        });
    };

    // ELIMINADA: const hasActiveIngredient = ... (no se usaba)

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-lg font-bold text-[#121212] dark:text-white mb-1">
                    Filters
                </h2>
                <p className="text-sm text-gray-500">
                    Refine your culinary journey.
                </p>
            </div>

            {/* Categories */}
            <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Categories
                </h3>
                <div className="space-y-1">
                    {categoryOptions.slice(0, 6).map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.id === 'all' ? 'All' : cat.label)}
                            className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors ${activeCategory === (cat.id === 'all' ? 'All' : cat.label)
                                ? 'bg-brand-primary/10 text-brand-primary font-medium'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#121212] dark:hover:text-white'
                                }`}
                        >
                            <span className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${activeCategory === (cat.id === 'all' ? 'All' : cat.label)
                                ? 'bg-brand-primary border-brand-primary'
                                : 'border-gray-300 dark:border-gray-600'
                                }`}>
                                {activeCategory === (cat.id === 'all' ? 'All' : cat.label) && (
                                    <span className="font-icons text-white text-xs">check</span>
                                )}
                            </span>
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Cuisine */}
            <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Cuisine
                </h3>
                <div className="space-y-1">
                    {areas.slice(0, 8).map((area) => (
                        <button
                            key={area}
                            onClick={() => handleAreaClick(area)}
                            className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors ${activeArea === area
                                ? 'bg-brand-primary/10 text-brand-primary font-medium'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#121212] dark:hover:text-white'
                                }`}
                        >
                            <span className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${activeArea === area
                                ? 'bg-brand-primary border-brand-primary'
                                : 'border-gray-300 dark:border-gray-600'
                                }`}>
                                {activeArea === area && (
                                    <span className="font-icons text-white text-xs">check</span>
                                )}
                            </span>
                            {area}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Ingredient */}
            <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Main Ingredient
                </h3>
                <form onSubmit={handleIngredientSearch} className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-icons text-gray-400 text-sm">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="e.g. Chicken, Tofu"
                        value={ingredientInput}
                        onChange={(e) => setIngredientInput(e.target.value)}
                        className="w-full pl-9 pr-8 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-[#121212] dark:text-white placeholder-gray-400 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 transition-all"
                    />
                    {ingredientInput && (
                        <button
                            type="button"
                            onClick={clearIngredient}
                            className="absolute right-3 top-1/2 -translate-y-1/2 font-icons text-gray-400 hover:text-brand-primary text-sm"
                        >
                            close
                        </button>
                    )}
                </form>

                {activeFilters.ingredient && (
                    <div className="mt-3 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-primary/10 text-brand-primary text-xs font-medium rounded-full">
                            {activeFilters.ingredient}
                            <button onClick={clearIngredient} className="font-icons text-xs hover:text-red-600">
                                close
                            </button>
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FilterSidebar;