import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

const i18n = createInstance();

i18n
  .use(initReactI18next)
  .init({
    lng: 'zh', // default language
    fallbackLng: 'en',
    resources: {
      en: {
        translation: {
          hero: {
            title: 'VibeCafé',
            subtitle: 'Keep the vibe',
            description: 'A community and service for AI one-person creators',
          },
          manifesto: {
            title: 'Manifesto',
            vision: 'Vision: Build a vibe lifestyle, where you can create freely and be rewarded.',
            mission: 'Mission: Vibe Friends hack at Vibe Café, to become a Vibe Maker and earn Vibe Coins.',
            text1: 'Belief: We believe AI empowers creative individuals with ideas, aesthetics, and execution abilities.',
            text2: 'Community: We gather one-person creators with the same vibe and practice.',
            text3: 'Service: We help these individuals create and profit with their own vibe.',
          },
          vibeFriends: {
            title: 'VibeFriends',
            description: 'A community of creators who believe in and practice the Vibe creation model'
          },
          vibeCafe: {
            title: 'VibeCafé Space',
            description: 'A physical space serving Vibe creators',
            comingSoon: 'Coming soon!',
          },
          contact: {
            title: 'Subscribe: VibeFriends',
            button: 'WeChat Official: VibeFriends',
          },
          hacks: {
            audienceApplyButton: 'Audience Registration',
            seo: {
              title: 'Vibe Hacks #01 - 24-Hour AI Coding Hackathon | VibeFriends × SegmentFault',
              description: 'Join the 24-hour Vibe Coding hackathon co-hosted by VibeFriends and SegmentFault. 33 teams compete for real user votes and prizes worth tens of thousands. Theme: Optimize Vibe Coding with Vibe Coding. Beijing, September 13, 2025.',
              keywords: 'Vibe Hacks, hackathon, AI coding, Vibe Coding, VibeFriends, SegmentFault, coding competition, Beijing, 24-hour, AI development',
            },
          },
        },
      },
      zh: {
        translation: {
          hero: {
            title: 'VibeCafé',
            subtitle: 'Keep the vibe',
            description: '专注于 AI 一人创作者的社群与服务',
          },
          manifesto: {
            title: 'Manifesto',
            vision: '愿景：构建一种可以自由创作、获取回报的生活方式',
            mission: '使命：VibeFriends 在 VibeCafé 中创作，成为能够获取 VibeCoins 收益的 VibeMaker',
            text1: '理念：我们相信 AI 带给有想法、创意、审美、执行力的个体巨大的创作能力',
            text2: '社区：我们汇聚有相同 vibe 理念并践行的一人创作者',
            text3: '服务：我们帮助这些个体用自己的 vibe 去创作，获得收益',
          },
          vibeFriends: {
            title: 'VibeFriends',
            description: '一群相信和践行 Vibe 创作模式的人',
          },
          vibeCafe: {
            title: 'VibeCafé 空间',
            description: '一个服务于 Vibe 创作者的实体空间',
            comingSoon: '敬请期待',
          },
          contact: {
            title: '关注我们：VibeFriends',
            button: '微信公众号：VibeFriends',
          },
          hacks: {
            audienceApplyButton: '观众报名',
            seo: {
              title: 'Vibe Hacks #01 - 24小时 AI 编程黑客松 | VibeFriends × SegmentFault',
              description: 'VibeFriends 和 SegmentFault 联合主办的 24 小时 Vibe Coding 黑客松。33 组参赛者，真实用户投票，数万元奖金等你来拿！主题：用 Vibe Coding 优化 Vibe Coding。地点：北京，时间：2025年9月13日。',
              keywords: 'Vibe Hacks, 黑客松, AI编程, Vibe Coding, VibeFriends, SegmentFault, 编程比赛, 北京, 24小时, AI开发',
            },
          },
        },
      },
    },
  });

export default i18n; 