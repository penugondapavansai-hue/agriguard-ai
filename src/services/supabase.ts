import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  AnalysisResult,
  ForumComment,
  ForumPost,
  UserProfile,
  UserRole,
} from '../types';

// Default Supabase configuration
const metaEnv = (import.meta as any).env || {};
const SUPABASE_URL = metaEnv.VITE_SUPABASE_URL || 'https://xaubecuaalodjvvaenrz.supabase.co';
const SUPABASE_ANON_KEY = metaEnv.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  SUPABASE_ANON_KEY &&
  SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY' &&
  !SUPABASE_ANON_KEY.startsWith('MY_')
);

// Initialize Supabase client
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// Local fallback keys for seamless offline / pre-configuration usage
const LOCAL_STORAGE_USERS_KEY = 'agriguard_local_users';
const LOCAL_STORAGE_POSTS_KEY = 'agriguard_local_posts';
const LOCAL_STORAGE_COMMENTS_KEY = 'agriguard_local_comments';
const LOCAL_STORAGE_ANALYSES_KEY = 'agriguard_analysis_history_v1';

// Default seed forum posts
export const SEED_POSTS: Omit<ForumPost, 'id'>[] = [
  {
    userId: 'seed_farmer_1',
    authorName: 'Ramesh Patel',
    authorRole: 'farmer',
    authorLocation: 'Gujarat, India',
    title: 'Severe curling and silvering underneath cotton leaves - is it Whitefly or Thrips?',
    description:
      'Noticed upward curling on my Bt-Cotton crop (approx 45 days after sowing). The leaf undersides show slight shiny silvery patches and early honeydew excretion. What IPM spray or botanical treatment is safest right now before boll formation?',
    crop: 'Cotton',
    category: 'pest',
    urgency: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1594488554286-9a2c3a502621?auto=format&fit=crop&w=800&q=80',
    analysisSnippet: {
      problem: 'Cotton Thrips & Whitefly Infestation',
      confidence: 94,
      severity: 'HIGH',
      recommendationSummary: 'Install 10 yellow sticky traps/acre immediately; apply 5% Neem Seed Kernel Extract (NSKE) or Neem Oil 1500ppm before considering systemic insecticides.',
    },
    status: 'resolved',
    likesCount: 14,
    likedBy: ['seed_user_2', 'seed_user_3'],
    commentsCount: 2,
    isPinned: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
  {
    userId: 'seed_agronomist_1',
    authorName: 'Dr. Ananya Sharma',
    authorRole: 'agronomist',
    authorLocation: 'ICAR Research Station, Pune',
    title: 'Advisory: Early Blight outbreak warning following continuous humid showers',
    description:
      'Farmers growing Solanaceous crops (Tomato, Potato, Eggplant) should monitor lower foliage closely. Concentric brown ring lesions (target-board appearance) indicate Alternaria solani. Avoid overhead sprinkler irrigation in the late evenings.',
    crop: 'Tomato',
    category: 'fungal',
    urgency: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=800&q=80',
    status: 'open',
    likesCount: 28,
    likedBy: ['seed_farmer_1', 'seed_user_4'],
    commentsCount: 1,
    isPinned: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    userId: 'seed_farmer_2',
    authorName: 'Suresh Rao',
    authorRole: 'farmer',
    authorLocation: 'Andhra Pradesh, India',
    title: 'Yellowing interveinal striping on young paddy tillers',
    description:
      'Our rice fields are in the tillering stage. New leaves are pale yellow while the veins stay green. Suspecting Zinc or Iron deficiency due to alkaline soil pH (8.2). How quickly can foliar zinc chelate revive the crop?',
    crop: 'Paddy / Rice',
    category: 'deficiency',
    urgency: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    status: 'open',
    likesCount: 8,
    likedBy: ['seed_agronomist_1'],
    commentsCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    userId: 'seed_farmer_3',
    authorName: 'Mahesh Kumar',
    authorRole: 'farmer',
    authorLocation: 'Karnataka, India',
    title: 'Chili leaf curl virus vector management without harming beneficial predators',
    description:
      'We had a mild outbreak of Gemini leaf curl virus transmitted by Bemisia tabaci. We have ladybird beetles and hoverfly larvae active in the field. Seeking bio-rational pest control measures to halt transmission.',
    crop: 'Chili',
    category: 'viral',
    urgency: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1588879460618-924b172a5639?auto=format&fit=crop&w=800&q=80',
    status: 'resolved',
    likesCount: 19,
    likedBy: ['seed_agronomist_1', 'seed_farmer_1'],
    commentsCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
];

export const SEED_COMMENTS: Record<string, Omit<ForumComment, 'id' | 'postId'>[]> = {
  seed_post_0: [
    {
      userId: 'seed_agronomist_1',
      authorName: 'Dr. Ananya Sharma',
      authorRole: 'agronomist',
      authorLocation: 'ICAR Pune',
      content:
        'Confirmed Thrips + Whitefly complex. Spray cold-pressed Neem Oil (10,000 ppm at 2ml/L) along with Pongamia pinnata (Karanja oil) in the early morning hours. Erect 10-12 yellow and blue sticky traps per acre to disrupt the mating cycle.',
      isSolution: true,
      likesCount: 12,
      likedBy: ['seed_farmer_1', 'seed_farmer_2'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    },
  ],
};

/* =========================================================================
   USER PROFILE & AUTHENTICATION
   ========================================================================= */

function getLocalUsers(): Record<string, UserProfile> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalUsers(users: Record<string, UserProfile>) {
  try {
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn('Could not save local user to cache', e);
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('uid', uid)
        .maybeSingle();

      if (!error && data) {
        return {
          uid: data.uid,
          email: data.email,
          displayName: data.display_name,
          photoURL: data.photo_url,
          role: data.role as UserRole,
          location: data.location,
          cropSpecialty: data.crop_specialty,
          bio: data.bio,
          isVerifiedAgronomist: data.is_verified_agronomist,
          joinedAt: data.joined_at,
        };
      }
    } catch (err) {
      console.warn('Supabase profile fetch error, fallback to local:', err);
    }
  }

  const locals = getLocalUsers();
  return locals[uid] || null;
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const locals = getLocalUsers();
  locals[profile.uid] = profile;
  saveLocalUsers(locals);

  if (supabase) {
    try {
      await supabase.from('user_profiles').upsert({
        uid: profile.uid,
        email: profile.email,
        display_name: profile.displayName,
        photo_url: profile.photoURL || null,
        role: profile.role,
        location: profile.location || null,
        crop_specialty: profile.cropSpecialty || null,
        bio: profile.bio || null,
        is_verified_agronomist: profile.isVerifiedAgronomist || false,
        joined_at: profile.joinedAt || new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Supabase saveUserProfile error:', err);
    }
  }
}

export async function signUpWithEmail(
  email: string,
  pass: string,
  displayName: string,
  role: UserRole = 'farmer',
  location = '',
  cropSpecialty = ''
): Promise<UserProfile> {
  if (supabase) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          displayName,
          role,
          location,
          cropSpecialty,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    const uid = data.user?.id || `usr_${Date.now()}`;
    const profile: UserProfile = {
      uid,
      email,
      displayName,
      role,
      location,
      cropSpecialty,
      joinedAt: new Date().toISOString(),
    };
    await saveUserProfile(profile);
    return profile;
  }

  // Local fallback auth
  const uid = 'local_' + btoa(email).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
  const profile: UserProfile = {
    uid,
    email,
    displayName,
    role,
    location,
    cropSpecialty,
    joinedAt: new Date().toISOString(),
  };
  await saveUserProfile(profile);
  localStorage.setItem('agriguard_active_uid', uid);
  return profile;
}

export async function signInWithEmail(email: string, pass: string): Promise<UserProfile> {
  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) {
      throw new Error(error.message);
    }

    const uid = data.user.id;
    const existing = await getUserProfile(uid);
    if (existing) return existing;

    const profile: UserProfile = {
      uid,
      email,
      displayName: data.user.user_metadata?.displayName || email.split('@')[0],
      role: (data.user.user_metadata?.role as UserRole) || 'farmer',
      joinedAt: new Date().toISOString(),
    };
    await saveUserProfile(profile);
    return profile;
  }

  // Local fallback
  const locals = getLocalUsers();
  for (const uid in locals) {
    if (locals[uid].email?.toLowerCase() === email.toLowerCase()) {
      localStorage.setItem('agriguard_active_uid', uid);
      return locals[uid];
    }
  }

  const uid = 'local_' + btoa(email).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
  const profile: UserProfile = {
    uid,
    email,
    displayName: email.split('@')[0],
    role: 'farmer',
    joinedAt: new Date().toISOString(),
  };
  await saveUserProfile(profile);
  localStorage.setItem('agriguard_active_uid', uid);
  return profile;
}

export async function signInWithGoogle(preferredRole: UserRole = 'farmer'): Promise<UserProfile> {
  if (supabase) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw new Error(error.message);
  }

  return signInAsGuest('Google Agronomist', preferredRole, 'Regional Field Station');
}

