import React, { useEffect, useState } from 'react';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { FlyAnimationItem } from '../types';

const FlyingToken: React.FC<{ item: FlyAnimationItem }> = ({ item }) => {
  const [launched, setLaunched] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setLaunched(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const dx = item.endX - item.startX;
  const dy = item.endY - item.startY;

  return (
    <div
      className="fixed z-[100] pointer-events-none top-0 left-0"
      style={{
        transform: `translate3d(${item.startX - 28}px, ${item.startY - 28}px, 0)`,
      }}
    >
      {/* Horizontal movement (linear/ease-out) */}
      <div
        style={{
          transform: launched ? `translate3d(${dx}px, 0, 0)` : 'translate3d(0, 0, 0)',
          transition: 'transform 680ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* Vertical movement + scale (parabolic arc feel) */}
        <div
          style={{
            transform: launched
              ? `translate3d(0, ${dy}px, 0) scale(0.32) rotate(12deg)`
              : 'translate3d(0, -18px, 0) scale(1.08) rotate(-4deg)',
            opacity: launched ? 0.25 : 1,
            transition:
              'transform 680ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 680ms ease-in',
          }}
          className="relative w-14 h-14 rounded-2xl bg-white p-1 border-2 border-[#B76E79] shadow-[0_12px_30px_rgba(183,110,121,0.45)] flex items-center justify-center"
        >
          <img
            src={item.productImage}
            alt={item.productName}
            className="w-full h-full object-cover rounded-xl"
          />
          <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-[#B76E79] text-white text-[10px] font-bold shadow flex items-center gap-0.5">
            <Sparkles className="w-2.5 h-2.5" />
            +1
          </span>
          <span className="absolute -bottom-1.5 -left-1.5 w-5 h-5 rounded-full bg-[#2D2926] text-[#F4C2C2] flex items-center justify-center shadow">
            <ShoppingBag className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
};

export const FlyToCartAnimation: React.FC = () => {
  const { flyAnimations } = useStore();

  if (flyAnimations.length === 0) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {flyAnimations.map((item) => (
        <FlyingToken key={item.id} item={item} />
      ))}
    </div>
  );
};
