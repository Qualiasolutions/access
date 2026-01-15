'use client';

import { useState, useEffect, useCallback } from 'react';
import Vapi from '@vapi-ai/web';

// Hardcoded for reliability - env vars can be flaky with Next.js static builds
const VAPI_PUBLIC_KEY = '58d3e7c2-5eb3-47dd-a304-5b6a55447ecc';
const ASSISTANT_ID = '5c494144-a5fb-4593-a282-b8ec0c086b8c';

type CallStatus = 'idle' | 'connecting' | 'active' | 'ending';

export default function VoiceAgent() {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [status, setStatus] = useState<CallStatus>('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);

  useEffect(() => {
    if (!VAPI_PUBLIC_KEY) return;

    const vapiInstance = new Vapi(VAPI_PUBLIC_KEY);

    vapiInstance.on('call-start', () => {
      setStatus('active');
      setTranscript([]);
    });

    vapiInstance.on('call-end', () => {
      setStatus('idle');
      setIsSpeaking(false);
    });

    vapiInstance.on('speech-start', () => {
      setIsSpeaking(true);
    });

    vapiInstance.on('speech-end', () => {
      setIsSpeaking(false);
    });

    vapiInstance.on('message', (message) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        setTranscript(prev => [...prev, `${message.role}: ${message.transcript}`]);
      }
    });

    vapiInstance.on('error', (error) => {
      console.error('VAPI Error:', error);
      setStatus('idle');
    });

    setVapi(vapiInstance);

    return () => {
      vapiInstance.stop();
    };
  }, []);

  const startCall = useCallback(async () => {
    if (!vapi || status !== 'idle') return;

    setStatus('connecting');
    try {
      await vapi.start(ASSISTANT_ID);
    } catch (error) {
      console.error('Failed to start call:', error);
      setStatus('idle');
    }
  }, [vapi, status]);

  const endCall = useCallback(() => {
    if (!vapi || status === 'idle') return;

    setStatus('ending');
    vapi.stop();
  }, [vapi, status]);

  const getStatusText = () => {
    switch (status) {
      case 'connecting': return 'Connexion...';
      case 'active': return isSpeaking ? 'En écoute...' : 'En appel';
      case 'ending': return 'Fin d\'appel...';
      default: return 'Prêt';
    }
  };

  if (!VAPI_PUBLIC_KEY) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p className="text-slate-500 text-sm">Configuration en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6">
      {/* Call button - smaller and teal themed */}
      <div className="relative">
        <button
          onClick={status === 'active' ? endCall : startCall}
          disabled={status === 'connecting' || status === 'ending'}
          className={`
            relative w-20 h-20 md:w-24 md:h-24 rounded-full transition-all duration-300 ease-out
            flex items-center justify-center
            ${status === 'active'
              ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20'
              : status === 'connecting' || status === 'ending'
                ? 'bg-slate-200 cursor-not-allowed'
                : 'bg-teal-500 hover:bg-teal-600 shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/25 hover:scale-105 active:scale-95'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {status === 'active' ? (
            <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          )}

          {/* Ripple effect for active call */}
          {status === 'active' && isSpeaking && (
            <>
              <span className="absolute w-full h-full rounded-full bg-teal-400/30 animate-ping" />
              <span className="absolute w-[130%] h-[130%] rounded-full bg-teal-400/15 animate-pulse" />
            </>
          )}
        </button>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
          status === 'active'
            ? isSpeaking
              ? 'bg-teal-400 animate-pulse'
              : 'bg-green-400'
            : status === 'connecting' || status === 'ending'
              ? 'bg-amber-400 animate-pulse'
              : 'bg-slate-300'
        }`} />
        <span className="text-sm text-slate-500 font-medium">{getStatusText()}</span>
      </div>

      {/* Transcript container - wide and polished */}
      <div className="w-full max-w-2xl px-4">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <p className="text-sm text-white font-medium">Transcription en direct</p>
            </div>
            <span className="text-xs text-slate-400">Sophie AI</span>
          </div>
          <div className="p-5 min-h-[140px] max-h-[200px] overflow-y-auto bg-gradient-to-b from-slate-50/50 to-white">
            {transcript.length > 0 ? (
              <div className="space-y-3">
                {transcript.slice(-8).map((line, i) => {
                  const isAssistant = line.toLowerCase().startsWith('assistant:');
                  const isUser = line.toLowerCase().startsWith('user:');
                  const content = line.replace(/^(assistant|user):\s*/i, '');

                  return (
                    <div
                      key={i}
                      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          isAssistant
                            ? 'bg-teal-50 text-teal-800 border border-teal-100 rounded-tl-sm'
                            : isUser
                              ? 'bg-slate-800 text-white rounded-tr-sm'
                              : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isAssistant && <span className="text-teal-500 font-semibold text-xs block mb-1">Sophie</span>}
                        {isUser && <span className="text-slate-400 font-semibold text-xs block mb-1">Vous</span>}
                        {content}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-sm text-slate-500 font-medium">Conversation</p>
                <p className="text-xs text-slate-400 mt-1">La transcription apparaitra ici</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
