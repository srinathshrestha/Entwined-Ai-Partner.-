/**
 * User Initialization Utilities
 *
 * These functions handle user setup including namespace initialization
 * and are called from API routes to avoid client-side bundle issues.
 */

/**
 * Initialize user namespace and other setup tasks
 * This should be called from API routes when a user first makes requests
 */
export async function initializeUserResources(userId: string): Promise<void> {
  try {
    // Only run on server side
    if (typeof window !== "undefined") {
      return;
    }

    // Dynamic import to avoid client-side issues
    const { ensureUserNamespace } = await import(
      "../pinecone/namespace-manager"
    );

    // Initialize Pinecone namespace for the user
    await ensureUserNamespace(userId);

    console.log(
      `[UserInit] Successfully initialized resources for user ${userId}`
    );
  } catch (error) {
    // Don't throw error - allow user to continue without vector storage
    console.warn(
      `[UserInit] Failed to initialize resources for user ${userId}:`,
      error
    );
  }
}

/**
 * Helper to safely get user ID from Clerk and initialize resources
 */
export async function getUserAndInitialize(clerkId: string): Promise<string> {
  // Initialize user resources in background
  initializeUserResources(clerkId).catch((error) => {
    console.warn("Background user initialization failed:", error);
  });

  return clerkId;
}
