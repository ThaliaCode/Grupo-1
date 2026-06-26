/**
 * Formatea los ingredientes y medidas de un plato de TheMealDB
 * de campos planos (strIngredient1...20) a un arreglo iterable.
 * @param {Object} meal - Objeto meal de la API
 * @returns {Array} Arreglo de objetos { id, name, measure }
 */
export function formatMealIngredients(meal) {
    if (!meal) return [];
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const name = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (name && name.trim() !== "") {
            ingredients.push({
                id: i,
                name: name.trim(),
                measure: measure ? measure.trim() : ""
            });
        }
    }
    return ingredients;
}

/**
 * Extrae las instrucciones como un arreglo de pasos numerados.
 * Divide por saltos de línea o números seguidos de punto.
 * @param {string} instructions - Texto crudo de strInstructions
 * @returns {Array} Arreglo de pasos limpios
 */
export function formatInstructions(instructions) {
    if (!instructions) return [];
    return instructions
        .split(/\r?\n|\.\s+(?=[A-Z])|(?<=\d)\.\s+/)
        .map(step => step.trim())
        .filter(step => step.length > 3 && !/^\d+$/.test(step));
}

/**
 * Obtiene la URL del video de YouTube embebido.
 * @param {string} youtubeUrl - URL de YouTube (watch o embed)
 * @returns {string|null} URL embebida o null
 */
export function getEmbedUrl(youtubeUrl) {
    if (!youtubeUrl) return null;
    const match = youtubeUrl.match(/(?:v=|\/embed\/|\/v\/|youtu\.be\/)([^&\n?#]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}