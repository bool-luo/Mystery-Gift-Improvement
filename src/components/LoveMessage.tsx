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
      className={`absolute ${borderRadius} p-4 ${bgColor} ${textColor} ${boxShadow} ${border} max-w-[200px] flex items-center backdrop-blur-sm cursor-pointer transition-all duration-300`}
      style={{ 
        width: `${width}px`,
        left: `${x}px`, 
        top: `${y}px`,
        zIndex: isTopMessage ? 100 : 10,
        position: 'absolute',
        // 确保在移动设备上也有足够的最小宽度
        minWidth: '100px'
      }}
      // 简化初始状态，使过渡更快速
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        opacity: 1,
        scale: isTopMessage ? 1.1 : 1
      }}
      transition={{ 
        delay,
        duration: 0.5, // 合理的动画持续时间
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.1, 
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.2 }
      }}
      onClick={onMessageClick}
      whileTap={{ scale: 0.95 }}
    >
      {/* 装饰性图标 - 移除无限循环动画 */}
      <i className={`fa-solid ${icon} mr-2 text-sm ${iconColor}`}></i>
      
      {/* 消息文本 */}
      <p className="text-xs font-medium leading-relaxed">{message}</p>
      
      {/* 固定装饰元素 - 右上角小爱心 - 移除动画 */}
      {hasDecoration && (
        <div className="absolute -top-2 -right-2">
          <i className={`fa-solid fa-heart text-xs ${iconColor}`}></i>
        </div>
      )}
      
      {/* 被置顶时显示的特殊效果 - 简化动画 */}
      {isTopMessage && (
        <div className="absolute -inset-1 bg-pink-500/20 rounded-full blur-md -z-10">
        </div>
      )}
    </motion.div>
  );
};