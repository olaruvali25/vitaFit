import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-utils"
import { calculateRecipeMacros, RECIPES, INGREDIENTS } from "@/lib/recipes"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ planId: string; dayId: string; mealId: string }> }
) {
  try {
    const user = await requireAuth()
    const userId = (user as any).id
    const { mealId } = await params
    const body = await request.json()

    const { isCompleted, isSkipped, ingredients } = body

    // Get the meal and verify ownership
    const meal = await prisma.planMeal.findUnique({
      where: { id: mealId },
      include: {
        planDay: {
          include: {
            plan: {
              include: {
                profile: true,
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

    // If ingredients are provided, recalculate macros
    let updateData: any = {
      ...(isCompleted !== undefined && { isCompleted }),
      ...(isSkipped !== undefined && { isSkipped }),
    }

    if (ingredients && Array.isArray(ingredients)) {
      // Recalculate macros based on new ingredient portions
      const recipe = RECIPES.find((r) => r.id === meal.recipeId)
      if (recipe) {
        const portions: Record<string, number> = {}
        for (const ing of ingredients) {
          if (ing.id && ing.grams) {
            portions[ing.id] = ing.grams
          }
        }

        const macros = calculateRecipeMacros(recipe, portions)

        updateData = {
          ...updateData,
          calories: macros.calories,
          proteinG: macros.proteinG,
          fatG: macros.fatG,
          carbG: macros.carbG,
          ingredients: macros.ingredients,
        }
      }
    }

    const updatedMeal = await prisma.planMeal.update({
      where: { id: mealId },
      data: updateData,
    })

    return NextResponse.json(updatedMeal)
  } catch (error) {
    console.error("Update meal error:", error)
    return NextResponse.json({ error: "Failed to update meal" }, { status: 500 })
  }
}

