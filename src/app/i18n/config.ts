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
          },
          manifesto: {
            title: 'Manifesto',
            text1: 'We believe AI empowers creative individuals with ideas, aesthetics, and execution abilities',
            text2: 'Vibe – A lifestyle where you can create freely and be rewarded',
            text3: 'We help these individuals create and profit with their own vibe',
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
            title: 'Subscribe Us',
            button: 'WeChat Official: VibeFriends',
          },
        },
      },
      zh: {
        translation: {
          hero: {
            title: 'VibeCafé',
            subtitle: 'Keep the vibe',
          },
          manifesto: {
            title: 'Manifesto',
            text1: '我们相信 AI 带给有想法、创意、审美、执行力的个体巨大的创作能力',
            text2: 'Vibe - 一种可以自由创作、获取回报的生活方式',
            text3: '我们希望帮助这样的个体用自己的 vibe 去创作，获得收益',
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
            title: '关注我们',
            button: '微信公众号：VibeFriends',
          },
        },
      },
    },
  });

export default i18n; 