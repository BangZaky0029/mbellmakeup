import React from 'react';

interface FooterProps {
  onLinkClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onLinkClick }) => {
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      
      if (onLinkClick) {
        onLinkClick();
      }

      setTimeout(() => {
        const targetId = href.replace('#', '');
        const element = document.getElementById(targetId);
        
        if (element) {
          const offset = 85;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          window.history.pushState(null, '', href);
        }
      }, 100);
    }
  };

  return (
    <footer className="bg-mbell-surface/70 pt-16 pb-12 relative z-10 border-t border-mbell-border text-left">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Brand Col */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
             <a 
               href="#home" 
               onClick={(e) => handleSmoothScroll(e, '#home')}
               className="text-2xl font-serif font-medium text-mbell-ink block mb-4 group"
             >
                MBell MakeUp<span className="text-mbell-primary">.</span>
             </a>
             <p className="text-sm font-sans text-mbell-muted leading-relaxed max-w-sm">
               Sentuhan riasan personal dan elegan untuk momen terindah dalam hidupmu. Berdedikasi menghadirkan kecantikan alami dengan kenyamanan maksimal sepanjang hari.
             </p>
          </div>

          {/* Kontak & Reservasi */}
          <div>
             <h4 className="font-serif text-lg font-medium text-mbell-ink mb-4">Kontak & Reservasi</h4>
             <ul className="space-y-3 font-sans text-sm text-mbell-muted">
                <li>
                  <a 
                    href="https://wa.me/6288293473765" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-mbell-primary transition-colors flex items-center gap-2.5"
                  >
                    <span className="w-7 h-7 rounded-full bg-mbell-canvas border border-mbell-border flex items-center justify-center text-mbell-primary shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    </span>
                    <span>+62 882-9347-3765</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:baprilian29@gmail.com" 
                    className="hover:text-mbell-primary transition-colors flex items-center gap-2.5"
                  >
                    <span className="w-7 h-7 rounded-full bg-mbell-canvas border border-mbell-border flex items-center justify-center text-mbell-primary shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    </span>
                    <span>baprilian29@gmail.com</span>
                  </a>
                </li>
             </ul>
          </div>

          {/* Instagram */}
          <div>
             <h4 className="font-serif text-lg font-medium text-mbell-ink mb-4">Instagram</h4>
             <ul className="space-y-3 font-sans text-sm text-mbell-muted">
                <li>
                  <a 
                    href="https://www.instagram.com/mbell.makeup/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-mbell-primary transition-colors flex items-center gap-2"
                  >
                    <span>@mbell.makeup</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.instagram.com/bellaaprrrr_/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-mbell-primary transition-colors flex items-center gap-2"
                  >
                    <span>@bellaaprrrr_</span>
                  </a>
                </li>
             </ul>
          </div>

          {/* TikTok & Info */}
          <div>
             <h4 className="font-serif text-lg font-medium text-mbell-ink mb-4">TikTok & Lokasi</h4>
             <ul className="space-y-3 font-sans text-sm text-mbell-muted">
                <li>
                  <a 
                    href="https://www.tiktok.com/@bella_aprilian" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-mbell-primary transition-colors flex items-center gap-2"
                  >
                    <span>@bella_aprilian</span>
                  </a>
                </li>
                <li className="text-xs leading-relaxed text-mbell-muted/80 pt-1">
                  Melayani sesi makeup panggilan (on-location) untuk area Lampung dan sekitarnya.
                </li>
             </ul>
          </div>
        </div>

        {/* Footer Bottom Row */}
        <div className="border-t border-mbell-border pt-8 flex flex-col sm:flex-row justify-between items-center text-xs font-sans text-mbell-muted gap-3">
          <p>&copy; {new Date().getFullYear()} MBell MakeUp. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-4">
            <a 
              href="#home" 
              onClick={(e) => handleSmoothScroll(e, '#home')}
              className="hover:text-mbell-primary transition-colors flex items-center gap-1.5"
            >
              <span>Kembali ke atas</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;