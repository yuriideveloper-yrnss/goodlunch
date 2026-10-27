import { dictionary } from '@/lib/dictionary'

interface GlobalOverride {
  metaTitle: string
  metaDesc: string
  badge: string
  subtitle: string
  trialPriceLabel: string
  ctaMain: string
  reviewsTitle: string
  reviewsSubtitle: string
  city: string
  cityPlaceholder: string
  deliveryNote: string
  faqQ4: string
  faqA4: string
  faqA5: string
  promoHelper: string
  meals3Desc: string
  meals4Desc: string
  breadIncluded: string
  freeDelivery: string
}

const GLOBAL_OVERRIDES: Record<string, GlobalOverride> = {
  pl: {
    metaTitle: "GoodLunch | Catering Dietetyczny & Domowe Obiady z dostawą w całej Polsce – od 37,50 zł",
    metaDesc: "Pyszne domowe jedzenie na dowóz i catering dietetyczny z dostawą w całej Polsce. Świeże obiady, zupy i kolacje pod Twoje drzwi. Zniżka -25% na pierwsze zamówienie z kodem Jesień (od 37,50 zł)!",
    badge: "Dostawa w całej Polsce 🇵🇱",
    subtitle: "Zapomnij o gotowaniu i zakupach. Świeże posiłki (śniadanie, zupa, dania główne + świeży chleb) z bezpłatną dostawą pod Twoje drzwi w całej Polsce.",
    trialPriceLabel: "Z kodem Jesień (-25%)",
    ctaMain: "Zamów z rabatem -25%",
    reviewsTitle: "Polska już z nami je",
    reviewsSubtitle: "Ponad 500 zadowolonych klientów w całym kraju",
    city: "Miasto",
    cityPlaceholder: "np. Warszawa, Kraków, Poznań, Gdańsk",
    deliveryNote: "Dostawa bezpośrednio pod Twoje drzwi. Kurier po prostu zostawia paczkę.",
    faqQ4: "Czy dowozicie jedzenie na terenie całej Polski?",
    faqA4: "Tak! Dostarczamy świeże posiłki do każdego miasta i miejscowości w Polsce bezpłatną dostawą kurierską prosto pod Twoje drzwi.",
    faqA5: "W cenie pojedynczego dania z restauracji (od 37,50 zł z kodem Jesień) otrzymujesz pełnowartościowe posiłki na cały dzień (śniadanie, zupa, dania główne + chleb). Zero gotowania, zmywania i czekania na kuriera w ciągu dnia.",
    promoHelper: "Wpisz kod w formularzu, aby odebrać zniżkę -25% na całe zamówienie!",
    meals3Desc: "Śniadanie + zupa + danie główne",
    meals4Desc: "Śniadanie + zupa + 2 dania główne",
    breadIncluded: "Do diety dodajemy świeży chleb",
    freeDelivery: "Bezpłatna dostawa",
  },
  ua: {
    metaTitle: "GoodLunch | Кейтеринг & Домашні обіди з доставкою по всій Польщі – від 37,50 зл",
    metaDesc: "Смачна домашня їжа та дієтичний кейтеринг з доставкою по всій Польщі. Свіжі обіди, супи та вечері на весь день. Знижка -25% на перше замовлення з промокодом Jesień (від 37,50 zł)!",
    badge: "Доставка по всій Польщі 🇵🇱",
    subtitle: "Забудь про готування та магазини. Свіжий раціон (сніданок, суп, основні страви + свіжий хліб) з безкоштовною доставкою під твої двері по всій Польщі.",
    trialPriceLabel: "З кодом Jesień (-25%)",
    ctaMain: "Замовити зі знижкою -25%",
    reviewsTitle: "Польща вже з нами їсть",
    reviewsSubtitle: "Понад 500 задоволених клієнтів по всій країні",
    city: "Місто",
    cityPlaceholder: "напр. Варшава, Краків, Познань, Гданськ",
    deliveryNote: "Доставка кур'єром прямо під ваші двері.",
    faqQ4: "Чи доставляєте ви їжу по всій території Польщі?",
    faqA4: "Так! Ми доставляємо раціони свіжої їжі до будь-якого міста та населеного пункту Польщі з безкоштовною доставкою прямо під двері.",
    faqA5: "За ціною однієї ресторанної страви або бургера (від 37,50 zł з промокодом Jesień) ви отримуєте повноцінне домашнє харчування на весь день — сніданок, суп, основні страви + хліб.",
    promoHelper: "Введіть промокод у формі, щоб отримати знижку -25% на все замовлення!",
    meals3Desc: "Сніданок + суп + основна страва",
    meals4Desc: "Сніданок + суп + 2 основні страви",
    breadIncluded: "До раціону додаємо свіжий хліб",
    freeDelivery: "Безкоштовна доставка",
  },
  ru: {
    metaTitle: "GoodLunch | Кейтеринг & Домашние обеды с доставкой по всей Польше – от 37,50 zł",
    metaDesc: "Вкусная домашняя еда и правильное питание с доставкой по всей Польше. Свежие обеды, супы и ужины на весь день. Скидка -25% на весь первый заказ по промокоду Jesień (от 37,50 zł)!",
    badge: "Доставка по всей Польше 🇵🇱",
    subtitle: "Забудь о готовке и магазинах. Свежий рацион (завтрак, суп, основные блюда + свежий хлеб) с бесплатной доставкой до твоей двери по всей Польше.",
    trialPriceLabel: "С кодом Jesień (-25%)",
    ctaMain: "Заказать со скидкой -25%",
    reviewsTitle: "Польша уже с нами ест",
    reviewsSubtitle: "Более 500 довольных клиентов по всей стране",
    city: "Город",
    cityPlaceholder: "напр. Варшава, Краков, Познань, Гданьск",
    deliveryNote: "Доставка осуществляется курьером прямо под вашу дверь.",
    faqQ4: "Доставляете ли вы еду по всей Польше?",
    faqA4: "Да! Мы доставляем рационы свежей еды в любой город и населенный пункт Польши с бесплатной доставкой прямо под дверь.",
    faqA5: "По цене одного ресторанного блюда (от 37,50 zł с промокодом Jesień) вы получаете полноценное домашнее питание на целый день: завтрак, суп, основные блюда + хлеб.",
    promoHelper: "Введите промокод в форме, чтобы получить скидку -25% на весь заказ!",
    meals3Desc: "Завтрак + суп + основное блюдо",
    meals4Desc: "Завтрак + суп + 2 основных блюда",
    breadIncluded: "К рациону добавляем свежий хлеб",
    freeDelivery: "Бесплатная доставка",
  },
  en: {
    metaTitle: "GoodLunch | Diet Catering & Meal Prep across Poland – from 37.50 zł",
    metaDesc: "Delicious home-cooked food delivery and diet catering across Poland. Fresh breakfasts, soups, and main dishes delivered to your door. Get 25% off with code Jesień (from 37.50 zł)!",
    badge: "Delivery throughout Poland 🇵🇱",
    subtitle: "Forget cooking and grocery shopping. Complete balanced meals (breakfast, soup, main dishes + fresh bread) delivered right to your door anywhere in Poland.",
    trialPriceLabel: "With code Jesień (-25%)",
    ctaMain: "Order with 25% discount",
    reviewsTitle: "Poland eats with us",
    reviewsSubtitle: "Over 500 happy customers across the country",
    city: "City",
    cityPlaceholder: "e.g. Warsaw, Krakow, Poznan, Gdansk",
    deliveryNote: "Delivery right to your doorstep.",
    faqQ4: "Do you deliver throughout all of Poland?",
    faqA4: "Yes! We deliver fresh meals to every city and town in Poland with free courier delivery straight to your door.",
    faqA5: "For the price of a single restaurant takeout dish (from 37.50 zł with code Jesień), you receive full balanced home-cooked meals for the entire day (breakfast, soup, main courses + bread) without extra delivery fees.",
    promoHelper: "Enter promo code in the form to get 25% off your entire order!",
    meals3Desc: "Breakfast + soup + main dish",
    meals4Desc: "Breakfast + soup + 2 main dishes",
    breadIncluded: "Fresh bread included with every plan",
    freeDelivery: "Free delivery",
  },
  be: {
    metaTitle: "GoodLunch | Кейтарынг & Хатнія абеды з дастаўкай па ўсёй Польшчы – ад 37,50 zł",
    metaDesc: "Смачная хатнія абеды і кейтарынг з дастаўкай па ўсёй Польшчы. Свежыя абеды, супы і вячэры на ўвесь дзень. Зніжка -25% на першы заказ з кодам Jesień (ад 37,50 zł)!",
    badge: "Дастаўка па ўсёй Польшчы 🇵🇱",
    subtitle: "Забудзь пра гатаванне і крамы. Свежы рацыён (сняданак, суп, асноўныя стравы + свежы хлеб) з бясплатнай дастаўкай пад дзверы па ўсёй Польшчы.",
    trialPriceLabel: "З кодам Jesień (-25%)",
    ctaMain: "Замовіць са зніжкай -25%",
    reviewsTitle: "Польшча ўжо з намі есць",
    reviewsSubtitle: "Больш за 500 задаволеных кліентаў па ўсёй краіне",
    city: "Горад",
    cityPlaceholder: "напр. Варшава, Кракаў, Познань, Гданьск",
    deliveryNote: "Дастаўка кур'ерам прама пад вашы дзверы.",
    faqQ4: "Ці дастаўляеце вы ежу па ўсёй тэрыторыі Польшчы?",
    faqA4: "Так! Мы дастаўляем рацыёны свежай ежы ў кожны горад і населены пункт Польшчы з бясплатнай дастаўкай прама пад дзверы.",
    faqA5: "Па цане адной рэстараннай стравы (ад 37,50 zł з промакодам Jesień) вы атрымліваеце паўнавартаснае хатняе харчаванне на ўвесь дзень: сняданак, суп, асноўныя стравы + хлеб без лішніх выдаткаў.",
    promoHelper: "Увядзіце промакод у форме, каб атрымаць зніжку -25% на ўвесь заказ!",
    meals3Desc: "Сняданак + суп + асноўная страва",
    meals4Desc: "Сняданак + суп + 2 асноўныя стравы",
    breadIncluded: "Да рацыёну дадаем свежы хлеб",
    freeDelivery: "Бясплатная дастаўка",
  }
}

