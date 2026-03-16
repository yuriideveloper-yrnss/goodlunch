import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

const checkAuth = (request: Request) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Basic ')) return false;
    
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [login, password] = credentials.split(':');
    
    return login === process.env.ADMIN_LOGIN && password === process.env.ADMIN_PASSWORD;
};

export async function GET(request: Request) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('createdAt', { ascending: false });

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error reading orders from Supabase:', error);
        return NextResponse.json({ error: 'Failed to read orders' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, ...updates } = body;

        const { error } = await supabase
            .from('orders')
            .update(updates)
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating order in Supabase:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await request.json();

        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting order in Supabase:', error);
        return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
    }
}
