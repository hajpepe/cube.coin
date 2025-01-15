import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    // Connect to the MongoDB client
    const client = await clientPromise;
    const db = client.db("cbe");
    const usersCollection = db.collection("users");

    // Fetch and sort the leaderboard data
    const leaderboard = await usersCollection
      .find({})
      .sort({ clicks: -1 })
      .limit(10)
      .toArray();

    // Format the leaderboard data
    const formattedLeaderboard = leaderboard.map((user) => ({
      username: user.username || `Player${user.telegramId}`,
      clicks: user.clicks,
    }));

    // Return the formatted leaderboard
    return NextResponse.json(formattedLeaderboard, { status: 200 });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
