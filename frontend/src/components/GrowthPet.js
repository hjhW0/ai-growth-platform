import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Heart, Sparkles, Trophy } from 'lucide-react';
import { getGoals, getStreak, getTodayStats, trackEvent } from '../api/apiClient';
import { t } from '../styles/tokens';

import celebrate from '../assets/pet/celebrate.png';
import eat from '../assets/pet/eat.png';
import garden from '../assets/pet/garden.png';
import idle from '../assets/pet/idle.png';
import jump1 from '../assets/pet/jump-1.png';
import jump2 from '../assets/pet/jump-2.png';
import jump3 from '../assets/pet/jump-3.png';
import jump4 from '../assets/pet/jump-4.png';
import jump5 from '../assets/pet/jump-5.png';
import music from '../assets/pet/music.png';
import paint from '../assets/pet/paint.png';
import play from '../assets/pet/play.png';
import read from '../assets/pet/read.png';
import sleep from '../assets/pet/sleep.png';
import sleepBreath1 from '../assets/pet/sleep-breath-1.png';
import sleepBreath2 from '../assets/pet/sleep-breath-2.png';
import sleepBreath3 from '../assets/pet/sleep-breath-3.png';
import sleepBreath4 from '../assets/pet/sleep-breath-4.png';
import wave1 from '../assets/pet/wave-1.png';
import wave2 from '../assets/pet/wave-2.png';
import wave3 from '../assets/pet/wave-3.png';
import wave4 from '../assets/pet/wave-4.png';
import yawn from '../assets/pet/yawn.png';

const moodFrames = {
  idle: [idle],
  read: [read],
  eat: [eat],
  garden: [garden],
  music: [music],
  sleep: [sleep],
  paint: [paint],
  play: [play],
  yawn: [yawn],
  celebrate: [celebrate],
  wave: [wave1, wave2, wave3, wave4],
  jump: [jump1, jump2, jump3, jump4, jump5],
  sleepBreath: [sleepBreath1, sleepBreath2, sleepBreath3, sleepBreath4],
};

const loopingMoods = new Set(['wave', 'jump', 'sleepBreath']);
const autoMoods = ['read', 'eat', 'garden', 'music', 'sleep', 'paint'];

const stageMeta = {
  seed: {
    label: '猫帽新手',
    message: '我在这里陪你，先点亮一个小任务吧。',
  },
  sprout: {
    label: '元气陪练',
    message: '节奏起来了，今天先稳稳推进。',
  },
  sapling: {
    label: '闪光队友',
    message: '这波很顺，我在旁边给你记分。',
  },
  tree: {
    label: '成长王牌',
    message: '今天状态发光，继续收下这份进度。',
  },
};

const lines = {
  welcome: ['我来啦，今天也一起长大一点。', '猫帽陪练上线，先从一个小目标开始。'],
  idle: ['先点亮一个小任务吧。', '我有点困啦，等你叫我开练。'],
  active: ['不错，下一步就差一点点。', '节奏很稳，我给你加一颗星。'],
  rest: ['喝口水，眼睛也休息一下。', '换个动作陪你，别把自己绷太紧。'],
  complete: ['今日训练完成，漂亮收工。', '进度满格，我的小本本记下来了。'],
  streak: ['连胜还在延长，手感很好。', '坚持已经变成你的隐藏 buff 了。'],
};

function getStage(rate, streak, activeGoals) {
  if (streak >= 14 || rate >= 90) return 'tree';
  if (streak >= 5 || rate >= 60 || activeGoals >= 3) return 'sapling';
  if (rate > 0 || streak > 0 || activeGoals > 0) return 'sprout';
  return 'seed';
}

function pickLine(group) {
  const pool = lines[group] || lines.active;
  return pool[Math.floor(Math.random() * pool.length)];
}

function pickAutoMood(currentMood) {
  const pool = autoMoods.filter((mood) => mood !== currentMood);
  return pool[Math.floor(Math.random() * pool.length)] || 'read';
}