export async function signInAsGuest(
  name = 'Field Farmer',
  role: UserRole = 'farmer',
  location = 'Field Zone'
): Promise<UserProfile> {
  const uid = 'guest_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
  const profile: UserProfile = {
    uid,
    email: null,
    displayName: name,
    role,
    location,
    joinedAt: new Date().toISOString(),
  };
  await saveUserProfile(profile);
  localStorage.setItem('agriguard_active_uid', uid);
  return profile;
}

export async function signOutUser(): Promise<void> {
  localStorage.removeItem('agriguard_active_uid');
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
  }
}

export async function updateUserProfile(
  uid: string,
  updates: Partial<UserProfile>
): Promise<UserProfile | null> {
  const current = await getUserProfile(uid);
  if (!current) return null;

  const updated: UserProfile = { ...current, ...updates };
  await saveUserProfile(updated);
  return updated;
}

/* =========================================================================
   ANALYSES CLOUD PERSISTENCE
   ========================================================================= */

export async function syncAnalysisToCloud(userId: string, result: AnalysisResult): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('analyses').upsert({
        id: result.id,
        user_id: userId,
        analyzed_at: result.analyzedAt,
        image_quality: result.imageQuality,
        plant_detected: result.plantDetected,
        crop: result.crop,
        problem: result.problem,
        confidence: result.confidence,
        confidence_level: result.confidenceLevel,
        severity: result.severity,
        visual_symptoms: result.visualSymptoms || [],
        possible_causes: result.possibleCauses || [],
        recommendations: result.recommendations || [],
        ipm: result.ipm || [],
        prevention: result.prevention || [],
        monitoring: result.monitoring || [],
        expert_advice: result.expertAdvice || '',
        is_demo: result.isDemo || false,
        user_notes: result.userNotes || null,
        image_thumbnail: result.imageThumbnail || null,
      });
      return !error;
    } catch (err) {
      console.warn('Failed to sync analysis to Supabase:', err);
      return false;
    }
  }
  return true;
}

