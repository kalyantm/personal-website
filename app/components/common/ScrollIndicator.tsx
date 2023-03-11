import { motion, useSpring, useViewportScroll } from "framer-motion"

export const ProgressIndicator = ({ className = '', isMobile = false }: {className?: string; isMobile?: boolean}) => {
  const { scrollYProgress } = useViewportScroll();

  const anim = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const mobileWrapperClasses = isMobile ? 'fixed top-0 left-0 right-0 h-1 w-full' : 'rounded-lg w-1';
  const mobileProgressClasses = isMobile ? 'bg-accent h-1 w-full' : 'rounded-lg bg-accent w-1 h-full'
  return (
    <>
     <div className={`max-h-[400px]  bg-grey-500 ${className} ${mobileWrapperClasses}`}>
      <motion.div className={mobileProgressClasses} style={isMobile ? {scaleX: anim, transformOrigin: '0%'} : { scaleY: anim, transformOrigin: 'center top' }} />
     </div>
    </>
  )
}