function getInteraction(rate, streak) {
  if (rate >= 100) return { mood: 'celebrate', action: 'victory', lineGroup: 'complete', duration: 1800 };
  if (streak >= 7) return { mood: 'garden', action: 'duel', lineGroup: 'streak', duration: 1600 };
  if (rate >= 80) return { mood: 'jump', action: 'victory', lineGroup: 'active', duration: 1500 };
  if (rate <= 0) {
    return Math.random() > 0.5
      ? { mood: 'sleepBreath', action: 'nudge', lineGroup: 'idle', duration: 1800 }
      : { mood: 'yawn', action: 'nudge', lineGroup: 'idle', duration: 1400 };
  }
  const mood = ['wave', 'read', 'garden', 'play'][Math.floor(Math.random() * 4)];
  return { mood, action: 'swing', lineGroup: 'active', duration: mood === 'wave' ? 1500 : 1300 };
}

function clampPosition(pos) {
  if (typeof window === 'undefined') return pos;
  return {
    x: Math.min(Math.max(pos.x, 12), window.innerWidth - 144),
    y: Math.min(Math.max(pos.y, 84), window.innerHeight - 206),
  };
}

function GrowthPet() {
  const [summary, setSummary] = useState({ rate: 0, streak: 0, activeGoals: 0 });
  const [bubble, setBubble] = useState('');
  const [action, setAction] = useState('');
  const [mood, setMood] = useState('idle');
  const [frameIndex, setFrameIndex] = useState(0);
  const [position, setPosition] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('growthPetPosition') || 'null');
      if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) return saved;
    } catch (e) {
      // Ignore malformed saved positions.
    }
    return { x: Math.max(16, window.innerWidth - 150), y: Math.max(100, window.innerHeight - 250) };
  });
  const dragRef = useRef(null);
  const actionTimerRef = useRef(null);
  const autoTimerRef = useRef(null);
  const lastInteractAtRef = useRef(0);

  useEffect(() => {
    let mounted = true;
    async function loadPetData() {
      try {
        const [stats, streakData, goalsData] = await Promise.all([
          getTodayStats(),
          getStreak(),
          getGoals({ status: 'active' }),
        ]);
        if (!mounted) return;
        const goals = goalsData.data || goalsData.goals || [];
        setSummary({
          rate: stats?.rate || 0,
          streak: streakData?.streak || 0,
          activeGoals: goals.length,
        });
      } catch (e) {
        if (mounted) setSummary({ rate: 0, streak: 0, activeGoals: 0 });
      }
    }
    loadPetData();
    const timer = setInterval(loadPetData, 60000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const next = clampPosition(position);
    localStorage.setItem('growthPetPosition', JSON.stringify(next));
  }, [position]);

  useEffect(() => () => {
    clearTimeout(actionTimerRef.current);
    clearTimeout(autoTimerRef.current);
  }, []);

  const stage = useMemo(
    () => getStage(summary.rate, summary.streak, summary.activeGoals),
    [summary.rate, summary.streak, summary.activeGoals]
  );
  const meta = stageMeta[stage];

  useEffect(() => {
    const timer = setTimeout(() => setBubble(pickLine('welcome')), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const frames = moodFrames[mood] || moodFrames.idle;
    if (frameIndex >= frames.length) setFrameIndex(0);
  }, [frameIndex, mood]);

  useEffect(() => {
    const frames = moodFrames[mood] || moodFrames.idle;
    if (frames.length <= 1) {
      setFrameIndex(0);
      return undefined;
    }
    const interval = mood === 'sleepBreath' ? 520 : 180;
    const timer = setInterval(() => {
      setFrameIndex((current) => (current + 1) % frames.length);
    }, interval);
    return () => clearInterval(timer);
  }, [mood]);

  useEffect(() => {
    function scheduleAutoMood() {
      const delay = 25000 + Math.floor(Math.random() * 10000);
      autoTimerRef.current = setTimeout(() => {
        const interactedRecently = Date.now() - lastInteractAtRef.current < 8000;
        if (!interactedRecently) {
          const nextMood = pickAutoMood(mood);
          setAction('auto');
          setMood(nextMood);
          setFrameIndex(0);
          setBubble(pickLine(nextMood === 'sleep' ? 'idle' : 'rest'));
          actionTimerRef.current = setTimeout(() => setAction(''), 900);
        }
        scheduleAutoMood();
      }, delay);
    }
    scheduleAutoMood();
    return () => clearTimeout(autoTimerRef.current);
  }, [mood]);

  const handlePointerDown = (event) => {
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origin: position,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!dragRef.current) return;
    const dx = event.clientX - dragRef.current.startX;
    const dy = event.clientY - dragRef.current.startY;
    if (Math.abs(dx) + Math.abs(dy) > 4) dragRef.current.moved = true;
    const next = clampPosition({
      x: dragRef.current.origin.x + dx,
      y: dragRef.current.origin.y + dy,
    });
    setPosition(next);
  };

  const handlePointerUp = () => {
    window.setTimeout(() => {
      dragRef.current = null;
    }, 0);
  };

  const handleClick = () => {
    if (dragRef.current?.moved) return;
    const next = getInteraction(summary.rate, summary.streak);
    lastInteractAtRef.current = Date.now();
    clearTimeout(actionTimerRef.current);
    setAction('');
    window.requestAnimationFrame(() => {
      setMood(next.mood);
      setFrameIndex(0);
      setAction(next.action);
      setBubble(pickLine(next.lineGroup));
    });
    trackEvent('pet_interact', JSON.stringify({
      stage,
      mood: next.mood,
      action: next.action,
      rate: summary.rate,
      streak: summary.streak,
    }));
    actionTimerRef.current = setTimeout(() => {
      setAction('');
      if (loopingMoods.has(next.mood) || next.mood === 'yawn' || next.mood === 'celebrate') {
        setMood(next.mood === 'sleepBreath' ? 'sleep' : 'idle');
        setFrameIndex(0);
      }
    }, next.duration);
  };

  const frames = moodFrames[mood] || moodFrames.idle;
  const currentImage = frames[frameIndex % frames.length];
  const statusIcon = summary.rate >= 100 ? Trophy : summary.streak >= 7 ? Sparkles : Heart;
  const StatusIcon = statusIcon;

  return (
    <div
      aria-label={`猫帽元气陪练，当前阶段 ${meta.label}`}
      className="imagepet-wrap"
      style={{
        left: position.x,
        top: position.y,
        '--pet-primary': t.primary,
        '--pet-primary-dark': t.primaryDark,
        '--pet-gold': t.accentGold,
      }}
    >
      {bubble && (
        <div className={`imagepet-bubble ${action ? `imagepet-bubble-${action}` : ''}`}>
          {bubble}
        </div>
      )}

      <button
        type="button"
        className={`imagepet imagepet-stage-${stage} imagepet-mood-${mood} ${action ? `imagepet-action-${action}` : ''}`}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <span className="imagepet-glow" />
        <span className="imagepet-ring" />
        <img
          key={`${mood}-${frameIndex}`}
          className="imagepet-avatar"
          src={currentImage}
          alt={`${meta.label}桌宠`}
          draggable="false"
        />
        <span className="imagepet-spark imagepet-spark-one" />
        <span className="imagepet-spark imagepet-spark-two" />
        <span className="imagepet-label">
          <StatusIcon size={11} />
          {meta.label}
        </span>
      </button>

      <div className="imagepet-progress" aria-hidden="true">
        {[0, 1, 2].map((step) => (
          <span
            key={step}
            style={{
              width: step === 0 ? 18 : 7,
              background: summary.rate / 34 > step ? t.primary : '#d7e8dc',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default GrowthPet;
