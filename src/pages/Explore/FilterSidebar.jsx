import { useState, useEffect } from 'react';

function FilterSidebar({ categories, areas, activeFilters, onFilterChange }) {
    // 1. Estados para los inputs de búsqueda visual en el Sidebar
    const [categorySearch, setCategorySearch] = useState('');
    const [areaSearch, setAreaSearch] = useState('');
    const [ingredientInput, setIngredientInput] = useState(activeFilters.ingredient);

    // Sincronizar el ingrediente si cambia de forma externa
    useEffect(() => {
        setIngredientInput(activeFilters.ingredient);
    }, [activeFilters.ingredient]);

    const categoryOptions = [
        { id: 'all', label: 'All Recipes' },
        ...categories.map(c => ({ id: c.strCategory, label: c.strCategory }))
    ];

    // 2. Filtrar opciones de categorías en base al input de texto interno
    const filteredCategoryOptions = categoryOptions.filter(cat => 
        cat.label.toLowerCase().includes(categorySearch.toLowerCase())
    );

    // 3. Filtrar opciones de gastronomía (Cuisine) en base al input de texto interno
    const filteredAreas = areas.filter(area => 
        area.toLowerCase().includes(areaSearch.toLowerCase())
    );

    const handleCategoryClick = (category) => {
        onFilterChange({
            ...activeFilters,
            category: category,
            area: '',
            ingredient: '',
            search: '',
        });
    };

    const handleAreaClick = (area) => {
        const newArea = activeFilters.area === area ? '' : area;
        onFilterChange({
            ...activeFilters,
            area: newArea,
            category: 'All',
            ingredient: '',
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

            {/* Categories Section */}
            <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Categories
                </h3>
                {/* Input buscador de categorías */}
                <div className="relative mb-3">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-icons text-gray-400 text-xs">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Search category..."
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-md text-xs text-[#121212] dark:text-white placeholder-gray-400 outline-none focus:border-brand-primary transition-all"
                    />
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                    {filteredCategoryOptions.map((cat) => {
                        const isSelected = activeFilters.category === (cat.id === 'all' ? 'All' : cat.label);
                        return (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => handleCategoryClick(cat.id === 'all' ? 'All' : cat.label)}
                                className={`flex items-center gap-3 w-full px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                    isSelected
                                        ? 'bg-brand-primary/10 text-brand-primary font-medium'
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#121212] dark:hover:text-white'
                                }`}
                            >
                                <span className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                    isSelected
                                        ? 'bg-brand-primary border-brand-primary'
                                        : 'border-gray-300 dark:border-gray-600'
                                }`}>
                                    {isSelected && (
                                        <span className="font-icons text-white text-xs">check</span>
                                    )}
                                </span>
                                {cat.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Cuisine / Areas Section */}
            <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Cuisine
                </h3>
                {/* Input buscador de regiones/cuisine */}
                <div className="relative mb-3">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-icons text-gray-400 text-xs">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Search cuisine..."
                        value={areaSearch}
                        onChange={(e) => setAreaSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-md text-xs text-[#121212] dark:text-white placeholder-gray-400 outline-none focus:border-brand-primary transition-all"
                    />
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                    {filteredAreas.map((area) => {
                        const isSelected = activeFilters.area === area;
                        return (
                            <button
                                key={area}
                                type="button"
                                onClick={() => handleAreaClick(area)}
                                className={`flex items-center gap-3 w-full px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                    isSelected
                                        ? 'bg-brand-primary/10 text-brand-primary font-medium'
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#121212] dark:hover:text-white'
                                }`}
                            >
                                <span className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                    isSelected
                                        ? 'bg-brand-primary border-brand-primary'
                                        : 'border-gray-300 dark:border-gray-600'
                                }`}>
                                    {isSelected && (
                                        <span className="font-icons text-white text-xs">check</span>
                                    )}
                                </span>
                                {area}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Ingredient Section */}
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
                            <button type="button" onClick={clearIngredient} className="font-icons text-xs hover:text-red-600">
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
