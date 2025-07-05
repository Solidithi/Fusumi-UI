"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { useInViewAnimation } from "@/hooks/animation-hook/useInViewAnimation";

export function PlatformSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { ref: contentRef, isInView } = useInViewAnimation({
    once: true,
    margin: "-100px",
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax effects for different elements
  const yFast = useTransform(scrollYProgress, [0, 1], ["100px", "-100px"]);
  const ySlow = useTransform(scrollYProgress, [0, 1], ["50px", "-50px"]);
  const yReverse = useTransform(scrollYProgress, [0, 1], ["-50px", "50px"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.8, 1, 1, 0.9]
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

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateY: 15 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 0.3,
      transition: {
        duration: 2,
        ease: "easeInOut",
        delay: 1,
      },
    },
  };

  return (
    <motion.section
      ref={sectionRef}
      className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#f1f5f9] py-20 px-6 relative overflow-hidden"
      style={{ opacity }}
    >
      {/* Background decorative elements */}
      <motion.div
        className="absolute top-10 left-10 w-96 h-96 bg-[#2a849a]/3 rounded-full blur-3xl"
        style={{ y: ySlow }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-80 h-80 bg-pink-400/3 rounded-full blur-3xl"
        style={{ y: yReverse }}
      />

      <div ref={contentRef} className="max-w-7xl mx-auto relative">
        {/* SVG Connecting Lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 1200 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M200 200 Q400 100 600 400 Q800 300 1000 500"
            stroke="url(#gradient1)"
            strokeWidth="2"
            fill="none"
            variants={pathVariants as any}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          />
          <motion.path
            d="M200 600 Q400 700 600 400 Q800 500 1000 200"
            stroke="url(#gradient2)"
            strokeWidth="2"
            fill="none"
            variants={pathVariants as any}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2a849a" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#2a849a" stopOpacity="0.6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Central Content */}
        <motion.div
          className="absolute top-44 left-64 transform -translate-x-1/2 -translate-y-1/2 text-center z-10 bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-gray-100"
          style={{ scale }}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div className="mb-6" variants={textVariants as any}>
            <span className="text-2xl font-semibold text-[#2a849a] tracking-wide">
              PayFi
            </span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#000000] mb-8 leading-tight"
            variants={textVariants as any}
          >
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              The Platform for
            </motion.span>
            <br />
            <motion.span
              className="bg-gradient-to-r from-[#2a849a] to-[#F9C0C0] bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Invoice Payments
            </motion.span>
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-[#33363f] max-w-2xl mx-auto leading-relaxed"
            variants={textVariants as any}
          >
            Easily connect with businesses worldwide to issue, manage, and
            settle invoices seamlessly, with the trust and reliability that
            enterprises count on
          </motion.p>
        </motion.div>

        {/* Image Grid */}
        <div className="relative z-5 w-full h-screen">
          {/* Top Left Image - Business Handshake */}
          <motion.div
            className="absolute top-12 left-12"
            style={{ y: yFast }}
            variants={imageVariants as any}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#2a849a] to-[#F9C0C0] rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
              <div className="relative bg-white p-2 rounded-2xl shadow-2xl">
                <Image
                  src="https://images.pexels.com/photos/3184416/pexels-photo-3184416.jpeg?cs=srgb&dl=pexels-fauxels-3184416.jpg&fm=jpg"
                  alt="Business professionals shaking hands"
                  width={350}
                  height={220}
                  className="rounded-xl object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Top Right Image - City Skyline */}
          <motion.div
            className="absolute top-12 right-12"
            style={{ y: yReverse }}
            variants={imageVariants as any}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover={{ scale: 1.05, rotateY: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-pink-400 to-[#2a849a] rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
              <div className="relative bg-white p-2 rounded-2xl shadow-2xl">
                <Image
                  src="https://images.pexels.com/photos/1139556/pexels-photo-1139556.jpeg?cs=srgb&dl=pexels-zhangkaiyv-1139556.jpg&fm=jpg"
                  alt="City skyline with modern buildings"
                  width={280}
                  height={350}
                  className="rounded-xl object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Center Left Image - Office Building */}
          <motion.div
            className="absolute top-1/2 left-8 transform -translate-y-1/2"
            style={{ y: ySlow }}
            variants={imageVariants as any}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-[#2a849a] to-[#F9C0C0] rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
              <div className="relative bg-white p-2 rounded-2xl shadow-2xl">
                <Image
                  src="https://images.pexels.com/photos/1662159/pexels-photo-1662159.jpeg?cs=srgb&dl=pexels-rickyrecap-1662159.jpg&fm=jpg"
                  alt="Modern office building"
                  width={300}
                  height={400}
                  className="rounded-xl object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Bottom Right Image - Business Meeting */}
          <motion.div
            className="absolute top-[500px] right-1"
            style={{ y: yFast }}
            variants={imageVariants as any}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover={{ scale: 1.05, rotateY: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-[#2a849a] rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
              <div className="relative bg-white p-2 rounded-2xl shadow-2xl">
                <Image
                  src="https://wallpapercat.com/w/full/3/4/2/785265-3840x2160-desktop-4k-empire-state-building-wallpaper.jpg"
                  alt="Business team meeting"
                  width={380}
                  height={240}
                  className="rounded-xl object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating particles */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-3 h-3 bg-[#2a849a] rounded-full opacity-40"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.5, 1],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-4 h-4  rounded-full opacity-30"
          animate={{
            y: [0, 25, 0],
            x: [0, 15, 0],
            scale: [1, 0.7, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 3,
          }}
        />
      </div>
    </motion.section>
  );
}
