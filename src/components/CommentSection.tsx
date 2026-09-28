import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  ThumbsUp,
  Award,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Flag,
  Image as ImageIcon,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ForumComment, ForumPost, UserRole } from '../types';
import {
  subscribeToComments,
  addCommentToPost,
  toggleCommentLike,
  markCommentAsSolution,
  flagComment,
  deleteComment,
} from '../services/firebase';
import { FlagDialog } from './FlagDialog';

interface CommentSectionProps {
  post: ForumPost;
  onCommentCountChange?: (count: number) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  post,
  onCommentCountChange,
}) => {
  const { user, openAuthModal } = useAuth();
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [newContent, setNewContent] = useState('');
  const [commentImage, setCommentImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [flagTargetCommentId, setFlagTargetCommentId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToComments(post.id, (loadedComments) => {
      setComments(loadedComments);
      if (onCommentCountChange) {
        onCommentCountChange(loadedComments.length);
      }
    });

    return () => unsubscribe();
  }, [post.id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }

    if (!newContent.trim()) return;

    setIsSubmitting(true);
    try {
      await addCommentToPost(post.id, {
        userId: user.uid,
        authorName: user.displayName || 'Field Grower',
        authorEmail: user.email,
        authorAvatar: user.photoURL,
        authorRole: user.role || 'farmer',
        authorLocation: user.location,
        content: newContent.trim(),
        imageUrl: commentImage || undefined,
        isSolution: false,
      });

      setNewContent('');
      setCommentImage(null);
    } catch (e) {
      console.warn('Error posting comment:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleLike = async (comment: ForumComment) => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    const isLiked = comment.likedBy?.includes(user.uid) || false;
    await toggleCommentLike(post.id, comment.id, user.uid, isLiked);
  };

  const handleToggleSolution = async (comment: ForumComment) => {
    if (!user) return;
    const canMark =
      user.role === 'agronomist' ||
      user.role === 'moderator' ||
      user.uid === post.userId;

    if (!canMark) return;

    await markCommentAsSolution(post.id, comment.id, !comment.isSolution);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;
    if (confirm('Are you sure you want to delete this comment?')) {
      await deleteComment(post.id, commentId);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCommentImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFlagSubmit = async (reason: string) => {
    if (flagTargetCommentId) {
      await flagComment(post.id, flagTargetCommentId, reason);
      setFlagTargetCommentId(null);
    }
  };

  const getRoleBadge = (r: UserRole) => {
    switch (r) {
      case 'agronomist':
        return {
          label: 'Agronomist',
          class: 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800',
        };
      case 'moderator':
        return {
          label: 'Moderator',
          class: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
        };
      default:
        return {
          label: 'Farmer',
          class: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        };
    }
  };

  // Sort comments so verified solution appears first, then chronological
  const sortedComments = [...comments].sort((a, b) => {
    if (a.isSolution && !b.isSolution) return -1;
    if (!a.isSolution && b.isSolution) return 1;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return (
    <div className="pt-4 border-t border-emerald-100 dark:border-emerald-900/40 space-y-4">
      {/* Comments Heading */}
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
          <span>Responses & Agronomic Advice ({comments.length})</span>
        </h4>
        <span className="text-[11px] text-emerald-700/60 dark:text-emerald-400/50">
          Science-backed IPM responses
        </span>
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {sortedComments.length === 0 ? (
          <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-center space-y-1">
            <p className="text-xs font-medium text-emerald-950 dark:text-emerald-200">
              No replies yet on this crop case.
            </p>
            <p className="text-[11px] text-emerald-800/60 dark:text-emerald-400/50">
              Are you familiar with this crop or pathogen? Share your treatment advice below.
            </p>
          </div>
        ) : (
          sortedComments.map((comment) => {
            const roleBadge = getRoleBadge(comment.authorRole);
            const isLiked = user && comment.likedBy?.includes(user.uid);
            const isAuthor = user && user.uid === comment.userId;
            const isMod = user && (user.role === 'moderator' || user.role === 'agronomist');
            const canVerifySolution =
              user && (user.role === 'agronomist' || user.role === 'moderator' || user.uid === post.userId);

            return (
              <div
                key={comment.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                  comment.isSolution
                    ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700/60 shadow-xs'
                    : 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/40'
                }`}
              >
                {/* Solution Badge if marked */}
                {comment.isSolution && (
                  <div className="flex items-center gap-1.5 mb-2 px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 text-xs font-bold w-fit border border-amber-300 dark:border-amber-700/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Verified Agronomic Solution</span>
                  </div>
                )}

                {/* Comment Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                      {comment.authorName ? comment.authorName.charAt(0).toUpperCase() : 'F'}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-xs text-emerald-950 dark:text-white">
                        {comment.authorName}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md border ${roleBadge.class}`}
                      >
                        {roleBadge.label}
                      </span>
                      {comment.authorLocation && (
                        <span className="text-[10px] text-emerald-800/60 dark:text-emerald-400/50 hidden sm:inline">
                          • {comment.authorLocation}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] text-emerald-800/50 dark:text-emerald-400/40">
                    {new Date(comment.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                {/* Comment Body */}
                <p className="text-xs sm:text-sm text-emerald-900/90 dark:text-emerald-100/90 mt-2 leading-relaxed whitespace-pre-line font-normal">
                  {comment.content}
                </p>

                {/* Optional Comment Image */}
                {comment.imageUrl && (
                  <div className="mt-2.5 rounded-xl overflow-hidden max-h-48 border border-emerald-100 dark:border-emerald-900/40">
                    <img
                      src={comment.imageUrl}
                      alt="Comment attachment"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Comment Footer & Actions */}
                <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-emerald-100/60 dark:border-emerald-900/30 text-xs">
                  {/* Like / Helpful button */}
                  <button
                    onClick={() => handleToggleLike(comment)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-xs font-semibold ${
                      isLiked
                        ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200'
                        : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/40'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{comment.likesCount > 0 ? comment.likesCount : 'Helpful'}</span>
                  </button>

                  {/* Actions right */}
                  <div className="flex items-center gap-2">
                    {/* Mark as Solution button */}
                    {canVerifySolution && (
                      <button
                        onClick={() => handleToggleSolution(comment)}
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border transition-colors cursor-pointer flex items-center gap-1 ${
                          comment.isSolution
                            ? 'bg-amber-100 border-amber-300 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                            : 'border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/50'
                        }`}
                        title="Mark as verified solution"
                      >
                        <Award className="w-3 h-3" />
                        <span>{comment.isSolution ? 'Unmark Solution' : 'Verify Solution'}</span>
                      </button>
                    )}

                    {/* Flag button */}
                    <button
                      onClick={() => setFlagTargetCommentId(comment.id)}
                      className="p-1 text-emerald-600/60 hover:text-amber-600 transition-colors cursor-pointer"
                      title="Report comment"
                    >
                      <Flag className="w-3 h-3" />
                    </button>

                    {/* Delete button (Author or Moderator) */}
                    {(isAuthor || isMod) && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="p-1 text-emerald-600/60 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete comment"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Comment Input Form */}
      <form onSubmit={handleAddComment} className="pt-2 space-y-2">
        {commentImage && (
          <div className="relative inline-block">
            <img
              src={commentImage}
              alt="Attachment preview"
              className="w-16 h-16 object-cover rounded-xl border border-emerald-200"
            />
            <button
              type="button"
              onClick={() => setCommentImage(null)}
              className="absolute -top-1.5 -right-1.5 p-0.5 bg-rose-600 text-white rounded-full shadow-xs cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className="flex items-end gap-2 bg-white dark:bg-[#142017] border border-emerald-200/80 dark:border-emerald-900/60 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-emerald-500">
          <textarea
            rows={2}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder={
              user
                ? `Write your advice as ${user.displayName || 'Farmer'}...`
                : 'Sign in to reply or share pest advice...'
            }
            className="flex-1 bg-transparent text-xs sm:text-sm text-emerald-950 dark:text-white placeholder:text-emerald-800/40 focus:outline-none resize-none px-2 py-1"
          />

          <div className="flex items-center gap-1">
            {/* Image attachment button */}
            <label
              className="p-2 text-emerald-600/70 hover:text-emerald-950 dark:text-emerald-400 dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-xl transition-colors cursor-pointer"
              title="Attach photo"
            >
              <ImageIcon className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {/* Send Button */}
            <button
              type="submit"
              disabled={isSubmitting || (!newContent.trim() && !user)}
              className="p-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-40"
              title="Post comment"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      {/* Flag Dialog */}
      <FlagDialog
        isOpen={Boolean(flagTargetCommentId)}
        onClose={() => setFlagTargetCommentId(null)}
        onSubmit={handleFlagSubmit}
        targetType="comment"
      />
    </div>
  );
};
