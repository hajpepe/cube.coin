import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { telegramId, clicks, tonAddress } = body;

    // Validate input
    if (!telegramId || !tonAddress || typeof clicks !== "number") {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("cbe");
    const usersCollection = db.collection("users");

    // Upsert user data
    const result = await usersCollection.updateOne(
      { telegramId }, // Filter by telegramId
      { $set: { telegramId, clicks, tonAddress } }, // Update fields
      { upsert: true } // Create if not exists
    );

    return NextResponse.json(
      { message: "User data saved successfully", result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving user data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
