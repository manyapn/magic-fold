"use client";

export default function MobileBlocker() {
  return (
    <div className="fixed inset-0 z-[9999] bg-cream flex items-center justify-center p-8 lg:hidden">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-6">
          <svg className="w-16 h-16 mx-auto text-mauve" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
          </svg>
        </div>
        <h1 className="font-(family-name:--font-luckiest-guy) text-2xl text-mauve-dark mb-4">
          Desktop Required
        </h1>
        <p className="text-mauve-dark/80 font-(family-name:--font-mada) leading-relaxed">
          Magic Fold works best on a laptop or desktop computer. Please switch to a larger screen to create your zine.
        </p>
      </div>
    </div>
  );
}
