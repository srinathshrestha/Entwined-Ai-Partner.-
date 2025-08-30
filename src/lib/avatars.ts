// Avatar definitions for companion selection
export interface AvatarOption {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: "romantic" | "intimate" | "companion";
  personality: string[];
}

export const AVAILABLE_AVATARS: AvatarOption[] = [
  // Romantic Style
  {
    id: "se",
    name: "Seductive",
    description:
      "A captivating figure with smoldering eyes and confident allure",
    imageUrl: "/Se.png",
    category: "romantic",
    personality: ["passionate", "confident", "mysterious", "alluring"],
  },
  {
    id: "te",
    name: "Tender",
    description:
      "A gentle soul with caring eyes that radiate warmth and understanding",
    imageUrl: "/Te.png",
    category: "romantic",
    personality: ["gentle", "caring", "compassionate", "nurturing"],
  },
  {
    id: "al",
    name: "Alluring",
    description:
      "An enchanting presence with magnetic charisma and timeless elegance",
    imageUrl: "/Al.png",
    category: "romantic",
    personality: ["enchanting", "elegant", "sophisticated", "magnetic"],
  },
  {
    id: "de",
    name: "Devoted",
    description:
      "A faithful companion with deeply expressive eyes showing unwavering loyalty",
    imageUrl: "/De.png",
    category: "romantic",
    personality: ["loyal", "faithful", "dedicated", "committed"],
  },

  // Intimate Style
  {
    id: "co",
    name: "Cozy",
    description:
      "A comfortable companion with soft, welcoming eyes that invite relaxation",
    imageUrl: "/Co.png",
    category: "intimate",
    personality: ["comfortable", "welcoming", "relaxed", "homey"],
  },
  {
    id: "in",
    name: "Intimate",
    description:
      "A deeply connected presence that creates immediate understanding and closeness",
    imageUrl: "/In.png",
    category: "intimate",
    personality: ["connected", "understanding", "close", "soulful"],
  },
  {
    id: "wa",
    name: "Warm",
    description:
      "A radiantly welcoming figure with bright, genuine eyes full of friendliness",
    imageUrl: "/Wa.png",
    category: "intimate",
    personality: ["warm", "friendly", "genuine", "inviting"],
  },
  {
    id: "cl",
    name: "Close",
    description:
      "An emotionally available companion encouraging deep connection and vulnerability",
    imageUrl: "/Cl.png",
    category: "intimate",
    personality: ["emotional", "available", "vulnerable", "trusting"],
  },

  // Companion Style
  {
    id: "nu",
    name: "Nurturing",
    description:
      "A caring maternal figure with kind, understanding eyes offering instant comfort",
    imageUrl: "/Nu.png",
    category: "companion",
    personality: ["nurturing", "maternal", "comforting", "supportive"],
  },
  {
    id: "pl",
    name: "Playful",
    description:
      "An energetic, joyful companion with sparkling eyes full of mischief and laughter",
    imageUrl: "/Pl.png",
    category: "companion",
    personality: ["playful", "energetic", "joyful", "fun"],
  },
  {
    id: "wi",
    name: "Wise",
    description:
      "A sagacious companion with intelligent, perceptive eyes conveying deep understanding",
    imageUrl: "/wi.png",
    category: "companion",
    personality: ["wise", "intelligent", "perceptive", "thoughtful"],
  },
  {
    id: "lo",
    name: "Loyal",
    description:
      "A steadfast companion with honest, trustworthy eyes promising unwavering support",
    imageUrl: "/Lo.png",
    category: "companion",
    personality: ["loyal", "trustworthy", "steadfast", "reliable"],
  },
];

export const AVATAR_CATEGORIES = [
  {
    id: "romantic",
    name: "Romantic",
    description: "Passionate and intimate connections",
  },
  {
    id: "intimate",
    name: "Intimate",
    description: "Close and personal connections",
  },
  {
    id: "companion",
    name: "Companion",
    description: "Warm and supportive partners",
  },
] as const;

export function getAvatarById(id: string): AvatarOption | undefined {
  return AVAILABLE_AVATARS.find((avatar) => avatar.id === id);
}

export function getAvatarsByCategory(category: string): AvatarOption[] {
  return AVAILABLE_AVATARS.filter((avatar) => avatar.category === category);
}
