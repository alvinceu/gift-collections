import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center py-20 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1 flex-shrink-0"
          >
            <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden border-4 border-[#CAA07D] dark:border-[#CAA07D] shadow-lg">
              <img
                src="https://64.media.tumblr.com/6d1f80734f400ca8c07cae1782d698c8/aa046c0701203870-ca/s400x600/6d85af708c4f05621a2ecc929c153d8dd264fa67.gifv"
                alt="Gift Collections Animation"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2 flex-1 text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#1A1A1D] dark:text-[#F4EFEA]">
              Gift Collections — умные подборки подарков
            </h1>
            <p className="text-xl md:text-2xl text-secondary mb-8">
              Создавайте, сохраняйте и делитесь идеями подарков для любого повода
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/" className="btn-primary text-lg px-8 py-3">
                Смотреть подборки
              </Link>
              <Link to="/create" className="btn-secondary text-lg px-8 py-3">
                Создать свою
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


