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
  isDissolving?: boolean;
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
  isDissolving = false,
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
      animate={isDissolving ? {
        // 消散动画：更加丝滑的效果
        opacity: [1, 0.8, 0.6, 0],
        scale: [1, 1.1, 1.3, 1.4],
        rotate: [0, 2, -2, 0] // 轻微摇摆效果
      } : {
        opacity: 1,
        scale: isTopMessage ? 1.1 : 1,
        // 强烈的原地旋转动画，明显可见的摇摆效果
        rotate: [0, 5, -5, 5, 0],
        // 添加上下浮动效果，增加动感
        y: [0, -3, 3, -3, 0]
      }}
      transition={isDissolving ? {
        duration: 1.5,
        ease: [0.22, 1, 0.36, 1], // 更丝滑的缓动函数
        times: [0, 0.3, 0.6, 1],
        staggerChildren: 0.05 // 协调子元素动画
      } : {
        delay,
        duration: 0.5, // 合理的动画持续时间
        ease: "easeOut",
        // 配置旋转和浮动动画的过渡效果，使其更加明显
        rotate: {
          duration: 4, // 合适的持续时间，使动画节奏更舒适
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror"
        },
        y: {
          duration: 4,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror"
        }
      }}
      whileHover={{ 
        scale: 1.1, 
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.2 }
      }}
      onClick={!isDissolving ? onMessageClick : undefined}
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
      
      {/* 消散时显示浪漫爱心粒子效果 */}
      {isDissolving && (
        <div className="absolute inset-0 flex items-center justify-center">
          {Array.from({ length: 24 }).map((_, i) => {
            // 随机颜色变化
            const colors = ['text-pink-400', 'text-pink-500', 'text-pink-600', 'text-rose-400', 'text-rose-500'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            
            // 随机大小
            const sizeVariation = 0.8 + Math.random() * 0.6;
            
            // 随机偏移角度，不完全对称，更自然
            const angleOffset = (Math.random() - 0.5) * 30;
            const radius = 60 + Math.random() * 20;
            
            return (
              <motion.div
                key={i}
                className={`${randomColor} text-lg`}
                initial={{ 
                  x: 0, 
                  y: 0, 
                  opacity: 1,
                  scale: 0.5 * sizeVariation,
                  rotate: 0
                }}
                animate={{
                  x: Math.cos(((i * 15) + angleOffset) * Math.PI / 180) * radius,
                  y: Math.sin(((i * 15) + angleOffset) * Math.PI / 180) * radius,
                  opacity: [1, 0.8, 0],
                  scale: [0.5 * sizeVariation, 1.2 * sizeVariation, 0.8 * sizeVariation],
                  rotate: [0, Math.random() * 45 - Math.random() * 45] // 轻微旋转效果
                }}
                transition={{
                  duration: 1.2 + Math.random() * 0.3,
                  delay: i * 0.03,
                  ease: [0.22, 1, 0.36, 1], // 更丝滑的缓动函数
                  times: [0, 0.5, 1],
                  // 添加上下波动效果
                  y: {
                    duration: 1.2 + Math.random() * 0.3,
                    ease: [0.22, 1, 0.36, 1],
                    repeat: 0,
                    yoyo: false
                  }
                }}
              >
                <i className="fa-solid fa-heart"></i>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};