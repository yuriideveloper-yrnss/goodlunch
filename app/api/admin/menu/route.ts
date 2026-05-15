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
            .from('menu_items')
            .select('*')
            .order('week_number', { ascending: true })
            .order('day_index', { ascending: true })
            .order('sort_order', { ascending: true });

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error reading menu from Supabase:', error);
        return NextResponse.json({ error: 'Failed to read menu' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { menuItems } = body; // Array of menu items

        // We'll do a simple delete and re-insert for now to keep it clean, 
        // or an upsert if we have stable IDs.
        // Given Dimasik's request, they want to edit the whole 2 weeks.
        
        const { error: deleteError } = await supabase
            .from('menu_items')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

        if (deleteError) throw deleteError;

        const { error: insertError } = await supabase
            .from('menu_items')
            .insert(menuItems);

        if (insertError) throw insertError;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving menu to Supabase:', error);
        return NextResponse.json({ error: 'Failed to save menu' }, { status: 500 });
    }
}
