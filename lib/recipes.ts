// Recipe and ingredient library for plan generation
// All macros are per 100g unless specified

export interface Ingredient {
  id: string
  name: string
  caloriesPer100g: number
  proteinPer100g: number
  carbsPer100g: number
  fatPer100g: number
  // Dietary tags
  isVegan?: boolean
  isVegetarian?: boolean
  isDairyFree?: boolean
  isGlutenFree?: boolean
  containsPork?: boolean
  containsSeafood?: boolean
  containsNuts?: boolean
  isHighProtein?: boolean
}

export interface Recipe {
  id: string
  name: string
  mealType: "breakfast" | "lunch" | "dinner" | "snack"
  description: string
  imageUrl: string
  imagePrompt: string // For future AI generation
  ingredients: Array<{
    ingredientId: string
    grams: number
  }>
  // Dietary tags
  isVegan?: boolean
  isVegetarian?: boolean
  isDairyFree?: boolean
  isGlutenFree?: boolean
  containsPork?: boolean
  containsSeafood?: boolean
  containsNuts?: boolean
  // Tags for preferences
  isHighProtein?: boolean
  isSimple?: boolean
  isEasyToCook?: boolean
}

// Ingredient database
export const INGREDIENTS: Record<string, Ingredient> = {
  "chicken-breast": {
    id: "chicken-breast",
    name: "Chicken Breast",
    caloriesPer100g: 165,
    proteinPer100g: 31,
    carbsPer100g: 0,
    fatPer100g: 3.6,
    isDairyFree: true,
    isGlutenFree: true,
  },
  "salmon": {
    id: "salmon",
    name: "Salmon",
    caloriesPer100g: 208,
    proteinPer100g: 20,
    carbsPer100g: 0,
    fatPer100g: 12,
    containsSeafood: true,
    isDairyFree: true,
    isGlutenFree: true,
  },
  "eggs": {
    id: "eggs",
    name: "Eggs",
    caloriesPer100g: 155,
    proteinPer100g: 13,
    carbsPer100g: 1.1,
    fatPer100g: 11,
    isVegetarian: true,
    isDairyFree: true,
    isGlutenFree: true,
  },
  "brown-rice": {
    id: "brown-rice",
    name: "Brown Rice",
    caloriesPer100g: 111,
    proteinPer100g: 2.6,
    carbsPer100g: 23,
    fatPer100g: 0.9,
    isVegan: true,
    isVegetarian: true,
    isDairyFree: true,
    isGlutenFree: true,
  },
  "quinoa": {
    id: "quinoa",
    name: "Quinoa",
    caloriesPer100g: 120,
    proteinPer100g: 4.4,
    carbsPer100g: 22,
    fatPer100g: 1.9,
    isVegan: true,
    isVegetarian: true,
    isDairyFree: true,
    isGlutenFree: true,
  },
  "sweet-potato": {
    id: "sweet-potato",
    name: "Sweet Potato",
    caloriesPer100g: 86,
    proteinPer100g: 1.6,
    carbsPer100g: 20,
    fatPer100g: 0.1,
    isVegan: true,
    isVegetarian: true,
    isDairyFree: true,
    isGlutenFree: true,
  },
  "broccoli": {
    id: "broccoli",
    name: "Broccoli",
    caloriesPer100g: 34,
    proteinPer100g: 2.8,
    carbsPer100g: 7,
    fatPer100g: 0.4,
    isVegan: true,
    isVegetarian: true,
    isDairyFree: true,
    isGlutenFree: true,
  },
  "spinach": {
    id: "spinach",
    name: "Spinach",
    caloriesPer100g: 23,
    proteinPer100g: 2.9,
    carbsPer100g: 3.6,
    fatPer100g: 0.4,
    isVegan: true,
    isVegetarian: true,
    isDairyFree: true,
    isGlutenFree: true,
  },
  "avocado": {
    id: "avocado",
    name: "Avocado",
    caloriesPer100g: 160,
    proteinPer100g: 2,
    carbsPer100g: 9,
    fatPer100g: 15,
    isVegan: true,
    isVegetarian: true,
    isDairyFree: true,
    isGlutenFree: true,
  },
  "greek-yogurt": {
    id: "greek-yogurt",
    name: "Greek Yogurt",
    caloriesPer100g: 59,
    proteinPer100g: 10,
    carbsPer100g: 3.6,
    fatPer100g: 0.4,
    isVegetarian: true,
    isGlutenFree: true,
  },
  "oatmeal": {
    id: "oatmeal",
    name: "Oatmeal",
    caloriesPer100g: 68,
    proteinPer100g: 2.4,
    carbsPer100g: 12,
    fatPer100g: 1.4,
    isVegetarian: true,
    isDairyFree: true,
    isGlutenFree: true,
  },
  "almonds": {
    id: "almonds",
    name: "Almonds",
    caloriesPer100g: 579,
    proteinPer100g: 21,
    carbsPer100g: 22,
    fatPer100g: 50,
    isVegan: true,
    isVegetarian: true,
    isDairyFree: true,
    isGlutenFree: true,
    containsNuts: true,
  },
  "banana": {
    id: "banana",
    name: "Banana",
    caloriesPer100g: 89,
    proteinPer100g: 1.1,
    carbsPer100g: 23,
    fatPer100g: 0.3,
    isVegan: true,
    isVegetarian: true,
    isDairyFree: true,
    isGlutenFree: true,
  },
  "protein-powder": {
    id: "protein-powder",
    name: "Protein Powder",
    caloriesPer100g: 370,
    proteinPer100g: 75,
    carbsPer100g: 5,
    fatPer100g: 5,
    isDairyFree: true,
    isGlutenFree: true,
    isHighProtein: true,
  },
  "whole-wheat-bread": {
    id: "whole-wheat-bread",
    name: "Whole Wheat Bread",
    caloriesPer100g: 247,
    proteinPer100g: 13,
    carbsPer100g: 41,
    fatPer100g: 4.2,
    isVegetarian: true,
  },
  "black-beans": {
    id: "black-beans",
    name: "Black Beans",
    caloriesPer100g: 132,
    proteinPer100g: 8.9,
    carbsPer100g: 24,
    fatPer100g: 0.5,
    isVegan: true,
    isVegetarian: true,
    isDairyFree: true,
    isGlutenFree: true,
  },
  "olive-oil": {
    id: "olive-oil",
    name: "Olive Oil",
    caloriesPer100g: 884,
    proteinPer100g: 0,
    carbsPer100g: 0,
    fatPer100g: 100,
    isVegan: true,
    isVegetarian: true,
    isDairyFree: true,
    isGlutenFree: true,
  },
}

