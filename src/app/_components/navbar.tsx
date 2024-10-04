import React from 'react';
import Image from "next/image";
import Link from 'next/link'

const Navbar: React.FC = () => {
return (
    <nav className="navbar bg-base-300">
            <div className="w-full flex justify-between md:hidden">
                    <Link className="btn btn-ghost text-lg" href="/" >
                         <Image alt="Logo" src="/icons/icon.svg" height={64} width={64} className="w-7" />
                            AouPlr
                    </Link>
    
                    <div className="dropdown dropdown-end">
                            <button className="btn btn-ghost">
                                    <i className="fa-solid fa-bars text-sm">Menu</i>
                            </button>
    
                            <ul tabIndex={0} className="dropdown-content menu z-[1] bg-base-200 p-6 rounded-box shadow w-56 gap-2">
                                    <li><Link href="/about">About</Link></li>
                                    <li><Link href="/gpacalc">GPA Calculator</Link></li>
                                    <li><Link href="/ctools">Course tools</Link></li>
                                    <li><a href="https://www.facebook.com/groups/aougroup/" rel="noopener noreferrer" target="_blank">Community</a></li>
                                    <Link href="/guides" className="btn btn-primary btn-sm">
                                            <i className="fa-brands fa-space-awesome"></i>
                                            Guides
                                    </Link>
                            </ul>
                    </div>
            </div>
    
            <div className="w-full hidden md:grid grid-cols-5 gap-2 rounded-box">
                    <ul className="col-span-2 menu md:menu-horizontal justify-end hidden">
                            <li><Link href="/about">About</Link></li>
                            <li><Link href="/gpacalc">GPA Calculator</Link></li>
                            <li><Link href="/ctools">Course tools</Link></li>
                    </ul>
    
                    <div className="flex justify-center">
                    <Link href="/">
                                <Image alt="Logo" src="/icons/icon.svg" height={128} width={128} className="w-10" />
                                    AouPlr
                    </Link>
                    </div>
                    
    
                    <ul className="col-span-2 menu md:menu-horizontal justify-start gap-4 hidden">
                    <li><a href="https://www.facebook.com/groups/aougroup/" rel="noopener noreferrer" target="_blank" >Community</a></li>
                    <Link href="/guides" className="btn btn-primary btn-sm">
                                    <i className="fa-brands fa-space-awesome"></i>
                                    Guides
                            </Link>
                    </ul>
            </div>
    </nav>
);
};

export default Navbar;




