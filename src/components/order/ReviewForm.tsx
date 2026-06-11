import { useState } from 'react';
import { ThumbsUp, MessageSquare, Sparkles } from 'lucide-react';
import StarRating from '../common/StarRating';
import Button from '../common/Button';
import Card from '../common/Card';

interface ReviewFormProps {
  onSubmit: (data: {
    overall: number;
    skill: number;
    service: number;
    attitude: number;
    content: string;
    tags: string[];
  }) => void;
}

const quickTags = ['技术超神', '准时靠谱', '沟通顺畅', '带飞全场', '声音好听', '性格好', '教学细致', '配合默契'];

export default function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [overall, setOverall] = useState(5);
  const [skill, setSkill] = useState(5);
  const [service, setService] = useState(5);
  const [attitude, setAttitude] = useState(5);
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    onSubmit({
      overall,
      skill,
      service,
      attitude,
      content,
      tags: selectedTags,
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={20} className="text-yellow-400" />
        <h3 className="font-display font-bold text-xl">服务评价</h3>
      </div>

      <div className="space-y-5">
        <div className="p-4 rounded-lg bg-cyber-bg-primary/40 border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">综合评分</span>
            <StarRating rating={overall} interactive onChange={setOverall} size={28} showValue />
          </div>
          <p className="text-xs text-cyber-text-muted">请为本次陪玩服务打分</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-cyber-bg-primary/40 border border-white/5">
            <div className="text-sm font-medium mb-2">技术水平</div>
            <StarRating rating={skill} interactive onChange={setSkill} size={20} showValue />
          </div>
          <div className="p-4 rounded-lg bg-cyber-bg-primary/40 border border-white/5">
            <div className="text-sm font-medium mb-2">服务质量</div>
            <StarRating rating={service} interactive onChange={setService} size={20} showValue />
          </div>
          <div className="p-4 rounded-lg bg-cyber-bg-primary/40 border border-white/5">
            <div className="text-sm font-medium mb-2">服务态度</div>
            <StarRating rating={attitude} interactive onChange={setAttitude} size={20} showValue />
          </div>
        </div>

        <div>
          <div className="text-sm font-medium mb-2 flex items-center gap-1.5">
            <ThumbsUp size={16} className="text-cyan-neon" />
            快捷标签
          </div>
          <div className="flex flex-wrap gap-2">
            {quickTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-cyan-neon/20 border border-cyan-neon/50 text-cyan-neon shadow-neon-cyan'
                    : 'bg-cyber-bg-primary/40 border border-white/10 text-cyber-text-secondary hover:border-white/30'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium mb-2 flex items-center gap-1.5">
            <MessageSquare size={16} className="text-cyan-neon" />
            评价内容
          </div>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="分享你的陪玩体验，帮助其他玩家做出选择..."
            className="w-full h-28 px-4 py-3 rounded-lg input-dark resize-none"
            maxLength={500}
          />
          <div className="text-right text-xs text-cyber-text-muted mt-1">{content.length}/500</div>
        </div>

        <Button variant="primary" className="w-full" onClick={handleSubmit} size="lg">
          提交评价
        </Button>
      </div>
    </Card>
  );
}
