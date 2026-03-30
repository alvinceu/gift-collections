import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';

const problems = [
  'Не знаешь, что подарить',
  'Идеи теряются в заметках',
  'Ссылки и скриншоты повсюду',
];

interface MagneticCardProps {
  children: React.ReactNode;
  index: number;
  isInView: boolean;
}

function MagneticCard({ children, index, isInView }: MagneticCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['15deg', '-15deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-15deg', '15deg']);

  const translateZ = useTransform(mouseYSpring, [-0.5, 0.5], [-10, 10]);
  const translateY = useTransform(mouseYSpring, [-0.5, 0.5], [10, -10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    // Увеличиваем чувствительность
    x.set(xPct * 1.2);
    y.set(yPct * 1.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
      animate={
        isInView
          ? { opacity: 1, y: 0, filter: 'blur(0px)' }
          : { opacity: 0, y: 30, filter: 'blur(10px)' }
      }
      transition={{
        duration: 0.5,
        delay: index * 0.2,
        filter: { duration: 0.3 },
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className="card text-center p-6 cursor-pointer transition-shadow duration-300"
      whileHover={{
        scale: 1.05,
        boxShadow: '0 20px 40px rgba(202, 160, 125, 0.3)',
      }}
    >
      <motion.div
        style={{
          transform: isHovered
            ? `translateZ(40px) translateY(${translateY}px)`
            : `translateZ(0px)`,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function ProblemSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="py-20 px-4 bg-[#FFF7F2] dark:bg-[#1B1B1F]">
      <div className="container mx-auto">
        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#1A1A1D] dark:text-[#F4EFEA]"
        >
          Дарить подарки сложно
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {problems.map((problem, index) => (
            <MagneticCard key={index} index={index} isInView={isInView}>
              <p className="text-lg text-secondary">{problem}</p>
            </MagneticCard>
          ))}
        </div>
      </div>
    </section>
  );
}