export async function fetchUserAnalysesFromCloud(userId: string): Promise<AnalysisResult[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', userId)
        .order('analyzed_at', { ascending: false })
        .limit(50);

      if (!error && data) {
        return data.map((d) => ({
          id: d.id,
          analyzedAt: d.analyzed_at,
          imageQuality: d.image_quality,
          plantDetected: d.plant_detected,
          crop: d.crop,
          problem: d.problem,
          confidence: d.confidence,
          confidenceLevel: d.confidence_level,
          severity: d.severity,
          visualSymptoms: d.visual_symptoms || [],
          possibleCauses: d.possible_causes || [],
          recommendations: d.recommendations || [],
          ipm: d.ipm || [],
          prevention: d.prevention || [],
          monitoring: d.monitoring || [],
          expertAdvice: d.expert_advice || '',
          isDemo: d.is_demo,
          userNotes: d.user_notes,
          imageThumbnail: d.image_thumbnail,
        }));
      }
    } catch (e) {
      console.warn('Error reading from Supabase analyses:', e);
    }
  }

  return [];
}

export const fetchUserCloudAnalyses = fetchUserAnalysesFromCloud;

export async function syncLocalHistoryToCloud(userId: string): Promise<void> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ANALYSES_KEY);
    if (!raw) return;
    const items: AnalysisResult[] = JSON.parse(raw);
    for (const item of items) {
      await syncAnalysisToCloud(userId, item);
    }
  } catch (err) {
    console.warn('Error during local to cloud sync:', err);
  }
}

