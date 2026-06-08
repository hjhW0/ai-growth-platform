import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Leaf, Sparkles, Droplets, Trophy, Heart } from 'lucide-react';
import { getGoals, getStreak, getTodayStats, trackEvent } from '../api/apiClient';
import { t } from '../styles/tokens';

const stageMeta = {
  seed: { label: '种子', emoji: '•', message: '今天先浇一点点水吧' },
  sprout: { label: '幼苗', emoji: '🌱', message: '已经冒芽了，继续保持节奏' },
  sapling: { label: '小树', emoji: '🌿', message: '状态不错，小树在长高' },
  tree: { label: '大树', emoji: '🌳', message: '今天的温室很有生命力' },
};

function getStage(rate, streak, activeGoals) {
  if (streak >= 14 || rate >= 90) return 'tree';
  if (streak >= 5 || rate >= 60 || activeGoals >= 3) return 'sapling';
  if (rate > 0 || streak > 0 || activeGoals > 0) return 'sprout';
  return 'seed';
}

function clampPosition(pos) {
  if (typeof window === 'undefined') return pos;
  return {
    x: Math.min(Math.max(pos.x, 12), window.innerWidth - 112),
    y: Math.min(Math.max(pos.y, 84), window.innerHeight - 172),
  };
}

function GrowthPet() {
  const [summary, setSummary] = useState({ rate: 0, streak: 0, activeGoals: 0 });
  const [bubble, setBubble] = useState('');
  const [isHappy, setIsHappy] = useState(false);
  const [position, setPosition] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('growthPetPosition') || 'null');
      if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) return saved;
    } catch (e) {
      // Ignore malformed saved positions.
    }
    return { x: Math.max(16, window.innerWidth - 120), y: Math.max(100, window.innerHeight - 220) };
  });
  const dragRef = useRef(null);

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
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!dragRef.current) return;
    const next = clampPosition({
      x: dragRef.current.origin.x + event.clientX - dragRef.current.startX,
      y: dragRef.current.origin.y + event.clientY - dragRef.current.startY,
    });
    setPosition(next);
  };

  const handlePointerUp = () => {
    dragRef.current = null;
  };

  const handleClick = () => {
    setIsHappy(true);
    setBubble(summary.rate >= 100 ? '今天已经全部收获，真不错' : '我在这儿陪你，先完成一个小任务');
    trackEvent('pet_interact', JSON.stringify({ stage, rate: summary.rate, streak: summary.streak }));
    setTimeout(() => setIsHappy(false), 800);
  };

  const moodIcon = summary.rate >= 100 ? Trophy : summary.streak >= 3 ? Sparkles : summary.rate > 0 ? Droplets : Heart;
  const MoodIcon = moodIcon;

  return (
    <div
      aria-label={`成长桌宠，当前阶段 ${meta.label}`}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 70,
        width: 96,
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      {bubble && (
        <div style={{
          position: 'absolute',
          right: 4,
          bottom: 92,
          width: 170,
          padding: '10px 12px',
          borderRadius: t.rLg,
          background: '#ffffff',
          border: `1px solid ${t.border}`,
          color: t.textSecondary,
          fontSize: t.xs,
          lineHeight: 1.5,
          boxShadow: '0 14px 28px rgba(31, 85, 52, 0.12)',
        }}>
          {bubble}
        </div>
      )}

      <button
        type="button"
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          width: 88,
          height: 88,
          borderRadius: '28px',
          border: `1px solid ${t.borderGlow}`,
          background: 'linear-gradient(145deg, #ffffff 0%, #e9fbef 58%, #ccf5d9 100%)',
          boxShadow: isHappy
            ? '0 18px 34px rgba(34, 197, 94, 0.24)'
            : '0 12px 26px rgba(31, 85, 52, 0.13)',
          cursor: 'grab',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          transform: isHappy ? 'translateY(-4px) scale(1.04)' : 'translateY(0) scale(1)',
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          color: t.primaryDark,
          fontFamily: 'inherit',
        }}
      >
        <span style={{ fontSize: stage === 'seed' ? 28 : 34, lineHeight: 1 }}>
          {meta.emoji}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700 }}>
          <MoodIcon size={11} />
          {meta.label}
        </span>
      </button>

      <div style={{
        marginTop: 6,
        display: 'flex',
        justifyContent: 'center',
        gap: 4,
      }}>
        {[0, 1, 2].map((step) => (
          <span
            key={step}
            style={{
              width: step === 0 ? 18 : 7,
              height: 7,
              borderRadius: 999,
              background: summary.rate / 34 > step ? t.primary : '#cfe6d6',
            }}
          />
        ))}
      </div>

      <Leaf
        size={16}
        style={{
          position: 'absolute',
          top: -4,
          right: 11,
          color: t.primary,
          transform: isHappy ? 'rotate(20deg)' : 'rotate(0deg)',
          transition: 'transform 0.25s ease',
        }}
      />
    </div>
  );
}

export default GrowthPet;
