import { NextResponse } from "next/server"

export function jsonOk(data: any, init?: ResponseInit) {
  return NextResponse.json(data, { status: 200, ...init })
}

export function jsonError(code: string, message: string, status = 400) {
  return NextResponse.json(
    {
      error: {
        code,
        message,
      },
    },
    { status }
  )
}