export async function deleteUserAnalysisFromCloud(userId: string, analysisId: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('analyses').delete().eq('id', analysisId);
      return !error;
    } catch {
      return false;
    }
  }
  return true;
}

export async function clearUserAnalysesFromCloud(userId: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('analyses').delete().eq('user_id', userId);
      return !error;
    } catch {
      return false;
    }
  }
  return true;
}

/* =========================================================================
   COMMUNITY FORUM SERVICES
   ========================================================================= */

function getLocalPosts(): ForumPost[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_POSTS_KEY);
    if (!raw) {
      const initial = SEED_POSTS.map((sp, idx) => ({
        ...sp,
        id: `seed_post_${idx}`,
      }));
      localStorage.setItem(LOCAL_STORAGE_POSTS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_POSTS.map((sp, idx) => ({ ...sp, id: `seed_post_${idx}` }));
  }
}

function saveLocalPosts(posts: ForumPost[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_POSTS_KEY, JSON.stringify(posts));
  } catch (e) {
    console.warn('Could not save local posts:', e);
  }
}

export async function ensureSeedPostsInitialized(): Promise<void> {
  getLocalPosts();
}

export function subscribeToForumPosts(
  callback: (posts: ForumPost[]) => void,
  onError?: (err: any) => void
): () => void {
  let isMounted = true;

  const fetchPosts = async () => {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('forum_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped: ForumPost[] = data.map((p) => ({
            id: p.id,
            userId: p.user_id,
            authorName: p.author_name,
            authorRole: p.author_role,
            authorLocation: p.author_location,
            crop: p.crop,
            title: p.title,
            description: p.description || p.content || '',
            category: p.category,
            urgency: p.urgency,
            status: p.status || 'open',
            likesCount: p.likes_count || 0,
            likedBy: p.liked_by || [],
            commentsCount: p.comments_count || 0,
            isPinned: p.is_pinned || false,
            imageUrl: p.image_url,
            createdAt: p.created_at,
          }));
          if (isMounted) callback(mapped);
          return;
        }
      } catch (err) {
        if (onError) onError(err);
      }
    }

    if (isMounted) {
      callback(getLocalPosts());
    }
  };

  fetchPosts();

  // Supabase Realtime subscription if available
  let channel: any = null;
  if (supabase) {
    channel = supabase
      .channel('public:forum_posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forum_posts' }, () => {
        fetchPosts();
      })
      .subscribe();
  }

  return () => {
    isMounted = false;
    if (channel && supabase) {
      supabase.removeChannel(channel);
    }
  };
}

export async function createForumPost(
  postData: Omit<ForumPost, 'id' | 'createdAt' | 'likesCount' | 'likedBy' | 'commentsCount'>
): Promise<ForumPost> {
  const newId = 'post_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
  const now = new Date().toISOString();

  const newPost: ForumPost = {
    ...postData,
    id: newId,
    likesCount: 0,
    likedBy: [],
    commentsCount: 0,
    status: postData.status || 'open',
    createdAt: now,
  };

  if (supabase) {
    try {
      await supabase.from('forum_posts').insert({
        id: newId,
        user_id: postData.userId,
        author_name: postData.authorName,
        author_role: postData.authorRole,
        author_location: postData.authorLocation || null,
        crop: postData.crop,
        title: postData.title,
        description: postData.description,
        content: postData.description,
        category: postData.category,
        urgency: postData.urgency,
        status: postData.status || 'open',
        image_url: postData.imageUrl || null,
        analysis_id: postData.analysisSnippet ? 'analysis_' + Date.now() : null,
        likes_count: 0,
        comments_count: 0,
        is_pinned: false,
        liked_by: [],
        created_at: now,
      });
    } catch (e) {
      console.warn('Could not insert to Supabase forum_posts:', e);
    }
  }

  const posts = getLocalPosts();
  posts.unshift(newPost);
  saveLocalPosts(posts);

  return newPost;
}

