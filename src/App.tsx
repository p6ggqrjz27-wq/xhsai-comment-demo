import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Sparkles, 
  Settings, 
  Heart, 
  MoreHorizontal, 
  Send, 
  User, 
  X, 
  Check, 
  RefreshCw,
  ChevronLeft,
  Smile,
  Frown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Comment, UserStyle, PersonaStyle } from './types';
import { generateXiaohongshuReplies } from './services/geminiService';

const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    author: '小红薯_123',
    avatar: 'https://picsum.photos/seed/user1/100/100',
    content: '博主这套穿搭也太好看了吧！！✨',
    time: '2小时前',
    likes: 128
  },
  {
    id: '2',
    author: '爱生活的喵',
    avatar: 'https://picsum.photos/seed/user2/100/100',
    content: '这个氛围感绝了，感觉拍照好出片！📸',
    time: '5小时前',
    likes: 45
  },
  {
    id: '3',
    author: '极简主义者',
    avatar: 'https://picsum.photos/seed/user3/100/100',
    content: '感觉有点普通诶',
    time: '昨天',
    likes: 12
  },
  {
    id: '4',
    author: '小红薯_456',
    avatar: 'https://picsum.photos/seed/user1/100/100',
    content: '不太喜欢，感觉滤镜太重了',
    time: '2小时前',
    likes: 128
  }
];

const DEFAULT_STYLE: UserStyle = {
  persona: '亲切活泼的邻家博主',
  selectedStyle: 'lively',
  commonPhrases: ['宝子们', '绝绝子', '求关注', '爱你们'],
  tone: 'warm',
  emojiPreference: 'high'
};

const STYLE_OPTIONS: { id: PersonaStyle; label: string; icon: string }[] = [
  { id: 'lively', label: '活泼', icon: '✨' },
  { id: 'gentle', label: '温柔', icon: '🌸' },
  { id: 'sharp', label: '毒舌', icon: '🔥' },
  { id: 'chill', label: '佛系', icon: '🍵' },
  { id: 'cool', label: '霸总', icon: '🕶️' }
];

