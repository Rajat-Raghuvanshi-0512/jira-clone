import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createWorkspaceSchema, updateWorkspaceSchema } from "../schema";
import {
  MEMBER_ID,
  DATABASE_ID,
  WORKSPACE_ID,
  IMAGE_BUCKET_ID,
} from "@/config";
import { ID, Query } from "node-appwrite";
import { generateInviteCode } from "@/lib/utils";
import { getMember } from "@/features/members/utils";
import { MemberRole } from "@/features/members/types";
import { sessionMiddleware } from "@/lib/session-middleware";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const members = await databases.listDocuments({
      databaseId: DATABASE_ID,
      collectionId: MEMBER_ID,
      queries: [Query.equal("userId", user.$id)],
    });

    if (members.total === 0) {
      return c.json({ data: { documents: [], total: 0 } });
    }
    const workspaceIds = members.documents.map((member) => member.workspaceId);
    const workspaces = await databases.listDocuments({
      databaseId: DATABASE_ID,
      collectionId: WORKSPACE_ID,
      queries: [Query.contains("$id", workspaceIds), Query.orderAsc("name")],
    });
    return c.json({ data: workspaces });
  })
  .post(
    "/",
    zValidator("form", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { name, image } = c.req.valid("form");

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
        ).toString("base64")}`;
      } else {
        uploadedImageUrl = image;
      }

      const workspace = await databases.createDocument({
        collectionId: WORKSPACE_ID,
        databaseId: DATABASE_ID,
        documentId: ID.unique(),
        data: {
          name,
          userId: user.$id,
          image: uploadedImageUrl,
          inviteCode: generateInviteCode(6),
        },
      });

      await databases.createDocument({
        collectionId: MEMBER_ID,
        databaseId: DATABASE_ID,
        documentId: ID.unique(),
        data: {
          workspaceId: workspace.$id,
          userId: user.$id,
          role: MemberRole.ADMIN,
        },
      });

      return c.json({ data: workspace });
    }
  )
  .patch(
    "/:workspaceId",
    sessionMiddleware,
    zValidator("form", updateWorkspaceSchema),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const storage = c.get("storage");

      const { workspaceId } = c.req.param();
      const { name, image } = c.req.valid("form");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });
      if (!member) {
        return c.json({ error: "Member not found" }, 404);
      }
      if (member.role !== MemberRole.ADMIN) {
        return c.json(
          { error: "You are not authorized to update this workspace" },
          403
        );
      }
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
        ).toString("base64")}`;
      } else {
        uploadedImageUrl = image;
      }
      const workspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACE_ID,
        workspaceId,
        {
          name,
          image: uploadedImageUrl,
        }
      );
      return c.json({ data: workspace });
    }
  )
  .delete("/:workspaceId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { workspaceId } = c.req.param();
    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });
    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    // TODO: Delete all members of the workspace
    // TODO: Delete all documents of the workspace
    // TODO: Delete all files of the workspace
    await databases.deleteDocument(DATABASE_ID, WORKSPACE_ID, workspaceId);
    return c.json({ data: { $id: workspaceId } });
  })
  .post("/:workspaceId/reset-invite-code", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { workspaceId } = c.req.param();
    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });
    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const inviteCode = generateInviteCode(6);
    const updatedWorkspace = await databases.updateDocument(
      DATABASE_ID,
      WORKSPACE_ID,
      workspaceId,
      {
        inviteCode,
      }
    );
    return c.json({ data: updatedWorkspace });
  });

export default app;
