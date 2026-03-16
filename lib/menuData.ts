// lib/menuData.ts

export type Dish = {
  id: string;
  type: 'breakfast' | 'soup' | 'main1' | 'main2';
  title: string;
}

export type DayMenu = {
  dayIndex: number; // 1 = Monday, ..., 7 = Sunday
  dishes: Dish[];
}

export type WeekMenu = DayMenu[];

// Ця неділя (тиждень 1)
export const week1Menu: WeekMenu = [
  {
    dayIndex: 1, // Понеділок
    dishes: [
      { id: 'w1-d1-b', type: 'breakfast', title: 'Szakszuka' },
      { id: 'w1-d1-s', type: 'soup', title: 'Barszcz czerwony' },
      { id: 'w1-d1-m1', type: 'main1', title: 'Bulgur z zapiekanka z kurczaka i pesto' },
      { id: 'w1-d1-m2', type: 'main2', title: 'Pierogi z cebulą i śmietaną' },
    ]
  },
  {
    dayIndex: 2, // Wtorek
    dishes: [
      { id: 'w1-d2-b', type: 'breakfast', title: 'Naleśniki z serem, szynką i śmietaną' },
      { id: 'w1-d2-s', type: 'soup', title: 'Zupa z pulpetami' },
      { id: 'w1-d2-m1', type: 'main1', title: 'Ryż z kurczakiem teriyaki' },
      { id: 'w1-d2-m2', type: 'main2', title: 'Draniki z mięsem i śmietaną' },
    ]
  },
  {
    dayIndex: 3, // Środa
    dishes: [
      { id: 'w1-d3-b', type: 'breakfast', title: 'Bajgiel z jajkiem i bekonem' },
      { id: 'w1-d3-s', type: 'soup', title: 'Zupa z soczewicy' },
      { id: 'w1-d3-m1', type: 'main1', title: 'Makaron z sosem pesto i pieczonym kurczakiem' },
      { id: 'w1-d3-m2', type: 'main2', title: 'Kopytka w sosie szpinakowym z rybą' },
    ]
  },
  {
    dayIndex: 4, // Czwartek
    dishes: [
      { id: 'w1-d4-b', type: 'breakfast', title: 'Naleśniki z waniliowym twarogiem i dżemem' },
      { id: 'w1-d4-s', type: 'soup', title: 'Zupa warzywna z kurczakiem' },
      { id: 'w1-d4-m1', type: 'main1', title: 'Kasza gryczana z gulaszem i sałatka z buraka' },
      { id: 'w1-d4-m2', type: 'main2', title: 'Makaron szklany (Funchoza)' },
    ]
  },
  {
    dayIndex: 5, // Piątek
    dishes: [
      { id: 'w1-d5-b', type: 'breakfast', title: 'Sałatka z kurczakiem i sosem Caesar' },
      { id: 'w1-d5-s', type: 'soup', title: 'Barszcz zielony' },
      { id: 'w1-d5-m1', type: 'main1', title: 'Purée z kotletem schabowym i sałatka z kapusty' },
      { id: 'w1-d5-m2', type: 'main2', title: 'Naleśniki z mięsem i śmietaną' },
    ]
  },
  {
    dayIndex: 6, // Sobota
    dishes: [
      { id: 'w1-d6-b', type: 'breakfast', title: 'Granola z jogurtem i dżemem (croissant z bananem)' },
      { id: 'w1-d6-s', type: 'soup', title: 'Zupa gryczana' },
      { id: 'w1-d6-m1', type: 'main1', title: 'Makaron à la bolognese' },
      { id: 'w1-d6-m2', type: 'main2', title: 'Kuskus pęczakowy z kurczakiem w sosie śmietanowym' },
    ]
  },
  {
    dayIndex: 7, // Niedziela
    dishes: [
      { id: 'w1-d7-b', type: 'breakfast', title: 'Frittata z warzywami' },
      { id: 'w1-d7-s', type: 'soup', title: 'Rosół z kurczaka' },
      { id: 'w1-d7-m1', type: 'main1', title: 'Żulien z kurczakiem i grzybami' },
      { id: 'w1-d7-m2', type: 'main2', title: 'Czachochbili z ryżem' },
    ]
  },
];

