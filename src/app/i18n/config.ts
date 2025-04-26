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
            subtitle: 'Keep the Vibe',
          },
          manifesto: {
            title: 'Vibe Manifesto',
            text1: 'We believe in the power of creation that resonates with the soul. Every piece of code, every product, every film, and every game should carry a unique vibe that speaks to its audience.',
            text2: 'Our mission is to gather creators who share this vision - those who don\'t just build, but craft experiences that leave lasting impressions.',
          },
          vibeFriends: {
            title: 'VibeFriends',
            description: 'A growing community of passionate creators who push the boundaries of digital innovation.',
            coders: {
              title: 'Vibe Coders',
              description: 'Crafting elegant solutions with code',
            },
            products: {
              title: 'Vibe Products',
              description: 'Building the future of digital experiences',
            },
            creators: {
              title: 'Vibe Creators',
              description: 'Bringing stories to life through various mediums',
            },
          },
          vibeCafe: {
            title: 'VibeCafé Space',
            description: 'Coming Soon: A physical space where Vibe Creators can meet, collaborate, and create together.',
            details: 'A creative hub designed for innovation and collaboration.',
            comingSoon: 'Stay tuned for the grand opening!',
          },
          contact: {
            title: 'Contact',
            description: 'Want to join the Vibe community or learn more about what we do?',
            button: 'Get in Touch',
          },
        },
      },
      zh: {
        translation: {
          hero: {
            title: 'VibeCafé',
            subtitle: 'Keep the Vibe',
          },
          manifesto: {
            title: 'Vibe 宣言',
            text1: '我们相信创作的力量能够与灵魂共鸣。每一行代码、每一个产品、每一部影片和每一款游戏，都应该带有独特的共振，与受众产生共鸣。',
            text2: '我们的使命是聚集有着相同愿景的创作者——那些不仅仅是在创造，而是在打造能留下持久印记的体验的人。',
          },
          vibeFriends: {
            title: 'VibeFriends',
            description: '一个不断成长的创作者社区，推动数字创新的边界。',
            coders: {
              title: 'Vibe 工程师',
              description: '用代码打造优雅的解决方案',
            },
            products: {
              title: 'Vibe 产品',
              description: '构建数字体验的未来',
            },
            creators: {
              title: 'Vibe 内容创作者',
              description: '通过各种媒介让故事栩栩如生',
            },
          },
          vibeCafe: {
            title: 'VibeCafé 空间',
            description: '即将到来：一个供Vibe创作者相遇、协作和创造的实体空间。',
            details: '为创新和协作设计的创意中心。',
            comingSoon: '敬请期待盛大开幕！',
          },
          contact: {
            title: '联系我们',
            description: '想加入Vibe社区或了解更多关于我们的信息？',
            button: '联系我们',
          },
        },
      },
    },
  });

export default i18n; 