import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createWorkspaceSchema } from '../schema';
import { sessionMiddleware } from '@/lib/session-middleware';
import { DATABASE_ID, IMAGE_BUCKET_ID, WORKSPACE_ID } from '@/config';
import { ID } from 'node-appwrite';

const app = new Hono().post(
  '/',
  zValidator('form', createWorkspaceSchema),
  sessionMiddleware,
  async (c) => {
    const databases = c.get('databases');
    const storage = c.get('storage');
    const user = c.get('user');

    const { name, image } = c.req.valid('form');

    let uploadedImageUrl: string | undefined;
    if (image && image instanceof File) {
      const file = await storage.createFile(
        IMAGE_BUCKET_ID,
        ID.unique(),
        image
      );
      const fileBuffer = await storage.getFileDownload(
        IMAGE_BUCKET_ID,
        file.$id
      );

      uploadedImageUrl = `data:image/png;base64,${Buffer.from(
        fileBuffer
      ).toString('base64')}`;
    }

    const workspace = await databases.createDocument({
      collectionId: WORKSPACE_ID,
      databaseId: DATABASE_ID,
      documentId: ID.unique(),
      data: {
        name,
        userId: user.$id,
        image: uploadedImageUrl,
      },
    });

    return c.json({ data: workspace });
  }
);

export default app;
