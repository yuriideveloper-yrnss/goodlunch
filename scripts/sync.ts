import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { seedWeek1, seedWeek2 } from '../lib/menuData'
import { menuTranslations } from '../lib/menuTranslations'

// 1. Load env variables manually from .env.local
const envPath = path.resolve(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const env: Record<string, string> = {}
envContent.split('\n').forEach(line => {
    const [key, ...value] = line.split('=')
    if (key && value) env[key.trim()] = value.join('=').trim()
})

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY // Use service role for bypass RLS

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function migrate() {
    console.log('🚀 Starting menu migration...')

    const menuItems: any[] = []

    const processWeek = (weekData: any[], weekNum: number) => {
        weekData.forEach((day: any) => {
            day.dishes.forEach((dish: any, dishIdx: number) => {
                const titlePl = dish.title
                const translations = menuTranslations[titlePl] || { pl: titlePl, ua: titlePl, ru: titlePl, en: titlePl }

                menuItems.push({
                    week_number: weekNum,
                    day_index: day.dayIndex,
                    dish_type: dish.type,
                    title_pl: translations.pl || titlePl,
                    title_ua: translations.ua || titlePl,
                    title_ru: translations.ru || titlePl,
                    title_en: translations.en || titlePl,
                    sort_order: dishIdx
                })
            })
        })
    }

    processWeek(seedWeek1, 1)
    processWeek(seedWeek2, 2)

    console.log(`📦 Prepared ${menuItems.length} items. Syncing with Supabase...`)

    // Clear existing menu
    const { error: deleteError } = await supabase
        .from('menu_items')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000')

    if (deleteError) {
        console.error('❌ Error clearing table:', deleteError)
        return
    }

    // Insert new menu
    const { error: insertError } = await supabase
        .from('menu_items')
        .insert(menuItems)

    if (insertError) {
        console.error('❌ Error inserting data:', insertError)
        return
    }

    console.log('✅ Migration successful! Menu is now in the database.')
}

migrate()
