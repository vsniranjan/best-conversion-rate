import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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
