import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SuggestPriorityRequest {
  title: string;
  description?: string;
}

function analyzePriority(title: string, description: string = ""): "low" | "medium" | "high" {
  const text = `${title} ${description}`.toLowerCase();

  const highPriorityKeywords = [
    "urgent", "asap", "critical", "emergency", "immediate", "important",
    "deadline", "today", "now", "priority", "crucial"
  ];

  const lowPriorityKeywords = [
    "maybe", "someday", "when possible", "eventually", "nice to have",
    "consider", "think about", "optional"
  ];

  const highKeywordCount = highPriorityKeywords.filter(keyword => text.includes(keyword)).length;
  const lowKeywordCount = lowPriorityKeywords.filter(keyword => text.includes(keyword)).length;

  if (highKeywordCount >= 2) {
    return "high";
  }

  if (highKeywordCount >= 1 && lowKeywordCount === 0) {
    return "high";
  }

  if (lowKeywordCount >= 1) {
    return "low";
  }

  if (text.length < 20) {
    return "medium";
  }

  if (text.includes("!") || text.includes("must") || text.includes("need")) {
    return "high";
  }

  return "medium";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: SuggestPriorityRequest = await req.json();

    if (!body.title) {
      return new Response(
        JSON.stringify({ error: "Title is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const suggestedPriority = analyzePriority(body.title, body.description);

    const explanation = {
      high: "This task appears urgent or time-sensitive",
      medium: "This task has standard priority",
      low: "This task can be done when convenient"
    };

    return new Response(
      JSON.stringify({
        priority: suggestedPriority,
        explanation: explanation[suggestedPriority]
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
