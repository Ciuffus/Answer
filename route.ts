import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

// La chiave viene letta dalle Environment Variables di Vercel.
// Non va mai scritta qui nel codice.
const ATP_API_KEY = process.env.ATP_API_KEY;

const handler = createMcpHandler(
  (server) => {
    server.tool(
      "atp_keyword_suggestions",
      "Recupera dati di keyword research (domande, preposizioni, comparativi, autocomplete) da AnswerThePublic per una parola chiave data.",
      {
        keyword: z.string().describe("La parola chiave o frase da analizzare"),
        country: z.string().optional().describe("Codice paese, es. it"),
        language: z.string().optional().describe("Codice lingua, es. it"),
      },
      async ({ keyword, country, language }) => {
        if (!ATP_API_KEY) {
          return {
            content: [
              {
                type: "text",
                text: "Errore di configurazione: ATP_API_KEY non impostata su Vercel.",
              },
            ],
          };
        }

        // TODO: sostituisci questo URL con l'endpoint reale che trovi
        // nella pagina docs di AnswerThePublic (loggato con la tua chiave).
        // Esempio plausibile, DA VERIFICARE:
        // https://api.answerthepublic.com/api/v1/suggestions
        const endpoint = "https://api.answerthepublic.com/TODO-ENDPOINT";

        const params = new URLSearchParams({ keyword });
        if (country) params.set("country", country);
        if (language) params.set("language", language);

        const res = await fetch(`${endpoint}?${params.toString()}`, {
          method: "GET",
          headers: {
            // TODO: verifica il nome header corretto sulla doc.
            // Varianti comuni: "Authorization: Bearer <key>" oppure "x-api-key: <key>"
            Authorization: `Bearer ${ATP_API_KEY}`,
          },
        });

        if (!res.ok) {
          const errText = await res.text();
          return {
            content: [
              {
                type: "text",
                text: `Errore AnswerThePublic (${res.status}): ${errText}`,
              },
            ],
          };
        }

        const data = await res.json();

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }
    );
  },
  {},
  { basePath: "/api" }
);

export { handler as GET, handler as POST, handler as DELETE };
