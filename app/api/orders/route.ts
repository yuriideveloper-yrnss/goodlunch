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

async function editTelegramNotification(messageId: number | string, orderData: any) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    if (!token || !chatId || !messageId) {
        return null;
    }

    const title = '🚨 <b>НОВАЯ ЗАЯВКА (Оформлена)</b> 🚨';
    
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

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // If an ID is provided, this is Step 2 completing an existing Unfinished order
        if (body.id) {
            const { data: updatedOrder, error } = await supabase
                .from('orders')
                .update({
                    street: body.street || '',
                    house: body.house || '',
                    floor: body.floor || '',
                    apt: body.apt || '',
                    intercom: body.intercom || '',
                    deliveryDay: body.deliveryDay || '',
                    status: 'New', // Promoted to New since they finished the form
                })
                .eq('id', body.id)
                .select()
                .single();

            if (error) throw error;
            
            // Отправляем или редактируем уведомление в Telegram (Шаг 2 завершен)
            if (updatedOrder) {
                if (updatedOrder.telegram_message_id) {
                    await editTelegramNotification(updatedOrder.telegram_message_id, updatedOrder);
                } else {
                    await sendTelegramNotification(updatedOrder, true);
                }
            }

            return NextResponse.json({ success: true, orderId: body.id });
        }

        // Otherwise, it's a new order (usually Step 1)
        const newOrder = {
            id: Date.now().toString(),
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
            status: body.step === 1 ? 'Unfinished' : 'New',
        };

        const { error } = await supabase
            .from('orders')
            .insert([newOrder]);

        if (error) {
            console.error('Supabase insert error:', error);
            throw error;
        }

        // Отправляем уведомление в Telegram (Шаг 1 или сразу новый заказ)
        const messageId = await sendTelegramNotification(newOrder, newOrder.status === 'New');
        if (messageId) {
            const { error: updateError } = await supabase
                .from('orders')
                .update({ telegram_message_id: messageId.toString() })
                .eq('id', newOrder.id);
            if (updateError) {
                console.error("Failed to save telegram_message_id (maybe column is missing?):", updateError);
            }
        }

        return NextResponse.json({ success: true, orderId: newOrder.id });
    } catch (error) {
        console.error('Error saving order:', error);
        return NextResponse.json({ success: false, error: 'Failed to save order' }, { status: 500 });
    }
}