export async function togglePostLike(
  postId: string,
  userId: string,
  currentlyLiked: boolean
): Promise<void> {
  const posts = getLocalPosts();
  const post = posts.find((p) => p.id === postId);
  if (post) {
    if (currentlyLiked) {
      post.likesCount = Math.max(0, post.likesCount - 1);
      post.likedBy = (post.likedBy || []).filter((id) => id !== userId);
    } else {
      post.likesCount += 1;
      post.likedBy = [...(post.likedBy || []), userId];
    }
    saveLocalPosts(posts);
  }

  if (supabase) {
    try {
      await supabase
        .from('forum_posts')
        .update({
          likes_count: post?.likesCount,
          liked_by: post?.likedBy,
        })
        .eq('id', postId);
    } catch (e) {
      console.warn('Error toggling like on Supabase:', e);
    }
  }
}

export async function updatePostStatus(
  postId: string,
  status: 'open' | 'resolved'
): Promise<void> {
  const posts = getLocalPosts();
  const post = posts.find((p) => p.id === postId);
  if (post) {
    post.status = status;
    saveLocalPosts(posts);
  }

  if (supabase) {
    try {
      await supabase.from('forum_posts').update({ status }).eq('id', postId);
    } catch (e) {
      console.warn('Error updating status on Supabase:', e);
    }
  }
}

export async function togglePinPost(postId: string, isPinned: boolean): Promise<void> {
  const posts = getLocalPosts();
  const post = posts.find((p) => p.id === postId);
  if (post) {
    post.isPinned = isPinned;
    saveLocalPosts(posts);
  }

  if (supabase) {
    try {
      await supabase.from('forum_posts').update({ is_pinned: isPinned }).eq('id', postId);
    } catch (e) {
      console.warn('Error toggling pin on Supabase:', e);
    }
  }
}

export async function flagPost(postId: string, reason: string): Promise<void> {
  const posts = getLocalPosts();
  const post = posts.find((p) => p.id === postId);
  if (post) {
    (post as any).isFlagged = true;
    (post as any).flagReason = reason;
    saveLocalPosts(posts);
  }
}

export async function unflagPost(postId: string): Promise<void> {
  const posts = getLocalPosts();
  const post = posts.find((p) => p.id === postId);
  if (post) {
    (post as any).isFlagged = false;
    delete (post as any).flagReason;
    saveLocalPosts(posts);
  }
}

export async function deleteForumPost(postId: string): Promise<void> {
  const posts = getLocalPosts().filter((p) => p.id !== postId);
  saveLocalPosts(posts);

  if (supabase) {
    try {
      await supabase.from('forum_posts').delete().eq('id', postId);
    } catch (e) {
      console.warn('Error deleting post on Supabase:', e);
    }
  }
}

/* =========================================================================
   COMMENTS SERVICES
   ========================================================================= */

function getLocalComments(): Record<string, ForumComment[]> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_COMMENTS_KEY);
    if (!raw) {
      const initial: Record<string, ForumComment[]> = {};
      Object.keys(SEED_COMMENTS).forEach((postId) => {
        initial[postId] = SEED_COMMENTS[postId].map((c, idx) => ({
          ...c,
          id: `comment_${postId}_${idx}`,
          postId,
        }));
      });
      localStorage.setItem(LOCAL_STORAGE_COMMENTS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveLocalComments(comments: Record<string, ForumComment[]>) {
  try {
    localStorage.setItem(LOCAL_STORAGE_COMMENTS_KEY, JSON.stringify(comments));
  } catch (e) {
    console.warn('Could not save local comments:', e);
  }
}

export function subscribeToComments(
  postId: string,
  callback: (comments: ForumComment[]) => void,
  onError?: (err: any) => void
): () => void {
  let isMounted = true;

  const fetchComments = async () => {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('forum_comments')
          .select('*')
          .eq('post_id', postId)
          .order('created_at', { ascending: true });

        if (!error && data) {
          const mapped: ForumComment[] = data.map((c) => ({
            id: c.id,
            postId: c.post_id,
            userId: c.user_id,
            authorName: c.author_name,
            authorRole: c.author_role,
            content: c.content,
            likesCount: c.likes_count || 0,
            likedBy: c.liked_by || [],
            createdAt: c.created_at,
          }));
          if (isMounted) callback(mapped);
          return;
        }
      } catch (err) {
        if (onError) onError(err);
      }
    }

    if (isMounted) {
      const allComments = getLocalComments();
      callback(allComments[postId] || []);
    }
  };

  fetchComments();

  return () => {
    isMounted = false;
  };
}

