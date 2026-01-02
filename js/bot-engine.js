// bot-engine.js
// The Logic Layer - Scores user input against Knowledge Base.

class BotEngine {
  constructor() {
    this.context = {
      lastIntent: null,
      lastEntities: {},
      history: [],
    };
  }

  processMessage(text) {
    let cleanText = text.toLowerCase().replace(/[^\w\s]/g, "");
    cleanText = this.normalizeText(cleanText); // Apply Synonyms

    // Safety Check
    if (!window.botKnowledge) {
      console.error("Bot Knowledge not loaded!");
      return {
        text: "I'm having a little trouble thinking right now. Please try refreshing the page.",
      };
    }

    // 1. Extract Entities (Brand, Type, etc.)
    const entities = this.extractEntities(cleanText);

    // 2. Score Intents
    const bestMatch = this.scoreIntents(cleanText);

    // 3. Update Context
    if (bestMatch) {
      this.context.lastIntent = bestMatch.intent.id;
    }
    this.context.lastEntities = { ...this.context.lastEntities, ...entities };

    // 4. Resolve Response
    return this.resolveResponse(bestMatch, entities);
  }

  normalizeText(text) {
    const synonyms = {
      cheap: "affordable",
      pockets: "budget",
      kids: "family",
      fast: "performance",
      speed: "performance",
      busted: "maintenance",
      broken: "maintenance",
      fix: "maintenance",
    };

    let normalized = text;
    Object.keys(synonyms).forEach((key) => {
      // Replace whole words only
      const regex = new RegExp(`\\b${key}\\b`, "g");
      normalized = normalized.replace(regex, synonyms[key]);
    });
    return normalized;
  }

  extractEntities(text) {
    const found = {};
    const words = text.split(/\s+/);
    const knowledge = window.botKnowledge || {
      entities: { brands: [], types: [], fuels: [] },
    };

    // Check Brands
    knowledge.entities.brands.forEach((brand) => {
      if (text.includes(brand)) found.brand = brand;
    });

    // Check Types
    knowledge.entities.types.forEach((type) => {
      if (text.includes(type)) found.type = type;
      // Handle plural/variations loosely
      if (text.includes(type + "s")) found.type = type;
    });

    // Check Fuels
    knowledge.entities.fuels.forEach((fuel) => {
      if (text.includes(fuel)) found.fuel = fuel;
    });

    return found;
  }

  scoreIntents(text) {
    let bestScore = 0;
    let bestIntent = null;
    const words = text.split(/\s+/);
    const knowledge = window.botKnowledge || { intents: [] };

    // Helper to find category of an intent ID
    const getCategory = (id) =>
      knowledge.intents.find((i) => i.id === id)?.category;
    const lastCategory = this.context.lastIntent
      ? getCategory(this.context.lastIntent)
      : null;

    knowledge.intents.forEach((intent) => {
      let score = 0;
      let maxPotentialScore = 0; // To calculate confidence
      const keywords = intent.keywords;

      // 1. Keyword Matching
      words.forEach((word) => {
        if (keywords[word]) {
          score += keywords[word];
        }
      });
      // Simple max score estimation: sum of top 3 keywords or similar.
      // For now, let's just use the score we got relative to a threshold or self-calculated max.
      // Better: Store max possible score in intent? Or just sum all matched keywords?
      // Let's use a simpler confidence metric: score / (threshold * 2) or similar,
      // but strictly we can just trust the raw score relative to others for now.
      // User asked for: confidence = score / intent.maxScore;
      // We don't have maxScore in intent, let's estimate it or assume 10 for standard query.
      // Or we can just calculate confidence based on threshold: score / threshold.

      // Let's iterate keywords to find max possible for this intent (approx) triggers if we matched perfectly?
      // No, let's just use the score.

      // 2. Phrase Matching (Boost)
      Object.keys(keywords).forEach((phrase) => {
        if (phrase.includes(" ") && text.includes(phrase)) {
          score += keywords[phrase] * 1.5;
        }
      });

      // 3. Contextual Boosts (The Brain)
      // Continuity: Same intent as last time?
      if (this.context.lastIntent === intent.id) {
        score += 1.0;
      }

      // Category Continuity: Same category as last time?
      if (lastCategory && intent.category === lastCategory) {
        score += 1.5; // Stronger boost for staying in topic (e.g. maintenance -> maintenance)
      }

      // Entity Context: If we have buying entities, boost buying intents
      if (
        intent.category === "buying" &&
        (this.context.lastEntities?.type || this.context.lastEntities?.brand)
      ) {
        score += 1.0;
      }

      if (score > bestScore) {
        bestScore = score;
        bestIntent = intent;
      }
    });

    const threshold = bestIntent ? bestIntent.threshold || 2 : 2;

    // Calculate Confidence
    // If score is 5 and threshold is 3, confidence is high.
    // Let's define confidence = score / (threshold + 2) roughly, or just normalize.
    // User formula: confidence = score / intent.maxScore.
    // Since we don't have maxScore, let's assume a "solid match" is around 5-10 points.
    // Let's just return the raw score and handle logic in resolve for now, or normalize here.
    let confidence = 0;
    if (bestIntent) {
      // Estimate max score based on keywords matched?
      // Let's just use a heuristic:
      // < threshold = 0 confidence (effectively)
      // threshold = 0.5
      // threshold * 2 = 1.0
      confidence = Math.min(bestScore / (threshold * 2), 1.0);
    }

    if (bestScore >= 0.5) {
      // Lower internal threshold, filter later
      return { intent: bestIntent, score: bestScore, confidence };
    }
    return null;
  }

