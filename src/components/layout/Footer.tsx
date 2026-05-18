import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary text-white/60 py-4 px-6 text-xs border-t border-white/10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} CEAT. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
};
