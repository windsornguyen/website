'use client';
import { FC } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

type ProjectProps = {
  title: string,
  description: string,
  delay: number,
  position: number
};

const Project: FC<ProjectProps> = ({ title, description, delay, position }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const variants = {
    hidden: { opacity: 0, x: position % 2 === 0 ? 100 : -100 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1.5,
        delay: delay,
      },
    },
  };

  return (
    <motion.div ref={ref} variants={variants} initial="hidden" animate={inView ? 'show' : 'hidden'} className="border border-gray-200 rounded p-6">
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="mb-4">{description}</p>
      <a href="#" className="text-blue-500 hover:text-blue-700 transition-colors">Learn more</a>
    </motion.div>
  );
};

export default Project;
