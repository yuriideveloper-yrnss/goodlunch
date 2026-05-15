import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('menu_items')
            .select('*')
            .order('week_number', { ascending: true })
            .order('day_index', { ascending: true })
            .order('sort_order', { ascending: true });

        if (error) throw error;

        // If DB is empty, we return null to let the client fallback to hardcoded data
        if (!data || data.length === 0) {
            return NextResponse.json({ menu: null });
        }

        return NextResponse.json({ menu: data });
    } catch (error) {
        console.error('Error fetching public menu:', error);
        return NextResponse.json({ menu: null, error: 'Failed to fetch menu' });
    }
}
