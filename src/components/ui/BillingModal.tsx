"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatedButton } from "./Button";
import { Label } from "./Label";
import { Input } from "./Input";

interface BillingItem {
  id: string;
  productName: string;
  price: string;
  quantity: string;
}

interface BillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (items: BillingItem[], total: number) => void;
}

export function BillingModal({ isOpen, onClose, onSave }: BillingModalProps) {
  const [items, setItems] = useState<BillingItem[]>([
    { id: "1", productName: "", price: "", quantity: "" },
    { id: "2", productName: "", price: "", quantity: "" },
    { id: "3", productName: "", price: "", quantity: "" },
  ]);
  const [total, setTotal] = useState("0.00");

  const addItem = () => {
    const newItem: BillingItem = {
      id: Date.now().toString(),
      productName: "",
      price: "",
      quantity: "",
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof BillingItem, value: string) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const calculateTotal = () => {
    return items
      .reduce((total, item) => {
        const price = Number.parseFloat(item.price) || 0;
        const quantity = Number.parseFloat(item.quantity) || 0;
        return total + price * quantity;
      }, 0)
      .toFixed(2);
  };

  // Update total whenever items change
  useEffect(() => {
    setTotal(calculateTotal());
  }, [items]);

  const handleSave = () => {
    const totalValue = Number.parseFloat(total);
    onSave?.(items, totalValue);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-md z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#3587A3]/80 to-[#4a9bb8]/80 backdrop-blur-sm p-6 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Billing</h2>
                  <AnimatedButton
                    onClick={onClose}
                    // variant="ghost"
                    // size="icon"
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </AnimatedButton>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
                {/* Add Button */}
                <div className="flex justify-start">
                  <AnimatedButton
                    onClick={addItem}
                    variant="outline"
                    // size="icon"
                    className="w-12 h-12 rounded-full bg-white/20 border-white/30 hover:bg-white/30 text-white"
                  >
                    <Plus className="h-6 w-6" />
                  </AnimatedButton>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      className={`grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-lg ${
                        index === 0
                          ? "border-2 border-[#3587A3]/50 bg-white/5"
                          : "bg-white/5"
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="space-y-2">
                        <Label className="text-white/90 font-medium">
                          Product Name/Service
                        </Label>
                        <Input
                          value={item.productName}
                          onChange={(e: any) =>
                            updateItem(item.id, "productName", e.target.value)
                          }
                          className="bg-white/90 border-white/30 text-gray-800"
                          placeholder="Enter product name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white/90 font-medium">
                          Price
                        </Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.price}
                          onChange={(e: any) =>
                            updateItem(item.id, "price", e.target.value)
                          }
                          className="bg-white/90 border-white/30 text-gray-800"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white/90 font-medium">
                          Quantity
                        </Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e: any) =>
                            updateItem(item.id, "quantity", e.target.value)
                          }
                          className="bg-white/90 border-white/30 text-gray-800"
                          placeholder="1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white/90 font-medium">
                          Action
                        </Label>
                        <AnimatedButton
                          onClick={() => removeItem(item.id)}
                          variant="outline"
                        //   size="icon"
                        //   disabled={items.length <= 1}
                          className="w-full bg-red-500/20 border-red-400/30 text-red-200 hover:bg-red-500/30 hover:border-red-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="h-4 w-4" />
                        </AnimatedButton>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Total */}
                <div className="flex justify-end items-center space-x-4 pt-4 border-t border-white/20">
                  <Label className="text-white/90 font-semibold text-lg">
                    Total:
                  </Label>
                  <div className="bg-white/90 px-4 py-2 rounded-lg min-w-[120px] text-center font-bold text-gray-800">
                    ${total}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/20 flex justify-center space-x-4">
                <AnimatedButton
                  onClick={handleSave}
                  className="px-8 py-2 bg-gradient-to-r from-[#3587A3] to-[#4a9bb8] hover:from-[#2a6b7f] hover:to-[#3587A3] text-white font-semibold rounded-full"
                >
                  Save
                </AnimatedButton>
                <AnimatedButton
                  onClick={onClose}
                  variant="outline"
                  className="px-8 py-2 bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-full"
                >
                  Cancel
                </AnimatedButton>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
