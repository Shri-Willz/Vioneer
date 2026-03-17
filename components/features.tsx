'use client';

import { motion } from 'framer-motion';
import { Zap, Target, BarChart3, Brain } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'AI Call Analysis',
      description: 'Advanced algorithms analyze your sales conversations in real-time.',
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Pattern Detection',
      description: 'Identify ineffective tactics and conversation patterns automatically.',
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Revenue Insights',
      description: 'Calculate exact lost revenue based on your industry and metrics.',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Recommendations',
      description: 'Get actionable insights to improve future conversations.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
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

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
            How Vioneer Works
          </h2>
          <p className="text-lg text-slate-400">
            Powerful tools designed to help you understand and improve your sales conversations.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="p-8 rounded-xl border border-slate-800 bg-slate-800/40 hover:bg-slate-800/80 transition-all group"
            >
              <div className="mb-4 text-cyan-400 group-hover:text-purple-400 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