// Recipe database
export const RECIPES: Recipe[] = [
  // Breakfast recipes
  {
    id: "protein-overnight-oats",
    name: "Protein Overnight Oats",
    mealType: "breakfast",
    description: "Creamy oats with protein powder and berries",
    imageUrl: "/images/meals/overnight-oats.jpg",
    imagePrompt: "A bowl of creamy overnight oats with fresh berries and a scoop of protein powder",
    ingredients: [
      { ingredientId: "oatmeal", grams: 80 },
      { ingredientId: "protein-powder", grams: 30 },
      { ingredientId: "banana", grams: 100 },
      { ingredientId: "almonds", grams: 20 },
    ],
    isHighProtein: true,
    isSimple: true,
    isEasyToCook: true,
    isDairyFree: true,
    isGlutenFree: true,
  },
  {
    id: "scrambled-eggs-avocado",
    name: "Scrambled Eggs with Avocado",
    mealType: "breakfast",
    description: "Fluffy scrambled eggs served with fresh avocado",
    imageUrl: "/images/meals/eggs-avocado.jpg",
    imagePrompt: "Fluffy scrambled eggs on a plate with sliced avocado and whole wheat toast",
    ingredients: [
      { ingredientId: "eggs", grams: 200 },
      { ingredientId: "avocado", grams: 100 },
      { ingredientId: "whole-wheat-bread", grams: 60 },
      { ingredientId: "olive-oil", grams: 5 },
    ],
    isHighProtein: true,
    isSimple: true,
    isEasyToCook: true,
    isVegetarian: true,
  },
  {
    id: "greek-yogurt-bowl",
    name: "Greek Yogurt Protein Bowl",
    mealType: "breakfast",
    description: "Greek yogurt topped with nuts and fruit",
    imageUrl: "/images/meals/yogurt-bowl.jpg",
    imagePrompt: "A bowl of Greek yogurt with fresh berries, almonds, and a drizzle of honey",
    ingredients: [
      { ingredientId: "greek-yogurt", grams: 200 },
      { ingredientId: "almonds", grams: 30 },
      { ingredientId: "banana", grams: 100 },
    ],
    isHighProtein: true,
    isSimple: true,
    isEasyToCook: true,
    isVegetarian: true,
    isGlutenFree: true,
  },
  // Lunch recipes
  {
    id: "chicken-rice-bowl",
    name: "Chicken & Rice Bowl",
    mealType: "lunch",
    description: "Grilled chicken with brown rice and steamed broccoli",
    imageUrl: "/images/meals/chicken-rice.jpg",
    imagePrompt: "A bowl with grilled chicken breast, brown rice, and steamed broccoli",
    ingredients: [
      { ingredientId: "chicken-breast", grams: 150 },
      { ingredientId: "brown-rice", grams: 150 },
      { ingredientId: "broccoli", grams: 200 },
      { ingredientId: "olive-oil", grams: 10 },
    ],
    isHighProtein: true,
    isSimple: true,
    isEasyToCook: true,
    isDairyFree: true,
    isGlutenFree: true,
  },
  {
    id: "quinoa-chicken-salad",
    name: "Quinoa Chicken Salad",
    mealType: "lunch",
    description: "Fresh quinoa salad with grilled chicken and vegetables",
    imageUrl: "/images/meals/quinoa-salad.jpg",
    imagePrompt: "A colorful quinoa salad bowl with grilled chicken, spinach, and vegetables",
    ingredients: [
      { ingredientId: "chicken-breast", grams: 120 },
      { ingredientId: "quinoa", grams: 150 },
      { ingredientId: "spinach", grams: 100 },
      { ingredientId: "avocado", grams: 80 },
      { ingredientId: "olive-oil", grams: 8 },
    ],
    isHighProtein: true,
    isDairyFree: true,
    isGlutenFree: true,
  },
  {
    id: "black-bean-bowl",
    name: "Black Bean Power Bowl",
    mealType: "lunch",
    description: "Protein-rich black beans with rice and vegetables",
    imageUrl: "/images/meals/bean-bowl.jpg",
    imagePrompt: "A colorful bowl with black beans, brown rice, avocado, and vegetables",
    ingredients: [
      { ingredientId: "black-beans", grams: 200 },
      { ingredientId: "brown-rice", grams: 120 },
      { ingredientId: "avocado", grams: 100 },
      { ingredientId: "spinach", grams: 80 },
    ],
    isVegan: true,
    isVegetarian: true,
    isDairyFree: true,
    isGlutenFree: true,
    isHighProtein: true,
    isSimple: true,
    isEasyToCook: true,
  },
  // Dinner recipes
  {
    id: "salmon-sweet-potato",
    name: "Salmon & Sweet Potato",
    mealType: "dinner",
    description: "Baked salmon with roasted sweet potato and greens",
    imageUrl: "/images/meals/salmon-sweet-potato.jpg",
    imagePrompt: "Baked salmon fillet with roasted sweet potato and steamed broccoli",
    ingredients: [
      { ingredientId: "salmon", grams: 150 },
      { ingredientId: "sweet-potato", grams: 200 },
      { ingredientId: "broccoli", grams: 150 },
      { ingredientId: "olive-oil", grams: 10 },
    ],
    isHighProtein: true,
    isDairyFree: true,
    isGlutenFree: true,
    containsSeafood: true,
  },
  {
    id: "chicken-quinoa-dinner",
    name: "Herb Chicken with Quinoa",
    mealType: "dinner",
    description: "Herb-crusted chicken with quinoa and vegetables",
    imageUrl: "/images/meals/chicken-quinoa.jpg",
    imagePrompt: "Herb-crusted chicken breast with quinoa and roasted vegetables",
    ingredients: [
      { ingredientId: "chicken-breast", grams: 180 },
      { ingredientId: "quinoa", grams: 150 },
      { ingredientId: "broccoli", grams: 150 },
      { ingredientId: "olive-oil", grams: 12 },
    ],
    isHighProtein: true,
    isDairyFree: true,
    isGlutenFree: true,
  },
  // Snack recipes
  {
    id: "protein-shake",
    name: "Protein Shake",
    mealType: "snack",
    description: "Quick protein shake with banana",
    imageUrl: "/images/meals/protein-shake.jpg",
    imagePrompt: "A protein shake in a shaker bottle with banana",
    ingredients: [
      { ingredientId: "protein-powder", grams: 40 },
      { ingredientId: "banana", grams: 120 },
    ],
    isHighProtein: true,
    isSimple: true,
    isEasyToCook: true,
    isDairyFree: true,
    isGlutenFree: true,
  },
  {
    id: "almond-banana-snack",
    name: "Almonds & Banana",
    mealType: "snack",
    description: "A handful of almonds with a banana",
    imageUrl: "/images/meals/almond-banana.jpg",
    imagePrompt: "A small bowl of almonds next to a banana",
    ingredients: [
      { ingredientId: "almonds", grams: 30 },
      { ingredientId: "banana", grams: 150 },
    ],
    isVegan: true,
    isVegetarian: true,
    isDairyFree: true,
    isGlutenFree: true,
    isSimple: true,
    containsNuts: true,
  },
  {
    id: "greek-yogurt-snack",
    name: "Greek Yogurt with Berries",
    mealType: "snack",
    description: "Greek yogurt topped with fresh berries",
    imageUrl: "/images/meals/yogurt-snack.jpg",
    imagePrompt: "A small cup of Greek yogurt with fresh berries",
    ingredients: [
      { ingredientId: "greek-yogurt", grams: 150 },
      { ingredientId: "banana", grams: 80 },
    ],
    isHighProtein: true,
    isSimple: true,
    isEasyToCook: true,
    isVegetarian: true,
    isGlutenFree: true,
  },
]

