"use client";

import { useState } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Reply, Edit, Trash2, Copy } from "lucide-react";

interface MessageActionsV2Props {
  messageId: string;
  messageContent: string;
  messageRole: "user" | "assistant";
  onReply?: (messageId: string) => void;
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  className?: string;
}

export default function MessageActionsV2({
  messageId,
  messageContent,
  messageRole,
  onReply,
  onEdit,
  onDelete,
  className = "",
}: MessageActionsV2Props) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(messageContent);
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(messageId);
    }
    setShowDeleteDialog(false);
  };

  return (
    <>
      {/* Action Icons Row - Always visible, styled for mobile */}
      <div className={`flex items-center gap-1 ${className}`}>
        {/* Reply */}
        {onReply && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReply(messageId)}
            className="h-7 w-7 p-0 opacity-70 hover:opacity-100 transition-opacity"
            title="Reply"
          >
            <Reply className="h-3 w-3" />
          </Button>
        )}

        {/* Edit (only for user messages) */}
        {messageRole === "user" && onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(messageId)}
            className="h-7 w-7 p-0 opacity-70 hover:opacity-100 transition-opacity"
            title="Edit"
          >
            <Edit className="h-3 w-3" />
          </Button>
        )}

        {/* Copy */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyMessage}
          className="h-7 w-7 p-0 opacity-70 hover:opacity-100 transition-opacity"
          title="Copy"
        >
          <Copy className="h-3 w-3" />
        </Button>

        {/* Delete */}
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            className="h-7 w-7 p-0 opacity-70 hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
            title="Delete"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Message</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this message? This action cannot
              be undone.
              {messageRole === "user" &&
                " The AI's response to this message will also be removed."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleDelete} variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
