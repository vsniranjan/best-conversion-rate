import { NextRequest, NextResponse } from "next/server";

const RATE_LIMIT = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string) {
  const now = Date.now();
  const windowMs = 3_600_000; // 1 hour
  const maxRequests = 5;

  const entry = RATE_LIMIT.get(ip);

  if (!entry || now > entry.resetAt) {
    RATE_LIMIT.set(ip, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (entry.count >= maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { ok: false, retryAfter };
  }

  entry.count++;
  return { ok: true };
}

function getIdentifier(req: NextRequest) {
  return req.headers.get("x-forwarded-for") || "unknown";
}

export async function POST(req: NextRequest) {
  const identifier = getIdentifier(req);
  const limit = checkRateLimit(identifier);

  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests", retryAfter: limit.retryAfter },
      { status: 429 },
    );
  }

  const { title, description, category, name, email } = await req.json();

  if (!title?.trim())
    return NextResponse.json({ error: "Title required" }, { status: 400 });

  const VALID_CATEGORIES = ["bug", "feature", "feedback"] as const;
  if (!VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  const extras = [
    description?.trim(),
    name?.trim() ? `**Name:** ${name.trim()}` : null,
    email?.trim() ? `**Email:** ${email.trim()}` : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  const res = await fetch(
    "https://api.github.com/repos/vsniranjan/rate-radar/issues",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({
        title: title.trim(),
        body: extras,
        labels: [category],
        assignees: ["vsniranjan"],
      }),
    },
  );
  if (!res.ok) return NextResponse.json({ error: "Failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
