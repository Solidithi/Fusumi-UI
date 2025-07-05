"use client";

import { useInViewAnimation } from "@/hooks/animation-hook/useInViewAnimation";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { AnimatedButton } from "../ui/Button";
import { useRouter } from "next/navigation";

export function ReadySection() {
  const route = useRouter();
  const handleClick = () => {
    route.push("/business/dashboard");
  };
  const sectionRef = useRef<HTMLDivElement>(null);
  const { ref: contentRef, isInView } = useInViewAnimation({
    once: true,
    margin: "-100px",
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], ["50px", "-50px"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.95, 1, 1, 0.95]
  );

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.section
      ref={sectionRef}
      className="h-[432px] bg-gradient-to-br from-gray-50 to-white relative overflow-hidden flex items-center justify-center"
      style={{ opacity }}
    >
      {/* Background decorative elements */}
      <motion.div
        className="absolute top-10 left-10 w-64 h-64 bg-[#2a849a]/5 rounded-full blur-3xl"
        style={{ y }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-80 h-80 bg-pink-400/5 rounded-full blur-3xl"
        style={{ y: useTransform(scrollYProgress, [0, 1], ["-30px", "30px"]) }}
      />

      {/* Floating particles */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#2a849a]/30 rounded-full"
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.7, 0.3],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-3/4 right-1/4 w-3 h-3 bg-pink-400/30 rounded-full"
        animate={{
          y: [0, 15, 0],
          x: [0, 10, 0],
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Main content */}
      <motion.div
        ref={contentRef}
        className="text-center px-6 max-w-4xl mx-auto"
        style={{ scale }}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Main heading */}
        <motion.h2
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight"
          variants={itemVariants as any}
        >
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Ready to get
          </motion.span>{" "}
          <motion.span
            className="bg-gradient-to-r from-[#2a849a] to-[#F9C0C0] bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Started?
          </motion.span>
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
          variants={itemVariants as any}
        >
          Be among the first to embrace the next wave of crypto innovation.
          Start your journey with PayFi today.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div variants={buttonVariants as any}>
            <AnimatedButton
              className="bg-[#2a849a] hover:bg-[#2a849a]/90 text-white px-8 py-4 rounded-full text-lg font-semibold min-w-[160px] shadow-lg hover:shadow-xl transition-shadow duration-300"
              //   whileHover={{
              //     scale: 1.05,
              //     boxShadow: "0 20px 40px rgba(42, 132, 154, 0.3)",
              //   }}
              //   whileTap={{ scale: 0.95 }}
              onClick={handleClick}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Dashboard
              </motion.span>
            </AnimatedButton>
          </motion.div>

          <motion.div variants={buttonVariants as any}>
            <AnimatedButton
              variant="outline"
              className="border-2 border-[#2a849a] text-[#2a849a] hover:bg-[#2a849a] hover:text-white hover:scale-105
               px-8 py-4 rounded-full text-lg font-semibold min-w-[160px] transition-all duration-300"
              //   whileHover={{
              //     scale: 1.05,
              //     boxShadow: "0 10px 25px rgba(42, 132, 154, 0.2)",
              //   }}
              //   whileTap={{ scale: 0.95 }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Contact us
              </motion.span>
            </AnimatedButton>
          </motion.div>
        </motion.div>

        {/* Subtle accent line */}
        <motion.div
          className="mt-12 w-24 h-1 bg-gradient-to-r from-[#2a849a] to-[#F9C0C0] rounded-full mx-auto"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={
            isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }
          }
          transition={{ duration: 0.8, delay: 1 }}
        />
      </motion.div>

      {/* Additional floating elements */}
      <motion.div
        className="absolute top-16 right-16 w-1 h-1 bg-[#2a849a] rounded-full opacity-40"
        animate={{
          scale: [1, 2, 1],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-30"
        animate={{
          y: [0, -10, 0],
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
    </motion.section>
  );
}