// Наступний тиждень (тиждень 2)
export const week2Menu: WeekMenu = [
  {
    dayIndex: 1, // Poniedziałek
    dishes: [
      { id: 'w2-d1-b', type: 'breakfast', title: 'Szarlotka z jabłkami i kremem serowym' },
      { id: 'w2-d1-s', type: 'soup', title: 'Zupa pomidorowa' },
      { id: 'w2-d1-m1', type: 'main1', title: 'Ryż z warzywami i pieczonym kurczakiem w sosie śmietanowym' },
      { id: 'w2-d1-m2', type: 'main2', title: 'Carbonara' },
    ]
  },
  {
    dayIndex: 2, // Wtorek
    dishes: [
      { id: 'w2-d2-b', type: 'breakfast', title: 'Jajka po turecku' },
      { id: 'w2-d2-s', type: 'soup', title: 'Zupa z grzybami i fasolą' },
      { id: 'w2-d2-m1', type: 'main1', title: 'Bulgur z wieprzowiną i sałatka' },
      { id: 'w2-d2-m2', type: 'main2', title: 'Rizoni bowl z kurczakiem, warzywami i sosem jogurtowo-musztardowym' },
    ]
  },
  {
    dayIndex: 3, // Środa
    dishes: [
      { id: 'w2-d3-b', type: 'breakfast', title: 'Pancakes z jogurtem i dżemem' },
      { id: 'w2-d3-s', type: 'soup', title: 'Kapuśniak' },
      { id: 'w2-d3-m1', type: 'main1', title: 'Purée z kotletem wieprzowym z serem, pomidorem i szpinakiem' },
      { id: 'w2-d3-m2', type: 'main2', title: 'Bowl z kurczakiem i sosem szpinakowym' },
    ]
  },
  {
    dayIndex: 4, // Czwartek
    dishes: [
      { id: 'w2-d4-b', type: 'breakfast', title: 'Angielskie śniadanie' },
      { id: 'w2-d4-s', type: 'soup', title: 'Zupa serowa' },
      { id: 'w2-d4-m1', type: 'main1', title: 'Ryż z zieloną fasolką i kurczakiem po azjatycku' },
      { id: 'w2-d4-m2', type: 'main2', title: 'Ragu z wieprzowiną' },
    ]
  },
  {
    dayIndex: 5, // Piątek
    dishes: [
      { id: 'w2-d5-b', type: 'breakfast', title: 'Kanapka z szynką, jajkiem i serem' },
      { id: 'w2-d5-s', type: 'soup', title: 'Grzybowa' },
      { id: 'w2-d5-m1', type: 'main1', title: 'Kasza gryczana z gulaszem węgierskim i marchewką po koreańsku' },
      { id: 'w2-d5-m2', type: 'main2', title: 'Makaron z pesto i kotletem z kurczaka' },
    ]
  },
  {
    dayIndex: 6, // Sobota
    dishes: [
      { id: 'w2-d6-b', type: 'breakfast', title: 'Omlet z szynką' },
      { id: 'w2-d6-s', type: 'soup', title: 'Zupa z pulpetami' },
      { id: 'w2-d6-m1', type: 'main1', title: 'Kuskus w sosie śmietanowo-grzybowym' },
      { id: 'w2-d6-m2', type: 'main2', title: 'Placki ziemniaczane ze śmietaną' },
    ]
  },
  {
    dayIndex: 7, // Niedziela
    dishes: [
      { id: 'w2-d7-b', type: 'breakfast', title: 'Sernik z brzoskwinią i jogurtem' },
      { id: 'w2-d7-s', type: 'soup', title: 'Charczo' },
      { id: 'w2-d7-m1', type: 'main1', title: 'Purée z siekanym kotletem z kurczaka' },
      { id: 'w2-d7-m2', type: 'main2', title: 'Makaron szklany z kurczakiem' },
    ]
  },
];

/**
 * Calculates which week applies to the given date and returns the day's menu.
 * We know that Mar 16, 2026 is Monday of Week 1.
 */
export function getMenuForDate(date: Date): { weekNumber: number; menu: DayMenu } {
  // Use UTC to avoid timezone issues when calculating days difference
  const targetDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  
  // Anchor date: Mar 16, 2026 (Monday of Week 1)
  const anchorDate = new Date(Date.UTC(2026, 2, 16));
  
  const diffTime = targetDate.getTime() - anchorDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Calculate offset in weeks from anchor week.
  const weeksDiff = Math.floor(diffDays / 7);
  
  // If weeksDiff is even → Week 1, odd → Week 2
  const isWeek1 = weeksDiff % 2 === 0;
  
  // Find correct day of week index (1 = Monday, 7 = Sunday)
  let dayOfWeek = targetDate.getUTCDay();
  // In JS, 0 is Sunday. Convert to 1-7 where 1 is Monday.
  dayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
  
  const selectedWeek = isWeek1 ? week1Menu : week2Menu;
  const menu = selectedWeek.find(d => d.dayIndex === dayOfWeek)!;
  
  return {
    weekNumber: isWeek1 ? 1 : 2,
    menu
  };
}

export function generateUpcomingDays(startDate: Date, count: number): Date[] {
  const dates: Date[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    dates.push(d);
  }
  return dates;
}
