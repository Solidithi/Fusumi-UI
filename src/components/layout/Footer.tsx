"use client";

import { useInViewAnimation } from "@/hooks/animation-hook/useInViewAnimation";
import { motion } from "framer-motion";
import Link from "next/link";

const footerLinks = {
  Security: [{ name: "Audit reports", href: "#" }],
  Explore: [
    { name: "Docs", href: "#" },
    { name: "Github", href: "#" },
  ],
  Community: [{ name: "Twitter", href: "#" }],
  Career: [{ name: "Contact us", href: "#" }],
};

export function Footer() {
  const { ref: footerRef, isInView } = useInViewAnimation({
    once: true,
    margin: "-100px",
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.5,
      },
    },
  };

  return (
    <motion.footer
      ref={footerRef}
      className="bg-black text-white py-16 px-6"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="max-w-7xl mx-auto">
        {/* Top Section - Links */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 mb-16"
          variants={containerVariants}
        >
          {Object.entries(footerLinks).map(([category, links]) => (
            <motion.div key={category} variants={itemVariants as any}>
              <h3 className="text-lg font-semibold mb-6">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={`text-gray-300 hover:text-white transition-colors duration-300 relative group ${
                        (link as any).featured ? "text-white" : ""
                      }`}
                    >
                      {link.name}
                      {(link as any).featured && (
                        <motion.div
                          className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#2a849a]"
                          initial={{ scaleX: 0 }}
                          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                          transition={{ duration: 0.6, delay: 0.8 }}
                        />
                      )}
                      <motion.div
                        className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2a849a] group-hover:w-full transition-all duration-300"
                        style={{
                          display: (link as any).featured ? "none" : "block",
                        }}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}

        {/* Middle Section - Content */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants as any}>
            <motion.div
              className="border-t border-gray-800 mb-16"
              variants={itemVariants as any}
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            />
            <p className="text-gray-300 leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged
            </p>
          </motion.div>
          <motion.div variants={itemVariants as any}>
            <motion.div
              className="border-t border-gray-800 mb-16"
              variants={itemVariants as any}
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            />
            <p className="text-gray-300 leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry standard dummy text
              ever since the 1500s,
            </p>
          </motion.div>
        </motion.div>

        {/* Logo Section */}
        <motion.div
          className="text-center mb-16"
          variants={logoVariants as any}
        >
          <motion.h2 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white">
            Fusumi
          </motion.h2>
        </motion.div>

        {/* Divider */}
        <motion.div
          className="border-t border-gray-800 mb-8"
          variants={itemVariants as any}
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        />

        {/* Bottom Section */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants as any}>
            <p>Fusumi © 2025</p>
          </motion.div>
          <motion.div
            className="flex space-x-8 mt-4 md:mt-0"
            variants={itemVariants as any}
          >
            <Link
              href="#"
              className="hover:text-white transition-colors duration-300 relative group"
            >
              Term of services
              <motion.div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2a849a] group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              href="#"
              className="hover:text-white transition-colors duration-300 relative group"
            >
              Privacy Policy
              <motion.div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2a849a] group-hover:w-full transition-all duration-300" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
