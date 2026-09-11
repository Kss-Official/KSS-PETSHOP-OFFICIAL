import React from 'react';
import { getCloudinaryImageUrl } from '../../lib/utils';

interface CtaBannerProps {
  whatsappUrl?: string;
  title?: React.ReactNode;
  subtitle?: string;
  imagePublicId?: string;
  customSrc?: string;
  image3D?: boolean;
  hideImage?: boolean;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({
  whatsappUrl = 'https://chat.whatsapp.com/YOUR_INVITE_CODE_HERE',
  title = (
    <>
      Happy Pet.{' '}
      <span
        className="text-[#EF7C3C]"
        style={{ WebkitTextStroke: '0.75px #16241B' }}
      >
        Happy Home.
      </span>
      <br className="hidden sm:inline" /> It's That Simple.
    </>
  ),
  subtitle = 'Join thousands of pet parents who trust us for everything their pets deserve.',
  imagePublicId = 'cta_cat_sunglasses_flawless_seamless',
  customSrc,
  image3D = false,
  hideImage = false,
}) => {
  const ctaImageUrl = customSrc || getCloudinaryImageUrl(imagePublicId);
  const avatar1Url = getCloudinaryImageUrl('avatar_user_1');
  const avatar2Url = getCloudinaryImageUrl('avatar_user_2');
  const avatar3Url = getCloudinaryImageUrl('avatar_user_3');
  const avatar4Url = getCloudinaryImageUrl('avatar_user_4');

  return (
    <section id="cta" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-16 overflow-visible">
      {image3D && (
        <style>{`
          .cta-img-3d {
            transform: perspective(800px) rotateY(-4deg) rotateX(2deg) scale(1.05);
            filter:
              drop-shadow(0 8px 16px rgba(239, 124, 60, 0.40))
              drop-shadow(0 16px 36px rgba(239, 124, 60, 0.35))
              drop-shadow(0 28px 50px rgba(255, 180, 50, 0.35));
            transform-style: preserve-3d;
            transition: transform 0.3s ease;
          }
          .cta-img-3d:hover {
            transform: perspective(800px) rotateY(0deg) rotateX(0deg) scale(1.07);
          }
        `}</style>
      )}

      <div className="bg-[#FFCA28] rounded-[36px] p-6 sm:p-10 lg:p-12 relative overflow-visible shadow-[0_20px_50px_rgba(255,202,40,0.28)] border border-[#F5C222]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* Left CTA image — hidden when hideImage=true */}
          {!hideImage && (
            <div className="lg:col-span-5 flex justify-center items-end relative overflow-visible z-20">
              <div className="relative -mt-24 sm:-mt-32 lg:-mt-40 -mb-6 sm:-mb-10 lg:-mb-14 w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[460px] flex justify-center items-end pointer-events-none">
                <div
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4/5 h-10 bg-[#EF7C3C]/35 rounded-full blur-xl -z-10"
                />
                <img
                  src={ctaImageUrl}
                  alt="CTA illustration"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://res.cloudinary.com/vphylrop/image/upload/v1788886319/ChatGPT_Image_Sep_8_2026_10_21_30_PM.png';
                  }}
                  className={
                    image3D
                      ? 'w-full h-auto object-contain cta-img-3d'
                      : 'w-full h-auto object-contain [filter:drop-shadow(0_12px_24px_rgba(239,124,60,0.35))_drop-shadow(0_28px_40px_rgba(255,180,50,0.35))]'
                  }
                />
              </div>
            </div>
          )}

          {/* Right Content */}
          <div className={`${hideImage ? 'lg:col-span-12' : 'lg:col-span-7'} space-y-6 text-center lg:text-left z-10`}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#16241B] tracking-tight leading-[1.15]">
              {title}
            </h2>
            <p className="text-base sm:text-lg text-[#3E3A1A] max-w-xl font-medium leading-relaxed">
              {subtitle}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 bg-[#009E66] hover:bg-[#008757] text-white font-black rounded-full shadow-[0_8px_20px_rgba(0,158,102,0.35)] transition-all flex items-center gap-2 text-base cursor-pointer inline-flex"
              >
                Join the Pack
              </a>

              <div className="bg-[#FFE58A]/95 backdrop-blur-xs px-4 py-2.5 rounded-full border border-white/50 shadow-xs flex items-center gap-3">
                <div className="flex -space-x-2">
                  <img
                    className="w-7 h-7 rounded-full ring-2 ring-white object-cover object-top"
                    src={avatar1Url}
                    alt="User Reviewer 1"
                  />
                  <img
                    className="w-7 h-7 rounded-full ring-2 ring-white object-cover object-top"
                    src={avatar2Url}
                    alt="User Reviewer 2"
                  />
                  <img
                    className="w-7 h-7 rounded-full ring-2 ring-white object-cover object-top"
                    src={avatar3Url}
                    alt="User Reviewer 3"
                  />
                  <img
                    className="w-7 h-7 rounded-full ring-2 ring-white object-cover object-top"
                    src={avatar4Url}
                    alt="User Reviewer 4"
                  />
                </div>
                <span className="text-xs font-bold text-[#16241B]">
                  25,000+ tails wagging!
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
