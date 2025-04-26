import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
  };

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      onClick={toggleLanguage}
      className="fixed top-8 right-8 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 text-sm tracking-wide"
    >
      {i18n.language === 'zh' ? 'EN' : '中文'}
    </motion.button>
  );
} 