import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  PlusCircle,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sprout,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  Flame,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  AnalysisResult,
  ForumFilterState,
  ForumIssueCategory,
  ForumPost,
  Language,
} from '../types';
import {
  ensureSeedPostsInitialized,
  subscribeToForumPosts,
} from '../services/firebase';
import { PostCard } from '../components/PostCard';
import { CROPS_LIST, CATEGORIES_LIST, NewPostModal } from '../components/NewPostModal';

interface CommunityPageProps {
  language?: Language;
  onStartDetect?: () => void;
  recentAnalyses?: AnalysisResult[];
}

export const CommunityPage: React.FC<CommunityPageProps> = ({
  language = 'en',
  onStartDetect,
  recentAnalyses = [],
}) => {
  const { user, openAuthModal } = useAuth();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);

  // Filters State
  const [filters, setFilters] = useState<ForumFilterState>({
    crop: 'all',
    category: 'all',
    urgency: 'all',
    status: 'all',
    sortBy: 'newest',
    search: '',
    myPostsOnly: false,
    flaggedOnly: false,
  });

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Initialize and subscribe to Firestore posts
  useEffect(() => {
    ensureSeedPostsInitialized();
    const unsubscribe = subscribeToForumPosts(
      (updatedPosts) => {
        setPosts(updatedPosts);
        setLoading(false);
      },
      (err) => {
        console.warn('Subscription err:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleOpenNewPost = () => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    setIsNewPostOpen(true);
  };

  // Filter & Sort Logic
  const filteredPosts = posts.filter((post) => {
    // Search query
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchDesc = post.description.toLowerCase().includes(q);
      const matchCrop = post.crop.toLowerCase().includes(q);
      const matchAuthor = post.authorName.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCrop && !matchAuthor) return false;
    }

    // Crop filter
    if (filters.crop !== 'all' && post.crop !== filters.crop) {
      return false;
    }

    // Category filter
    if (filters.category !== 'all' && post.category !== filters.category) {
      return false;
    }

    // Urgency filter
    if (filters.urgency !== 'all' && post.urgency !== filters.urgency) {
      return false;
    }

    // Status filter
    if (filters.status !== 'all' && post.status !== filters.status) {
      return false;
    }

    // My posts only
    if (filters.myPostsOnly && (!user || post.userId !== user.uid)) {
      return false;
    }

    // Moderator flagged only
    if (filters.flaggedOnly && !post.isFlagged) {
      return false;
    }

    return true;
  });

  // Sort logic
  filteredPosts.sort((a, b) => {
    // Pinned posts always stay on top
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    switch (filters.sortBy) {
      case 'most_active':
        return (b.commentsCount || 0) - (a.commentsCount || 0);
      case 'most_liked':
        return (b.likesCount || 0) - (a.likesCount || 0);
      case 'urgent':
        const urgencyWeight = { high: 3, medium: 2, low: 1 };
        return urgencyWeight[b.urgency] - urgencyWeight[a.urgency];
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Stats calculation
  const totalCases = posts.length;
  const resolvedCases = posts.filter((p) => p.status === 'resolved').length;
  const flaggedCount = posts.filter((p) => p.isFlagged).length;

  return (
    <div id="community-page-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* 1. Header Banner & CTA */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-emerald-100 dark:border-emerald-900/60">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
            <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Growers & Agronomists Forum</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-emerald-950 dark:text-white tracking-tight">
            AgriGuard Community
          </h1>
          <p className="text-xs sm:text-sm text-emerald-800/70 dark:text-emerald-300/70 max-w-2xl">
            Collaborative plant disease diagnostics, pest alerts, and peer-reviewed IPM remedies supported by verified extension specialists.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenNewPost}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Ask Question / Post Issue</span>
          </button>
        </div>
      </div>

      {/* 2. Community Key Statistics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-[#142017] border border-emerald-100 dark:border-emerald-900/60 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-bold text-emerald-950 dark:text-white block leading-tight">
              {totalCases}
            </span>
            <span className="text-[11px] text-emerald-800/60 dark:text-emerald-400/60 font-medium">
              Crop Case Studies
            </span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#142017] border border-emerald-100 dark:border-emerald-900/60 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-bold text-emerald-950 dark:text-white block leading-tight">
              {resolvedCases}
            </span>
            <span className="text-[11px] text-emerald-800/60 dark:text-emerald-400/60 font-medium">
              Verified Solutions
            </span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#142017] border border-emerald-100 dark:border-emerald-900/60 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-bold text-emerald-950 dark:text-white block leading-tight">
              100%
            </span>
            <span className="text-[11px] text-emerald-800/60 dark:text-emerald-400/60 font-medium">
              IPM First Focus
            </span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#142017] border border-emerald-100 dark:border-emerald-900/60 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-bold text-emerald-950 dark:text-white block leading-tight">
              Active
            </span>
            <span className="text-[11px] text-emerald-800/60 dark:text-emerald-400/60 font-medium">
              Extension Moderation
            </span>
          </div>
        </div>
      </div>

      {/* 3. Search & Comprehensive Filter Controls */}
      <div className="bg-white dark:bg-[#142017] border border-emerald-100 dark:border-emerald-900/60 rounded-3xl p-5 shadow-xs space-y-4">
        {/* Search Bar & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-emerald-600/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search by crop, disease symptom (e.g. thrips, blight, chlorosis), or farmer name..."
              className="w-full pl-10 pr-4 py-2.5 bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 rounded-2xl text-xs sm:text-sm text-emerald-950 dark:text-white placeholder:text-emerald-800/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden px-3.5 py-2.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 rounded-2xl text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Badges & Selectors (Always visible on desktop, toggleable on mobile) */}
        <div className={`space-y-3 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
          {/* Quick Crop Selector Pills */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                Filter by Crop
              </span>
              {filters.crop !== 'all' && (
                <button
                  onClick={() => setFilters({ ...filters, crop: 'all' })}
                  className="text-[11px] font-bold text-emerald-600 hover:underline cursor-pointer"
                >
                  Clear Crop Filter
                </button>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              <button
                onClick={() => setFilters({ ...filters, crop: 'all' })}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  filters.crop === 'all'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100 border border-emerald-100 dark:border-emerald-900/40'
                }`}
              >
                All Crops ({posts.length})
              </button>

              {CROPS_LIST.map((c) => {
                const count = posts.filter((p) => p.crop === c).length;
                return (
                  <button
                    key={c}
                    onClick={() => setFilters({ ...filters, crop: c })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                      filters.crop === c
                        ? 'bg-emerald-600 text-white shadow-xs font-bold'
                        : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100 border border-emerald-100 dark:border-emerald-900/40'
                    }`}
                  >
                    {c} {count > 0 && <span className="opacity-75">({count})</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secondary Dropdown Filter Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-emerald-100/60 dark:border-emerald-900/40 text-xs">
            {/* Category Dropdown */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-emerald-800/70 dark:text-emerald-400/70">
                Issue Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl text-xs text-emerald-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="all">All Categories</option>
                {CATEGORIES_LIST.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Urgency Dropdown */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-emerald-800/70 dark:text-emerald-400/70">
                Urgency Level
              </label>
              <select
                value={filters.urgency}
                onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl text-xs text-emerald-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="all">All Urgency Levels</option>
                <option value="high">High (Severe Outbreak)</option>
                <option value="medium">Medium Urgency</option>
                <option value="low">Low (Routine)</option>
              </select>
            </div>

            {/* Status Dropdown */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-emerald-800/70 dark:text-emerald-400/70">
                Solution Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                className="w-full px-2.5 py-1.5 bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl text-xs text-emerald-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="all">All Cases</option>
                <option value="open">Open (Needs Advice)</option>
                <option value="resolved">Resolved with Solution</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-emerald-800/70 dark:text-emerald-400/70">
                Sort Order
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                className="w-full px-2.5 py-1.5 bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl text-xs text-emerald-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="most_active">Most Replies</option>
                <option value="most_liked">Most Helpful</option>
                <option value="urgent">Highest Urgency</option>
              </select>
            </div>
          </div>

          {/* Quick Filter Checkboxes (My Posts, Moderator Flagged) */}
          <div className="flex items-center gap-4 pt-2 text-xs flex-wrap">
            {user && (
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filters.myPostsOnly}
                  onChange={(e) => setFilters({ ...filters, myPostsOnly: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-semibold text-emerald-950 dark:text-white">
                  Show Only My Inquiries
                </span>
              </label>
            )}

            {user?.role === 'moderator' && (
              <label className="flex items-center gap-2 cursor-pointer select-none bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-300 dark:border-amber-800">
                <input
                  type="checkbox"
                  checked={filters.flaggedOnly}
                  onChange={(e) => setFilters({ ...filters, flaggedOnly: e.target.checked })}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="font-bold text-amber-900 dark:text-amber-300">
                  Moderator Queue ({flaggedCount} Flagged)
                </span>
              </label>
            )}
          </div>
        </div>
      </div>

      {/* 4. Posts Feed */}
      <div className="space-y-6">
        {loading ? (
          <div className="p-12 text-center space-y-3 bg-white dark:bg-[#142017] rounded-3xl border border-emerald-100 dark:border-emerald-900/60">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
            <p className="text-sm font-bold text-emerald-950 dark:text-white">
              Loading community crop inquiries...
            </p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center space-y-4 bg-white dark:bg-[#142017] rounded-3xl border border-emerald-100 dark:border-emerald-900/60">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <Sprout className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-emerald-950 dark:text-white">
                No crop cases match your current filters
              </h3>
              <p className="text-xs text-emerald-800/70 dark:text-emerald-300/70 max-w-md mx-auto">
                Try clearing search keywords or selecting "All Crops" to explore discussions from across regions.
              </p>
            </div>
            <button
              onClick={() =>
                setFilters({
                  crop: 'all',
                  category: 'all',
                  urgency: 'all',
                  status: 'all',
                  sortBy: 'newest',
                  search: '',
                  myPostsOnly: false,
                  flaggedOnly: false,
                })
              }
              className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold rounded-xl hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>

      {/* New Post Modal */}
      <NewPostModal
        isOpen={isNewPostOpen}
        onClose={() => setIsNewPostOpen(false)}
        recentAnalyses={recentAnalyses}
      />
    </div>
  );
};
