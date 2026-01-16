#!/bin/bash
# Update Sophie VAPI Assistant with enhanced configuration
# Run: ./scripts/update-vapi.sh

set -e

# Check for VAPI token
if [ -z "$VAPI_TOKEN" ]; then
    echo "Error: VAPI_TOKEN environment variable not set"
    echo "Run: export VAPI_TOKEN=your-token-here"
    exit 1
fi

ASSISTANT_ID="5c494144-a5fb-4593-a282-b8ec0c086b8c"

# Read the system prompt from file
SYSTEM_PROMPT=$(cat prompts/sophie-system-prompt.md | sed 's/"/\\"/g' | sed ':a;N;$!ba;s/\n/\\n/g')

echo "Updating Sophie assistant..."

curl -s -X PATCH "https://api.vapi.ai/assistant/${ASSISTANT_ID}" \
  -H "Authorization: Bearer ${VAPI_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @- << EOF
{
  "name": "Sophie - Acces Croisieres",
  "firstMessage": "Bonjour! Ici Sophie d'Acces Croisieres et Voyages. Comment puis-je vous aider a planifier votre prochain voyage?",
  "model": {
    "provider": "openai",
    "model": "gpt-4o",
    "temperature": 0.7,
    "maxTokens": 500,
    "messages": [
      {
        "role": "system",
        "content": "${SYSTEM_PROMPT}"
      }
    ]
  },
  "voice": {
    "provider": "11labs",
    "voiceId": "sarah",
    "model": "eleven_multilingual_v2",
    "stability": 0.5,
    "similarityBoost": 0.75,
    "useSpeakerBoost": true,
    "optimizeStreamingLatency": 3
  },
  "transcriber": {
    "provider": "deepgram",
    "model": "nova-3",
    "language": "multi",
    "smartFormat": true
  },
  "silenceTimeoutSeconds": 30,
  "responseDelaySeconds": 0.4,
  "llmRequestDelaySeconds": 0.1,
  "numWordsToInterruptAssistant": 2,
  "maxDurationSeconds": 600,
  "backgroundSound": "office",
  "backchannelingEnabled": true,
  "backgroundDenoisingEnabled": true,
  "modelOutputInMessagesEnabled": true,
  "endCallMessage": "Merci d'avoir appele Acces Croisieres et Voyages. Bonne journee et bon voyage!",
  "endCallPhrases": [
    "au revoir",
    "bye bye",
    "goodbye",
    "merci bonne journee",
    "c'est tout merci",
    "that's all thanks"
  ],
  "metadata": {
    "version": "2.0",
    "updated": "$(date -Iseconds)"
  }
}
EOF

echo ""
echo "Done! Sophie has been updated."
echo "Test at: https://dashboard.vapi.ai/assistants/${ASSISTANT_ID}"
