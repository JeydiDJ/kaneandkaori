import { NextResponse } from "next/server";

import { isAdminRequest } from "@/lib/admin-auth";
import { getAdminAnalytics } from "@/services/adminAnalytics";

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const analytics = await getAdminAnalytics();
    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Failed to build admin analytics", error);
    return NextResponse.json({ error: "Could not load reports." }, { status: 500 });
  }
}
