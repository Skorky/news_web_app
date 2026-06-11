import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";

export async function POST(request: NextRequest) {
  try {
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    const subject = process.env.VAPID_SUBJECT || "mailto:test@example.com";

    if (!publicKey || !privateKey) {
      return NextResponse.json(
        { error: "Chybí VAPID klíče." },
        { status: 500 },
      );
    }

    webpush.setVapidDetails(subject, publicKey, privateKey);

    const subscription = await request.json();

    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: "Skorky News",
        body: "Testovací notifikace funguje 🎉",
      }),
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Push test error:", error);

    return NextResponse.json(
      { error: "Nepodařilo se poslat testovací notifikaci." },
      { status: 500 },
    );
  }
}
