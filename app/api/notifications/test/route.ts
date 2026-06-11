import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:test@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json();

    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'Skorky News',
        body: 'Testovací notifikace funguje 🎉',
      })
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Push test error:', error);

    return NextResponse.json(
      { error: 'Nepodařilo se poslat testovací notifikaci.' },
      { status: 500 }
    );
  }
}
