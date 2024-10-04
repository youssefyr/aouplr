"use client"
import React, { useEffect, useState } from 'react';
import { getGuides, getGuideContent } from '@/lib/guides';
import Link from 'next/link';
import Navbar from '@/app/_components/navbar';
import ThemeSelect from '@/app/_components/themeselect';
import Markdown from 'markdown-to-jsx'


interface GuideProps {
  name: string;
  path: string;
}

export default function renderGuide({ params }: { params: { guide: string } }) {
  const [guidess, setGuides] = useState<GuideProps[]>([]);
  const [content, setContent] = useState<string>('');
  const guide = params.guide;
  useEffect(() => {
    const fetchGuides = async () => {
      const guidesData = getGuides();
      setGuides(guidesData);
    };

    fetchGuides();
  }, []);

  useEffect(() => {
    if (guide) {
      const fetchContent = async () => {
        const contentData = await getGuideContent(`${guide}.md`);
        setContent(contentData);
      };

      fetchContent();
    }
  }, [guide]);

  if (!content) return ( <div>
    <span className="loading loading-infinity loading-lg"></span> <div>Loading...</div></div>
  );
  console.log(content)

  console.log(guide)
  const guideTitle = guide.replace(/_/g, ' ');

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <Link href="/guides" className='btn btn-primary mb-4'>
          Back to Guides
        </Link>
        <h1 className="text-2xl font-bold mb-4 text-center">{guideTitle}</h1>
        <Markdown options={{ wrapper: 'article' }}>{content}</Markdown>
      </div>
      <ThemeSelect />
    </div>
  );
};
