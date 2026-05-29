import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const messageSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(8000),
      }),
    )
    .min(1)
    .max(40),
});

const SYSTEM_PROMPT = `Você é a IA Pedagógica do EduAnalytics IA, uma plataforma de BI educacional para equipes gestoras escolares brasileiras (diretores, vice-diretores, coordenadores e supervisores).

Responda sempre em português do Brasil, com tom profissional, objetivo e pedagógico.
Quando solicitado, gere análises de indicadores (frequência, desempenho, evasão), pareceres pedagógicos e planos de ação concretos.
Use listas e estrutura clara. Seja prático e acionável. Baseie recomendações em boas práticas de gestão escolar e na legislação educacional brasileira (BNCC, busca ativa escolar).`;

export const askIA = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => messageSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("IA indisponível: chave não configurada.");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...data.messages],
      }),
    });

    if (response.status === 429) {
      throw new Error("Muitas solicitações. Aguarde um momento e tente novamente.");
    }
    if (response.status === 402) {
      throw new Error("Créditos de IA esgotados. Adicione créditos no workspace.");
    }
    if (!response.ok) {
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error("Não foi possível gerar a resposta da IA.");
    }

    const json = await response.json();
    const content: string = json.choices?.[0]?.message?.content ?? "";
    return { content };
  });