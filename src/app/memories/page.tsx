"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Search,
  Trash2,
  Filter,
  Brain,
  Heart,
  User,
  Star,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Memory {
  id: string;
  content: string;
  type: string;
  importance: number;
  category: string;
  tags: string[];
  createdAt: string;
  emotionalContext?: string;
}

export default function MemoriesPage() {
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [filteredMemories, setFilteredMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [importanceFilter, setImportanceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    loadMemories();
  }, []);

  useEffect(() => {
    filterAndSortMemories();
  }, [memories, searchTerm, categoryFilter, importanceFilter, sortBy]);

  const loadMemories = async () => {
    try {
      const response = await fetch("/api/memories");
      if (response.ok) {
        const data = await response.json();
        setMemories(data.memories || []);
      } else {
        throw new Error("Failed to load memories");
      }
    } catch (error) {
      console.error("Error loading memories:", error);
      toast.error("Failed to load memories");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortMemories = () => {
    let filtered = memories;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (memory) =>
          memory.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          memory.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (memory) => memory.category === categoryFilter
      );
    }

    // Importance filter
    if (importanceFilter !== "all") {
      const threshold = parseInt(importanceFilter);
      filtered = filtered.filter((memory) => memory.importance >= threshold);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "importance":
          return b.importance - a.importance;
        case "alphabetical":
          return a.content.localeCompare(b.content);
        default:
          return 0;
      }
    });

    setFilteredMemories(filtered);
  };

  const deleteMemory = async (memoryId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this memory? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/memories?memoryId=${memoryId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMemories(memories.filter((m) => m.id !== memoryId));
        toast.success("Memory deleted successfully");
      } else {
        throw new Error("Failed to delete memory");
      }
    } catch (error) {
      console.error("Error deleting memory:", error);
      toast.error("Failed to delete memory");
    }
  };

  const getMemoryIcon = (type: string) => {
    switch (type) {
      case "PERSONALITY_TRAIT":
      case "BEHAVIORAL_PATTERN":
        return <User className="h-4 w-4" />;
      case "RELATIONSHIP_DYNAMIC":
      case "INTIMATE_MOMENT":
        return <Heart className="h-4 w-4" />;
      case "PREFERENCE":
      case "INTEREST":
        return <Star className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  const getImportanceColor = (importance: number) => {
    if (importance >= 8) return "bg-red-100 text-red-800";
    if (importance >= 6) return "bg-orange-100 text-orange-800";
    if (importance >= 4) return "bg-yellow-100 text-yellow-800";
    return "bg-muted text-muted-foreground";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading memories...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/settings")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Settings
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Memory Management
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Brain className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Memories</p>
                  <p className="text-2xl font-bold">{memories.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">High Importance</p>
                  <p className="text-2xl font-bold">
                    {memories.filter((m) => m.importance >= 8).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-rose-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Relationship</p>
                  <p className="text-2xl font-bold">
                    {
                      memories.filter(
                        (m) =>
                          m.type.includes("RELATIONSHIP") ||
                          m.type.includes("INTIMATE")
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">This Week</p>
                  <p className="text-2xl font-bold">
                    {
                      memories.filter(
                        (m) =>
                          new Date(m.createdAt) >
                          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search memories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="relationship">Relationship</SelectItem>
                  <SelectItem value="preferences">Preferences</SelectItem>
                  <SelectItem value="experiences">Experiences</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={importanceFilter}
                onValueChange={setImportanceFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Importance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Importance</SelectItem>
                  <SelectItem value="8">High (8+)</SelectItem>
                  <SelectItem value="6">Medium (6+)</SelectItem>
                  <SelectItem value="4">Low (4+)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="importance">Importance</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                  setImportanceFilter("all");
                  setSortBy("recent");
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Memories Grid */}
        {filteredMemories.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {memories.length === 0
                  ? "No memories yet"
                  : "No memories match your filters"}
              </h3>
              <p className="text-gray-500">
                {memories.length === 0
                  ? "Start chatting with your AI companion to create memories!"
                  : "Try adjusting your search or filter criteria."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMemories.map((memory) => (
              <Card
                key={memory.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getMemoryIcon(memory.type)}
                      <span className="text-sm font-medium capitalize">
                        {memory.type.toLowerCase().replace(/_/g, " ")}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMemory(memory.id)}
                      className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                    {memory.content}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <Badge className={getImportanceColor(memory.importance)}>
                      Importance: {memory.importance}/10
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {format(new Date(memory.createdAt), "MMM dd, yyyy")}
                    </span>
                  </div>

                  {memory.tags && memory.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {memory.tags.slice(0, 3).map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {memory.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{memory.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
