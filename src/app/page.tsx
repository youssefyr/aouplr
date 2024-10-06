"use client"
import Navbar from './_components/navbar';
import ThemeSelect from "./_components/themeselect";
import Link from "next/link";
import { useState, useEffect } from 'react';



interface WindowWithMSStream extends Window {
  MSStream?: unknown;
}

function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as WindowWithMSStream).MSStream
    );

    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
  }, []);

  if (isStandalone) {
    return null; // Don't show install button if already installed
  }

  return (
    <div>
      <h3>Install App</h3>
      <button>Add to Home Screen</button>
      {isIOS && (
        <p>
          To install this app on your iOS device, tap the share button
          <span role="img" aria-label="share icon">
            {' '}
            ⎋{' '}
          </span>
          and then &apos;Add to Home Screen&apos;
          <span role="img" aria-label="plus icon">
            {' '}
            ➕{' '}
          </span>.
        </p>
      )}
    </div>
  );
}

 

export default function Home() {
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
              $ npm i app-name
              <i className="fa-solid fa-copy text-lg text-secondary"></i>
            </code>
          </div>
        </div>
      </div>
      <ThemeSelect />
      <InstallPrompt />
    </>
  );
}
