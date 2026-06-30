const API_BASE = 'https://www.themealdb.com/api/json/v1/1';
const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');

let allMealsCache = null;

// CORREGIDO: Se cambiaron las comillas de las URLs a Backticks (``)
export const fetchRandomMeal = async () => {
    const resultados = await fetch(`${API_BASE}/random.php`);
    const data = await resultados.json();
    return data.meals?.[0] || null;
};

export const fetchMealsByFirstLetter = async (letter) => {
    const resultados = await fetch(`${API_BASE}/search.php?f=${encodeURIComponent(letter)}`);
    const data = await resultados.json();
    return data.meals || [];
};

export const searchMealsByName = async (query) => {
    const resultados = await fetch(`${API_BASE}/search.php?s=${encodeURIComponent(query)}`);
    const data = await resultados.json();
    return data.meals || [];
};

// ... El resto de tus funciones (getAllMeals y getMealCatalog) quedan igual


export const getAllMeals = async () => {
    if (allMealsCache) {
        return allMealsCache;
    }

    const results = await Promise.all(LETTERS.map(fetchMealsByFirstLetter));
    const uniqueMeals = new Map();

    results.flat().forEach((meal) => {
        if (meal?.idMeal) {
            uniqueMeals.set(meal.idMeal, meal);
        }
    });

    allMealsCache = Array.from(uniqueMeals.values());
    return allMealsCache;
};

export const getMealCatalog = async () => {
    const meals = await getAllMeals();

    const categories = [...new Set(meals.map((meal) => meal.strCategory).filter(Boolean))]
        .sort()
        .map((category) => ({
            strCategory: category,
            idCategory: category.toLowerCase().replace(/\s+/g, '-'),
        }));

    const areas = [...new Set(meals.map((meal) => meal.strArea).filter(Boolean))].sort();

    return { categories, areas };
};

//  -Obtiene todos los detalles de la receta por ID.
export const getMealById = async (id) => {
    const resultados = await fetch(`${API_BASE}/lookup.php?i=${encodeURIComponent(id)}`);
    const data = await resultados.json();

    return data.meals?.[0] || null;
};

//  - Obtiene recetas por categoría con todos los detalles.
export const getMealsByCategory = async (category) => {
    const resultados = await fetch(`${API_BASE}/filter.php?c=${encodeURIComponent(category)}`);
    const data = await resultados.json();

    return data.meals || [];
};

// - Obtiene recetas por tipo de cocina/región con todos los detalles.
export const getMealsByArea = async (area) => {
    const resultados = await fetch(`${API_BASE}/filter.php?a=${encodeURIComponent(area)}`);
    const data = await resultados.json();
    const meals = data.meals || [];

    const details = await Promise.all(
        meals.map((meal) => getMealById(meal.idMeal))
    );

    return details.filter(Boolean);
};