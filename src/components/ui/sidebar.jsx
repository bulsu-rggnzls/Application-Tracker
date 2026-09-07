"use client";;
import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconX } from "@tabler/icons-react";

const SidebarContext = createContext(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full py-4 px-3 hidden md:flex md:flex-col bg-[#090D16] shrink-0 overflow-hidden relative border-r border-white/[0.04]",
        className
      )}
      initial={false}
      animate={{
        width: animate ? (open ? 300 : 64) : 300,
      }}
      transition={{
        duration: 0.3,
        ease: [0.32, 0.72, 0, 1],
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}>
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-20 w-72 h-72 rounded-full bg-indigo-600/10 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-20 w-72 h-72 rounded-full bg-violet-600/[0.07] blur-3xl" />
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}) => {
  const { open, setOpen } = useSidebar();
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[99] md:hidden"
            onClick={() => setOpen(false)}
          />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={cn(
                "fixed inset-y-0 left-0 w-[82%] max-w-xs bg-[#090D16] p-4 z-[100] flex flex-col md:hidden shadow-2xl border-r border-white/[0.04] overflow-hidden",
                className
              )}
              {...props}>
              <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-20 w-72 h-72 rounded-full bg-indigo-600/10 blur-3xl" />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="absolute top-3.5 right-3 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer bg-transparent border-0 z-[101]">
                <IconX size={18} />
              </button>
              {children}
            </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const SidebarLink = ({
  link,
  className,
  active,
  ...props
}) => {
  const { open } = useSidebar();
  return (
    <a
      href={link.href}
      className={cn(
        "flex items-center h-11 w-full rounded-xl transition-colors duration-200 group/sidebar relative",
        open ? "justify-start" : "justify-center",
      active
        ? "bg-white/10 text-white font-medium"
        : "text-slate-400 hover:text-white hover:bg-white/5",
        className
      )}
      {...props}>
      <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
        {link.icon}
      </div>
      <span
        className={`text-sm whitespace-nowrap transition-all duration-200 ${
          open ? "opacity-100 ml-1" : "opacity-0 ml-0 w-0 overflow-hidden"
        } ${active ? "text-white" : "text-slate-400 group-hover/sidebar:text-white"}`}
      >
        {link.label}
      </span>
      {active && (
        <span className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-indigo-400 to-violet-500 rounded-r-full" />
      )}
    </a>
  );
};
