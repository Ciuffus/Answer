[README.md](https://github.com/user-attachments/files/29844694/README.md)
# AnswerThePublic MCP Server

Server MCP minimale che espone i dati di AnswerThePublic come tool utilizzabile da Claude.

## Passi per il deploy

### 1. Crea il repository su GitHub
Crea un nuovo repo (es. `atp-mcp-server`), carica questi file dentro (struttura invariata:
`app/[transport]/route.ts`, `package.json`, `.env.example`, questo README).

### 2. Importa il repo su Vercel
Vercel è già collegato a GitHub: vai su vercel.com, "Add New Project", seleziona il repo.
Vercel riconosce automaticamente Next.js, non serve configurazione aggiuntiva.

### 3. Imposta la variabile d'ambiente
In Vercel: Project Settings > Environment Variables.
Aggiungi:
- Nome: `ATP_API_KEY`
- Valore: la chiave AnswerThePublic RIGENERATA (non quella vecchia condivisa in chat)
- Ambiente: Production (e Preview se vuoi testare anche lì)

### 4. Trova l'endpoint reale nella documentazione ATP
Prima di fare il deploy definitivo, apri (loggato) questa pagina:
https://api.answerthepublic.com/api-docs/public

Cerca l'endpoint per "keyword suggestions" o "search" e annota:
- il path esatto (es. /api/v1/suggestions o simile)
- il nome dell'header di autenticazione (Authorization: Bearer, oppure x-api-key)
- i parametri richiesti (keyword, country, language, ecc.)

Poi aggiorna `app/[transport]/route.ts` nei due punti segnati con TODO.

### 5. Deploy
Vercel farà il deploy automatico ad ogni push su GitHub.
Otterrai un URL tipo: `https://atp-mcp-server.vercel.app`

### 6. Collega il connettore in Claude
In Claude: Impostazioni > Connettori > Aggiungi connettore personalizzato.
URL da inserire: `https://atp-mcp-server.vercel.app/api/mcp`
(il path `/api` corrisponde al `basePath` impostato nel route handler,
`mcp` è il transport di default usato dal client)

### 7. Test
Prova a chiedere a Claude di cercare suggestion di keyword su un termine:
se il connettore è collegato correttamente, Claude userà il tool `atp_keyword_suggestions`.

## Note di sicurezza
- La chiave API non è mai nel codice, solo nelle Environment Variables di Vercel.
- Il file `.env.example` è solo un modello, non contiene chiavi reali.
- Se in futuro devi ruotare la chiave, aggiornala solo su Vercel: nessun redeploy del codice necessario.