// Calculate macros for a recipe with given ingredient portions
export function calculateRecipeMacros(recipe: Recipe, ingredientPortions?: Record<string, number>) {
  let totalCalories = 0
  let totalProtein = 0
  let totalCarbs = 0
  let totalFat = 0
  const ingredients: Array<{
    id: string
    name: string
    grams: number
    calories: number
    proteinG: number
    fatG: number
    carbG: number
  }> = []

  for (const recipeIngredient of recipe.ingredients) {
    const ingredient = INGREDIENTS[recipeIngredient.ingredientId]
    if (!ingredient) continue

    const grams = ingredientPortions?.[recipeIngredient.ingredientId] ?? recipeIngredient.grams
    const multiplier = grams / 100

    const calories = ingredient.caloriesPer100g * multiplier
    const proteinG = ingredient.proteinPer100g * multiplier
    const carbG = ingredient.carbsPer100g * multiplier
    const fatG = ingredient.fatPer100g * multiplier

    totalCalories += calories
    totalProtein += proteinG
    totalCarbs += carbG
    totalFat += fatG

    ingredients.push({
      id: ingredient.id,
      name: ingredient.name,
      grams: Math.round(grams * 10) / 10,
      calories: Math.round(calories * 10) / 10,
      proteinG: Math.round(proteinG * 10) / 10,
      fatG: Math.round(fatG * 10) / 10,
      carbG: Math.round(carbG * 10) / 10,
    })
  }

  return {
    calories: Math.round(totalCalories * 10) / 10,
    proteinG: Math.round(totalProtein * 10) / 10,
    fatG: Math.round(totalFat * 10) / 10,
    carbG: Math.round(totalCarbs * 10) / 10,
    ingredients,
  }
}

