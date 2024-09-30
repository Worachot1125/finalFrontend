// src/app/api/CRUD/route.ts
import { connectToDatabase } from "@/lib/mongodb";
import Transaction from "@/models/credit";
import { NextResponse } from "next/server";
import { getSession } from "next-auth/react";

// CREATE: สร้างงานใหม่
export async function POST(req: Request) {
  try {
    const { amount, date, type, notes } = await req.json(); // Use req instead of request
    const session = await getSession({ req: { headers: { cookie: req.headers.get("cookie") || "" } } });
    const userEmail = session?.user?.email; // รับอีเมลของผู้ใช้ที่เข้าสู่ระบบ
    
    await connectToDatabase();
    const newTransaction = new Transaction({
      amount,
      date,
      type,
      notes,
      userEmail // เพิ่มอีเมลเป็นฟิลด์ในฐานข้อมูล
    });
    
    await newTransaction.save();
    return NextResponse.json({ success: true, data: newTransaction });
  } catch (err) {
    return NextResponse.json({ success: false, error: err });
  }
}

// READ: แสดงรายการงานทั้งหมด
export async function GET(req: Request) { // Use req instead of request
  try {
    const session = await getSession({ req: { headers: { cookie: req.headers.get("cookie") || "" } } });
    const userEmail = session?.user?.email; // รับอีเมลของผู้ใช้ที่เข้าสู่ระบบ
    
    await connectToDatabase();
    const transactions = await Transaction.find({ userEmail }); // ดึงรายการที่เชื่อมโยงกับอีเมล
    return NextResponse.json({ success: true, data: transactions });
  } catch (err) {
    return NextResponse.json({ success: false, error: err });
  }
}

// UPDATE: แก้ไขข้อมูล
export async function PUT(req: Request) { // Use req instead of request
  try {
    const { id, amount, date, type, notes } = await req.json(); // Use req instead of request
    await connectToDatabase();
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { amount, date, type, notes },
      { new: true }
    );
    return NextResponse.json({ success: true, data: updatedTransaction });
  } catch (err) {
    return NextResponse.json({ success: false, error: err });
  }
}

// DELETE: ลบงาน
export async function DELETE(req: Request) { // Use req instead of request
  try {
    const { id } = await req.json(); // Use req instead of request
    await connectToDatabase();
    await Transaction.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err });
  }
}