export async function addCommentToPost(
  postId: string,
  commentPayload: any,
  _ignoredAuthorName?: string,
  _ignoredAuthorRole?: UserRole,
  _ignoredContent?: string
): Promise<ForumComment> {
  const newId = 'comment_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
  const now = new Date().toISOString();

  // Support both object payload and individual parameters
  const isObj = typeof commentPayload === 'object' && commentPayload !== null;
  const userId = isObj ? commentPayload.userId : commentPayload;
  const authorName = isObj ? commentPayload.authorName : _ignoredAuthorName || 'Farmer';
  const authorRole = isObj ? commentPayload.authorRole : _ignoredAuthorRole || 'farmer';
  const content = isObj ? commentPayload.content : _ignoredContent || '';

  const comment: ForumComment = {
    id: newId,
    postId,
    userId,
    authorName,
    authorRole,
    content,
    likesCount: 0,
    likedBy: [],
    createdAt: now,
  };

  if (supabase) {
    try {
      await supabase.from('forum_comments').insert({
        id: newId,
        post_id: postId,
        user_id: userId,
        author_name: authorName,
        author_role: authorRole,
        content,
        likes_count: 0,
        liked_by: [],
        created_at: now,
      });

      const { data: post } = await supabase.from('forum_posts').select('comments_count').eq('id', postId).single();
      if (post) {
        await supabase.from('forum_posts').update({ comments_count: (post.comments_count || 0) + 1 }).eq('id', postId);
      }
    } catch (e) {
      console.warn('Error saving comment to Supabase:', e);
    }
  }

  const allComments = getLocalComments();
  if (!allComments[postId]) allComments[postId] = [];
  allComments[postId].push(comment);
  saveLocalComments(allComments);

  const posts = getLocalPosts();
  const p = posts.find((item) => item.id === postId);
  if (p) {
    p.commentsCount = (p.commentsCount || 0) + 1;
    saveLocalPosts(posts);
  }

  return comment;
}

export async function toggleCommentLike(
  postId: string,
  commentId: string,
  userId: string,
  currentlyLiked: boolean
): Promise<void> {
  const allComments = getLocalComments();
  const comments = allComments[postId] || [];
  const comment = comments.find((c) => c.id === commentId);

  if (comment) {
    if (currentlyLiked) {
      comment.likesCount = Math.max(0, comment.likesCount - 1);
      comment.likedBy = (comment.likedBy || []).filter((id) => id !== userId);
    } else {
      comment.likesCount += 1;
      comment.likedBy = [...(comment.likedBy || []), userId];
    }
    saveLocalComments(allComments);
  }

  if (supabase) {
    try {
      await supabase
        .from('forum_comments')
        .update({
          likes_count: comment?.likesCount,
          liked_by: comment?.likedBy,
        })
        .eq('id', commentId);
    } catch (e) {
      console.warn('Error toggling comment like on Supabase:', e);
    }
  }
}

export async function markCommentAsSolution(
  postId: string,
  commentId: string,
  isSolution: boolean
): Promise<void> {
  const allComments = getLocalComments();
  const comments = allComments[postId] || [];
  const comment = comments.find((c) => c.id === commentId);
  if (comment) {
    comment.isSolution = isSolution;
    saveLocalComments(allComments);
  }
}

export async function flagComment(
  postId: string,
  commentId: string,
  reason: string
): Promise<void> {
  const allComments = getLocalComments();
  const comments = allComments[postId] || [];
  const comment = comments.find((c) => c.id === commentId);
  if (comment) {
    (comment as any).isFlagged = true;
    (comment as any).flagReason = reason;
    saveLocalComments(allComments);
  }
}

export async function deleteComment(
  postId: string,
  commentId: string
): Promise<void> {
  const allComments = getLocalComments();
  if (allComments[postId]) {
    allComments[postId] = allComments[postId].filter((c) => c.id !== commentId);
    saveLocalComments(allComments);
  }

  if (supabase) {
    try {
      await supabase.from('forum_comments').delete().eq('id', commentId);
    } catch (e) {
      console.warn('Error deleting comment from Supabase:', e);
    }
  }
}
