import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

// Get nested comments for a lesson
export const getLessonComments = async (req: AuthRequest, res: Response) => {
  const { lessonId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { lessonId },
      include: {
        user: {
          select: {
            id: true,
            nameAr: true,
            nameEn: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Nest replies under their parents in memory
    const commentMap: { [key: string]: any } = {};
    const rootComments: any[] = [];

    comments.forEach(comment => {
      commentMap[comment.id] = { ...comment, replies: [] };
    });

    comments.forEach(comment => {
      const mapped = commentMap[comment.id];
      if (comment.parentId) {
        const parent = commentMap[comment.parentId];
        if (parent) {
          parent.replies.push(mapped);
        } else {
          // If parent not found (e.g. deleted or error), treat as root
          rootComments.push(mapped);
        }
      } else {
        rootComments.push(mapped);
      }
    });

    return res.json({ comments: rootComments });
  } catch (error) {
    console.error('Get comments error:', error);
    return res.status(500).json({ error: 'Internal server error fetching comments' });
  }
};

// Create a new comment or reply
export const createComment = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized to post comments' });
  }

  const { lessonId } = req.params;
  const { content, parentId } = req.body;

  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Comment content is required' });
  }

  try {
    // Check if lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId }
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // If parentId is specified, make sure it exists
    if (parentId) {
      const parent = await prisma.comment.findUnique({
        where: { id: parentId }
      });
      if (!parent) {
        return res.status(404).json({ error: 'Parent comment not found' });
      }
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        lessonId,
        userId: req.user.id,
        parentId: parentId || null
      },
      include: {
        user: {
          select: {
            id: true,
            nameAr: true,
            nameEn: true,
            role: true
          }
        }
      }
    });

    return res.status(201).json({
      message: 'Comment posted successfully',
      comment
    });
  } catch (error) {
    console.error('Create comment error:', error);
    return res.status(500).json({ error: 'Internal server error posting comment' });
  }
};

// Delete a comment
export const deleteComment = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized comment deletion' });
  }

  const { id } = req.params;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id }
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Verify ownership or role
    const isOwner = comment.userId === req.user.id;
    const isAdminOrTeacher = req.user.role === 'ADMIN' || req.user.role === 'TEACHER';

    if (!isOwner && !isAdminOrTeacher) {
      return res.status(403).json({ error: 'Forbidden: you cannot delete this comment' });
    }

    await prisma.comment.delete({
      where: { id }
    });

    return res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    return res.status(500).json({ error: 'Internal server error deleting comment' });
  }
};
