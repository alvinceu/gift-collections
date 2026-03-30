import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const solutions = [
  {
    title: 'Подборки по темам',
    description: 'Организуйте подарки по категориям и поводам',
    icon: '📋',
  },
  {
    title: 'Удобный визуальный формат',
    description: 'Красивые карточки с изображениями и описаниями',
    icon: '🎨',
  },
  {
    title: 'Ссылки на покупку',
    description: 'Все ссылки в одном месте, легко найти и купить',
    icon: '🔗',
  },
  {
    title: 'Комментарии и заметки',
    description: 'Добавляйте свои мысли и идеи к каждому подарку',
    icon: '💬',
  },
];

export default function SolutionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#1A1A1D] dark:text-[#F4EFEA]"
        >
          Мы собрали всё в одном месте
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="card-hover cursor-pointer p-6"
            >
              <div className="text-4xl mb-4">{solution.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-[#1A1A1D] dark:text-[#F4EFEA]">
                {solution.title}
              </h3>
              <p className="text-secondary">{solution.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


