"use client"

import { motion } from "framer-motion"
import { Home, FileText, Tag, PlusCircle, Package, ChevronLeft, ChevronRight } from "lucide-react"
import { AnimatedButton } from "./Button"
// import { Button } from "@/components/ui/button"

const sidebarItems = [
  { icon: Home, label: "Home", active: false },
  { icon: FileText, label: "Invoice Creation", active: true },
  { icon: Tag, label: "My Offer", active: false },
  { icon: PlusCircle, label: "Offer Creation", active: false },
  { icon: Package, label: "Product Creation", active: false },
]

const containerVariants = {
  expanded: {
    width: 240,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  collapsed: {
    width: 80,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
}

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
}

interface SidebarProps {
  isExpanded: boolean
  onToggle: () => void
}

export function Sidebar({ isExpanded, onToggle }: SidebarProps) {
  return (
    <motion.div
      className="bg-gradient-to-b from-[#2a6b7f] to-[#3587A3] flex flex-col shadow-2xl relative"
      variants={containerVariants as any}
      animate={isExpanded ? "expanded" : "collapsed"}
      initial="expanded"
    >
      {/* Toggle Button - Inside Sidebar */}
      <div className="flex justify-end p-2">
        <AnimatedButton
          onClick={onToggle}
        //   size="icon"
          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 border-0 text-white shadow-lg transition-all duration-300"
        //   variant="ghost"
        >
          {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </AnimatedButton>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col items-start py-4 px-4 space-y-4 flex-1">
        {sidebarItems.map((item, index) => (
          <motion.div
            key={item.label}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full"
          >
            <AnimatedButton
            //   variant="ghost"
              className={`w-full justify-start h-12 transition-all duration-300 ${
                item.active
                  ? "bg-white/20 text-white shadow-lg ring-2 ring-white/30"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              } ${isExpanded ? "px-4" : "px-0 justify-center"}`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {isExpanded && (
                <motion.span
                  className="ml-3 font-medium"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatedButton>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
