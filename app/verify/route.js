import { NextResponse } from 'next/server';
import { verifyEmail } from './emailVerifier';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { error: 'Email parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Call your verification function (await if it's asynchronous)
    const result = await verifyEmail(email);

    return NextResponse.json({
      success: true,
      email: email,
      result: result,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to verify email', details: error.message },
      { status: 500 }
    );
  }
}