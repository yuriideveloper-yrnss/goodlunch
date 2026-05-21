import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

async function sendTelegramNotification(orderData: any, isFinished: boolean) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    if (!token || !chatId) {
        console.log('Telegram credentials missing, skipping notification');
        return null;
    }

    const title = isFinished ? '🚨 <b>НОВАЯ ЗАЯВКА (Оформлена)</b> 🚨' : '⚠️ <b>Новая заявка (Шаг 1 - Контакты)</b> ⚠️';
    
    const message = `
${title}

👤 <b>Имя:</b> ${orderData.name || 'Не указано'}
📞 <b>Телефон:</b> ${orderData.phone || 'Не указано'}
💬 <b>Мессенджер:</b> ${orderData.messenger || 'Не указано'}
📦 <b>Пакет:</b> ${orderData.package || 'Не указано'} (${orderData.calories || 0} ккал)
💰 <b>Цена:</b> ${orderData.price || 'Не указано'}
📅 <b>Дни доставки:</b> ${orderData.deliveryDay || 'Не указано'}
🏠 <b>Адрес:</b> ул. ${orderData.street || ''}, д. ${orderData.house || ''}, кв. ${orderData.apt || ''}
    `.trim();

    try {
        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });
        const data = await res.json();
        if (data.ok) {
            return data.result.message_id;
        }
    } catch (error) {
        console.error('Failed to send Telegram notification:', error);
    }
    return null;
}

async function editTelegramNotification(messageId: number | string, orderData: any, isFinished: boolean) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    if (!token || !chatId || !messageId) {
        return null;
    }

    const title = isFinished ? '🚨 <b>НОВАЯ ЗАЯВКА (Оформлена)</b> 🚨' : '⚠️ <b>Новая заявка (Шаг 1 - Контакты)</b> ⚠️';
    
    const message = `
${title}

👤 <b>Имя:</b> ${orderData.name || 'Не указано'}
📞 <b>Телефон:</b> ${orderData.phone || 'Не указано'}
💬 <b>Мессенджер:</b> ${orderData.messenger || 'Не указано'}
📦 <b>Пакет:</b> ${orderData.package || 'Не указано'} (${orderData.calories || 0} ккал)
💰 <b>Цена:</b> ${orderData.price || 'Не указано'}
📅 <b>Дни доставки:</b> ${orderData.deliveryDay || 'Не указано'}
🏠 <b>Адрес:</b> ул. ${orderData.street || ''}, д. ${orderData.house || ''}, кв. ${orderData.apt || ''}
    `.trim();

    try {
        await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                message_id: messageId,
                text: message,
                parse_mode: 'HTML'
            })
        });
    } catch (error) {
        console.error('Failed to edit Telegram notification:', error);
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        if (!id) {
            return NextResponse.json({ success: false, error: 'Missing ID parameter' }, { status: 400 });
        }

        const { data: order, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching order from database:', error);
            return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, order });
    } catch (error) {
        console.error('Error in GET /api/orders:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // If an ID is provided, check if we can update an existing order
        if (body.id) {
            // First, fetch the existing order to check its current status & telegram message id
            const { data: existingOrder } = await supabase
                .from('orders')
                .select('*')
                .eq('id', body.id)
                .single();

            if (existingOrder) {
                // Determine new status: if Step 2 is submitted or was already completed ('New'), it stays 'New'
                const status = (body.step === 2 || existingOrder.status === 'New') ? 'New' : 'Unfinished';

                // Build a dynamic update payload based on provided fields
                const updatePayload: any = {
                    status,
                };
                if (body.name !== undefined) updatePayload.name = body.name;
                if (body.phone !== undefined) updatePayload.phone = body.phone;
                if (body.messenger !== undefined) updatePayload.messenger = body.messenger;
                if (body.street !== undefined) updatePayload.street = body.street;
                if (body.house !== undefined) updatePayload.house = body.house;
                if (body.floor !== undefined) updatePayload.floor = body.floor;
                if (body.apt !== undefined) updatePayload.apt = body.apt;
                if (body.intercom !== undefined) updatePayload.intercom = body.intercom;
                if (body.deliveryDay !== undefined) updatePayload.deliveryDay = body.deliveryDay;
                if (body.package !== undefined) updatePayload.package = body.package;
                if (body.calories !== undefined) updatePayload.calories = parseInt(body.calories) || 0;
                if (body.price !== undefined) updatePayload.price = body.price;
                if (body.lang !== undefined) updatePayload.lang = body.lang;

                const { data: updatedOrder, error } = await supabase
                    .from('orders')
                    .update(updatePayload)
                    .eq('id', body.id)
                    .select()
                    .single();

                if (error) throw error;
                
                // Manage Telegram notification
                if (updatedOrder) {
                    if (updatedOrder.telegram_message_id) {
                        await editTelegramNotification(updatedOrder.telegram_message_id, updatedOrder, updatedOrder.status === 'New');
                    } else {
                        const messageId = await sendTelegramNotification(updatedOrder, updatedOrder.status === 'New');
                        if (messageId) {
                            await supabase
                                .from('orders')
                                .update({ telegram_message_id: messageId.toString() })
                                .eq('id', updatedOrder.id);
                        }
                    }
                }

                return NextResponse.json({ success: true, orderId: body.id });
            }
        }

        // Generate a new UUID for the order if it's completely new or not found
        const orderId = body.id || crypto.randomUUID();
        const newOrder = {
            id: orderId,
            name: body.name || '',
            phone: body.phone || '',
            messenger: body.messenger || '',
            street: body.street || '',
            house: body.house || '',
            floor: body.floor || '',
            apt: body.apt || '',
            intercom: body.intercom || '',
            deliveryDay: body.deliveryDay || '',
            package: body.package || '',
            calories: parseInt(body.calories) || 0,
            price: body.price || '',
            lang: body.lang || 'unknown',
            status: body.step === 2 ? 'New' : 'Unfinished',
        };

        const { error } = await supabase
            .from('orders')
            .insert([newOrder]);

        if (error) {
            console.error('Supabase insert error:', error);
            throw error;
        }

        // Send Telegram notification
        const messageId = await sendTelegramNotification(newOrder, newOrder.status === 'New');
        if (messageId) {
            const { error: updateError } = await supabase
                .from('orders')
                .update({ telegram_message_id: messageId.toString() })
                .eq('id', newOrder.id);
            if (updateError) {
                console.error("Failed to save telegram_message_id:", updateError);
            }
        }

        return NextResponse.json({ success: true, orderId: newOrder.id });
    } catch (error) {
        console.error('Error saving order:', error);
        return NextResponse.json({ success: false, error: 'Failed to save order' }, { status: 500 });
    }
}
