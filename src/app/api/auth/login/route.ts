import { NextRequest, NextResponse } from 'next/server';

// Admin credentials
const ADMIN_EMAIL = 'lars@lpgdigital.com';
const ADMIN_PASSWORD = '3859Listicle!';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Generate a simple token (in production, use JWT or proper session management)
      const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');

      return NextResponse.json({
        success: true,
        token,
        user: {
          email: ADMIN_EMAIL,
          role: 'admin',
          name: 'Lars',
        },
      });
    }

    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
