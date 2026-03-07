'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { MenuItem } from '@/lib/mock/menu';
import { cn } from '@/lib/utils';

interface MegaMenuProps {
  items: MenuItem[];
}

function NavItem({
  item,
  onOpen,
  onClose,
  isOpen,
}: {
  item: MenuItem;
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const hasDropdown = item.children && item.children.length > 0;
  const href = item.href ?? (item.categorySlug ? `/categories/${item.categorySlug}` : '#');

  if (item.type === 'divider') {
    return <div className="h-px bg-zinc-700 my-2" />;
  }

  if (hasDropdown) {
    return (
      <div ref={ref} className="relative">
        <button
          type="button"
          onMouseEnter={() => onOpen()}
          onClick={() => onOpen()}
          className="flex items-center gap-1 text-sm text-zinc-300 hover:text-paper transition-colors py-2"
        >
          {item.label}
          <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-0 pt-2 -ml-4" onMouseLeave={() => onClose()}>
            <div className="bg-zinc-900 border border-zinc-700 rounded-lg shadow-modal min-w-[280px] py-4">
              <div className="grid grid-cols-1 gap-1 px-4">
                {item.children!.map((child) => {
                  const childHref =
                    child.href ?? (child.categorySlug ? `/categories/${child.categorySlug}` : '#');
                  return (
                    <Link
                      key={child.id}
                      href={childHref}
                      className="block py-2 px-3 text-sm text-zinc-300 hover:text-paper hover:bg-zinc-800 rounded-md transition-colors"
                      onClick={() => onClose()}
                    >
                      {child.label}
                    </Link>
                  );
                })}
              </div>
              <div className="absolute top-0 left-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-zinc-700" />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="flex items-center gap-2 text-sm text-zinc-300 hover:text-paper transition-colors py-2"
    >
      {item.label}
      {item.badge && (
        <span
          className={cn(
            'text-xs font-bold px-1.5 py-0.5 rounded',
            item.badgeColor === 'fire' && 'bg-fire text-white',
            item.badgeColor === 'sun' && 'bg-sun text-ink',
            !item.badgeColor && 'bg-fire text-white',
          )}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export function MegaMenu({ items }: MegaMenuProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const sorted = [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <nav className="hidden md:flex items-center gap-6 flex-shrink-0">
      {sorted.map((item) => (
        <NavItem
          key={item.id}
          item={item}
          isOpen={openId === item.id}
          onOpen={() => setOpenId(item.id)}
          onClose={() => setOpenId(null)}
        />
      ))}
    </nav>
  );
}
