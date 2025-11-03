import { motion } from 'framer-motion';

interface LoveMessageProps {
  message: string;
  x: number;
  y: number;
  width: number;
  borderRadius: string;
  delay: number;
  bgColor: string;
  textColor: string;
  rotate: number[];
  scale: number[];
  iconColor: string;
  boxShadow: string;
  border: string;
  icon: string;
  hasDecoration: boolean;
  isTopMessage: boolean;
  onMessageClick: () => void;
}

export const LoveMessage: React.FC<LoveMessageProps> = ({ 
  message, 
  x, 
  y, 
  width,
  borderRadius,
  delay,
  bgColor,
  textColor,
  rotate,
  scale,
  iconColor,
  boxShadow,
  border,
  icon,
  hasDecoration,
  isTopMessage,
  onMessageClick
}) => {
  // 生成随机的动画参数，但保证每次渲染时相同
  const rotationDuration = 4 + ((message.length * 31) % 3); // 使用消息长度作为种子生成固定的动画时长
  const scaleDuration = 3 + ((message.length * 17) % 2);
  const yDuration = 2 + ((message.length * 23) % 2);
  const yDelay = (message.length * 13) % 1;
  const iconScaleDuration = 1.5 + ((message.length * 19) % 1);
  const decorationDuration = 3 + ((message.length * 29) % 2);
  
  return (
    <motion.div
      className={`absolute ${borderRadius} p-5 ${bgColor} ${textColor} ${boxShadow} ${border} max-w-[300px] flex items-center backdrop-blur-sm cursor-pointer transition-all duration-300`}
      style={{ 
        width: `${width}px`,
        left: `${x}px`, 
        top: `${y}px`,
        zIndex: isTopMessage ? 100 : 10,
        position: 'absolute'
      }}
      // 简化初始状态，使过渡更快速
      initial={{ scale: 0.8, opacity: 0, rotate: 0 }} // 简化初始旋转，加快过渡
      animate={{ 
        opacity: 1,
        rotate: rotate,
        scale: isTopMessage ? 1.1 : 1, // 简化缩放动画，去掉重复值
        y: isTopMessage ? 0 : 0 // 移除上下浮动，专注于快速出现
      }}
       transition={{ 
        delay,
        duration: 0.05, // 极小的动画持续时间，几乎瞬间出现
        type: "spring",
        bounce: 0, // 完全消除弹性，使动画立即完成
        left: {
          type: "spring",
          stiffness: 2000, // 极大的刚度，位置瞬间到位
          damping: 100
        },
        top: {
          type: "spring",
          stiffness: 2000, // 极大的刚度
          damping: 100 // 高阻尼，确保立即稳定
        },
        rotate: {
          repeat: Infinity,
          duration: rotationDuration,
          ease: "easeInOut"
        },
        scale: {
          repeat: Infinity,
          duration: scaleDuration,
          ease: "easeInOut"
        },
        y: {
          repeat: Infinity,
          duration: yDuration,
          ease: "easeInOut",
          delay: yDelay
        }
      }}
       whileHover={{ 
        scale: 1.1, 
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.2 } // 添加hover过渡动画，使效果更丝滑
      }}
      onClick={onMessageClick}
      whileTap={{ scale: 0.95 }}
    >
      {/* 装饰性图标 */}
      <motion.i 
        className={`fa-solid ${icon} mr-3 text-lg ${iconColor}`}
        animate={{ 
          scale: [1, 1.3, 1],
        }}
        transition={{ 
          repeat: Infinity,
          duration: iconScaleDuration,
          ease: "easeInOut"
        }}
      />
      
      {/* 消息文本 */}
      <p className="text-sm md:text-base font-medium leading-relaxed">{message}</p>
      
      {/* 固定装饰元素 - 右上角小爱心 */}
      {hasDecoration && (
        <motion.div
          className="absolute -top-2 -right-2"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0, -10, 0]
          }}
          transition={{ 
            repeat: Infinity,
            duration: decorationDuration,
            ease: "easeInOut"
          }}
        >
          <i className={`fa-solid fa-heart text-xs ${iconColor}`}></i>
        </motion.div>
      )}
      
      {/* 被置顶时显示的特殊效果 */}
      {isTopMessage && (
        <motion.div
          className="absolute -inset-1 bg-pink-500/20 rounded-full blur-md -z-10"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.8, 0.6]
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  );
};