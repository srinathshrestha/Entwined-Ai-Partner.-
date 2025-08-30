import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { backstory, relationshipBackstory, companionName, companionGender } =
      await request.json();

    // Combine existing backstory content
    let currentBackstory = backstory || "";
    let relationshipDetails = "";

    if (relationshipBackstory) {
      const details = [
        relationshipBackstory.howYouMet &&
          `How we met: ${relationshipBackstory.howYouMet}`,
        relationshipBackstory.relationshipDuration &&
          `Duration: ${relationshipBackstory.relationshipDuration}`,
        relationshipBackstory.livingSituation &&
          `Living situation: ${relationshipBackstory.livingSituation.replace(
            "_",
            " "
          )}`,
        relationshipBackstory.homeDescription &&
          `Our home: ${relationshipBackstory.homeDescription}`,
        relationshipBackstory.partnerQuirks &&
          `Partner quirks: ${relationshipBackstory.partnerQuirks}`,
        relationshipBackstory.sharedMemories &&
          `Shared memories: ${relationshipBackstory.sharedMemories}`,
        relationshipBackstory.relationshipDynamics &&
          `Relationship dynamics: ${relationshipBackstory.relationshipDynamics}`,
      ].filter(Boolean);

      relationshipDetails = details.join("\n");
    }

    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      throw new Error("XAI_API_KEY not found");
    }

    const improvementPrompt = `You are an expert creative writer specializing in character development and relationship storytelling. Help improve this AI companion backstory to make it more detailed, emotionally rich, and engaging.

CURRENT INFORMATION:
Companion Name: ${companionName}
Companion Gender: ${companionGender}

Current Backstory: ${currentBackstory || "None provided"}

Current Relationship Details:
${relationshipDetails || "None provided"}

Please enhance this backstory by:
1. Adding vivid, specific details that make the relationship feel real and personal
2. Including emotional depth and meaningful moments
3. Creating a cohesive narrative that connects all the elements
4. Adding unique personality quirks and characteristics
5. Describing the living space and daily routines that make it feel authentic

Write an improved, comprehensive backstory that incorporates and expands on the existing information. Make it feel personal, intimate, and realistic. The improved backstory should be 200-400 words and feel like a real relationship story.

Focus on making it emotionally resonant and full of specific details that would help an AI companion understand the relationship dynamics and history.`;

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-3-fast",
        messages: [
          {
            role: "system",
            content:
              "You are a professional creative writer and relationship expert. Write engaging, personal, and emotionally rich backstories.",
          },
          {
            role: "user",
            content: improvementPrompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Grok API failed: ${response.status}`);
    }

    const data = await response.json();
    const improvedBackstory = data.choices[0].message.content.trim();

    // Also score the improved backstory
    const evaluationPrompt = `Please evaluate this relationship backstory for an AI companion on a scale of 1-10 across these criteria:

BACKSTORY TO EVALUATE:
${improvedBackstory}

Please provide a JSON response with the following structure:
{
  "overall": [overall score 1-10],
  "criteria": {
    "detail": [score for level of detail and specificity],
    "consistency": [score for internal consistency and believability],
    "emotional_depth": [score for emotional resonance and depth],
    "uniqueness": [score for uniqueness and memorable elements]
  },
  "suggestions": ["suggestion1", "suggestion2"] (optional)
}

Only return the JSON, no other text.`;

    const evaluationResponse = await fetch(
      "https://api.x.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-3-fast",
          messages: [
            {
              role: "system",
              content:
                "You are an expert evaluator of relationship backstories. Return only valid JSON.",
            },
            {
              role: "user",
              content: evaluationPrompt,
            },
          ],
          max_tokens: 500,
          temperature: 0.3,
        }),
      }
    );

    let score = 8; // Default score if evaluation fails
    if (evaluationResponse.ok) {
      try {
        const evalData = await evaluationResponse.json();
        const evalResult = JSON.parse(
          evalData.choices[0].message.content.trim()
        );
        score = evalResult.overall || evalResult;
      } catch (e) {
        console.warn("Failed to parse score, using default:", e);
      }
    }

    return NextResponse.json({
      improvedBackstory: improvedBackstory,
      score: score,
    });
  } catch (error) {
    console.error("Backstory improvement error:", error);
    return NextResponse.json(
      { error: "Failed to improve backstory" },
      { status: 500 }
    );
  }
}
