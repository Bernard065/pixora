"use client";
import Footer from "@/components/footer";
import Editor from "@/modules/editor";
import Features from "@/modules/features";
import Hero from "@/modules/hero";
import Pricing from "@/modules/pricing";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Clock, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

const PaymentNotification = () => {
  const searchParams = useSearchParams();
  const [dismissed, setDismissed] = useState(false);

  const upgraded = searchParams.get("upgraded");
  const canceled = searchParams.get("payment_canceled");

  const paymentStatus = dismissed ? null : (upgraded ? "upgraded" : canceled ? "canceled" : null);

  // Clean up URL after reading params
  useEffect(() => {
    if (upgraded || canceled) {
      window.history.replaceState({}, "", "/");
    }
  }, [upgraded, canceled]);

  return (
    <AnimatePresence>
      {paymentStatus && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-60 p-4 rounded-xl border shadow-lg ${
            paymentStatus === "upgraded"
              ? "bg-green-500/10 border-green-500/20 text-green-600"
              : "bg-yellow-500/10 border-yellow-500/20 text-yellow-600"
          }`}
        >
          <div className="flex items-center space-x-2">
            {paymentStatus === "upgraded" ? (
              <>
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">
                  🎉 Welcome to Pro! You now have unlimited uploads.
                </span>
              </>
            ) : (
              <>
                <Clock className="h-5 w-5" />
                <span className="font-medium">
                  Payment canceled. You can upgrade anytime!
                </span>
              </>
            )}
            <button
              onClick={() => setDismissed(true)}
              className="ml-2 hover:opacity-70"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Home = () => {
  return (
    <div>
      <Suspense fallback={null}>
        <PaymentNotification />
      </Suspense>
      <Hero />
      <Features />
      <Pricing />
      <Editor />
      <Footer />
    </div>
  );
};

export default Home;
