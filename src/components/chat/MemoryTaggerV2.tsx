"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Brain, Tag, Search, Clock, Star, Check, Users } from "lucide-react";
import { SimplifiedMemory } from "@/types";
// ScrollArea component replaced with regular div with overflow

interface MemoryTaggerV2Props {
  userId: string;
  companionId: string;
  onMemorySelect: (memories: SimplifiedMemory[]) => void;
  isOpen: boolean;
  onClose: () => void;
  selectedMemories: SimplifiedMemory[];
}

export default function MemoryTaggerV2({
  userId: _userId,
  companionId: _companionId,
  onMemorySelect,
  isOpen,
  onClose,
  selectedMemories,
}: MemoryTaggerV2Props) {
  const [memories, setMemories] = useState<SimplifiedMemory[]>([]);
  const [filteredMemories, setFilteredMemories] = useState<SimplifiedMemory[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tempSelectedMemories, setTempSelectedMemories] = useState<
    SimplifiedMemory[]
  >([]);

  // Load memories when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadMemories();
      setTempSelectedMemories([...selectedMemories]);
    }
  }, [isOpen, selectedMemories]);

  // Filter memories based on search and tags
  useEffect(() => {
    let filtered = memories;

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (memory) =>
          memory.content.toLowerCase().includes(searchLower) ||
          memory.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((memory) =>
        selectedTags.some((tag) => memory.tags.includes(tag))
      );
    }

    // Sort by importance and date
    filtered.sort((a, b) => {
      if (b.importance !== a.importance) {
        return b.importance - a.importance;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredMemories(filtered);
  }, [memories, searchTerm, selectedTags]);

  const loadMemories = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/memories");
      if (response.ok) {
        const data = await response.json();
        setMemories(data.memories || []);
      }
    } catch (error) {
      console.error("Error loading memories:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMemorySelection = (memory: SimplifiedMemory) => {
    setTempSelectedMemories((prev) => {
      const isSelected = prev.some((m) => m.id === memory.id);
      if (isSelected) {
        return prev.filter((m) => m.id !== memory.id);
      } else {
        return [...prev, memory];
      }
    });
  };

  const toggleTagFilter = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  const handleConfirm = () => {
    onMemorySelect(tempSelectedMemories);
    onClose();
  };

  const handleCancel = () => {
    setTempSelectedMemories([...selectedMemories]);
    setSearchTerm("");
    setSelectedTags([]);
    onClose();
  };

  // Get all unique tags
  const allTags = Array.from(
    new Set(memories.flatMap((memory) => memory.tags))
  ).sort();

  const getImportanceColor = (importance: number) => {
    if (importance >= 8) return "text-red-500";
    if (importance >= 6) return "text-yellow-500";
    return "text-gray-500";
  };

  const getImportanceIcon = (importance: number) => {
    if (importance >= 8) return <Star className="h-3 w-3 fill-current" />;
    if (importance >= 6) return <Star className="h-3 w-3" />;
    return <Clock className="h-3 w-3" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Select Memories
          </DialogTitle>
          <DialogDescription>
            Choose memories to provide context for your message. You can select
            multiple memories.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search memories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Tag Filters */}
          {allTags.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Filter by tags:
              </p>
              <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer text-xs"
                    onClick={() => toggleTagFilter(tag)}
                  >
                    <Tag className="h-2 w-2 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Selected Count */}
          {tempSelectedMemories.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-green-500" />
              {tempSelectedMemories.length} memories selected
            </div>
          )}
        </div>

        {/* Memories List */}
        <div className="flex-1 px-6 max-h-96 overflow-y-auto">
          <div className="space-y-2 pb-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredMemories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No memories found</p>
                {searchTerm && (
                  <p className="text-sm">Try a different search term</p>
                )}
              </div>
            ) : (
              filteredMemories.map((memory) => {
                const isSelected = tempSelectedMemories.some(
                  (m) => m.id === memory.id
                );
                return (
                  <motion.div
                    key={memory.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50 hover:bg-accent/50"
                    }`}
                    onClick={() => toggleMemorySelection(memory)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          {isSelected && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                          <p className="text-sm text-foreground leading-relaxed">
                            {memory.content}
                          </p>
                        </div>

                        {/* Tags */}
                        {memory.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {memory.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs px-1.5 py-0.5"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Metadata */}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(memory.createdAt).toLocaleDateString()}
                          </div>
                          <div
                            className={`flex items-center gap-1 ${getImportanceColor(
                              memory.importance
                            )}`}
                          >
                            {getImportanceIcon(memory.importance)}
                            {memory.importance}/10
                          </div>
                          {memory.userCreated && (
                            <Badge
                              variant="outline"
                              className="text-xs px-1 py-0"
                            >
                              <Users className="h-2 w-2 mr-1" />
                              User
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between p-6 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <div className="flex items-center gap-2">
            {tempSelectedMemories.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setTempSelectedMemories([])}
                size="sm"
              >
                Clear All
              </Button>
            )}
            <Button onClick={handleConfirm}>
              Confirm ({tempSelectedMemories.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
