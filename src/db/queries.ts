import { db } from './index.ts';
import { analyses, forumPosts, userProfiles } from './schema.ts';
import { desc, eq } from 'drizzle-orm';
import type { AnalysisResult, ForumPost, UserProfile } from '../types/index.ts';

export async function saveAnalysisToDb(result: AnalysisResult, userId?: string) {
  if (!db) {
    return result as any;
  }
  try {
    const inserted = await db
      .insert(analyses)
      .values({
        id: result.id,
        userId: userId || null,
        analyzedAt: new Date(result.analyzedAt),
        imageQuality: result.imageQuality,
        plantDetected: result.plantDetected,
        crop: result.crop,
        problem: result.problem,
        confidence: result.confidence,
        confidenceLevel: result.confidenceLevel,
        severity: result.severity,
        visualSymptoms: result.visualSymptoms || [],
        possibleCauses: result.possibleCauses || [],
        recommendations: result.recommendations || [],
        ipm: result.ipm || [],
        prevention: result.prevention || [],
        monitoring: result.monitoring || [],
        expertAdvice: result.expertAdvice || '',
        isDemo: result.isDemo || false,
        userNotes: result.userNotes || null,
        imageThumbnail: result.imageThumbnail || null,
      })
      .onConflictDoUpdate({
        target: analyses.id,
        set: {
          userNotes: result.userNotes || null,
          imageThumbnail: result.imageThumbnail || null,
        },
      })
      .returning();

    return inserted[0];
  } catch (error) {
    console.error('Failed to save analysis to PostgreSQL database:', error);
    return result as any;
  }
}

export async function getAnalysesFromDb(userId?: string) {
  if (!db) {
    return [];
  }
  try {
    if (userId) {
      return await db
        .select()
        .from(analyses)
        .where(eq(analyses.userId, userId))
        .orderBy(desc(analyses.analyzedAt))
        .limit(50);
    }
    return await db
      .select()
      .from(analyses)
      .orderBy(desc(analyses.analyzedAt))
      .limit(50);
  } catch (error) {
    console.error('Failed to get analyses from database:', error);
    return [];
  }
}

export async function getForumPostsFromDb() {
  if (!db) {
    return [];
  }
  try {
    return await db
      .select()
      .from(forumPosts)
      .orderBy(desc(forumPosts.createdAt))
      .limit(100);
  } catch (error) {
    console.error('Failed to get forum posts from database:', error);
    return [];
  }
}

export async function createForumPostInDb(post: {
  id: string;
  userId: string;
  authorName: string;
  authorRole: string;
  authorLocation?: string;
  crop: string;
  title: string;
  content: string;
  category: string;
  urgency: string;
  imageUrl?: string;
  analysisId?: string;
}) {
  if (!db) {
    return post as any;
  }
  try {
    const inserted = await db
      .insert(forumPosts)
      .values({
        id: post.id,
        userId: post.userId,
        authorName: post.authorName,
        authorRole: post.authorRole,
        authorLocation: post.authorLocation || null,
        crop: post.crop,
        title: post.title,
        content: post.content,
        category: post.category,
        urgency: post.urgency,
        imageUrl: post.imageUrl || null,
        analysisId: post.analysisId || null,
      })
      .returning();

    return inserted[0];
  } catch (error) {
    console.error('Failed to create forum post in database:', error);
    return post as any;
  }
}

export async function syncUserProfileToDb(profile: {
  uid: string;
  email?: string | null;
  displayName: string;
  photoURL?: string | null;
  role?: string;
  location?: string;
  cropSpecialty?: string;
  bio?: string;
}) {
  if (!db) {
    return profile as any;
  }
  try {
    const result = await db
      .insert(userProfiles)
      .values({
        uid: profile.uid,
        email: profile.email || null,
        displayName: profile.displayName,
        photoURL: profile.photoURL || null,
        role: profile.role || 'farmer',
        location: profile.location || null,
        cropSpecialty: profile.cropSpecialty || null,
        bio: profile.bio || null,
      })
      .onConflictDoUpdate({
        target: userProfiles.uid,
        set: {
          displayName: profile.displayName,
          email: profile.email || null,
          photoURL: profile.photoURL || null,
          location: profile.location || null,
          cropSpecialty: profile.cropSpecialty || null,
          bio: profile.bio || null,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Failed to sync user profile to database:', error);
    return profile as any;
  }
}
