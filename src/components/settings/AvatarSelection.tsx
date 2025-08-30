"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Heart, Users, Sparkles, Camera, Upload } from "lucide-react";
import {
  AVAILABLE_AVATARS,
  AVATAR_CATEGORIES,
  AvatarOption,
} from "@/lib/avatars";


interface AvatarSelectionProps {
  currentAvatarUrl?: string;
  onAvatarSelect: (avatarUrl: string, avatarId: string) => void;
  isLoading?: boolean;
}

export default function AvatarSelection({
  currentAvatarUrl,
  onAvatarSelect,
  isLoading = false,
}: AvatarSelectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("romantic");
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    currentAvatarUrl || ""
  );

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case "romantic":
        return <Heart className="h-4 w-4" />;
      case "intimate":
        return <Users className="h-4 w-4" />;
      case "companion":
        return <Sparkles className="h-4 w-4" />;
      default:
        return <Camera className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (categoryId: string) => {
    switch (categoryId) {
      case "romantic":
        return "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200";
      case "intimate":
        return "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200";
      case "companion":
        return "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200";
      default:
        return "bg-muted text-muted-foreground border-border hover:bg-muted/80";
    }
  };

  const handleAvatarSelect = (avatar: AvatarOption) => {
    setSelectedAvatar(avatar.imageUrl);
    onAvatarSelect(avatar.imageUrl, avatar.id);
  };

  const filteredAvatars = AVAILABLE_AVATARS.filter(
    (avatar) => avatar.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">
          Choose Avatar Style
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {AVATAR_CATEGORIES.map((category) => (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all duration-200 ${
                selectedCategory === category.id
                  ? "ring-2 ring-primary border-primary shadow-md"
                  : "border-border hover:border-primary/50 hover:shadow-sm"
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${getCategoryColor(
                      category.id
                    )}`}
                  >
                    {getCategoryIcon(category.id)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">
                      {category.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                  {selectedCategory === category.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Avatar Grid */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">
          Select Your Partner's Avatar
        </h3>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {filteredAvatars.map((avatar) => {
              const isSelected = selectedAvatar === avatar.imageUrl;

              return (
                <motion.div
                  key={avatar.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group"
                >
                  <Card
                    className={`cursor-pointer transition-all duration-200 overflow-hidden ${
                      isSelected
                        ? "ring-2 ring-primary border-primary shadow-lg"
                        : "border-border hover:border-primary/50 hover:shadow-md group-hover:shadow-lg"
                    }`}
                    onClick={() => handleAvatarSelect(avatar)}
                  >
                    <CardContent className="p-0 relative">
                      {/* Avatar Image */}
                      <div className="aspect-square relative overflow-hidden">
                        <img
                          src={avatar.imageUrl}
                          alt={avatar.name}
                          className={`w-full h-full object-cover transition-all duration-300 ${
                            isSelected ? "scale-105" : "group-hover:scale-105"
                          }`}
                        />

                        {/* Overlay */}
                        <div
                          className={`absolute inset-0 transition-all duration-200 ${
                            isSelected
                              ? "bg-primary/20"
                              : "bg-black/0 group-hover:bg-black/10"
                          }`}
                        />

                        {/* Selection Check */}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1"
                          >
                            <Check className="h-3 w-3" />
                          </motion.div>
                        )}

                        {/* Loading Overlay */}
                        {isLoading && isSelected && (
                          <div className="absolute inset-0 bg-primary/80 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                          </div>
                        )}
                      </div>

                      {/* Avatar Info */}
                      <div className="p-3 space-y-2">
                        {/* Name and Selected Badge */}
                        <div className="space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-sm text-foreground leading-tight flex-1 min-w-0">
                              {avatar.name}
                            </h4>
                            {isSelected && !isLoading && (
                              <Badge
                                variant="default"
                                className="text-xs shrink-0 px-2 py-0.5 hidden sm:inline-flex"
                              >
                                Selected
                              </Badge>
                            )}
                          </div>

                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {avatar.description}
                          </p>
                        </div>

                        {/* Personality Tags */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {avatar.personality.slice(0, 2).map((trait) => (
                            <Badge
                              key={trait}
                              variant="outline"
                              className="text-xs px-1.5 py-0.5 leading-none"
                            >
                              {trait}
                            </Badge>
                          ))}
                          {avatar.personality.length > 2 && (
                            <Badge
                              variant="outline"
                              className="text-xs px-1.5 py-0.5 leading-none"
                            >
                              +{avatar.personality.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Custom Upload Option (Future Feature) */}
      <Card className="border-dashed border-2 border-muted-foreground/30">
        <CardContent className="p-6">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-muted">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
            <div>
              <h4 className="font-medium text-foreground">Custom Avatar</h4>
              <p className="text-sm text-muted-foreground">
                Upload your own image (Coming Soon)
              </p>
            </div>
            <Button variant="outline" disabled className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Upload Custom Image
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Selection Info */}
      {selectedAvatar && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-muted/50 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={selectedAvatar}
                alt="Selected avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-medium text-sm text-foreground">
                Selected Avatar
              </p>
              <p className="text-xs text-muted-foreground">
                This will be your companion's appearance in conversations
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
