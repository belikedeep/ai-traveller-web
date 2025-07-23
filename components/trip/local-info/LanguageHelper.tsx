"use client";

import { Languages, Volume2, StarIcon, Copy } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Phrase {
  local: string;
  english: string;
  pronunciation: string;
  category: string;
}

interface LanguageHelperProps {
  phrases: Phrase[];
  localLanguage: string;
}

export default function LanguageHelper({ phrases, localLanguage }: LanguageHelperProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();

  const categories = ["all", ...new Set(phrases.map((phrase) => phrase.category))];

  const filteredPhrases = phrases.filter(
    (phrase) => selectedCategory === "all" || phrase.category === selectedCategory
  );

  const handleCopyPhrase = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The phrase has been copied to your clipboard.",
    });
  };

  const toggleFavorite = (phrase: string) => {
    setFavorites((prev) =>
      prev.includes(phrase)
        ? prev.filter((p) => p !== phrase)
        : [...prev, phrase]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Languages className="h-5 w-5 text-primary" />
          Language Helper - {localLanguage}
        </h3>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm capitalize ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredPhrases.map((phrase, index) => (
          <div
            key={index}
            className="rounded-xl border border-border/50 overflow-hidden backdrop-blur-sm bg-background/50 p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-medium text-lg">{phrase.local}</p>
                <p className="text-sm text-muted-foreground">{phrase.english}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFavorite(phrase.local)}
                  className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <StarIcon
                    className={`h-5 w-5 ${
                      favorites.includes(phrase.local) ? "fill-primary" : ""
                    }`}
                  />
                </button>
                <button
                  onClick={() => handleCopyPhrase(phrase.local)}
                  className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <Copy className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Volume2 className="h-4 w-4" />
              <span>{phrase.pronunciation}</span>
            </div>

            <div className="mt-2">
              <span className="text-xs text-muted-foreground capitalize px-2 py-1 rounded-full bg-primary/5">
                {phrase.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredPhrases.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No phrases found for this category.
        </div>
      )}
    </div>
  );
}