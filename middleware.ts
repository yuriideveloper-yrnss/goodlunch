import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Пропускаем системные файлы, API и админку
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/admin') ||
    pathname.includes('.') // Любой файл с точкой (favicon.ico, robots.txt)
  ) {
    return NextResponse.next()
  }

  // 2. Проверяем, есть ли уже язык в URL
  const pathnameHasLocale = ['/pl', '/ua', '/ru', '/be', '/en'].some(loc => pathname.startsWith(loc))
  if (pathnameHasLocale) return

  // 3. Магия определения языка
  const acceptLanguage = request.headers.get('accept-language') || ''

  // ЛОГИКА ОПРЕДЕЛЕНИЯ ЯЗЫКА:
  // Для польского рынка по умолчанию ставим 'pl'
  let locale = 'pl';
  if (/uk|ua/i.test(acceptLanguage)) locale = 'ua';
  else if (/be/i.test(acceptLanguage)) locale = 'be';
  else if (/ru|kz/i.test(acceptLanguage)) locale = 'ru';
  else if (/en/i.test(acceptLanguage)) locale = 'en';
  else if (/pl/i.test(acceptLanguage)) locale = 'pl';

  // 4. Делаем редирект напрямую без двойных слешей (минимизируем цепочку редиректов для PageSpeed и SEO)
  const cleanPath = pathname === '/' ? '' : pathname
  const url = new URL(`/${locale}${cleanPath}`, request.url)
  url.search = request.nextUrl.search
  return NextResponse.redirect(url)
}

export const config = {
  // Применяем этот код ко всем путям
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}