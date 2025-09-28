'use client';

import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.43, 0.13, 0.23, 0.96],
      delayChildren: 0.1,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] },
  },
};

const numberVariants: Variants = {
  hidden: (direction: number) => ({
    opacity: 0,
    x: direction * 40,
    y: 15,
    rotate: direction * 5,
  }),
  visible: {
    opacity: 0.7,
    x: 0,
    y: 0,
    rotate: 0,
    transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] },
  },
};

const ghostVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0, y: 15, rotate: -5 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] },
  },
  hover: {
    scale: 1.1,
    y: -10,
    rotate: [0, -5, 5, -5, 0],
    transition: {
      duration: 0.8,
      ease: 'easeInOut',
      rotate: {
        duration: 2,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'reverse',
      },
    },
  },
  floating: {
    y: [-5, 5],
    transition: {
      y: {
        duration: 2,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'reverse',
      },
    },
  },
};

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <AnimatePresence mode="wait">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Numbers + Ghost */}
          <div className="flex items-center justify-center gap-4 md:gap-6 mb-8 md:mb-12">
            <motion.span
              className="text-[80px] md:text-[120px] font-bold text-primary opacity-70 select-none font-signika"
              variants={numberVariants}
              custom={-1}
            >
              4
            </motion.span>

            <motion.div
              variants={ghostVariants}
              whileHover="hover"
              animate={['visible', 'floating']}
            >
              <img
                src="https://xubohuah.github.io/xubohua.top/Group.png"
                alt="Ghost"
                width={120}
                height={120}
                className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] object-contain select-none"
                draggable={false}
              />
            </motion.div>

            <motion.span
              className="text-[80px] md:text-[120px] font-bold text-primary opacity-70 select-none font-signika"
              variants={numberVariants}
              custom={1}
            >
              4
            </motion.span>
          </div>

          {/* Title */}
          <motion.h1
            className="text-3xl md:text-5xl font-bold text-primary mb-4 md:mb-6 opacity-70 select-none font-dm-sans"
            variants={itemVariants}
          >
            Boo! Page missing!
          </motion.h1>

          {/* Description */}
          <motion.p
            className="text-lg md:text-xl text-muted-foreground mb-8 md:mb-12 select-none font-dm-sans"
            variants={itemVariants}
          >
            Whoops! This page must be a ghost – it&apos;s not here!
          </motion.p>

          {/* Link */}
          <motion.div
            variants={itemVariants}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] },
            }}
          >
            <Link
              href="/dashboard"
              className="inline-block bg-primary text-background px-8 py-3 rounded-full text-lg font-medium hover:bg-primary/90 transition-colors select-none font-dm-sans"
            >
              Find shelter
            </Link>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}