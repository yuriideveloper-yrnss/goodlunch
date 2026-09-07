export const SMART_CATERING_URLS = {
  meals3: 'https://goodlunch-catering.mobilnycatering.pl/sklep/produkt/3-posiki/3574',
  meals4: 'https://goodlunch-catering.mobilnycatering.pl/sklep/produkt/4-posiki/3575',
  store: 'https://goodlunch-catering.mobilnycatering.pl/sklep',
} as const;

export function getSmartCateringUrl(mealPackage?: string): string {
  if (mealPackage === 'meals4' || mealPackage === '4') {
    return SMART_CATERING_URLS.meals4;
  }
  if (mealPackage === 'meals3' || mealPackage === '3') {
    return SMART_CATERING_URLS.meals3;
  }
  return SMART_CATERING_URLS.store;
}
