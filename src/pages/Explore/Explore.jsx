import { useState, useEffect, useCallback, useRef } from 'react';
import FilterSidebar from './FilterSidebar';
import RecipeGrid from './RecipeGrid';
import { fetchMealsByFirstLetter, getAllMeals, getMealCatalog, searchMealsByName } from '../../utils/mealApi';

const DEFAULT_FILTERS = {
    category: 'All',
    area: '',
    ingredient: '',
    search: '',
};

const mealHasIngredient = (meal, ingredient) => {
    const normalizedIngredient = ingredient.toLowerCase();

    for (let i = 1; i <= 20; i++) {
        const mealIngredient = meal[`strIngredient${i}`];
        if (mealIngredient?.toLowerCase().includes(normalizedIngredient)) {
            return true;
        }
    }

    return false;
};

const filterMeals = (meals, filters) => {
    let filteredMeals = meals;

    if (filters.category && filters.category !== 'All') {
        filteredMeals = filteredMeals.filter((meal) => meal.strCategory === filters.category);
    }

    if (filters.area) {
        filteredMeals = filteredMeals.filter((meal) => meal.strArea === filters.area);
    }

    if (filters.ingredient) {
        filteredMeals = filteredMeals.filter((meal) => mealHasIngredient(meal, filters.ingredient));
    }

    return filteredMeals;
};

function Explore({ favorites, toggleFavorite, onRecipeClick }) {
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [activeFilters, setActiveFilters] = useState(DEFAULT_FILTERS);
    const initialLoadDone = useRef(false);

    const updateRecipes = (meals) => {
        setFilteredRecipes(meals);
        setTotalResults(meals.length);
        setCurrentPage(1);
    };

    // THALIA - Loads recipes using the correct endpoint according to the selected filter.
const loadRecipesForFilters = useCallback(async (filters) => {
    // THALIA - Search by recipe name.
    if (filters.search) {
        return await searchMealsByName(filters.search);
    }

    // THALIA - Filter by category, for example Dessert, Beef or Chicken.
    if (filters.category && filters.category !== 'All') {
        const res = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?c=${filters.category}`
        );
        const data = await res.json();
        const meals = data.meals || [];

        const detailPromises = meals.map((meal) =>
            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
                .then((res) => res.json())
        );

        const details = await Promise.all(detailPromises);

        return details.map((item) => item.meals?.[0]).filter(Boolean);
    }

    // THALIA - Filter by cuisine/area, for example Italian, Mexican or Japanese.
    if (filters.area) {
        const res = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?a=${filters.area}`
        );
        const data = await res.json();
        const meals = data.meals || [];

        const detailPromises = meals.map((meal) =>
            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
                .then((res) => res.json())
        );

        const details = await Promise.all(detailPromises);

        return details.map((item) => item.meals?.[0]).filter(Boolean);
    }

    // THALIA - Default load when there is no active filter.
    return await getAllMeals();
}, []);

    useEffect(() => {
        if (initialLoadDone.current) {
            return;
        }

        initialLoadDone.current = true;

        const fetchInitialData = async () => {
            try {
                setLoading(true);

                const catalog = await getMealCatalog();
                setCategories(catalog.categories);
                setAreas(catalog.areas);

                const homeFilter = sessionStorage.getItem('home-filter');
                if (homeFilter) {
                    const parsedFilter = JSON.parse(homeFilter);
                    const nextFilters = { ...DEFAULT_FILTERS, ...parsedFilter };
                    setActiveFilters(nextFilters);
                    sessionStorage.removeItem('home-filter');
                    updateRecipes(await loadRecipesForFilters(nextFilters));
                    return;
                }

                const homeSearch = sessionStorage.getItem('home-search');
                if (homeSearch) {
                    const nextFilters = { ...DEFAULT_FILTERS, search: homeSearch };
                    setActiveFilters(nextFilters);
                    sessionStorage.removeItem('home-search');
                    updateRecipes(await loadRecipesForFilters(nextFilters));
                    return;
                }

                const meals = await fetchMealsByFirstLetter('a');
                updateRecipes(meals);
            } catch (error) {
                console.error('Error loading explore data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [loadRecipesForFilters]);

    const applyFilters = useCallback(async (filters) => {
        setActiveFilters(filters);
        setLoading(true);

        try {
            updateRecipes(await loadRecipesForFilters(filters));
        } catch (error) {
            console.error('Filter error:', error);
        } finally {
            setLoading(false);
        }
    }, [loadRecipesForFilters]);

    const getBreadcrumbs = () => {
        const crumbs = [{ label: 'Explore', active: false }];
        if (activeFilters.category !== 'All') {
            crumbs.push({ label: activeFilters.category, active: true });
        } else if (activeFilters.area) {
            crumbs.push({ label: activeFilters.area, active: true });
        } else if (activeFilters.ingredient) {
            crumbs.push({ label: activeFilters.ingredient, active: true });
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
                <aside className="lg:w-64 shrink-0">
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
                                    <span className={crumb.active ? 'text-brand-primary font-medium' : 'text-gray-500'}>
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
                            Showing {totalResults === 0 ? 0 : Math.min((currentPage - 1) * 12 + 1, totalResults)} - {Math.min(currentPage * 12, totalResults)} of {totalResults} results
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