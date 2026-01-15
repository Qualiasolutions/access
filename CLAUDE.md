# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Bilingual Voice AI Agent** for Acces Croisieres et Voyages - a 24/7 inbound call handling system using VAPI that qualifies leads, answers travel questions, and books consultations in French and English.

## Agent Capabilities

- Answer common questions (destinations, pricing ranges, availability)
- Collect lead information (name, travel dates, preferences, budget)
- Qualify leads based on criteria (trip type, timeline, budget tier)
- Book consultation appointments with human agents
- Transfer hot leads to available agents in real-time
- Send SMS confirmations with agent details

## MCP Integration

VAPI MCP server connected via `mcp.json`:
- `create_assistant` / `update_assistant` - Configure voice agent
- `create_call` - Initiate outbound calls
- `list_phone_numbers` - Manage phone numbers
- `create_tool` - Add function tools (SMS, transfer, API requests)

**Known Issue**: MCP server may return 401 errors due to `mcp-remote` auth header handling. The API key IS valid - test with curl if needed:
```bash
curl -s -X GET "https://api.vapi.ai/assistant" -H "Authorization: Bearer $VAPI_TOKEN"
```

## VAPI Resources (Updated Jan 2026)

### Assistant
- **Name**: Sophie - Acces Croisieres
- **ID**: `5c494144-a5fb-4593-a282-b8ec0c086b8c`
- **Voice**: ElevenLabs `sarah` with `eleven_multilingual_v2` model
- **Transcriber**: Deepgram `nova-3` (multilingual)
- **LLM**: OpenAI `gpt-4o`
- **Languages**: French/English (auto-detect via multilingual transcriber)
- **Background**: Office ambiance enabled
- **Max Duration**: 10 minutes

### Tools
| Tool | ID | Type |
|------|-----|------|
| Lead Capture | `c5d356ee-d5c1-4704-8c3e-5e853af61953` | function |
| Search Trips | `67595e3f-9079-44b0-893a-504b95efbfd7` | function |
| Browse Website | `156c7f1e-30ec-464c-99b9-24408213e3cc` | function |

#### Browse Website Tool Configuration
```json
{
  "type": "function",
  "function": {
    "name": "browse_website",
    "description": "Search the Acces Croisieres website for cruises, exclusive deals, and European circuits. Use when caller asks about current offerings or wants to browse available trips.",
    "parameters": {
      "type": "object",
      "properties": {
        "category": {
          "type": "string",
          "enum": ["croisieres", "prix-exclusifs", "circuit-europe"],
          "description": "Trip type: croisieres (accompanied cruises), prix-exclusifs (exclusive deals), circuit-europe (European circuits)"
        },
        "max_price": {
          "type": "number",
          "description": "Maximum price per person in CAD"
        },
        "search_query": {
          "type": "string",
          "description": "Free text search query"
        }
      }
    }
  },
  "server": {
    "url": "https://oatuumaqkjwsatpmdnes.supabase.co/functions/v1/browse-website"
  }
}
```

### Voice Configuration
```json
{
  "provider": "11labs",
  "voiceId": "sarah",
  "model": "eleven_multilingual_v2",
  "stability": 0.5,
  "similarityBoost": 0.75,
  "useSpeakerBoost": true,
  "optimizeStreamingLatency": 3
}
```

### Transcriber Configuration
```json
{
  "provider": "deepgram",
  "model": "nova-3",
  "language": "multi",
  "smartFormat": true
}
```

### Phone Numbers
- None configured yet (use VAPI dashboard to purchase/import)

### Testing
Test via VAPI Dashboard > Assistants > Sophie > "Talk with Assistant" button
Or create outbound call with curl:
```bash
curl -X POST "https://api.vapi.ai/call" \
  -H "Authorization: Bearer $VAPI_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"assistantId": "5c494144-a5fb-4593-a282-b8ec0c086b8c", "customer": {"number": "+1XXXXXXXXXX"}}'
```

## VAPI Configuration

```
Voice: 11labs (natural speech)
Transcriber: deepgram nova-3
LLM: claude-3-7-sonnet or gpt-4o
Response target: <600ms
Languages: French (primary), English
```

## Business Targets

- Capture 100% of after-hours inquiries
- Reduce agent qualification time by 70%
- 20+ new leads captured per month

## Production Readiness Checklist

- [x] Assistant created with correct configuration
- [x] SMS tool attached
- [x] Transfer call tool attached
- [x] Lead capture tool attached
- [x] Search trips tool attached
- [x] Browse website edge function deployed
- [x] Browse website VAPI tool created and attached
- [x] API token secured (not hardcoded)
- [x] System prompt version controlled (`prompts/sophie-system-prompt.md`)
- [x] Documentation complete
- [ ] Phone number configured (via VAPI dashboard)
- [x] Lead capture webhook endpoint configured
- [ ] End-to-end call testing completed
- [ ] Softvoyage CRM integration tested

## Supabase Integration

- **Project ID**: `oatuumaqkjwsatpmdnes`
- **Project Name**: `acces-voyages`
- **Project URL**: `https://oatuumaqkjwsatpmdnes.supabase.co`
- **Lead Capture Webhook**: `https://oatuumaqkjwsatpmdnes.supabase.co/functions/v1/capture-lead`
- **Search Trips Endpoint**: `https://oatuumaqkjwsatpmdnes.supabase.co/functions/v1/search-trips`
- **Browse Website Endpoint**: `https://oatuumaqkjwsatpmdnes.supabase.co/functions/v1/browse-website`

### Tables
- `leads` - Captured lead information (name, phone, destination, trip_type, budget, etc.)
- `appointments` - Booked consultation appointments
- `trips` - Travel packages from accesvoyages.ca

### Edge Functions
- `capture-lead` - Webhook endpoint for VAPI lead capture tool (JWT disabled for webhook access)
- `search-trips` - Search endpoint for trip availability (JWT disabled for VAPI access)
- `browse-website` - Scrapes accescroisieres.com for real-time cruise/tour listings (JWT disabled for VAPI access)

### VAPI Tool Update Required
Update the Lead Capture tool (`9b790a08-c535-40f8-a243-bb2c7e63e3b9`) server URL to:
```
https://oatuumaqkjwsatpmdnes.supabase.co/functions/v1/capture-lead
```

Update or create Search Trips tool server URL:
```
https://oatuumaqkjwsatpmdnes.supabase.co/functions/v1/search-trips
```

## Demo Web App

- **URL**: `https://demo-n16wfinu1-qualiasolutionscy.vercel.app`
- **Team**: Qualia Solutions CY
- **Pages**:
  - `/` - Voice agent demo
  - `/leads` - Lead dashboard with real-time updates
  - `/calendar` - Appointment calendar (week/list views)

## Project Structure

```
voice/
├── access/
│   └── proposal.html      # Client proposal (Acces Voyages)
├── demo/                  # Next.js demo web app
│   ├── app/
│   │   ├── api/webhook/   # API routes (backup)
│   │   ├── calendar/      # Appointment calendar page
│   │   ├── components/    # VoiceAgent component
│   │   ├── leads/         # Leads dashboard page
│   │   ├── lib/           # Supabase client
│   │   └── page.tsx       # Main demo page
│   ├── package.json
│   └── vercel.json
├── prompts/
│   └── sophie-system-prompt.md  # Version-controlled system prompt
├── .env.example           # Environment variable template
├── .gitignore
├── CLAUDE.md              # This file
└── mcp.json               # VAPI MCP server config
```
