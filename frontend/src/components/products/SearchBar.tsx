import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, History, Sparkles, ArrowRight } from 'lucide-react';
import type { ProductItemData } from './ProductCard';
import { formatCurrency, getProductImageUrl } from '../../lib/utils';
import { springs } from '../../lib/motion';

interface SearchBarProps {
  products: ProductItemData[];
  onSelectProduct: (product: ProductItemData) => void;
  onSearchSubmit?: (query: string) => void;
  className?: string;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  All: '🐾',
  Food: '🥫',
  Nutrition: '🥩',
  Pharmacy: '💊',
  Supplements: '✨',
  Grooming: '✂️',
  'Flea & Tick': '🛡️',
  Accessories: '🎾',
};

const TRENDING_KEYWORDS = ['Royal Canin', 'NexGard Spectra', 'Omega 3 Fish Oil', 'Dental Chews', 'Probiotics'];

export const SearchBar: React.FC<SearchBarProps> = ({
  products,
  onSelectProduct,
  onSearchSubmit,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('pawfectly_recent_searches');
      return stored ? JSON.parse(stored) : ['Puppy Food', 'Flea Shampoo'];
    } catch {
      return ['Puppy Food', 'Flea Shampoo'];
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter products matching query
  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [products, query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter((s) => s.toLowerCase() !== term.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem('pawfectly_recent_searches', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleSelect = (product: ProductItemData) => {
    saveRecentSearch(product.name);
    onSelectProduct(product);
    setIsExpanded(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isExpanded) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && filteredResults[activeIndex]) {
        handleSelect(filteredResults[activeIndex]);
      } else if (query.trim()) {
        saveRecentSearch(query.trim());
        if (onSearchSubmit) onSearchSubmit(query.trim());
        setIsExpanded(false);
      }
    } else if (e.key === 'Escape') {
      setIsExpanded(false);
      inputRef.current?.blur();
    }
  };

  // Helper to highlight matched letters
  const renderHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <span
              key={i}
              className="text-[#009E66] font-black underline decoration-[#009E66]/40 underline-offset-2"
            >
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  return (
    <div ref={containerRef} className={`relative z-40 ${className}`}>
      {/* Expanding Search Bar Container */}
      <motion.div
        animate={{ width: isExpanded ? '100%' : '280px' }}
        transition={springs.snappy}
        className="relative flex items-center"
      >
        <div
          className={`flex items-center w-full rounded-2xl px-3.5 py-2.5 transition-all duration-300 ${
            isExpanded
              ? 'bg-white shadow-[0_8px_30px_rgba(22,36,27,0.12)] ring-2 ring-[#009E66] border-transparent'
              : 'bg-white/80 backdrop-blur-md border border-[#16241B]/10 hover:border-[#009E66]/40 hover:bg-white shadow-sm'
          }`}
        >
          <Search className={`w-4 h-4 mr-2.5 transition-colors ${isExpanded ? 'text-[#009E66]' : 'text-gray-400'}`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onFocus={() => setIsExpanded(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search food, medicine, toys, supplements..."
            className="w-full bg-transparent border-none outline-none text-xs sm:text-sm font-semibold text-[#16241B] placeholder:text-[#16241B]/40"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="p-1 text-gray-400 hover:text-[#16241B] rounded-full transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Glass Suggestions Dropdown */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={springs.soft}
            className="absolute top-full left-0 right-0 mt-2 glass-surface rounded-2xl p-3 shadow-2xl border border-white/60 overflow-hidden"
          >
            {query.trim() === '' ? (
              /* Trending & Recent Searches */
              <div className="p-2 space-y-4">
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#16241B]/50 uppercase tracking-wider mb-2">
                      <History className="w-3.5 h-3.5 text-[#009E66]" />
                      <span>Recent Searches</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => {
                            setQuery(term);
                            inputRef.current?.focus();
                          }}
                          className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-[#16241B] border border-[#16241B]/8 hover:border-[#009E66] hover:bg-[#FAF6EE] transition-all cursor-pointer"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#16241B]/50 uppercase tracking-wider mb-2">
                    <TrendingUp className="w-3.5 h-3.5 text-[#EF7C3C]" />
                    <span>Popular Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {TRENDING_KEYWORDS.map((trend) => (
                      <button
                        key={trend}
                        type="button"
                        onClick={() => {
                          setQuery(trend);
                          inputRef.current?.focus();
                        }}
                        className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FAF6EE] text-[#16241B] hover:bg-[#009E66] hover:text-white transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Sparkles className="w-2.5 h-2.5" />
                        {trend}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : filteredResults.length === 0 ? (
              /* Empty State */
              <div className="py-8 px-4 text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-[#FAF6EE] flex items-center justify-center text-xl">
                  🐶
                </div>
                <h5 className="font-bold text-xs text-[#16241B]">No pet products found</h5>
                <p className="text-[11px] text-[#16241B]/50 mt-0.5">
                  Try checking for spelling or searching a different term
                </p>
              </div>
            ) : (
              /* Search Results with Keyboard Pill Highlight */
              <div className="space-y-1">
                <div className="px-2 py-1 text-[10px] font-extrabold text-[#16241B]/40 uppercase tracking-wider">
                  Top Product Matches ({filteredResults.length})
                </div>

                {filteredResults.map((product, idx) => {
                  const isRowActive = activeIndex === idx;
                  const categoryEmoji = CATEGORY_EMOJIS[product.category] || '🐾';

                  return (
                    <div
                      key={product.id}
                      onClick={() => handleSelect(product)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`relative flex items-center gap-3 p-2.5 rounded-xl transition-colors cursor-pointer group ${
                        isRowActive ? 'bg-[#009E66]/10 text-[#16241B]' : 'hover:bg-black/5 text-[#16241B]'
                      }`}
                    >
                      {/* Active Pill Highlight */}
                      {isRowActive && (
                        <motion.div
                          layoutId="search-active-pill"
                          className="absolute inset-0 bg-[#009E66]/12 rounded-xl border border-[#009E66]/25 pointer-events-none"
                          transition={springs.snappy}
                        />
                      )}

                      {/* Product Thumbnail */}
                      <div className="w-10 h-10 rounded-lg bg-white p-1 shrink-0 border border-[#16241B]/6 flex items-center justify-center">
                        <img
                          src={getProductImageUrl(product.name, product.imageUrl, product.id)}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs">{categoryEmoji}</span>
                          <h4 className="text-xs font-bold truncate">
                            {renderHighlightedText(product.name, query)}
                          </h4>
                        </div>
                        <span className="text-[10px] text-[#16241B]/50 block">
                          in {product.category}
                        </span>
                      </div>

                      {/* Price & Action */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-black text-[#009E66]">
                          {formatCurrency(product.price)}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#009E66] transition-colors" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
