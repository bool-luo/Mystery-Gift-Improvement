import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoveMessage } from '../components/LoveMessage';
import { loveMessages } from '../lib/loveMessages';

// 定义样式变体类型
interface MessageVariant {
  bgColor: string;
  textColor: string;
  rotate: number[];
  scale: number[];
  iconColor: string;
  boxShadow: string;
  border: string;
}

// 预定义样式变体 - 移除旋转和缩放动画以避免闪烁
const messageVariants: MessageVariant[] = [
  { 
    bgColor: 'bg-gradient-to-r from-pink-400 to-pink-500', 
    textColor: 'text-white',
    rotate: [0],
    scale: [1],
    iconColor: 'text-pink-200',
    boxShadow: 'shadow-lg',
    border: 'border border-pink-300/20'
  },
  { 
    bgColor: 'bg-gradient-to-r from-rose-400 to-red-400', 
    textColor: 'text-white',
    rotate: [0],
    scale: [1],
    iconColor: 'text-rose-200',
    boxShadow: 'shadow-lg',
    border: 'border border-rose-300/20'
  },
  { 
    bgColor: 'bg-white', 
    textColor: 'text-pink-700',
    rotate: [0],
    scale: [1],
    iconColor: 'text-pink-500',
    boxShadow: 'shadow-xl',
    border: 'border-2 border-pink-200'
  },
  { 
    bgColor: 'bg-gradient-to-r from-pink-100 to-rose-100', 
    textColor: 'text-red-700',
    rotate: [0],
    scale: [1],
    iconColor: 'text-red-500',
    boxShadow: 'shadow-lg',
    border: 'border border-pink-200/50'
  },
  { 
    bgColor: 'bg-pink-50', 
    textColor: 'text-pink-600',
    rotate: [0],
    scale: [1],
    iconColor: 'text-pink-400',
    boxShadow: 'shadow-md',
    border: 'border-2 border-pink-100'
  },
  { 
    bgColor: 'bg-rose-50', 
    textColor: 'text-rose-600',
    rotate: [0],
    scale: [1],
    iconColor: 'text-rose-400',
    boxShadow: 'shadow-md',
    border: 'border-2 border-rose-100'
  },
];

// 装饰性图标类型
const icons = ['fa-heart', 'fa-heartbeat', 'fa-star', 'fa-heart-pulse', 'fa-kiss-wink-heart', 'fa-heart-crack'];

