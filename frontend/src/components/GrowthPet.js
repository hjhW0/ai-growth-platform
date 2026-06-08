import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Heart, Sparkles, Trophy } from 'lucide-react';
import { getGoals, getStreak, getTodayStats, trackEvent } from '../api/apiClient';
import { t } from '../styles/tokens';

const stageMeta = {
  seed: {
    label: '见习剑士',
    message: '剑已出鞘，等你下令。',
  },
  sprout: {
    label: '轻剑巡守',
    message: '节奏开始亮起来了。',
  },
  sapling: {
    label: '双刃武者',
    message: '这一击很稳，再推进一点。',
  },
  tree: {
    label: '荣耀女武神',
    message: '锋芒正盛，今天很漂亮。',
  },
};

const lines = {
  idle: ['先斩一个小任务吧。', '剑已出鞘，等你下令。'],
  active: ['节奏不错，再推进一点。', '这一击很稳。'],
  complete: ['训练完成，收剑。', '今天的战绩很漂亮。'],
  streak: ['连胜还在继续。', '你的坚持已经成了锋芒。'],
};

function getStage(rate, streak, activeGoals) {
  if (streak >= 14 || rate >= 90) return 'tree';
  if (streak >= 5 || rate >= 60 || activeGoals >= 3) return 'sapling';
  if (rate > 0 || streak > 0 || activeGoals > 0) return 'sprout';
  return 'seed';
}

function getInteraction(rate, streak) {
  if (rate >= 100) return { action: 'victory', lineGroup: 'complete' };
  if (streak >= 7) return { action: 'duel', lineGroup: 'streak' };
  if (rate >= 80) return { action: 'victory', lineGroup: 'active' };
  if (rate <= 0) return { action: 'nudge', lineGroup: 'idle' };
  return { action: 'swing', lineGroup: 'active' };
}

function pickLine(group) {
  const pool = lines[group] || lines.active;
  return pool[Math.floor(Math.random() * pool.length)];
}

function clampPosition(pos) {
  if (typeof window === 'undefined') return pos;
  return {
    x: Math.min(Math.max(pos.x, 12), window.innerWidth - 116),
    y: Math.min(Math.max(pos.y, 84), window.innerHeight - 178),
  };
}

function GrowthPet() {
  const [summary, setSummary] = useState({ rate: 0, streak: 0, activeGoals: 0 });
  const [bubble, setBubble] = useState('');
  const [action, setAction] = useState('');
  const [position, setPosition] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('growthPetPosition') || 'null');
      if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) return saved;
    } catch (e) {
      // Ignore malformed saved positions.
    }
    return { x: Math.max(16, window.innerWidth - 122), y: Math.max(100, window.innerHeight - 226) };
  });
  const dragRef = useRef(null);
  const actionTimerRef = useRef(null);

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

  useEffect(() => () => clearTimeout(actionTimerRef.current), []);

  const stage = useMemo(
    () => getStage(summary.rate, summary.streak, summary.activeGoals),
    [summary.rate, summary.streak, summary.activeGoals]
  );
  const meta = stageMeta[stage];

  useEffect(() => {
    const timer = setTimeout(() => setBubble(meta.message), 500);
    return () => clearTimeout(timer);
  }, [meta.message]);

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
    clearTimeout(actionTimerRef.current);
    setAction('');
    window.requestAnimationFrame(() => {
      setAction(next.action);
      setBubble(pickLine(next.lineGroup));
    });
    trackEvent('pet_interact', JSON.stringify({
      stage,
      action: next.action,
      rate: summary.rate,
      streak: summary.streak,
    }));
    actionTimerRef.current = setTimeout(() => setAction(''), 900);
  };

  const statusIcon = summary.rate >= 100 ? Trophy : summary.streak >= 7 ? Sparkles : Heart;
  const StatusIcon = statusIcon;

  return (
    <div
      aria-label={`荣耀女武神桌宠，当前阶段 ${meta.label}`}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 70,
        width: 100,
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      {bubble && (
        <div className={`valkyrie-bubble ${action ? `valkyrie-bubble-${action}` : ''}`}>
          {bubble}
        </div>
      )}

      <button
        type="button"
        className={`valkyrie-pet valkyrie-stage-${stage} ${action ? `valkyrie-action-${action}` : ''}`}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          '--pet-primary': t.primary,
          '--pet-primary-dark': t.primaryDark,
          '--pet-gold': t.accentGold,
          '--pet-purple': t.accentPurple,
        }}
      >
        <span className="valkyrie-aura" />
        <span className="valkyrie-ring" />
        <span className="valkyrie-cape" />
        <span className="valkyrie-pony" />
        <span className="valkyrie-hair" />
        <span className="valkyrie-head">
          <span className="valkyrie-fringe" />
          <span className="valkyrie-face">
            <span className="valkyrie-eye valkyrie-eye-left" />
            <span className="valkyrie-eye valkyrie-eye-right" />
            <span className="valkyrie-smile" />
          </span>
          <span className="valkyrie-crown" />
        </span>
        <span className="valkyrie-body">
          <span className="valkyrie-gem" />
          <span className="valkyrie-arm valkyrie-arm-left" />
          <span className="valkyrie-arm valkyrie-arm-right" />
        </span>
        <span className="valkyrie-sword valkyrie-sword-main">
          <span className="valkyrie-blade" />
          <span className="valkyrie-hilt" />
        </span>
        <span className="valkyrie-sword valkyrie-sword-off">
          <span className="valkyrie-blade" />
          <span className="valkyrie-hilt" />
        </span>
        <span className="valkyrie-shine valkyrie-shine-one" />
        <span className="valkyrie-shine valkyrie-shine-two" />
        <span className="valkyrie-label">
          <StatusIcon size={11} />
          {meta.label}
        </span>
      </button>

      <div className="valkyrie-progress" aria-hidden="true">
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