export default function App() {
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [userStyle, setUserStyle] = useState<UserStyle>(DEFAULT_STYLE);
  const [showSettings, setShowSettings] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [generatedReplies, setGeneratedReplies] = useState<Record<string, string[]>>({});
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState<Record<string, string>>({});
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<Record<string, number>>({});
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, boolean>>({});

  const handleGenerateReply = async (comment: Comment) => {
    setIsGenerating(comment.id);
    const replies = await generateXiaohongshuReplies(comment.content, userStyle);
    setGeneratedReplies(prev => ({ ...prev, [comment.id]: replies }));
    setSelectedOptionIndex(prev => ({ ...prev, [comment.id]: 0 }));
    setFeedbackGiven(prev => ({ ...prev, [comment.id]: false }));
    setIsGenerating(null);
  };

  const handleFeedback = (commentId: string) => {
    setFeedbackGiven(prev => ({ ...prev, [commentId]: true }));
  };

  const adoptReply = (commentId: string) => {
    const index = selectedOptionIndex[commentId] || 0;
    const content = generatedReplies[commentId][index];
    setReplyInput(prev => ({ ...prev, [commentId]: content }));
    setActiveReplyId(commentId);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4 font-sans">
      {/* Mobile Frame Simulation */}
      <div className="w-full max-w-[400px] bg-white rounded-[40px] shadow-2xl overflow-hidden border-[8px] border-gray-900 relative h-[800px] flex flex-col">
        
        {/* Status Bar */}
        <div className="h-10 bg-white flex items-center justify-between px-8 pt-2">
          <span className="text-sm font-bold">9:41</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded-full bg-black/10" />
            <div className="w-4 h-4 rounded-full bg-black/10" />
          </div>
        </div>

        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ChevronLeft className="w-6 h-6 text-gray-800" />
            <h1 className="font-bold text-lg">评论 (128)</h1>
          </div>
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </header>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {comments.map(comment => (
            <div key={comment.id} className="space-y-3">
              <div className="flex gap-3">
                <img 
                  src={comment.avatar} 
                  alt={comment.author} 
                  className="w-10 h-10 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">{comment.author}</span>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Heart className="w-4 h-4" />
                      <span className="text-xs">{comment.likes}</span>
                    </div>
                  </div>
                  <p className="text-[15px] text-gray-900 leading-relaxed">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-4 pt-1">
                    <span className="text-xs text-gray-400">{comment.time}</span>
                    <button 
                      onClick={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)}
                      className="text-xs font-bold text-gray-500 hover:text-red-500 transition-colors"
                    >
                      回复
                    </button>
                    <button 
                      onClick={() => handleGenerateReply(comment)}
                      disabled={isGenerating === comment.id}
                      className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full hover:bg-red-100 transition-all disabled:opacity-50"
                    >
                      {isGenerating === comment.id ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                      AI 回复
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Suggestion Area */}
              <AnimatePresence>
                {generatedReplies[comment.id] && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="ml-12 bg-red-50/50 border border-red-100 rounded-2xl p-3 space-y-3 relative"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                        <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">AI 风格建议 (3个选项)</span>
                      </div>
                      <button 
                        onClick={() => setGeneratedReplies(prev => {
                          const next = { ...prev };
                          delete next[comment.id];
                          return next;
                        })}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Options Carousel/List */}
                    <div className="space-y-2">
                      {generatedReplies[comment.id].map((reply, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedOptionIndex(prev => ({ ...prev, [comment.id]: idx }))}
                          className={`w-full text-left p-2.5 rounded-xl text-sm leading-relaxed transition-all border ${
                            (selectedOptionIndex[comment.id] ?? 0) === idx
                              ? 'bg-white border-red-200 shadow-sm text-gray-900'
                              : 'bg-transparent border-transparent text-gray-500 hover:bg-white/50'
                          }`}
                        >
                          <div className="flex gap-2">
                            <span className={`text-[10px] mt-1 font-bold px-1 rounded ${
                              (selectedOptionIndex[comment.id] ?? 0) === idx ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-400'
                            }`}>
                              {idx + 1}
                            </span>
                            <span className="flex-1 italic">"{reply}"</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-red-100 mt-2">
                      <div className="flex items-center gap-2">
                        {feedbackGiven[comment.id] ? (
                          <span className="text-[10px] text-red-400 font-medium animate-bounce">感谢反馈！❤️</span>
                        ) : (
                          <>
                            <span className="text-[10px] text-gray-400">建议如何？</span>
                            <button 
                              onClick={() => handleFeedback(comment.id)}
                              className="p-1 hover:bg-white rounded transition-all text-gray-400 hover:text-green-500"
                            >
                              <Smile className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleFeedback(comment.id)}
                              className="p-1 hover:bg-white rounded transition-all text-gray-400 hover:text-red-500"
                            >
                              <Frown className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleGenerateReply(comment)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all"
                          title="重新生成"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => adoptReply(comment.id)}
                          className="flex items-center gap-1 px-4 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 shadow-sm transition-all"
                        >
                          <Check className="w-3 h-3" />
                          采纳选中
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Reply Input (Simulated) */}
              {activeReplyId === comment.id && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="ml-12 pt-2"
                >
                  <div className="flex items-end gap-2 bg-gray-100 rounded-2xl p-2">
                    <textarea 
                      value={replyInput[comment.id] || ''}
                      onChange={(e) => setReplyInput(prev => ({ ...prev, [comment.id]: e.target.value }))}
                      placeholder={`回复 ${comment.author}...`}
                      className="flex-1 bg-transparent border-none focus:ring-0 text-sm resize-none py-1 px-2 max-h-24"
                      rows={1}
                    />
                    <button className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Input Placeholder */}
        <div className="p-4 border-t border-gray-100 flex items-center gap-3 bg-white">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-400">
            说点什么吧...
          </div>
          <div className="flex gap-4 text-gray-400">
            <Heart className="w-6 h-6" />
            <MessageCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 z-50 flex items-end"
            >
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-full bg-white rounded-t-[32px] p-6 space-y-6 max-h-[90%] overflow-y-auto"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">AI 风格设置</h2>
                  <button onClick={() => setShowSettings(false)} className="p-2 bg-gray-100 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">核心风格</label>
                    <div className="flex flex-wrap gap-2">
                      {STYLE_OPTIONS.map(option => (
                        <button
                          key={option.id}
                          onClick={() => setUserStyle(prev => ({ ...prev, selectedStyle: option.id }))}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            userStyle.selectedStyle === option.id
                              ? 'bg-red-500 text-white shadow-md shadow-red-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <span>{option.icon}</span>
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">人设描述</label>
                    <input 
                      type="text" 
                      value={userStyle.persona}
                      onChange={(e) => setUserStyle(prev => ({ ...prev, persona: e.target.value }))}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="例如：亲切活泼的邻家博主"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">常用语 (逗号分隔)</label>
                    <textarea 
                      value={userStyle.commonPhrases.join(', ')}
                      onChange={(e) => setUserStyle(prev => ({ ...prev, commonPhrases: e.target.value.split(',').map(s => s.trim()) }))}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all h-24"
                      placeholder="例如：宝子们, 绝绝子, 爱你们"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">语气偏好</label>
                      <select 
                        value={userStyle.tone}
                        onChange={(e) => setUserStyle(prev => ({ ...prev, tone: e.target.value as any }))}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                      >
                        <option value="warm">温暖亲切</option>
                        <option value="cool">高冷简洁</option>
                        <option value="neutral">中性客观</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">表情密度</label>
                      <select 
                        value={userStyle.emojiPreference}
                        onChange={(e) => setUserStyle(prev => ({ ...prev, emojiPreference: e.target.value as any }))}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                      >
                        <option value="high">丰富表情</option>
                        <option value="medium">适量使用</option>
                        <option value="low">极简主义</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setShowSettings(false)}
                  className="w-full py-4 bg-red-500 text-white font-bold rounded-2xl shadow-lg shadow-red-200 hover:bg-red-600 transition-all"
                >
                  保存设置
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Desktop Instructions */}
      <div className="mt-8 text-center space-y-2 max-w-md">
        <h3 className="text-gray-900 font-bold">💡 演示说明</h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          1. 点击评论下方的 <span className="text-red-500 font-bold">AI 回复</span> 按钮生成建议。<br/>
          2. 在右上角 <Settings className="inline w-4 h-4" /> 设置中修改你的博主人设，观察 AI 回复的变化。<br/>
          3. 点击“采纳”将 AI 建议填入回复框。
        </p>
      </div>
    </div>
  );
}
