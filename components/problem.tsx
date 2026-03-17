'use client';

import { motion } from 'framer-motion';
import { AlertCircle, TrendingDown, Clock } from 'lucide-react';

export function Problem() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const problems = [
    {
      icon: <AlertCircle className="w-8 h-8" />,
      title: 'Silent Failures',
      description: 'Sales calls fail silently. You never know which conversations are costing you deals.',
    },
    {
      icon: <TrendingDown className="w-8 h-8" />,
      title: 'Hidden Revenue Loss',
      description: 'Poor call tactics lead to lost deals, but you can\'t quantify the impact.',
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'No Real-Time Insights',
      description: 'By the time you notice patterns, valuable revenue is already gone.',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
            The Problem Most Teams Miss
          </h2>
          <p className="text-lg text-slate-400">
            Your sales team is having 100+ conversations a week. How many are truly effective?
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="p-6 rounded-xl border border-slate-800 bg-slate-800/30 hover:bg-slate-800/60 transition-colors"
            >
              <div className="mb-4 text-cyan-400">{problem.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">{problem.title}</h3>
              <p className="text-slate-400">{problem.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
