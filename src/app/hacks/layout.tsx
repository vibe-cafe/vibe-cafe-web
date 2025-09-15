import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vibe Hacks #01 - 24小时 AI 编程黑客松 | VibeFriends × SegmentFault',
  description: 'VibeFriends 和 SegmentFault 联合主办的 24 小时 Vibe Coding 黑客松。33 组参赛者，真实用户投票，数万元奖金等你来拿！主题：用 Vibe Coding 优化 Vibe Coding。地点：北京，时间：2025年9月13日。',
  keywords: 'Vibe Hacks, 黑客松, AI编程, Vibe Coding, VibeFriends, SegmentFault, 编程比赛, 北京, 24小时, AI开发',
  openGraph: {
    title: 'Vibe Hacks #01 - 24小时 AI 编程黑客松',
    description: 'VibeFriends 和 SegmentFault 联合主办的 24 小时 Vibe Coding 黑客松。33 组参赛者，真实用户投票，数万元奖金等你来拿！',
    type: 'website',
    locale: 'zh_CN',
    alternateLocale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vibe Hacks #01 - 24小时 AI 编程黑客松',
    description: 'VibeFriends 和 SegmentFault 联合主办的 24 小时 Vibe Coding 黑客松。',
  },
  alternates: {
    languages: {
      'zh': '/hacks',
      'en': '/hacks', 
    },
  },
};

export default function HacksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}