// Filter recipes based on dietary restrictions
export function filterRecipesByRestrictions(
  recipes: Recipe[],
  restrictions: string[]
): Recipe[] {
  return recipes.filter((recipe) => {
    // Check each restriction
    for (const restriction of restrictions) {
      if (restriction === "no-pork" && recipe.containsPork) return false
      if (restriction === "no-seafood" && recipe.containsSeafood) return false
      if (restriction === "vegan" && !recipe.isVegan) return false
      if (restriction === "vegetarian" && !recipe.isVegetarian && !recipe.isVegan) return false
      if (restriction === "dairy-free" && !recipe.isDairyFree) return false
      if (restriction === "gluten-free" && !recipe.isGlutenFree) return false
      if (restriction === "no-nuts" && recipe.containsNuts) return false
    }
    return true
  })
}

// Filter recipes by preferences
export function filterRecipesByPreferences(
  recipes: Recipe[],
  preferences: string[]
): Recipe[] {
  if (preferences.length === 0) return recipes

  return recipes.filter((recipe) => {
    for (const preference of preferences) {
      if (preference === "high-protein" && !recipe.isHighProtein) return false
      if (preference === "simple" && !recipe.isSimple) return false
      if (preference === "easy-to-cook" && !recipe.isEasyToCook) return false
    }
    return true
  })
}

