import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json({
    message: "Test signup works!",
    userId: "test-" + Date.now()
  }, { status: 201 })
}
