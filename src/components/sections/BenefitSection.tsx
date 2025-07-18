"use client";

import type React from "react";

import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, Globe, Zap } from "lucide-react";
import { useRef } from "react";
import { useInViewAnimation } from "@/hooks/animation-hook/useInViewAnimation";

interface BenefitItem {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  delay: number;
}

const benefits: BenefitItem[] = [
  {
    icon: Shield,
    title: "Security",
    description:
      "Advanced blockchain encryption with multi-layer security protocols ensuring your transactions are completely protected.",
    delay: 0.2,
  },
  {
    icon: Globe,
    title: "Global",
    description:
      "Our platform enables to connect with businesses around the world, making it easy to support global payments, simplify transactions, and deliver a smooth checkout experience to your customers",
    delay: 0.4,
  },
  {
    icon: Zap,
    title: "Lightning Speed",
    description:
      "Process thousands of NFT invoices per second with our optimized blockchain infrastructure and smart contracts.",
    delay: 0.6,
  },
];

export function BenefitSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { ref: contentRef, isInView } = useInViewAnimation({
    once: true,
    margin: "-200px",
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], ["100px", "-100px"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      x: -50,
      rotateY: -15,
    },
    visible: (delay: number) => ({
      opacity: 1,
      x: 0,
      rotateY: 0,
      transition: {
        duration: 0.8,
        delay,
        ease: "easeOut",
      },
    }),
  };

  return (
    <motion.section
      ref={sectionRef}
      className="min-h-screen bg-gradient-to-b  py-20 px-6 relative overflow-hidden"
      style={{ opacity }}
    >
      {/* Background decorative elements */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 bg-[#2a849a]/5 rounded-full blur-3xl"
        style={{ y }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 bg-pink-400/5 rounded-full blur-3xl"
        style={{ y: useTransform(scrollYProgress, [0, 1], ["-50px", "50px"]) }}
      />

      <div ref={contentRef} className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h2
            className="text-5xl md:text-6xl font-bold text-[#000000] mb-8"
            variants={itemVariants as any}
          >
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Why Choose
            </motion.span>{" "}
            <motion.span
              className="bg-gradient-to-r from-[#2a849a] to-[#F9C0C0] bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Fusumi?
            </motion.span>
          </motion.h2>

          <motion.p
            className="text-xl text-[#33363f] max-w-4xl mx-auto leading-relaxed"
            variants={itemVariants as any}
          >
            Experience the future of business payments with our cutting-edge
            blockchain technology, designed for maximum efficiency and
            unparalleled security.
          </motion.p>
        </motion.div>

        {/* Benefits Cards */}
        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                className="group"
                variants={cardVariants as any}
                custom={benefit.delay}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:border-[#2a849a]/30">
                  <div className="flex items-start space-x-6">
                    {/* Icon */}
                    <motion.div
                      className="flex-shrink-0"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2a849a] to-[#F9C0C0] flex items-center justify-center shadow-lg">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1">
                      <motion.h3
                        className="text-2xl font-bold text-[#000000] mb-4 group-hover:text-[#2a849a] transition-colors duration-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={
                          isInView
                            ? { opacity: 1, x: 0 }
                            : { opacity: 0, x: -20 }
                        }
                        transition={{
                          duration: 0.6,
                          delay: benefit.delay + 0.2,
                        }}
                      >
                        {benefit.title}
                      </motion.h3>
                      <motion.p
                        className="text-[#33363f] text-lg leading-relaxed"
                        initial={{ opacity: 0, x: -20 }}
                        animate={
                          isInView
                            ? { opacity: 1, x: 0 }
                            : { opacity: 0, x: -20 }
                        }
                        transition={{
                          duration: 0.6,
                          delay: benefit.delay + 0.4,
                        }}
                      >
                        {benefit.description}
                      </motion.p>
                    </div>
                  </div>

                  {/* Hover effect line */}
                  <motion.div
                    className="h-1 bg-gradient-to-r from-[#2a849a] to-[#F9C0C0] rounded-full mt-6 origin-left"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: benefit.delay + 0.6 }}
                    viewport={{ once: true }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Floating elements */}
        <motion.div
          className="absolute top-1/4 right-20 w-6 h-6 bg-[#2a849a]/20 rounded-full"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-16 w-4 h-4 bg-pink-400/20 rounded-full"
          animate={{
            y: [0, 15, 0],
            x: [0, 10, 0],
            scale: [1, 0.8, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>
    </motion.section>
  );
}
