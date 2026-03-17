'use client';

import { motion } from 'framer-motion';
import { Building2, Briefcase, Zap, TrendingUp } from 'lucide-react';

export function Industries() {
  const industries = [
    {
      icon: <Briefcase className="w-8 h-8" />,
      name: 'SaaS',
      description: 'Optimize your enterprise sales process',
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      name: 'Professional Services',
      description: 'Improve consulting sales performance',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      name: 'Tech Sales',
      description: 'Enhance technical sales conversations',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      name: 'Enterprise',
      description: 'Scale your sales insights across teams',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

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
            Built for Your Industry
          </h2>
          <p className="text-lg text-slate-400">
            Vioneer adapts to your specific business model and sales process.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {industries.map((industry, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="p-6 rounded-xl border border-slate-800 bg-slate-800/30 hover:bg-slate-800/60 transition-colors text-center"
            >
              <div className="flex justify-center mb-4 text-purple-400">
                {industry.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">{industry.name}</h3>
              <p className="text-sm text-slate-400">{industry.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