export default function Home() {
  const [showModal, setShowModal] = useState(true);
  const [showMessages, setShowMessages] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  
  // 音乐列表 - 包含多首歌曲
  const musicList = [
    { id: 1, name: '告白气球', path: '/runtime/music/告白气球.mp3' },
    { id: 2, name: 'Waiting for You', path: '/runtime/music/Waiting for You.mp3' },
    { id: 3, name: '괜찮아도 괜찮아', path: '/runtime/music/괜찮아도 괜찮아.mp3' },
    { id: 4, name: '小幸运', path: '/runtime/music/小幸运.mp3' },
    { id: 5, name: '有点甜', path: '/runtime/music/有点甜.mp3' },
    { id: 6, name: '简单爱', path: '/runtime/music/简单爱.mp3' },
    { id: 7, name: '我只在乎你', path: '/runtime/music/我只在乎你.mp3' },
  ];
  
  // 当前播放的歌曲索引
  const [currentMusicIndex, setCurrentMusicIndex] = useState(0);
  
   // 扩展消息元素接口，包含可见性控制
   interface MessageElement {
     id: number;
     message: string;
     x: number;
     y: number;
     delay: number;
     width: number;
     borderRadius: string;
     variant: number;
     icon: string;
     hasDecoration: boolean;
     isVisible?: boolean; // 控制消息是否可见
   }
   
   // 用于存储生成的消息数据（包含位置信息和样式）
   const [messageElements, setMessageElements] = useState<MessageElement[]>([]);
  
  // 存储当前置顶的消息ID
  const [topMessageId, setTopMessageId] = useState<number | null>(null);
  
  // 初始化音频元素
  useEffect(() => {
    // 注意：音乐文件需要放在 public/runtime/music/ 目录下
    audioRef.current = new Audio(musicList[currentMusicIndex].path);
    audioRef.current.loop = true; // 设置为循环播放
    
    // 如果当前是播放状态，则播放新的音频
    if (isPlayingMusic) {
      audioRef.current.play().catch(error => {
        console.error('播放音乐失败:', error);
      });
    }
    
    // 组件卸载时清理资源
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentMusicIndex, isPlayingMusic]);
  
  // 切换音乐播放状态
  const toggleMusic = () => {
    if (!audioRef.current) return;
    
    if (isPlayingMusic) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error('播放音乐失败:', error);
      });
    }
    setIsPlayingMusic(!isPlayingMusic);
  };
  
  // 切换到下一首歌曲
  const nextMusic = () => {
    if (!audioRef.current) return;
    
    // 停止当前播放
    audioRef.current.pause();
    
    // 计算下一首索引
    const nextIndex = (currentMusicIndex + 1) % musicList.length;
    setCurrentMusicIndex(nextIndex);
    
    // 创建新的音频元素并播放
    audioRef.current = new Audio(musicList[nextIndex].path);
    audioRef.current.loop = true;
    
    if (isPlayingMusic) {
      audioRef.current.play().catch(error => {
        console.error('播放音乐失败:', error);
      });
    }
  };

  const handleConfirm = () => {
    setShowModal(false);
    
    // 延迟显示消息，让模态框动画完成
    setTimeout(() => {
      setShowMessages(true);
      generateMessageElements();
      
      // 开始播放背景音乐
      if (audioRef.current) {
         // 浏览器可能会阻止自动播放，需要用户交互后才能播放
         audioRef.current.play().catch(error => {
          console.error('播放音乐失败:', error);
        });
        setIsPlayingMusic(true);
      }
    }, 500);
  };

  // 生成消息元素的数组，但不立即显示所有消息
  const generateMessageElements = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    
    // 固定使用手机友好的消息框尺寸
    const messageMaxWidth = 150;
    const messageMinWidth = 100;
    const maxX = containerRect.width - messageMaxWidth;
    const maxY = containerRect.height - 80; // 80是消息框的最小高度
    
    // 生成消息数据，保持原有的80条消息
    const messagesData = Array.from({ length: 80 }, (_, index) => {
      // 使用加权随机分布，确保消息在整个屏幕均匀分布，避免右侧过于空旷
      let x;
      const randomFactor = Math.random();
      if (randomFactor > 0.7) {
        // 30%的概率分布在右侧1/3区域
        x = maxX * 0.67 + Math.random() * (maxX * 0.33);
      } else if (randomFactor > 0.4) {
        // 30%的概率分布在中间1/3区域
        x = maxX * 0.33 + Math.random() * (maxX * 0.33);
      } else {
        // 40%的概率分布在左侧1/3区域
        x = Math.random() * (maxX * 0.33);
      }
      
      return {
        id: index,
        message: loveMessages[index % loveMessages.length],
        x: Math.min(x, maxX), // 确保不超出容器范围
        y: Math.random() * maxY,
        delay: 0, // 暂时设为0，后续通过消息队列设置真正的延迟
        width: messageMinWidth + Math.random() * (messageMaxWidth - messageMinWidth), // 随机消息框宽度
        borderRadius: Math.random() > 0.5 ? 'rounded-2xl' : 'rounded-xl', // 随机选择消息框形状
        variant: Math.floor(Math.random() * messageVariants.length), // 固定的样式变体索引
        icon: icons[Math.floor(Math.random() * icons.length)], // 固定的装饰图标
        hasDecoration: Math.random() > 0.5, // 固定的装饰元素标志
        isVisible: false // 控制是否可见
      };
    });
    
    // 使用消息队列依次显示消息
    showMessagesInSequence(messagesData);
  };
  
   // 消息队列函数 - 简化为更高效的方式显示消息，减少渲染压力
  const showMessagesInSequence = (messagesData: Array<{
    id: number;
    message: string;
    x: number;
    y: number;
    delay: number;
    width: number;
    borderRadius: string;
    variant: number;
    icon: string;
    hasDecoration: boolean;
    isVisible: boolean;
  }>) => {
    // 简化消息显示逻辑，减少动画压力
    const allMessages = messagesData.map((msg, index) => ({
      ...msg,
      isVisible: true,
      // 减少延迟范围，让消息更快稳定下来
      delay: index * 0.05 // 每条消息间隔50ms显示
    }));
    
    // 一次性设置所有消息
    setMessageElements(allMessages);
  };

  // 当窗口大小改变时，重新计算消息位置 - 但添加防抖以避免频繁重渲染
  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (showMessages) {
          generateMessageElements();
        }
      }, 300); // 300ms防抖延迟
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [showMessages]);

  // 重新生成除指定ID外的所有消息的位置
  const regenerateOtherMessages = (excludedId: number) => {
    if (!containerRef.current || messageElements.length === 0) return;
    
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const messageWidth = 200; // 消息框的最大宽度
    
    // 计算最大X和Y值
    const maxX = containerRect.width - messageWidth;
    const maxY = containerRect.height - 100;
    
    // 创建新的消息数组，保留被点击的消息位置，重新生成其他消息的位置
    const newMessages = messageElements.map(message => {
      if (message.id === excludedId) {
        // 保留被点击的消息的所有属性（位置和样式）
        return message;
      } else {
        // 使用改进的分布算法，确保消息能够更均匀地分布在整个容器中
        // 特别调整右侧区域的分布，避免右侧过于空旷
        let x;
        
        // 使用加权随机分布，增加右侧区域的消息密度
        const randomFactor = Math.random();
        if (randomFactor > 0.7) {
          // 30%的概率分布在右侧1/3区域
          x = maxX * 0.67 + Math.random() * (maxX * 0.33);
        } else if (randomFactor > 0.4) {
          // 30%的概率分布在中间1/3区域
          x = maxX * 0.33 + Math.random() * (maxX * 0.33);
        } else {
          // 40%的概率分布在左侧1/3区域
          x = Math.random() * (maxX * 0.33);
        }
        
        return {
          ...message,
          x: Math.min(x, maxX), // 确保不超出容器范围
          y: Math.random() * maxY,
        };
      }
    });
    
    setMessageElements(newMessages);
  };

  // 处理消息框点击，将点击的消息置于顶层，并重新排列其他消息
  const handleMessageClick = (messageId: number) => {
    setTopMessageId(messageId);
    // 延迟重新排列其他消息，先让当前点击的消息置顶有一个过渡效果
    setTimeout(() => {
      regenerateOtherMessages(messageId);
    }, 300);
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 overflow-hidden"
    >
      {/* 柔和的光晕背景 */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* 装饰性爱心背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 减少背景装饰元素数量以避免闪烁 */}
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={`heart-large-${i}`}
            className="absolute text-pink-300 opacity-20"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              scale: 1.5 + Math.random() * 1,
              rotate: Math.random() * 360
            }}
            animate={{ 
              y: [null, Math.random() * -100 - 50],
              opacity: [0.2, 0.1, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 10 + Math.random() * 15,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          >
            <i className="fa-solid fa-heart text-3xl"></i>
          </motion.div>
        ))}
        
        {/* 小爱心 */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={`heart-small-${i}`}
            className="absolute text-pink-400 opacity-40"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              scale: 0.5 + Math.random() * 0.5,
              rotate: Math.random() * 360
            }}
            animate={{ 
              y: [null, Math.random() * -60 - 30],
              opacity: [0.4, 0.2, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 5 + Math.random() * 10,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          >
            <i className="fa-solid fa-heart text-lg"></i>
          </motion.div>
        ))}
      </div>

      {/* 主模态框 */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* 模态框装饰性光晕 - 移除动画 */}
            <div className="absolute w-[600px] h-[600px] bg-pink-300/30 rounded-full blur-3xl"/>
            
            <motion.div 
              className="bg-white rounded-2xl p-6 w-11/12 max-w-md shadow-2xl border-4 border-pink-300 relative z-10 mx-4"
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
            >
              {/* 礼物盒子 - 移除动画 */}
              <div className="flex justify-center mb-6">
                <i className="fa-solid fa-gift text-5xl text-pink-500 drop-shadow-md"></i>
              </div>
              
              <h2 className="text-2xl font-bold text-center text-pink-600 mb-8">
                您有一个神秘礼物，请签收
              </h2>
              
              <motion.button
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all text-lg"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConfirm}
              >
                确认签收
              </motion.button>
              
              {/* 模态框装饰元素 - 移除动画 */}
              <div className="absolute -top-4 -left-4 text-pink-400">
                <i className="fa-solid fa-heart text-xl"></i>
              </div>
              <div className="absolute -bottom-4 -right-4 text-rose-400">
                <i className="fa-solid fa-heart text-xl"></i>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

   {/* 爱心消息展示区域 */}
   <AnimatePresence>
     {showMessages && messageElements.filter(msg => msg.isVisible !== false).map((msg) => {
       const variant = messageVariants[msg.variant];
       return (
         <LoveMessage
           key={msg.id}
           message={msg.message}
           x={msg.x}
           y={msg.y}
           delay={msg.delay}
           width={msg.width}
           borderRadius={msg.borderRadius}
           bgColor={variant.bgColor}
           textColor={variant.textColor}
           rotate={variant.rotate}
           scale={variant.scale}
           iconColor={variant.iconColor}
           boxShadow={variant.boxShadow}
           border={variant.border}
           icon={msg.icon}
           hasDecoration={msg.hasDecoration}
           isTopMessage={topMessageId === msg.id}
           onMessageClick={() => handleMessageClick(msg.id)}
         />
       );
     })}
   </AnimatePresence>
      
       {/* 音乐控制按钮组 - 手机适配位置 */}
      {showMessages && (
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-20">
          {/* 切歌按钮 */}
          <motion.button
            className="bg-white/90 backdrop-blur-md p-4 rounded-full shadow-lg border border-pink-200"
            onClick={nextMusic}
            whileHover={{ scale: 1.1, boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.3)" }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, type: "spring" }}
          >
            <i className="fa-solid fa-forward text-pink-600 text-lg"></i>
          </motion.button>
          
          {/* 播放/暂停按钮 */}
          <motion.button
            className="bg-white/90 backdrop-blur-md p-4 rounded-full shadow-lg border border-pink-200"
            onClick={toggleMusic}
            whileHover={{ scale: 1.1, boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.3)" }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, type: "spring" }}
          >
            {isPlayingMusic ? (
              <i className="fa-solid fa-pause text-pink-600 text-lg"></i>
            ) : (
              <i className="fa-solid fa-play text-pink-600 text-lg"></i>
            )}
          </motion.button>
        </div>
      )}
      
       {/* 页面标题 - 只在消息显示时出现 */}
      {showMessages && (
        <motion.h1 
          className="absolute top-6 left-1/2 transform -translate-x-1/2 text-pink-600 font-bold text-xl z-20 text-center px-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          给我最爱的人 💖
        </motion.h1>
      )}
      
      {/* 当前播放歌曲信息 - 手机适配位置 */}
      {showMessages && isPlayingMusic && (
        <motion.div
          className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full shadow-md border border-pink-200 z-20 max-w-[60%]"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5, type: "spring" }}
        >
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-music text-pink-500"></i>
            <span className="text-pink-700 font-medium text-xs truncate">
              {musicList[currentMusicIndex].name}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}