import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const titles: Record<string, string> = {
    pl: 'Polityka Prywatności i Cookies | GoodLunch',
    ua: 'Політика конфіденційності та Cookies | GoodLunch',
    ru: 'Политика конфиденциальности и Cookies | GoodLunch',
    en: 'Privacy Policy & Cookies | GoodLunch',
  };
  const title = titles[lang] || titles.pl;
  return {
    title,
    description: 'Polityka prywatności i plików cookies serwisu GoodLunch.',
  };
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  // Localized UI elements
  const backText: Record<string, string> = {
    pl: 'Powrót do strony głównej',
    ua: 'Назад на головну',
    ru: 'Назад на главную',
    en: 'Back to homepage',
  };

  const tocs: Record<string, { id: string; label: string }[]> = {
    pl: [
      { id: 'wstep', label: 'Wstęp' },
      { id: 'administrator', label: '1. Administrator danych' },
      { id: 'jakie-dane', label: '2. Przetwarzane dane' },
      { id: 'czy-musza', label: '3. Dobrowolność podania' },
      { id: 'cel-podstawa', label: '4. Cel i podstawa prawna' },
      { id: 'czas-przechowywania', label: '5. Czas przechowywania' },
      { id: 'odbiorcy', label: '6. Odbiorcy danych i Autopay' },
      { id: 'bezpieczenstwo', label: '7. Bezpieczeństwo danych' },
      { id: 'prawa', label: '8. Prawa Użytkownika' },
      { id: 'eog', label: '9. Przekazywanie poza EOG' },
      { id: 'profilowanie', label: '10. Profilowanie' },
      { id: 'cookies', label: '11. Polityka cookies' },
      { id: 'dodatkowe', label: '12. Dodatkowe informacje' },
    ]
  };

  const activeToc = tocs.pl; // The policy is in Polish, so the table of contents is too.

  return (
    <main className="min-h-screen bg-brand-bg pt-28 md:pt-36 pb-24 text-brand-dark" key={lang}>
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Back Button */}
        <div className="mb-8 md:mb-12">
          <Link
            href={`/${lang}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-orange hover:text-brand-orange/80 transition-colors group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            {backText[lang] || backText.pl}
          </Link>
        </div>

        {/* Title Section */}
        <div className="mb-12 text-center md:text-left border-b border-gray-200 pb-8">
          <span className="text-xs uppercase tracking-widest font-extrabold text-brand-orange bg-brand-orange/10 px-3 py-1.5 rounded-full">
            Dokumenty prawne
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-brand-dark mt-4">
            POLITYKA PRYWATNOŚCI / COOKIES
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Ostatnia aktualizacja: 29 czerwca 2026 r.
          </p>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Sidebar Table of Contents (Desktop Only) */}
          <aside className="hidden md:block md:col-span-4 lg:col-span-3">
            <div className="sticky top-28 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-h-[calc(100vh-9rem)] overflow-y-auto">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
                Spis treści
              </h2>
              <nav className="flex flex-col gap-2">
                {activeToc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="text-sm font-medium text-gray-500 hover:text-brand-orange hover:translate-x-1 transition-all duration-200 py-1"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Legal Text Column */}
          <article className="col-span-12 md:col-span-8 lg:col-span-9 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 prose prose-slate max-w-none">
            
            {/* WSTĘP */}
            <section id="wstep" className="mb-8 scroll-mt-28">
              <p className="font-semibold text-gray-700 leading-relaxed text-lg mb-4">
                Szanowni Państwo,
              </p>
              <p className="text-gray-600 leading-relaxed">
                Niniejsza Polityka prywatności (dalej: Polityka prywatności) przedsiębiorcy działającego pod firmą GoodLunch (dalej: Usługodawca) określa, w jaki sposób Usługodawca gromadzi, przetwarza i wykorzystuje dane Użytkowników serwisu <a href="https://goodlunch-catering.mobilnycatering.pl" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline font-semibold">https://goodlunch-catering.mobilnycatering.pl</a> (dalej: Serwis). Serwis prowadzony jest przez Usługodawcę.
              </p>
            </section>

            {/* SECTION 1 */}
            <section id="administrator" className="mb-10 pt-6 border-t border-gray-100 scroll-mt-28">
              <h2 className="text-xl md:text-2xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <span className="text-brand-orange">1.</span> Kto jest Administratorem danych osobowych Użytkowników?
              </h2>
              <div className="bg-brand-bg rounded-2xl p-5 border border-brand-orange/10 text-gray-600 leading-relaxed">
                W związku z art. 13 Ogólnego Rozporządzenia o Ochronie Danych Osobowych (dalej: RODO) Usługodawca informuje, że administratorem, czyli podmiotem, który decyduje o tym jak będą wykorzystywane dane użytkowników Serwisu (dalej: Użytkownik) jest Usługodawca, z którym można się skontaktować pod adresem e-mail: <a href="mailto:goodlunch243@gmail.com" className="text-brand-orange font-bold hover:underline">goodlunch243@gmail.com</a>
              </div>
            </section>

            {/* SECTION 2 */}
            <section id="jakie-dane" className="mb-10 pt-6 border-t border-gray-100 scroll-mt-28">
              <h2 className="text-xl md:text-2xl font-bold text-brand-dark mb-4">
                <span className="text-brand-orange">2.</span> Jakie dane osobowe Użytkowników przetwarzamy?
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Podczas składania zamówienia nowy Użytkownik zostanie poproszony o podanie następujących danych:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 list-none pl-0">
                {[
                  'Imię i nazwisko',
                  'Nazwa firmy i NIP w przypadku firmy',
                  'Adres dostawy',
                  'Adres e-mail',
                  'Nr telefonu',
                  'Dane potrzebne do dostawy diety',
                  'Dane do faktury (opcjonalne)'
                ].map((item, idx) => (
                  <li key={idx} className="bg-brand-bg px-4 py-3 rounded-xl border border-gray-100 flex items-center gap-3 text-gray-700 text-sm font-semibold">
                    <span className="w-6 h-6 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* SECTION 3 */}
            <section id="czy-musza" className="mb-10 pt-6 border-t border-gray-100 scroll-mt-28">
              <h2 className="text-xl md:text-2xl font-bold text-brand-dark mb-4">
                <span className="text-brand-orange">3.</span> Czy muszą Państwo podawać swoje dane osobowe Usługodawcy?
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Podanie przez Użytkownika powyższych danych osobowych jest dobrowolne. Jednakże ich nie podanie będzie skutkowało brakiem możliwości realizacji umowy z Usługodawcą, przez co nie moglibyśmy świadczyć Państwu usług. Jeśli z jakiegoś powodu nie mogą Państwo podać swoich danych osobowych, niestety nie będziemy mogli zawrzeć z Państwem umowy, a w konsekwencji nie będą mogli Państwo korzystać z Serwisu.
              </p>
            </section>

            {/* SECTION 4 */}
            <section id="cel-podstawa" className="mb-10 pt-6 border-t border-gray-100 scroll-mt-28">
              <h2 className="text-xl md:text-2xl font-bold text-brand-dark mb-4">
                <span className="text-brand-orange">4.</span> Cel oraz podstawa prawna przetwarzania danych osobowych Użytkowników
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Państwa dane osobowe określone w punkcie 2 Polityki prywatności, będą przetwarzane na podstawie wyrażonej przez Państwa zgody.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Podane przez Państwa dane osobowe będą przetwarzane w celu wykonywania umowy zawartej z Usługodawcą, w szczególności do założenia i utrzymania konta w Serwisie, możliwości złożenia zamówienia, dokonania zakupu wybranych produktów i dostarczenia zamówienia przez naszego kierowcę (dalej: Kierowca) oraz możliwości świadczenia usług drogą elektroniczną i obsługi Państwa reklamacji oraz zgłoszeń. Usługodawca zobowiązuje Kierowcę do zapewnienia pełnej ochrony przekazanych mu danych osobowych.
              </p>
            </section>

            {/* SECTION 5 */}
            <section id="czas-przechowywania" className="mb-10 pt-6 border-t border-gray-100 scroll-mt-28">
              <h2 className="text-xl md:text-2xl font-bold text-brand-dark mb-4">
                <span className="text-brand-orange">5.</span> Przez jaki czas przechowujemy podane przez Państwa dane osobowe?
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Dane określone w punkcie 2 Polityki prywatności, będą przechowywane do momentu usunięcia konta w Serwisie, a także po usunięciu konta w Serwisie jednie w celach:
              </p>
              <ul className="space-y-2 list-none pl-0 mb-4">
                <li className="flex items-start gap-2.5 text-gray-600">
                  <span className="text-brand-orange mt-1">✓</span>
                  <span>wykonania obowiązków wynikających z przepisów prawa, w tym w szczególności podatkowych i rachunkowych;</span>
                </li>
                <li className="flex items-start gap-2.5 text-gray-600">
                  <span className="text-brand-orange mt-1">✓</span>
                  <span>dochodzenia roszczeń w związku z wykonywaniem umowy z Usługodawcą.</span>
                </li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                Dane osobowe zebrane do celów marketingowych, na które Użytkownik wyraził odrębną zgodę, przechowujemy przez okres wykonywania działań marketingowych lub do momentu wniesienia sprzeciwu przez Użytkownika wobec przetwarzania jego danych osobowych.
              </p>
            </section>

            {/* SECTION 6 */}
            <section id="odbiorcy" className="mb-10 pt-6 border-t border-gray-100 scroll-mt-28">
              <h2 className="text-xl md:text-2xl font-bold text-brand-dark mb-4">
                <span className="text-brand-orange">6.</span> Komu udostępniamy dane osobowe Użytkowników
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Państwa dane osobowe udostępniamy stronom transakcji, które zawierają Państwo w Serwisie oraz podmiotom wspierającym nas w świadczeniu usług drogą elektroniczną, czyli takim, które zapewniają usługi płatnicze, naszym pracownikom i współpracownikom, w tym Kierowcom, dostawcy Serwisu, firmie hostingowej obsługującej naszą pocztę mailową, podmiotom współpracującym z Nami przy obsłudze spraw księgowych, podatkowych i prawnych.
              </p>
              <div className="bg-brand-bg rounded-2xl p-6 border border-gray-100 text-gray-600 leading-relaxed text-sm">
                <p className="font-bold text-brand-dark mb-2">Płatności elektroniczne:</p>
                Dane transakcyjne, w tym dane osobowe, są przekazywane również na rzecz podmiotu obsługującego płatności internetowe tj. <strong>Autopay S.A.</strong> z siedzibą w Sopocie, adres: 81-718 Sopot, ul. Powstańców Warszawy 6, zarejestrowanym w Sądzie Rejonowym Gdańsk-Północ, VIII Wydział Gospodarczy Krajowego Rejestru Sądowego, nr KRS 0000320590, o kapitale zakładowym w wysokości 2 205 500 PLN (w całości wpłaconym), NIP: 585-13-51-185, będącym dostawcą usług płatniczych w rozumieniu ustawy z dnia 19 sierpnia 2011 r. o usługach płatniczych (dalej: Autopay) w zakresie niezbędnym do obsługi płatności. Autopay pełni rolę administratora przekazanych mu danych osobowych.
              </div>
            </section>

            {/* SECTION 7 */}
            <section id="bezpieczenstwo" className="mb-10 pt-6 border-t border-gray-100 scroll-mt-28">
              <h2 className="text-xl md:text-2xl font-bold text-brand-dark mb-4">
                <span className="text-brand-orange">7.</span> Bezpieczeństwo danych osobowych
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Usługodawca zabezpiecza dane osobowe przed ich udostępnieniem osobom nieupoważnionym, zabraniem przez osobę nieuprawnioną, przetwarzaniem z naruszeniem obowiązujących przepisów prawa oraz zmianą, utratą, uszkodzeniem lub zniszczeniem.
              </p>
            </section>

            {/* SECTION 8 */}
            <section id="prawa" className="mb-10 pt-6 border-t border-gray-100 scroll-mt-28">
              <h2 className="text-xl md:text-2xl font-bold text-brand-dark mb-4">
                <span className="text-brand-orange">8.</span> Przechowywanie danych osobowych i prawa Użytkownika
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Użytkownicy mają prawo do żądania od administratora dostępu do danych osobowych, prawo ich sprostowania, usunięcia, ograniczenia przetwarzania, prawo do przenoszenia danych, prawo wniesienia sprzeciwu, prawo do cofnięcia zgody. W przypadku stwierdzenia, że przetwarzanie danych osobowych przez nas narusza przepisy RODO, mają prawo wnieść skargę do Prezesa Urzędu Ochrony Danych Osobowych.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                W trakcie zamawiania produktów, do momentu ostatecznego potwierdzenia poprzez naciśnięcie odpowiedniego przycisku, Użytkownicy posiadający konto w Serwisie mają możliwość samodzielnego korygowania wprowadzonych danych poprzez edycję profilu konta.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Weryfikacji danych lub korekty zamówienia można dokonać także poprzez wysłanie wiadomości e-mail do Usługodawcy na adres: <a href="mailto:goodlunch243@gmail.com" className="text-brand-orange font-bold hover:underline">goodlunch243@gmail.com</a>
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Użytkownik ma możliwość zmiany danych wprowadzonych podczas tworzenia konta w każdym czasie w ramach udostępnionych opcji.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Klienci posiadający konto w Serwisie o zmianie niniejszej Polityki prywatności zostaną poinformowani za pośrednictwem korespondencji e-mail.
              </p>
              <p className="text-gray-600 leading-relaxed text-sm bg-brand-bg p-4 rounded-xl border border-gray-100">
                W sprawach nieuregulowanych niniejszym dokumentem zastosowanie mają przepisy prawa polskiego w tym Kodeksu cywilnego, a także prawa Unii Europejskiej, w szczególności RODO (Rozporządzenie Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE).
              </p>
            </section>

            {/* SECTION 9 */}
            <section id="eog" className="mb-10 pt-6 border-t border-gray-100 scroll-mt-28">
              <h2 className="text-xl md:text-2xl font-bold text-brand-dark mb-4">
                <span className="text-brand-orange">9.</span> Czy przekazujemy Państwa dane do państw spoza Europejskiego Obszaru Gospodarczego (EOG)?
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Państwa dane osobowe mogą być przekazywane do państw spoza Europejskiego Obszaru Gospodarczego, podmiotom wspierającym nas w świadczeniu usług drogą elektroniczną takich jak wysyłanie poczty e-mail, wysyłanie powiadomień, hosting danych.
              </p>
            </section>

            {/* SECTION 10 */}
            <section id="profilowanie" className="mb-10 pt-6 border-t border-gray-100 scroll-mt-28">
              <h2 className="text-xl md:text-2xl font-bold text-brand-dark mb-4">
                <span className="text-brand-orange">10.</span> Czy przetwarzamy Państwa dane osobowe automatycznie (w tym poprzez profilowanie) w sposób wpływający na Państwa prawa?
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Państwa dane osobowe nie będą przetwarzane w sposób zautomatyzowany (w tym w formie profilowania).
              </p>
            </section>

            {/* SECTION 11 */}
            <section id="cookies" className="mb-10 pt-6 border-t border-gray-100 scroll-mt-28">
              <h2 className="text-xl md:text-2xl font-bold text-brand-dark mb-4">
                <span className="text-brand-orange">11.</span> Polityka cookies
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Korzystanie z Serwisu jest realizowane za pomocą bezpiecznego Protokołu SSL, który wpływa na ochronę transmisji danych w sieci Internet.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Serwis może wykorzystywać pliki cookies (tzw. ciasteczka), czyli pliki z informacją, które są zapisywane przez serwer Usługodawcy na komputerze Użytkownika. Stosowanie plików cookies umożliwia podnoszenie jakości usług oferowanych przez Serwis poprzez:
              </p>
              <ol className="space-y-2 list-none pl-0 mb-6">
                <li className="flex items-start gap-2.5 text-gray-600">
                  <span className="text-brand-orange font-bold">a.</span>
                  <span>usprawnienie procesu wyboru i zamawiania produktów;</span>
                </li>
                <li className="flex items-start gap-2.5 text-gray-600">
                  <span className="text-brand-orange font-bold">b.</span>
                  <span>informowanie o preferencjach Użytkownika;</span>
                </li>
                <li className="flex items-start gap-2.5 text-gray-600">
                  <span className="text-brand-orange font-bold">c.</span>
                  <span>tworzenie statystyk dotyczących korzystania przez Użytkowników z usług Serwisu.</span>
                </li>
              </ol>
              <p className="text-gray-600 leading-relaxed mb-4">
                Pliki Cookies zazwyczaj zawierają nazwę strony internetowej, z której pochodzą, czas przechowywania ich na urządzeniu końcowym oraz unikalny numer. W ramach Serwisu wykorzystujemy następujące rodzaje plików Cookies:
              </p>
              <ul className="space-y-3 list-none pl-0 mb-6">
                {[
                  { name: '„sesyjne”', desc: 'przechowywane są w urządzeniu końcowym Użytkownika do czasu wylogowania, opuszczenia strony internetowej lub wyłączenia przeglądarki internetowej;' },
                  { name: '„stałe”', desc: 'przechowywane w urządzeniu końcowym Użytkownika przez czas określony w parametrach plików Cookies lub do czasu ich usunięcia przez Użytkownika;' },
                  { name: '„wydajnościowe”', desc: 'umożliwiają zbieranie informacji o sposobie korzystania ze stron internetowych Serwisu;' },
                  { name: '„niezbędne”', desc: 'umożliwiające korzystanie z usług dostępnych w ramach Serwisu;' },
                  { name: '„funkcjonalne”', desc: 'umożliwiające zapamiętanie wybranych przez Użytkownika ustawień i personalizację interfejsu Użytkownika;' },
                  { name: '„własne”', desc: 'zamieszczane przez Serwis;' },
                  { name: '„zewnętrzne”', desc: 'pochodzące z witryny zewnętrznej niż Serwis;' },
                ].map((cookie, idx) => (
                  <li key={idx} className="flex gap-2.5 text-gray-600 text-sm">
                    <span className="text-brand-orange mt-1">•</span>
                    <span><strong>{cookie.name}</strong> - {cookie.desc}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-lg font-bold text-brand-dark mt-6 mb-3">Mechanizm Cookies w Serwisie</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Nasza witryna wykorzystuje pliki Cookies, które ułatwiają korzystanie z jej zasobów. Cookies zawierają użyteczne informacje i są przechowywane na komputerze Użytkownika - nasz serwer może je odczytać przy ponownym połączeniu się z tym komputerem. Wykorzystanie plików cookies nie umożliwia pobrania jakichkolwiek danych osobowych i adresowych Użytkownika ani innych poufnych informacji z jego komputera. Stosowanie „ciasteczek” nie jest możliwe, jeśli w przeglądarce internetowej wyłączono opcję zapisywania plików cookies. Wyłączenie powołanej opcji nie uniemożliwia korzystania z Serwisu, może jednak spowodować pewne utrudnienia. Większość przeglądarek internetowych domyślnie dopuszcza przechowywanie plików Cookies w urządzeniu końcowym Użytkownika. Każdy Użytkownik naszego Serwisu ma możliwość zmiany ustawień dotyczących plików Cookies w ustawieniach przeglądarki internetowej.
              </p>
              
              <p className="text-gray-600 leading-relaxed mb-2 font-semibold">
                Serwis do prawidłowego działania wymaga najnowszej wersji jednej z poniższych przeglądarek:
              </p>
              <ul className="grid grid-cols-2 sm:grid-cols-5 gap-2 list-none pl-0">
                {['Chrome', 'Firefox', 'Edge', 'Opera', 'Safari'].map((browser, idx) => (
                  <li key={idx} className="bg-brand-bg py-2.5 px-4 rounded-xl border border-gray-100 text-center font-bold text-gray-700 text-sm">
                    {browser}
                  </li>
                ))}
              </ul>
            </section>

            {/* SECTION 12 */}
            <section id="dodatkowe" className="mb-10 pt-6 border-t border-gray-100 scroll-mt-28">
              <h2 className="text-xl md:text-2xl font-bold text-brand-dark mb-4">
                <span className="text-brand-orange">12.</span> Dodatkowe informacje
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                W ramach Serwisu mogą zostać zamieszczone zewnętrzne linki umożliwiające jego Użytkownikom bezpośrednie dotarcie do innych stron internetowych bądź też podczas korzystania z Serwisu w Państwa urządzeniu mogą być dodatkowo umieszczone pliki Cookies pochodzące od innych podmiotów w szczególności od dostawców takich jak: Facebook, Google w celu umożliwienia Państwu skorzystania z funkcjonalności Serwisu zintegrowanych z tymi serwisami. Każdy z dostawców określa zasady korzystania z plików Cookies w swojej polityce prywatności w związku z czym ze względów bezpieczeństwa zalecamy, aby przed skorzystaniem z takich stron zapoznać się z dokumentem dotyczącym Polityki prywatności.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Zastrzegamy sobie prawo zmiany Polityki prywatności poprzez opublikowanie nowej polityki prywatności na naszej stronie internetowej. Po dokonaniu zmiany polityka prywatności ukaże się na stronie z nową datą, a osobom, które posiadają konto w Serwisie zostanie przesłana informacja mailowa o zmianie dokumentu.
              </p>

              {/* Sign-off */}
              <div className="border-t border-gray-100 pt-6 flex flex-col items-end">
                <p className="text-gray-400 text-sm">Z poważaniem,</p>
                <p className="font-extrabold text-lg text-brand-orange mt-1">Zespół GoodLunch</p>
              </div>
            </section>

          </article>

        </div>
      </div>
    </main>
  );
}
