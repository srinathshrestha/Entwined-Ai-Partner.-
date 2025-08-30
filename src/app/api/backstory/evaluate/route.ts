import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { backstory, relationshipBackstory } = await request.json();

    if (!backstory && !relationshipBackstory) {
      return NextResponse.json(
        {
          error: "No backstory content provided",
        },
        { status: 400 }
      );
    }

    // Combine all backstory content for evaluation
    let fullBackstory = backstory || "";
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
      ]
        .filter(Boolean)
        .join("\n\n");

      if (details) {
        fullBackstory += "\n\n" + details;
      }
    }

    // Call Grok API to evaluate the backstory
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      throw new Error("XAI_API_KEY not found");
    }

    const evaluationPrompt = `You are an expert storytelling and relationship consultant. Please evaluate this AI companion backstory and provide detailed feedback.

BACKSTORY TO EVALUATE:
${fullBackstory}

Please analyze this backstory on a scale of 1-100 and provide scores for these criteria:
1. DETAIL (1-100): How rich and detailed is the backstory?
2. CONSISTENCY (1-100): How believable and internally consistent is it?
3. EMOTIONAL_DEPTH (1-100): How emotionally rich and connecting is it?
4. UNIQUENESS (1-100): How unique and personal does it feel?

Also provide 3-5 specific suggestions for improvement.

Respond in this exact JSON format:
{
  "overall": 75,
  "criteria": {
    "detail": 80,
    "consistency": 70,
    "emotional_depth": 75,
    "uniqueness": 70
  },
  "suggestions": [
    "Add more specific details about...",
    "Consider elaborating on...",
    "Include more emotional context about..."
  ]
}`;

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
              "You are a professional storytelling and relationship consultant. Always respond with valid JSON only.",
          },
          {
            role: "user",
            content: evaluationPrompt,
          },
        ],
        max_tokens: 800,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`Grok API failed: ${response.status}`);
    }

    const data = await response.json();
    const evaluationText = data.choices[0].message.content.trim();

    try {
      const evaluation = JSON.parse(evaluationText);

      return NextResponse.json({
        score: {
          overall: evaluation.overall,
          criteria: evaluation.criteria,
          suggestions: evaluation.suggestions,
          lastEvaluated: new Date().toISOString(),
        },
      });
    } catch (parseError) {
      console.error("Failed to parse AI evaluation:", evaluationText);

      // Fallback scoring if JSON parsing fails
      const wordCount = fullBackstory.split(/\s+/).length;
      const baseScore = Math.min(wordCount * 2, 60); // 2 points per word, max 60

      return NextResponse.json({
        score: {
          overall: baseScore,
          criteria: {
            detail: Math.min(wordCount, 40),
            consistency: baseScore,
            emotional_depth: baseScore - 10,
            uniqueness: baseScore - 5,
          },
          suggestions: [
            "Add more specific details about your relationship",
            "Include more emotional context and personal moments",
            "Describe unique quirks and characteristics of your partner",
          ],
          lastEvaluated: new Date().toISOString(),
        },
      });
    }
  } catch (error) {
    console.error("Backstory evaluation error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate backstory" },
      { status: 500 }
    );
  }
}
