import React from 'react';
import googleLogo from '../../assets/partners/google.png';
import microsoftLogo from '../../assets/partners/microsoft.png';
import awsLogo from '../../assets/partners/aws.png';
import metaLogo from '../../assets/partners/meta.png';
import netflixLogo from '../../assets/partners/netflix.png';
import spotifyLogo from '../../assets/partners/spotify.png';

const partners = [
  {
    name: 'Google',
    src: googleLogo,
    widthClass: 'w-24 sm:w-28',
    tag: 'Cloud & AI Partner',
    color: '#4285F4',
  },
  {
    name: 'Microsoft',
    src: microsoftLogo,
    widthClass: 'w-20 sm:w-24',
    tag: 'Enterprise Systems',
    color: '#00A4EF',
  },
  {
    name: 'Amazon AWS',
    src: awsLogo,
    widthClass: 'w-20 sm:w-24',
    tag: 'Cloud Infrastructure',
    color: '#FF9900',
  },
  {
    name: 'Meta',
    src: metaLogo,
    widthClass: 'w-20 sm:w-24',
    tag: 'React & Front-End',
    color: '#0668E1',
  },
  {
    name: 'Netflix',
    src: netflixLogo,
    widthClass: 'w-20 sm:w-24',
    tag: 'Streaming & Scale',
    color: '#E50914',
  },
  {
    name: 'Spotify',
    src: spotifyLogo,
    widthClass: 'w-24 sm:w-28',
    tag: 'Data & Audio Systems',
    color: '#1ED760',
  },
];

const PartnersSection = () => {
  return (
    <section className="py-14 bg-white dark:bg-[#151B24] border-y border-gray-100 dark:border-gray-800 transition-colors relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#128F80]/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#64748B] dark:text-gray-400">
            Trusted by engineers, designers, and managers from leading global innovators
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-5 items-center">
          {partners.map((partner) => {
            return (
              <div
                key={partner.name}
                className="group relative flex flex-col items-center justify-center py-5 px-3 rounded-2xl bg-gray-50/60 dark:bg-slate-900/40 border border-[#E5EAF0] dark:border-gray-800 select-none"
              >
                <div className="h-10 flex items-center justify-center w-full">
                  <img
                    src={partner.src}
                    alt={`${partner.name} logo`}
                    className={`${partner.widthClass} h-auto max-h-10 object-contain`}
                    loading="lazy"
                  />
                </div>
                <div className="mt-2 text-[10px] font-semibold tracking-wide text-center text-[#128F80] dark:text-[#3CBBA7]">
                  {partner.tag}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
