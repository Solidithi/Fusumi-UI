"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { AnimatedButton } from "../ui/Button";
import {
  containerVariants,
  headerVariants,
  itemVariants,
} from "@/lib/animation";
import { NAVIGATION_ITEMS } from "@/lib/constant";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "../../../public/Fusumi_Logo.png";
import { WalletSelector } from "../ui/ConnectWalletButton";

export function Header() {
  const route = useRouter();
  const handleClick = () => {
    // route.push("/business/dashboard");
  };
  const handleLogoClick = () => {
    route.push("/");
  };
  return (
    <motion.header
      className="bg-[#2a849a] px-6 py-4 relative z-10"
      variants={headerVariants as any}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="flex items-center space-x-2 
          hover:cursor-pointer"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          onClick={handleLogoClick}
        >
          <motion.div
            className="w-10 h-10  rounded-full flex items-center justify-center"
            // whileHover={{ rotate: 360 }}
            // transition={{ duration: 0.5 }}
          >
            {/* <svg
              width="391"
              height="391"
              viewBox="0 0 391 391"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="50.5"
                y1="296"
                x2="50.5"
                y2="95"
                stroke="white"
                stroke-width="9"
              />
              <path
                d="M51 234C51 214 97.8333 214 191.5 234C285.167 254 332 254 332 234"
                stroke="white"
                stroke-width="9"
              />
              <circle
                cx="195.5"
                cy="195.5"
                r="188"
                stroke="white"
                stroke-width="15"
              />
              <line
                x1="58"
                y1="62.5"
                x2="330"
                y2="62.5"
                stroke="white"
                stroke-width="9"
              />
              <line
                x1="36"
                y1="90.5"
                x2="352"
                y2="90.5"
                stroke="white"
                stroke-width="9"
              />
              <line
                y1="-4.5"
                x2="275"
                y2="-4.5"
                transform="matrix(1 -8.82449e-08 -8.66083e-08 -1 57 324)"
                stroke="white"
                stroke-width="9"
              />
              <line
                y1="-4.5"
                x2="319"
                y2="-4.5"
                transform="matrix(1 -8.82449e-08 -8.66083e-08 -1 35 296)"
                stroke="white"
                stroke-width="9"
              />
              <line
                x1="190.5"
                y1="296"
                x2="190.5"
                y2="95"
                stroke="white"
                stroke-width="9"
              />
              <line
                x1="331.5"
                y1="296"
                x2="331.5"
                y2="95"
                stroke="white"
                stroke-width="9"
              />
              <circle cx="76" cy="190" r="6" stroke="white" stroke-width="6" />
              <circle cx="313" cy="190" r="6" stroke="white" stroke-width="6" />
              <path
                d="M53 246C66.8 239.333 89.8 239.333 122 246"
                stroke="white"
                stroke-width="9"
                stroke-linecap="round"
              />
              <path
                d="M257.5 229C267.833 234.167 294.9 241.4 320.5 229"
                stroke="white"
                stroke-width="9"
                stroke-linecap="round"
              />
              <path
                d="M132.486 262.267C130.425 263.656 129.879 266.452 131.267 268.514C132.656 270.575 135.452 271.121 137.514 269.733L132.486 262.267ZM135 266L137.514 269.733C155.499 257.621 186.679 257.027 232.752 270.324L234 266L235.248 261.676C188.921 248.307 154.101 247.712 132.486 262.267L135 266ZM234 266L232.752 270.324C279.079 283.693 313.899 284.288 335.514 269.733L333 266L330.486 262.267C312.501 274.379 281.321 274.973 235.248 261.676L234 266Z"
                fill="white"
              />
              <path
                d="M54 281C70 274.333 96.6667 274.333 134 281C171.333 287.667 198 287.667 214 281"
                stroke="white"
                stroke-width="9"
                stroke-linecap="round"
              />
            </svg> */}
            <Image src={Logo} alt="Logo" width={40} height={40} />
          </motion.div>
          <span
            className="text-white text-xl font-semibold uppercase"
            style={{ letterSpacing: "0.2em" }}
          >
            Fusumi
          </span>
        </motion.div>

        {/* Navigation */}
        <motion.nav
          className="hidden md:flex items-center space-x-8"
          variants={containerVariants as any}
          initial="hidden"
          animate="visible"
        >
          {NAVIGATION_ITEMS.map((item: any) => (
            <motion.div key={item.label} variants={itemVariants as any}>
              <Link
                href={item.href}
                className="text-white hover:text-white/80 transition-colors relative group"
              >
                {item.label}
                <motion.div
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white"
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
          ))}
        </motion.nav>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* <AnimatedButton
            variant="secondary"
            className="bg-white text-[#2a849a] hover:bg-white/90 rounded-full py-3 px-6"
            onClick={handleClick}
          > */}
            <WalletSelector />
          {/* </AnimatedButton> */}
        </motion.div>
      </div>
    </motion.header>
  );
}
