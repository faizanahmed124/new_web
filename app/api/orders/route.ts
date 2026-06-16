import { NextRequest, NextResponse } from "next/server";
import { supabase, getSupabaseAdmin } from "@/lib/supabase";

// GET orders — admin gets all, customer gets own (by ?email=)
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const admin = getSupabaseAdmin();

  let query = admin.from("orders").select("*").order("created_at", { ascending: false });

  if (email) {
    query = query.eq("customer_email", email);
  }

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const orders = data.map((o) => ({
    id: o.order_number,
    dbId: o.id,
    date: new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    status: o.status,
    total: o.total,
    email: o.customer_email,
    name: o.customer_name,
    phone: o.phone,
    address: o.shipping_address,
    items: o.items,
  }));

  return NextResponse.json(orders);
}

// POST — create new order (checkout)
export async function POST(req: NextRequest) {
  const body = await req.json();

  const orderNumber = `FS-${Date.now()}`;

  const { data, error } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      customer_email: body.email,
      customer_name: body.name,
      items: body.items,
      total: body.total,
      shipping_address: body.address ?? null,
      phone: body.phone ?? null,
      status: "Pending",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, orderNumber, order: data });
}

// PUT — update order status (admin)
export async function PUT(req: NextRequest) {
  const { id, status } = await req.json();
  const admin = getSupabaseAdmin();

  const { data, error } = await admin
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}