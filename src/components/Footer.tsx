import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white pt-20 pb-10 relative z-10 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Connect With Me Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-20">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
             <a href="#home" className="text-3xl font-serif font-bold text-textMain block mb-6">
                MBell MakeUp<span className="text-primary">.</span>
             </a>
             <p className="text-textMain/60 font-sans leading-relaxed">
               Enhancing natural beauty with a touch of elegance. Professional makeup services for all your special moments.
             </p>
          </div>

          <div>
             <h4 className="font-serif text-xl font-bold text-textMain mb-6">Contact</h4>
             <ul className="space-y-4">
                <li>
                  <a href="https://wa.me/6288293473765" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-textMain/70 hover:text-primary transition-colors group">
                    <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    </span>
                    <span>+62 882-9347-3765</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:baprilian29@gmail.com" className="flex items-center gap-3 text-textMain/70 hover:text-primary transition-colors group">
                    <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    </span>
                    <span>baprilian29@gmail.com</span>
                  </a>
                </li>
             </ul>
          </div>

          <div>
             <h4 className="font-serif text-xl font-bold text-textMain mb-6">Instagram</h4>
             <ul className="space-y-4">
                <li>
                  <a href="https://www.instagram.com/mbell.makeup/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-textMain/70 hover:text-primary transition-colors group">
                    <span className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </span>
                    <span>@mbell.makeup (Brand)</span>
                  </a>
                </li>
                <li>
                   <a href="https://www.instagram.com/bellaaprrrr_/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-textMain/70 hover:text-primary transition-colors group">
                    <span className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </span>
                    <span>@bellaaprrrr_ (Personal)</span>
                  </a>
                </li>
             </ul>
          </div>

          <div>
             <h4 className="font-serif text-xl font-bold text-textMain mb-6">TikTok</h4>
             <ul className="space-y-4">
                <li>
                  <a href="https://www.tiktok.com/@bella_aprilian?lang=id-ID" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-textMain/70 hover:text-primary transition-colors group">
                    <span className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="fill-current"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                    </span>
                    <span>@bella_aprilian</span>
                  </a>
                </li>
             </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-textMain/40 font-sans">
          <p>&copy; {new Date().getFullYear()} MBELL MAKEUP. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Designed with Elegance.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;