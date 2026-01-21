import { useEffect, useState, type ReactNode } from "react";
import Lottie from "lottie-react";
import animationData from "@/assets/aniamtion.json";
import Image from "next/image";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  const [animationReady, setAnimationReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimationReady(true);
    }, 150);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="bg-[#0b2b36] flex justify-center w-full min-h-screen overflow-hidden">
      <div className="bg-[#0b2b36] w-full max-w-[1280px] relative overflow-hidden">
        <div className="relative w-full h-full pt-8 md:pt-[103px]">
          <Image
            className="absolute top-0 left-0 w-full h-full max-w-full md:max-w-[1084px] md:h-[729px] object-cover md:object-contain"
            alt="Vector"
            src="/cmv.svg"
            fill
            style={{ pointerEvents: "none" }}
          />

          <div className="relative z-10 px-4 md:px-8 lg:px-16 flex flex-col md:flex-row justify-between items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 text-center  md:h-auto lg:h-[265px] md:text-left flex flex-col items-center justify-between">
              <h1 className="font-semibold text-[#42e3dc] text-3xl md:text-4xl lg:text-[40px] leading-tight mb-4 md:mb-8">
                Administrator
                <br />
                <span className="text-white font-normal text-2xl">
                  Dashboard
                </span>
              </h1>
              <p className="text-white text-sm hidden md:block">
                <span className="font-semibold">Po</span>
                <span className="font-normal">wered by COM ONLINE LTD</span>
              </p>
            </div>

            <div className="w-full md:w-[581px] rounded-[20px] bg-card shadow-lg overflow-hidden">
              <div className="flex flex-col md:flex-row min-h-[305px]">
                <div className="w-full md:w-[243px] bg-gradient-to-b from-[#31B265] to-[#406F7B] md:rounded-l-[20px] relative py-4 md:py-0 flex flex-col items-center justify-center">
                  <div className="w-full h-full flex items-center justify-center overflow-hidden">
                    {animationReady ? (
                      <Lottie
                        animationData={animationData}
                        loop
                        style={{ width: 180, maxWidth: "100%" }}
                      />
                    ) : (
                      <div className="w-[180px] h-[180px] bg-[#2d594e] rounded-md animate-pulse" />
                    )}
                  </div>
                  <div className="w-[183px] max-w-[80%] h-[23px] mb-4 md:mb-[22px] bg-white rounded-[5px] flex items-center justify-center">
                    <span className="font-bold text-[#0b2b36] text-[10px]">
                      WHOLESOME UGANDA
                    </span>
                  </div>
                </div>

                <div className="flex-1 p-6 flex flex-col">
                  <h2 className="font-bold text-xl text-[#0b2b36] mb-6">
                    {title}
                  </h2>
                  <div className="flex-grow flex flex-col">{children}</div>
                  <div className="text-[9px] text-[#606060] text-right mt-4">
                    *Secure Admin Access Only
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full text-center mt-6 md:hidden">
              <p className="text-white text-sm">
                <span className="font-semibold">Po</span>
                <span className="font-normal">wered by COM ONLINE LTD</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
