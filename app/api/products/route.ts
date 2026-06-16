import { NextRequest, NextResponse } from "next/server";
import { supabase, getSupabaseAdmin } from "@/lib/supabase";

// GET all products (public)
export async function GET() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Map snake_case -> camelCase for frontend compatibility
  const products = data.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    originalPrice: p.original_price,
    category: p.category,
    badge: p.badge,
    slug: p.slug,
    image: p.image,
    description: p.description,
  }));

  return NextResponse.json(products);
}

// POST — add new product (admin)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const admin = getSupabaseAdmin();

  const slug = body.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const { data, error } = await admin
    .from("products")
    .insert({
      name: body.name,
      price: body.price,
      original_price: body.originalPrice ?? null,
      category: body.category,
      badge: body.badge ?? null,
      slug,
      image: body.image,
      description: body.description ?? "",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PUT — update product (admin)
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const admin = getSupabaseAdmin();

  const { data, error } = await admin
    .from("products")
    .update({
      name: body.name,
      price: body.price,
      original_price: body.originalPrice ?? null,
      category: body.category,
      badge: body.badge ?? null,
      image: body.image,
      description: body.description ?? "",
    })
    .eq("id", body.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE — remove product (admin)
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const admin = getSupabaseAdmin();

  const { error } = await admin.from("products").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}