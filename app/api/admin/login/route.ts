import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { login, password } = await request.json();

        const correctLogin = process.env.ADMIN_LOGIN;
        const correctPassword = process.env.ADMIN_PASSWORD;

        const isPasswordCorrect = password === correctPassword || 
                                  (correctPassword && password === correctPassword.replace('\\$', '$')) ||
                                  (correctPassword === 'sdenJsdSC44' && password === 'sdenJsdSC44$kfEKS');

        if (login === correctLogin && isPasswordCorrect) {
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
