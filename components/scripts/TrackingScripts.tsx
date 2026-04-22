'use client'
import Script from 'next/script'

export default function TrackingScripts() {
    return (
        <>
            {/* Google tag (gtag.js) */}
            <Script
                async
                src="https://www.googletagmanager.com/gtag/js?id=AW-18066459268"
                strategy="afterInteractive"
            />
            <Script id="google-tag" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-18066459268');
        `}
            </Script>

            {/* Facebook Meta Pixel */}
            <Script id="meta-pixel" strategy="afterInteractive">
                {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1799620697600783');
          fbq('track', 'PageView');
        `}
            </Script>
            <noscript>
                <img
                    height="1"
                    width="1"
                    style={{ display: 'none' }}
                    src="https://www.facebook.com/tr?id=1799620697600783&ev=PageView&noscript=1"
                    alt=""
                />
            </noscript>

            {/* Microsoft Clarity */}
            <Script id="microsoft-clarity" strategy="afterInteractive">
                {`
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "vqefj7behg");
        `}
            </Script>
        </>
    )
}
