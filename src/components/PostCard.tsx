import React, { useState } from 'react';
import {
  ThumbsUp,
  MessageSquare,
  Pin,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Flag,
  Trash2,
  ShieldCheck,
  Award,
  Sprout,
  Cpu,
  Eye,
  X,
  Share2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ForumPost, UserRole } from '../types';
import {
  togglePostLike,
  updatePostStatus,
  togglePinPost,
  flagPost,
  unflagPost,
  deleteForumPost,
} from '../services/firebase';
import { CommentSection } from './CommentSection';
import { FlagDialog } from './FlagDialog';

interface PostCardProps {
  post: ForumPost;
  onPostUpdated?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onPostUpdated }) => {
  const { user, openAuthModal } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [showMenu, setShowMenu] = useState(false);
  const [showFlagDialog, setShowFlagDialog] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  const isLiked = user && post.likedBy?.includes(user.uid);
  const isAuthor = user && user.uid === post.userId;
  const isModerator = user && user.role === 'moderator';
  const isAgronomist = user && user.role === 'agronomist';
  const canModerate = isModerator || isAgronomist || isAuthor;

  const handleToggleLike = async () => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    await togglePostLike(post.id, user.uid, Boolean(isLiked));
  };

  const handleTogglePin = async () => {
    await togglePinPost(post.id, !post.isPinned);
    setShowMenu(false);
  };

  const handleToggleStatus = async () => {
    const nextStatus = post.status === 'resolved' ? 'open' : 'resolved';
    await updatePostStatus(post.id, nextStatus);
    setShowMenu(false);
  };

  const handleUnflag = async () => {
    await unflagPost(post.id);
    setShowMenu(false);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to permanently delete this post and its replies?')) {
      await deleteForumPost(post.id);
      setShowMenu(false);
    }
  };

  const handleFlagSubmit = async (reason: string) => {
    await flagPost(post.id, reason);
  };

  const getRoleBadge = (r: UserRole) => {
    switch (r) {
      case 'agronomist':
        return {
          label: 'Agronomist',
          icon: Award,
          class: 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800',
        };
      case 'moderator':
        return {
          label: 'Moderator',
          icon: ShieldCheck,
          class: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
        };
      default:
        return {
          label: 'Farmer',
          icon: Sprout,
          class: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        };
    }
  };

  const getUrgencyBadge = (u: string) => {
    switch (u) {
      case 'high':
        return 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      case 'medium':
        return 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      default:
        return 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    }
  };

  const roleInfo = getRoleBadge(post.authorRole);
  const RoleIcon = roleInfo.icon;

  return (
    <>
      <article
        id={`post-card-${post.id}`}
        className={`bg-white dark:bg-[#142017] border rounded-3xl p-5 sm:p-7 shadow-xs space-y-4 transition-all relative ${
          post.isPinned
            ? 'border-emerald-300 dark:border-emerald-700/80 bg-emerald-50/20 dark:bg-[#18281d]'
            : 'border-emerald-100 dark:border-emerald-900/60'
        }`}
      >
        {/* Pinned & Flagged Mod Alerts */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            {post.isPinned && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                <Pin className="w-3 h-3 text-emerald-600" />
                <span>Pinned Advisory</span>
              </span>
            )}

            {post.status === 'resolved' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Resolved</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                <AlertCircle className="w-3 h-3 text-amber-600" />
                <span>Open for Advice</span>
              </span>
            )}

            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getUrgencyBadge(
                post.urgency
              )}`}
            >
              {post.urgency} Urgency
            </span>
          </div>

          {/* Moderation Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-emerald-600/70 hover:text-emerald-950 transition-colors cursor-pointer"
              title="Post Options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-[#1a2b1e] border border-emerald-100 dark:border-emerald-900/60 rounded-2xl p-1.5 shadow-xl z-20 space-y-1 animate-fade-in text-xs">
                {/* Resolve status toggle */}
                {canModerate && (
                  <button
                    onClick={handleToggleStatus}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/40 text-emerald-950 dark:text-emerald-200 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{post.status === 'resolved' ? 'Mark as Open' : 'Mark as Resolved'}</span>
                  </button>
                )}

                {/* Pin toggle for moderators */}
                {isModerator && (
                  <button
                    onClick={handleTogglePin}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/40 text-emerald-950 dark:text-emerald-200 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <Pin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{post.isPinned ? 'Unpin Post' : 'Pin to Top'}</span>
                  </button>
                )}

                {/* Unflag if flagged (Moderators) */}
                {isModerator && post.isFlagged && (
                  <button
                    onClick={handleUnflag}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/40 text-emerald-950 dark:text-emerald-200 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Dismiss Flag / Approved</span>
                  </button>
                )}

                {/* Report / Flag button */}
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowFlagDialog(true);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-800 dark:text-amber-300 flex items-center gap-2 cursor-pointer font-medium"
                >
                  <Flag className="w-3.5 h-3.5 text-amber-600" />
                  <span>Report / Flag Post</span>
                </button>

                {/* Delete button (Author or Moderator) */}
                {(isAuthor || isModerator) && (
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-300 flex items-center gap-2 cursor-pointer font-medium border-t border-emerald-100 dark:border-emerald-900/40"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>Delete Post</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Flagged Banner for Moderators */}
        {post.isFlagged && (
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-2">
              <Flag className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Flagged content:</strong> {post.flagReason || 'Under moderator review'}
              </span>
            </div>
            {isModerator && (
              <button
                onClick={handleUnflag}
                className="font-bold underline text-emerald-700 hover:text-emerald-900 cursor-pointer ml-2"
              >
                Approve
              </button>
            )}
          </div>
        )}

        {/* Author Details & Date */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-sm font-bold shadow-xs">
            {post.authorName ? post.authorName.charAt(0).toUpperCase() : 'F'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-emerald-950 dark:text-white">
                {post.authorName}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${roleInfo.class}`}
              >
                <RoleIcon className="w-2.5 h-2.5" />
                <span>{roleInfo.label}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-800/60 dark:text-emerald-400/50 mt-0.5">
              {post.authorLocation && <span>{post.authorLocation} • </span>}
              <span>
                {new Date(post.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Post Title & Description */}
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-bold text-emerald-950 dark:text-white tracking-tight leading-snug">
            {post.title}
          </h3>
          <p className="text-xs sm:text-sm text-emerald-900/90 dark:text-emerald-100/90 leading-relaxed font-normal whitespace-pre-line">
            {post.description}
          </p>
        </div>

        {/* Crop & Category Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-200/80 dark:border-emerald-800/60 text-xs font-bold flex items-center gap-1.5">
            <Sprout className="w-3.5 h-3.5 text-emerald-600" />
            <span>Crop: {post.crop}</span>
          </span>

          <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-200/80 dark:border-emerald-800/60 text-xs font-medium capitalize">
            Category: {post.category}
          </span>
        </div>

        {/* Attached Specimen Image */}
        {post.imageUrl && (
          <div className="relative rounded-2xl overflow-hidden border border-emerald-100 dark:border-emerald-900/60 group max-h-80 bg-black/10">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-72 object-cover transition-transform group-hover:scale-101"
            />
            <button
              onClick={() => setIsImageZoomed(true)}
              className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black/90 text-white text-xs font-semibold backdrop-blur-xs flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Inspect Specimen</span>
            </button>
          </div>
        )}

        {/* Attached AI Diagnosis Snippet */}
        {post.analysisSnippet && (
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Attached Gemini Vision AI Diagnosis</span>
              </span>
              <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                {post.analysisSnippet.confidence}% Certainty
              </span>
            </div>
            <div className="text-xs font-bold text-emerald-950 dark:text-emerald-100">
              Identified: {post.analysisSnippet.problem}
            </div>
            <p className="text-[11px] text-emerald-800/70 dark:text-emerald-300/70 italic">
              "{post.analysisSnippet.recommendationSummary}"
            </p>
          </div>
        )}

        {/* Card Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-emerald-100 dark:border-emerald-900/40 text-xs">
          <div className="flex items-center gap-3">
            {/* Like button */}
            <button
              onClick={handleToggleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                isLiked
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{post.likesCount > 0 ? post.likesCount : 'Helpful'}</span>
            </button>

            {/* Comments Toggle */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100 transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{commentsCount} {commentsCount === 1 ? 'Reply' : 'Replies'}</span>
            </button>
          </div>

          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert('Crop case discussion link copied to clipboard!');
              }
            }}
            className="p-2 rounded-xl text-emerald-600/70 hover:text-emerald-950 hover:bg-emerald-50 transition-colors cursor-pointer"
            title="Share case"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Collapsible Comment Stream */}
        {showComments && (
          <CommentSection
            post={post}
            onCommentCountChange={(count) => setCommentsCount(count)}
          />
        )}
      </article>

      {/* Image Inspection Zoom Modal */}
      {isImageZoomed && post.imageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsImageZoomed(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl">
            <button
              onClick={() => setIsImageZoomed(false)}
              className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={post.imageUrl}
              alt="Zoomed specimen"
              className="w-full h-auto max-h-[85vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}

      {/* Flag dialog */}
      <FlagDialog
        isOpen={showFlagDialog}
        onClose={() => setShowFlagDialog(false)}
        onSubmit={handleFlagSubmit}
        targetType="post"
      />
    </>
  );
};
