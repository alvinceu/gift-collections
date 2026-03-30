import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const steps = [
  {
    number: '1',
    title: 'Создай подборку',
    description: 'Выберите название, описание и добавьте обложку',
  },
  {
    number: '2',
    title: 'Добавь подарки',
    description: 'Заполните информацию о каждом подарке: фото, цена, ссылка',
  },
  {
    number: '3',
    title: 'Поделись или сохрани',
    description: 'Делитесь подборками с друзьями или храните для себя',
  },
];

export default function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="py-20 px-4 bg-[#FFF7F2] dark:bg-[#1B1B1F]">
      <div className="container mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center mb-16 text-[#1A1A1D] dark:text-[#F4EFEA]"
        >
          Как это работает
        </motion.h2>

        <div className="relative" ref={ref}>
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:block absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-[#CAA07D] to-[#CAA07D]/30 origin-top"
          />
          
          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ duration: 0.5, delay: index * 0.3 }}
                className="relative flex items-start gap-6"
              >
                <div className="flex-shrink-0 relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.3 + 0.2, type: 'spring' }}
                    className="w-16 h-16 rounded-full bg-[#CAA07D] flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                  >
                    {step.number}
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.3 + 0.4 }}
                  className="flex-1 card pt-4"
                >
                  <h3 className="text-2xl font-semibold mb-2 text-[#1A1A1D] dark:text-[#F4EFEA]">
                    {step.title}
                  </h3>
                  <p className="text-secondary">{step.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
