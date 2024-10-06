"use client"
import React, { useEffect } from 'react';
import { themeChange } from 'theme-change';
import Link from 'next/link';
import Image from 'next/image';

const ThemeSelect: React.FC = () => {
    useEffect(() => {
        themeChange(false);
        }, []);    
        return (
          <footer className="fixed bottom-0 left-0 right-0 p-4 md:bg-transparent flex justify-between items-center">
          <Link className="btn btn-ghost btn-sm btn-circle link link-hover" href="https://github.com/youssefyr/aouplr" target='_blank'>
            <Image src="/icons/github.svg" alt='github' height={64} width={64} className="w-7" />
          </Link>
            <select className="select select-bordered w-min md:w-auto" data-choose-theme>
              <option disabled value="">Pick a theme</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="lemonade">Lemonade</option>
              <option value="synthwave">Synthwave</option>
            </select>
          </footer>
        );
      };
      

export default ThemeSelect;