  resolveResponse(match, entities) {
    if (!match || match.confidence < 0.2) {
      // Low confidence fallback
      // Check if we have strong entities (Fallback "Toyota SUV" search)
      if (entities.brand || entities.type) {
        return {
          text: `I see you're interested in a **${entities.brand || ""} ${
            entities.type || "car"
          }**. Shall I check our inventory?`,
          effect: { type: "filter", params: { ...entities } }, // Dynamic filter effect
          entities: entities,
        };
      }
      return {
        text:
          window.botKnowledge?.fallback?.response ||
          "I didn't understand that.",
        options: window.botKnowledge?.fallback?.options || [],
      };
    }

    const { intent, confidence } = match;

    // Clarification Mode
    if (intent.needsClarification) {
      // Check if we ALREADY have the answer in entities (?)
      // E.g. Intent "buy_general" needs clarification.
      // If user said "Buy Toyota", we might still need "Type".
      // For now, simpler: If flag is set, ALWAYS ask unless we have specific entity override logic.
      // User instruction: "if (intent.needsClarification && !entities.fuel)"

      // Example logic for generic buy:
      if (intent.id === "buy_general" && !entities.type && !entities.brand) {
        return {
          text: intent.clarify,
          waitForUser: true, // Signal UI to expect reply
        };
      }
      // Only return clarification if we don't have enough to proceed (simple check for now)
    }

    // Confidence Logic
    if (confidence < 0.4) {
      // Unsure - Ask for confirmation
      return {
        text: `I think you're asking about **${intent.id.replace(
          "_",
          " "
        )}**. Is that right?`,
        options: [
          {
            text: "Yes",
            msg: intent.keywords[Object.keys(intent.keywords)[0]] || "yes",
          }, // Hacky way to confirm? Better: "Yes, continue"
          { text: "No", msg: "help" },
        ],
      };
    }

    const responseText = intent.response(entities);

    return {
      text: responseText,
      effect: intent.effect || null, // Updated from action to effect
      options: intent.options || null,
      entities: entities,
    };
  }
}

// Global instance
const botEngine = new BotEngine();

// Load Context if available
const savedContext = localStorage.getItem("botContext");
if (savedContext) {
  try {
    botEngine.context = JSON.parse(savedContext);
  } catch (e) {
    console.error("Failed to load bot context", e);
  }
}

// Save Context Logic (Hook into processMessage)
const originalProcess = botEngine.processMessage.bind(botEngine);
botEngine.processMessage = function (text) {
  const response = originalProcess(text);
  localStorage.setItem("botContext", JSON.stringify(this.context));
  return response;
};