export function getGlobalDictionary(lang: string) {
  // @ts-ignore
  const base = dictionary[lang] || dictionary.pl
  const override = GLOBAL_OVERRIDES[lang] || GLOBAL_OVERRIDES.pl

  // Deep clone so base dictionary is not mutated
  const clone = JSON.parse(JSON.stringify(base))

  // Apply overrides
  if (clone.meta) {
    clone.meta.title = override.metaTitle
    clone.meta.desc = override.metaDesc
  }

  if (clone.hero) {
    clone.hero.badge = override.badge
    clone.hero.subtitle = override.subtitle
    clone.hero.trial_price_label = override.trialPriceLabel
    clone.hero.cta_main = override.ctaMain
  }

  if (clone.reviews) {
    clone.reviews.title = override.reviewsTitle
    clone.reviews.subtitle = override.reviewsSubtitle
  }

  if (clone.calc) {
    clone.calc.meals3_desc = override.meals3Desc
    clone.calc.meals4_desc = override.meals4Desc
    clone.calc.bread_included = override.breadIncluded
    clone.calc.free_delivery = override.freeDelivery
  }

  if (clone.form) {
    clone.form.city = override.city
    clone.form.city_placeholder = override.cityPlaceholder
    clone.form.delivery_note = override.deliveryNote
  }

  if (clone.faq) {
    clone.faq.q4 = override.faqQ4
    clone.faq.a4 = override.faqA4
    clone.faq.a5 = override.faqA5
  }

  if (clone.promo) {
    clone.promo.helper = override.promoHelper
  }

  return clone
}
