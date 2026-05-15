import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request) {
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
