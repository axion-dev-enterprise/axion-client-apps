import { NextRequest, NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { dashboardFor } from "@/lib/dashboard";
import { problem } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(await dashboardFor(currentUserId(request)));
  } catch (error) {
    return problem(error);
  }
}
