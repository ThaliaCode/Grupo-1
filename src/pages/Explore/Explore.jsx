import { useState, useEffect, useCallback } from 'react';
import FilterSidebar from './FilterSidebar';
import RecipeGrid from './RecipeGrid';

const API_BASE = 'https://www.themealdb.com/api/json/v1/1';

function Explore({ favorites, toggleFavorite, onRecipeClick }) {
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    const [activeFilters, setActiveFilters] = useState({
        category: 'All',
        area: '',
        ingredient: '',
        search: '',
    });

    // ─── Búsqueda por texto ───
    const performSearch = useCallback(async (query) => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/search.php?s=${encodeURIComponent(query)}`);
            const data = await res.json();
            const meals = data.meals || [];
            setFilteredRecipes(meals);
            setTotalResults(meals.length);
            setCurrentPage(1);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // ─── Cargar datos iniciales ───
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);

                const catRes = await fetch(`${API_BASE}/categories.php`);
                const catData = await catRes.json();
                setCategories(catData.categories || []);

                const areaRes = await fetch(`${API_BASE}/list.php?a=list`);
                const areaData = await areaRes.json();
                setAreas(areaData.meals?.map(a => a.strArea) || []);

                const homeSearch = sessionStorage.getItem('home-search');
                if (homeSearch) {
                    setActiveFilters(prev => ({ ...prev, search: homeSearch }));
                    sessionStorage.removeItem('home-search');
                    await performSearch(homeSearch);
                } else {
                    const allRes = await fetch(`${API_BASE}/search.php?s=`);
                    const allData = await allRes.json();
                    const meals = allData.meals || [];
                    setFilteredRecipes(meals);
                    setTotalResults(meals.length);
                }

            } catch (error) {
                console.error('Error loading explore data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [performSearch]);

    // ─── Aplicar filtros combinados ───
    const applyFilters = useCallback(async (filters) => {
        setActiveFilters(filters);
        setLoading(true);
        setCurrentPage(1);

        try {
            let meals = [];

            if (filters.category && filters.category !== 'All') {
                const res = await fetch(`${API_BASE}/filter.php?c=${encodeURIComponent(filters.category)}`);
                const data = await res.json();
                meals = data.meals || [];
            } else if (filters.area) {
                const res = await fetch(`${API_BASE}/filter.php?a=${encodeURIComponent(filters.area)}`);
                const data = await res.json();
                meals = data.meals || [];
            } else if (filters.search) {
                await performSearch(filters.search);
                return;
            } else {
                const res = await fetch(`${API_BASE}/search.php?s=`);
                const data = await res.json();
                meals = data.meals || [];
            }

            if (filters.ingredient && meals.length > 0) {
                const detailPromises = meals.slice(0, 25).map(m =>
                    fetch(`${API_BASE}/lookup.php?i=${m.idMeal}`).then(r => r.json())
                );
                const details = await Promise.all(detailPromises);
                const fullMeals = details.map(d => d.meals?.[0]).filter(Boolean);

                meals = fullMeals.filter(meal => {
                    for (let i = 1; i <= 20; i++) {
                        const ing = meal[`strIngredient${i}`];
                        if (ing && ing.toLowerCase().includes(filters.ingredient.toLowerCase())) {
                            return true;
                        }
                    }
                    return false;
                });
            } else if (meals.length > 0 && !meals[0].strCategory) {
                const detailPromises = meals.slice(0, 25).map(m =>
                    fetch(`${API_BASE}/lookup.php?i=${m.idMeal}`).then(r => r.json())
                );
                const details = await Promise.all(detailPromises);
                meals = details.map(d => d.meals?.[0]).filter(Boolean);
            }

            setFilteredRecipes(meals);
            setTotalResults(meals.length);

        } catch (error) {
            console.error('Filter error:', error);
        } finally {
            setLoading(false);
        }
    }, [performSearch]);

    // Breadcrumbs
    const getBreadcrumbs = () => {
        const crumbs = [{ label: 'Explore', active: false }];
        if (activeFilters.category !== 'All') {
            crumbs.push({ label: activeFilters.category, active: true });
        } else if (activeFilters.area) {
            crumbs.push({ label: activeFilters.area, active: true });
        } else if (activeFilters.search) {
            crumbs.push({ label: `"${activeFilters.search}"`, active: true });
        } else {
            crumbs.push({ label: 'All Recipes', active: true });
        }
        return crumbs;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="lg:w-64 flex-shrink-0">
                    <FilterSidebar
                        categories={categories}
                        areas={areas}
                        activeFilters={activeFilters}
                        onFilterChange={applyFilters}
                    />
                </aside>

                <main className="flex-1 min-w-0">
                    <nav className="mb-4">
                        <ol className="flex items-center gap-2 text-sm">
                            {getBreadcrumbs().map((crumb, index) => (
                                <li key={crumb.label} className="flex items-center gap-2">
                                    {index > 0 && (
                                        <span className="font-icons text-gray-400 text-xs">chevron_right</span>
                                    )}
                                    <span className={crumb.active ? 'text-[#e63946] font-medium' : 'text-gray-500'}>
                                        {crumb.label}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </nav>

                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-[#121212] dark:text-white">
                            Curated Recipes
                        </h1>
                        <span className="text-sm text-gray-500">
                            Showing {Math.min((currentPage - 1) * 12 + 1, totalResults)} - {Math.min(currentPage * 12, totalResults)} of {totalResults} results
                        </span>
                    </div>

                    <RecipeGrid
                        recipes={filteredRecipes}
                        favorites={favorites}
                        toggleFavorite={toggleFavorite}
                        onRecipeClick={onRecipeClick}
                        loading={loading}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        itemsPerPage={12}
                    />
                </main>
            </div>
        </div>
    );
}

export default Explore;