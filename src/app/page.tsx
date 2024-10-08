"use client"
import Navbar from './_components/navbar';
import ThemeSelect from "./_components/themeselect";
import Link from "next/link";
import { useRef } from 'react';
import PWAInstall from '@khmyznikov/pwa-install/react-legacy';
import { PWAInstallElement } from '@khmyznikov/pwa-install';



 

export default function Home() {
  const pwaInstallRef = useRef<PWAInstallElement>(null);

  return (
    <>
      <Navbar />
      <div className="hero bg-base-200 min-h-screen">
        <div className="text-center flex flex-col items-center gap-6 max-w-lg">
          <a className="btn btn-neutral">
            Beta release - intended to work with the EG branch
            <i className="fa-solid fa-circle-arrow-right text-lg"></i>
          </a>

          <h1 className="font-bold text-5xl">
            Your new
            <span className="text-primary"> Companion</span>
          </h1>

          <span>
          Welcome to your ultimate academic companion! Manage your courses, calculate your GPA, and access helpful guides all in one place. Stay on top of your academic journey with ease and efficiency.
          </span>

          <div className="flex gap-4">
            <Link className="btn btn-primary" href="/guides">
              <i className="fa-solid fa-rocket"></i>
              Get started
            </Link>

            <code className="btn btn-ghost border border-neutral">
              $ PWA Ready
              <i className="fa-solid fa-copy text-lg text-secondary"></i>
            </code>
          </div>
        </div>
      </div>
      <ThemeSelect />
      <PWAInstall
        ref={pwaInstallRef}
        manifest-url="/manifest.json"
        onPwaInstallAvailableEvent={(event) => console.log(event)}
      ></PWAInstall>
    </>
  );
}
