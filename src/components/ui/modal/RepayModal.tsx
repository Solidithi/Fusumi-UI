"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "lucide-react";
import type { RepayModalData } from "@/types/modal";
import { AnimatedButton } from "../Button";
import { Portal } from "../Portal";
import { aptos } from "@/utils/indexer";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { fusumi_deployer_address } from "@/utils/deployerAddress";

interface RepayModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: RepayModalData;
  onRepaySuccess?: (invoiceId: string) => void;
}

export function RepayModal({
  isOpen,
  onClose,
  data,
  onRepaySuccess,
}: RepayModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { account, signAndSubmitTransaction } = useWallet();
  const handleDeposit = async () => {
    if (!account) {
      // For testing purposes, allow repay without wallet connection
      console.log("No wallet connected, proceeding with test repay...");
      await processPayment(true);
      return;
    }
    try {
      const tx1 = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          // function:"0xd9768fa77515f3e23654dce4117ff0539d3ffe9fa4ebc87b78034701529d586e::debt_factory::create_debt_collection",
          function: `${fusumi_deployer_address}::debt_root::deposit_debt_payment`,
          typeArguments: [],
          functionArguments: [],
        },
      });

      console.log(`Transaction hash: ${tx1.hash}`);
      const wait = await aptos.waitForTransaction({
        transactionHash: tx1.hash,
      });
      console.log(`Transaction status: ${wait.success ? "Success" : "Failed"}`);

      await processPayment(wait.success);
    } catch (error) {
      console.error("Error creating debt collection:", error);
      alert("Failed to process payment");
      setIsProcessing(false);
    }
  };

  const processPayment = async (success: boolean) => {
    if (success) {
      setIsProcessing(true);

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update invoice status in the JSON file
      try {
        const response = await fetch("/api/invoices/update-status", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            invoiceId: data.invoiceId,
            newStatus: "PAID",
          }),
        });

        if (response.ok) {
          console.log("Invoice status updated in JSON file");
        } else {
          console.error("Failed to update invoice status in JSON file");
        }
      } catch (error) {
        console.error("Error updating invoice status:", error);
      }

      setIsProcessing(false);
      setIsSuccess(true);

      // Call the success callback to update invoice status
      if (onRepaySuccess) {
        onRepaySuccess(data.invoiceId);
      }

      // Auto close after success
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    } else {
      alert("Transaction failed!");
    }
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success State */}
            {isSuccess && (
              <motion.div
                className="p-8 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.3 }}
                >
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Payment Successful!
                </h3>
                <p className="text-gray-600">
                  Your deposit has been processed successfully.
                </p>
              </motion.div>
            )}

            {/* Main Modal Content */}
            {!isSuccess && (
              <>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 text-center flex-1">
                    Repay
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                  {/* NFT Address */}
                  <div className="space-y-3">
                    <label className="text-lg font-semibold text-gray-900 block">
                      NFT Address
                    </label>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-gray-900 font-mono text-sm break-all">
                        {/* {data.addressDebtor} */} No DATA
                      </p>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="space-y-3">
                    <label className="text-lg font-semibold text-gray-900 block">
                      Amount
                    </label>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-gray-900 font-semibold text-lg">
                        {data.unitDebt.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Deposit Button */}
                  <AnimatedButton
                    onClick={handleDeposit}
                    disabled={isProcessing}
                    className="w-full bg-[#2a849a] hover:bg-[#236b7a] text-white py-4 px-6 rounded-xl font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      "Deposit"
                    )}
                  </AnimatedButton>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </Portal>
  );
}
