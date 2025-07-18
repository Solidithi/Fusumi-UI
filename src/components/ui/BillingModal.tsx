"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Trash2, Search } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Label } from "./Label";
import { Input } from "./Input";
import { Button } from "./ButtonBussiness";
import { loadProductsByBusiness } from "@/utils/businessUtils";
import { Product, BillingItem } from "@/types";

interface BillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (items: BillingItem[], total: number) => void;
  businessId?: string;
}

export function BillingModal({ isOpen, onClose, onSave, businessId }: BillingModalProps) {
  const [items, setItems] = useState<BillingItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const addItem = useCallback(() => {
    const newItem: BillingItem = {
      id: Date.now().toString(),
      productId: "",
      productName: "",
      price: 0,
      quantity: 1,
    };
    setItems(prevItems => [...prevItems, newItem]);
  }, []);
  
  // Load products when modal opens and businessId is available
  const loadProducts = useCallback(async () => {
    if (!businessId) return;
    
    setLoading(true);
    try {
      const businessProducts = await loadProductsByBusiness(businessId);
      setProducts(businessProducts);
      
      // Initialize with first item if no items exist
      if (items.length === 0 && businessProducts.length > 0) {
        addItem();
      }
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  }, [businessId, items.length, addItem]);

  useEffect(() => {
    if (isOpen && businessId) {
      loadProducts();
    }
  }, [isOpen, businessId, loadProducts]);

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof BillingItem, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          // If productId changed, update related fields
          if (field === 'productId') {
            const selectedProduct = products.find(p => p.id === value);
            if (selectedProduct) {
              updatedItem.productName = selectedProduct.productName;
              updatedItem.price = selectedProduct.price;
            }
          }
          
          return updatedItem;
        }
        return item;
      })
    );
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const filteredProducts = products.filter(product =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    const totalValue = calculateTotal();
    const validItems = items.filter(item => item.productId && item.quantity > 0);
    
    if (validItems.length === 0) {
      alert("Please select at least one product");
      return;
    }
    
    onSave?.(validItems, totalValue);
    onClose();
  };

  const handleClose = () => {
    setItems([]);
    setSearchTerm("");
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
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#3587A3]/80 to-[#4a9bb8]/80 backdrop-blur-sm p-6 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Select Products for Invoice</h2>
                  <Button
                    onClick={handleClose}
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
                {loading ? (
                  <div className="text-center text-white">Loading products...</div>
                ) : (
                  <>
                    {/* Search Products */}
                    <div className="space-y-2">
                      <Label className="text-white/90 font-medium">Search Products</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-white/90 border-white/30 text-gray-800"
                          placeholder="Search products by name or description..."
                        />
                      </div>
                    </div>

                    {/* Add Button */}
                    <div className="flex justify-between items-center">
                      <Button
                        onClick={addItem}
                        variant="outline"
                        className="flex items-center gap-2 bg-white/20 border-white/30 hover:bg-white/30 text-white"
                      >
                        <Plus className="h-4 w-4" />
                        Add Product Line
                      </Button>
                      <div className="text-white/90 text-lg font-semibold">
                        Total: ${calculateTotal().toFixed(2)}
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-4">
                      {items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 rounded-lg bg-white/5 border border-white/10"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {/* Product Selection */}
                          <div className="space-y-2 md:col-span-2">
                            <Label className="text-white/90 font-medium">Product</Label>
                            <select
                              value={item.productId}
                              onChange={(e) => updateItem(item.id, "productId", e.target.value)}
                              className="w-full px-3 py-2 bg-white/90 border border-white/30 rounded-md text-gray-800 focus:border-white focus:ring-1 focus:ring-white/50"
                            >
                              <option value="">Select a product...</option>
                              {filteredProducts.map((product) => (
                                <option key={product.id} value={product.id}>
                                  {product.productName} - ${product.price} {product.unitOfMeasure}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Price Display */}
                          <div className="space-y-2">
                            <Label className="text-white/90 font-medium">Unit Price</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={item.price}
                              onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value) || 0)}
                              className="bg-white/90 border-white/30 text-gray-800"
                              placeholder="0.00"
                            />
                          </div>

                          {/* Quantity */}
                          <div className="space-y-2">
                            <Label className="text-white/90 font-medium">Quantity</Label>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                              className="bg-white/90 border-white/30 text-gray-800"
                              placeholder="1"
                            />
                          </div>

                          {/* Remove Button */}
                          <div className="space-y-2">
                            <Label className="text-white/90 font-medium">Action</Label>
                            <Button
                              onClick={() => removeItem(item.id)}
                              variant="outline"
                              size="icon"
                              disabled={items.length <= 1}
                              className="w-full bg-red-500/20 border-red-400/30 text-red-200 hover:bg-red-500/30 hover:border-red-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="bg-white/5 p-6 border-t border-white/20">
                <div className="flex justify-between items-center">
                  <div className="text-white/70">
                    {items.filter(item => item.productId).length} product(s) selected
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleClose}
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="bg-gradient-to-r from-[#2a6b7f] to-[#3587A3] hover:from-[#1f5a6b] hover:to-[#2a6b7f] text-white"
                      disabled={items.filter(item => item.productId).length === 0}
                    >
                      Save Selection
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
