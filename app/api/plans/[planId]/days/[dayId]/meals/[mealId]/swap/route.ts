import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-utils"
import { RECIPES, calculateRecipeMacros, filterRecipesByRestrictions } from "@/lib/recipes"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ planId: string; dayId: string; mealId: string }> }
) {
  try {
    const user = await requireAuth()
    const userId = (user as any).id
    const { mealId } = await params
    const body = await request.json()

    const { recipeId } = body

    if (!recipeId) {
      return NextResponse.json({ error: "recipeId is required" }, { status: 400 })
    }

    // Get the meal and verify ownership
    const meal = await prisma.planMeal.findUnique({
      where: { id: mealId },
      include: {
        planDay: {
          include: {
            plan: {
              include: {
                profile: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!meal) {
      return NextResponse.json({ error: "Meal not found" }, { status: 404 })
    }

    if (meal.planDay.plan.profile.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Find the new recipe
    const newRecipe = RECIPES.find((r) => r.id === recipeId && r.mealType === meal.mealType)
    if (!newRecipe) {
      return NextResponse.json(
        { error: "Recipe not found or wrong meal type" },
        { status: 400 }
      )
    }

    // Calculate macros for the new recipe (using default portions)
    const macros = calculateRecipeMacros(newRecipe)

    // Update the meal with the new recipe
    const updatedMeal = await prisma.planMeal.update({
      where: { id: mealId },
      data: {
        recipeId: newRecipe.id,
        recipeName: newRecipe.name,
        imageUrl: newRecipe.imageUrl,
        description: newRecipe.description,
        calories: macros.calories,
        proteinG: macros.proteinG,
        fatG: macros.fatG,
        carbG: macros.carbG,
        ingredients: macros.ingredients,
      },
    })

    return NextResponse.json(updatedMeal)
  } catch (error) {
    console.error("Swap meal error:", error)
    return NextResponse.json({ error: "Failed to swap meal" }, { status: 500 })
  }
}

