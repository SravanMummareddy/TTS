// Items are now managed per-variant via /api/routines/[id]/variants/[variantId]/items
// This route is retired.
export async function POST() {
  return Response.json(
    { error: 'Use /api/routines/[id]/variants/[variantId]/items instead' },
    { status: 410 }
  )
}

export async function PATCH() {
  return Response.json(
    { error: 'Use /api/routines/[id]/variants/[variantId]/items instead' },
    { status: 410 }
  )
}
