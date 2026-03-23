'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Vapi from '@vapi-ai/web';

interface VapiWidgetProps {
  apiKey: string;
  assistantId: string;
  config?: Record<string, unknown>;
}

type CallState = 'idle' | 'listening' | 'speaking';

interface TranscriptMessage {
  role: 'user' | 'assistant';
  text: string;
}

const VapiWidget: React.FC<VapiWidgetProps> = ({
  apiKey,
  assistantId,
  config = {},
}) => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [callState, setCallState] = useState<CallState>('idle');
  const [muted, setMuted] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [seconds, setSeconds] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const waveAnimRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const callStateRef = useRef<CallState>('idle');
  const phaseRef = useRef(0);

  // Keep ref in sync for canvas animation
  useEffect(() => {
    callStateRef.current = callState;
  }, [callState]);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Waveform animation
  const startWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const isSpeaking = callStateRef.current === 'speaking';
      const color = isSpeaking ? '#a855f7' : '#00d9ff';
      const amp = isSpeaking ? 14 : 8;

      // Main line
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const t = x / w;
        const y =
          h / 2 +
          Math.sin(t * Math.PI * 6 + phaseRef.current) * amp +
          Math.sin(t * Math.PI * 10 + phaseRef.current * 1.3) * (amp * 0.4) +
          Math.sin(t * Math.PI * 3 + phaseRef.current * 0.7) * (amp * 0.3);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Glow pass
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.globalAlpha = 0.12;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const t = x / w;
        const y =
          h / 2 +
          Math.sin(t * Math.PI * 6 + phaseRef.current) * amp +
          Math.sin(t * Math.PI * 10 + phaseRef.current * 1.3) * (amp * 0.4) +
          Math.sin(t * Math.PI * 3 + phaseRef.current * 0.7) * (amp * 0.3);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;

      phaseRef.current += isSpeaking ? 0.12 : 0.06;
      waveAnimRef.current = requestAnimationFrame(draw);
    };

    draw();
  }, []);

  const stopWaveform = useCallback(() => {
    if (waveAnimRef.current) {
      cancelAnimationFrame(waveAnimRef.current);
      waveAnimRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setSeconds(0);
  }, []);

  // Vapi setup
  useEffect(() => {
    const vapiInstance = new Vapi(apiKey);
    setVapi(vapiInstance);

    vapiInstance.on('call-start', () => {
      setCallState('listening');
      startTimer();
      startWaveform();
    });

    vapiInstance.on('call-end', () => {
      setCallState('idle');
      stopTimer();
      stopWaveform();
      setTranscript([]);
      setMuted(false);
    });

    vapiInstance.on('speech-start', () => {
      setCallState('speaking');
    });

    vapiInstance.on('speech-end', () => {
      setCallState('listening');
    });

    vapiInstance.on('message', (message: any) => {
      if (message.type === 'transcript') {
        setTranscript((prev) => [
          ...prev,
          { role: message.role, text: message.transcript },
        ]);
      }
    });

    vapiInstance.on('error', (error: unknown) => {
      console.error('Vapi error:', error);
      setCallState('idle');
      stopTimer();
      stopWaveform();
    });

    return () => {
      vapiInstance?.stop();
      stopTimer();
      stopWaveform();
    };
  }, [apiKey, startTimer, startWaveform, stopTimer, stopWaveform]);

  const startCall = () => {
    if (vapi) {
      vapi.start(assistantId);
    }
  };

  const endCall = () => {
    if (vapi) {
      vapi.stop();
    }
  };

  const toggleMute = () => {
    if (vapi) {
      vapi.setMuted(!muted);
      setMuted((m) => !m);
    }
  };

  const formatTime = (s: number) => {
    const m = String(Math.floor(s / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${m}:${sec}`;
  };

  const isActive = callState !== 'idle';
  const isSpeaking = callState === 'speaking';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

        .vapi-root {
          font-family: 'Space Grotesk', system-ui, sans-serif;
          background: var(--background, #0a0a0f);
          color: var(--foreground, #f0f0f5);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        /* Ambient background */
        .vapi-grid-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image:
            linear-gradient(rgba(0,217,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,217,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .vapi-orb-ambient {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          pointer-events: none;
          z-index: 0;
        }
        .vapi-orb-cyan {
          width: 500px; height: 500px;
          background: #00d9ff;
          top: -150px; right: -100px;
        }
        .vapi-orb-purple {
          width: 400px; height: 400px;
          background: #a855f7;
          bottom: -50px; left: -80px;
        }

        /* Content */
        .vapi-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
          padding: 40px 24px;
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
        }

        /* Header */
        .vapi-header { text-align: center; }

        .vapi-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(0,217,255,0.08);
          border: 1px solid rgba(0,217,255,0.2);
          border-radius: 100px;
          padding: 4px 12px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: var(--primary, #00d9ff);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 16px;
          transition: border-color 0.3s, background 0.3s;
        }
        .vapi-status-badge.speaking {
          background: rgba(168,85,247,0.08);
          border-color: rgba(168,85,247,0.3);
          color: var(--secondary, #a855f7);
        }

        .vapi-status-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--primary, #00d9ff);
          transition: background 0.3s;
        }
        .vapi-status-dot.pulse { animation: vapiDotPulse 1.4s ease-in-out infinite; }
        .vapi-status-dot.speaking {
          background: var(--secondary, #a855f7);
          animation: vapiDotPulse 0.8s ease-in-out infinite;
        }

        @keyframes vapiDotPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }

        .vapi-title {
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.5px;
          color: var(--foreground, #f0f0f5);
          margin: 0 0 6px;
        }
        .vapi-subtitle {
          font-size: 14px;
          color: var(--muted-foreground, #8888aa);
          font-weight: 400;
          margin: 0;
        }

        /* Orb */
        .vapi-orb-wrap {
          position: relative;
          width: 160px; height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .vapi-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid;
          opacity: 0;
        }
        .vapi-ring-1 { width: 100%; height: 100%; border-color: rgba(0,217,255,0.3); }
        .vapi-ring-2 { width: 120%; height: 120%; border-color: rgba(0,217,255,0.2); }
        .vapi-ring-3 { width: 140%; height: 140%; border-color: rgba(0,217,255,0.12); }

        .vapi-ring.active { animation: vapiRing 0.8s ease-out infinite; }
        .vapi-ring-2.active { animation-delay: 0.2s; }
        .vapi-ring-3.active { animation-delay: 0.4s; }
        .vapi-ring.speaking { border-color: rgba(168,85,247,0.3) !important; animation: vapiRing 0.6s ease-out infinite; }
        .vapi-ring-2.speaking { animation-delay: 0.15s; }
        .vapi-ring-3.speaking { animation-delay: 0.3s; }

        @keyframes vapiRing {
          0% { transform: scale(0.85); opacity: 0.7; }
          100% { transform: scale(1.2); opacity: 0; }
        }

        .vapi-orb-core {
          position: relative;
          z-index: 2;
          width: 96px; height: 96px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, rgba(0,217,255,0.3), rgba(0,217,255,0.06));
          border: 1.5px solid rgba(0,217,255,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .vapi-orb-core:hover {
          transform: scale(1.05);
          border-color: rgba(0,217,255,0.7);
          box-shadow: 0 0 32px rgba(0,217,255,0.2);
        }
        .vapi-orb-core.listening {
          border-color: rgba(0,217,255,0.8);
          box-shadow: 0 0 40px rgba(0,217,255,0.25);
          animation: vapiOrbBreath 1.5s ease-in-out infinite;
        }
        .vapi-orb-core.speaking {
          background: radial-gradient(circle at 35% 35%, rgba(168,85,247,0.3), rgba(168,85,247,0.06));
          border-color: rgba(168,85,247,0.8);
          box-shadow: 0 0 40px rgba(168,85,247,0.25);
          animation: vapiOrbSpeak 0.6s ease-in-out infinite;
        }
        @keyframes vapiOrbBreath {
          0%, 100% { transform: scale(1); box-shadow: 0 0 30px rgba(0,217,255,0.2); }
          50% { transform: scale(1.04); box-shadow: 0 0 50px rgba(0,217,255,0.35); }
        }
        @keyframes vapiOrbSpeak {
          0%, 100% { transform: scale(1); box-shadow: 0 0 30px rgba(168,85,247,0.2); }
          50% { transform: scale(1.06); box-shadow: 0 0 55px rgba(168,85,247,0.4); }
        }

        .vapi-mic-icon {
          width: 32px; height: 32px;
          color: var(--primary, #00d9ff);
          transition: color 0.3s;
        }
        .vapi-mic-icon.speaking { color: var(--secondary, #a855f7); }

        /* Wave bars */
        .vapi-wave-bars {
          display: flex;
          align-items: center;
          gap: 3px;
          height: 32px;
        }
        .vapi-bar {
          width: 3px;
          border-radius: 2px;
          background: var(--primary, #00d9ff);
          animation: vapiBarDance 0.8s ease-in-out infinite;
          transition: background 0.3s;
        }
        .vapi-bar.speaking { background: var(--secondary, #a855f7); }
        .vapi-bar:nth-child(1) { height: 8px; animation-delay: 0s; }
        .vapi-bar:nth-child(2) { height: 18px; animation-delay: 0.12s; }
        .vapi-bar:nth-child(3) { height: 28px; animation-delay: 0.24s; }
        .vapi-bar:nth-child(4) { height: 18px; animation-delay: 0.36s; }
        .vapi-bar:nth-child(5) { height: 10px; animation-delay: 0.48s; }
        @keyframes vapiBarDance {
          0%, 100% { transform: scaleY(0.5); opacity: 0.5; }
          50% { transform: scaleY(1.3); opacity: 1; }
        }

        /* Waveform strip */
        .vapi-waveform-wrap {
          width: 100%;
          height: 48px;
          border-radius: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border, #1e1e2e);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .vapi-waveform-idle {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: var(--muted-foreground, #8888aa);
          letter-spacing: 0.1em;
        }
        .vapi-waveform-canvas {
          width: 100%;
          height: 100%;
          display: block;
        }

        /* Transcript */
        .vapi-transcript {
          width: 100%;
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--border, #1e1e2e);
          border-radius: 12px;
          padding: 12px;
          max-height: 180px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
          scrollbar-width: thin;
          scrollbar-color: var(--muted, #2a2a3a) transparent;
        }
        .vapi-transcript:empty::before {
          content: 'Conversation will appear here...';
          font-size: 13px;
          color: var(--muted-foreground, #8888aa);
        }

        .vapi-msg {
          display: flex;
          gap: 8px;
          align-items: flex-start;
        }
        .vapi-msg.user { flex-direction: row-reverse; }

        .vapi-msg-label {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding-top: 4px;
          color: var(--muted-foreground, #8888aa);
          white-space: nowrap;
        }
        .vapi-msg-bubble {
          font-size: 13px;
          padding: 7px 11px;
          border-radius: 10px;
          line-height: 1.5;
          max-width: 80%;
        }
        .vapi-msg.assistant .vapi-msg-bubble {
          background: rgba(0,217,255,0.08);
          border: 1px solid rgba(0,217,255,0.15);
          color: var(--foreground, #f0f0f5);
        }
        .vapi-msg.user .vapi-msg-bubble {
          background: rgba(168,85,247,0.1);
          border: 1px solid rgba(168,85,247,0.2);
          color: var(--foreground, #f0f0f5);
        }

        /* Buttons */
        .vapi-btn-start {
          position: relative;
          background: transparent;
          border: 1.5px solid var(--primary, #00d9ff);
          color: var(--primary, #00d9ff);
          border-radius: 100px;
          padding: 14px 36px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.02em;
          overflow: hidden;
          transition: all 0.25s ease;
        }
        .vapi-btn-start:hover {
          background: rgba(0,217,255,0.1);
          box-shadow: 0 0 24px rgba(0,217,255,0.25);
          transform: translateY(-1px);
        }
        .vapi-btn-start:active { transform: translateY(0); }

        .vapi-btn-end {
          background: transparent;
          border: 1.5px solid rgba(255,22,84,0.5);
          color: #ff1654;
          border-radius: 100px;
          padding: 10px 24px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.02em;
          transition: all 0.25s ease;
        }
        .vapi-btn-end:hover {
          background: rgba(255,22,84,0.08);
          border-color: #ff1654;
          box-shadow: 0 0 16px rgba(255,22,84,0.2);
        }

        /* Controls row */
        .vapi-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .vapi-icon-btn {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border, #1e1e2e);
          color: var(--muted-foreground, #8888aa);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .vapi-icon-btn:hover {
          background: rgba(255,255,255,0.08);
          color: var(--foreground, #f0f0f5);
          border-color: rgba(255,255,255,0.15);
        }
        .vapi-icon-btn.muted {
          color: #ff1654;
          border-color: rgba(255,22,84,0.3);
          background: rgba(255,22,84,0.05);
        }

        /* Footer */
        .vapi-footer {
          display: flex;
          align-items: center;
          gap: 16px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: var(--muted-foreground, #8888aa);
          letter-spacing: 0.05em;
        }
        .vapi-footer-sep { opacity: 0.3; }
        .vapi-timer { font-variant-numeric: tabular-nums; }
      `}</style>

      <div className="vapi-root">
        {/* Background */}
        <div className="vapi-grid-bg" />
        <div className="vapi-orb-ambient vapi-orb-cyan" />
        <div className="vapi-orb-ambient vapi-orb-purple" />

        <div className="vapi-content">
          {/* Status Header */}
          <div className="vapi-header">
            <div className={`vapi-status-badge ${isSpeaking ? 'speaking' : ''}`}>
              <div
                className={`vapi-status-dot ${
                  isActive ? (isSpeaking ? 'speaking' : 'pulse') : ''
                }`}
              />
              <span>
                {!isActive ? 'READY' : isSpeaking ? 'SPEAKING' : 'LIVE'}
              </span>
            </div>
            <h1 className="vapi-title">Voice Assistant</h1>
            <p className="vapi-subtitle">
              {!isActive
                ? 'Click the orb to start a conversation'
                : isSpeaking
                ? 'Assistant speaking...'
                : 'Listening...'}
            </p>
          </div>

          {/* Orb Visualizer */}
          <div className="vapi-orb-wrap">
            <div
              className={`vapi-ring vapi-ring-1 ${
                isActive ? (isSpeaking ? 'speaking' : 'active') : ''
              }`}
            />
            <div
              className={`vapi-ring vapi-ring-2 ${
                isActive ? (isSpeaking ? 'speaking' : 'active') : ''
              }`}
            />
            <div
              className={`vapi-ring vapi-ring-3 ${
                isActive ? (isSpeaking ? 'speaking' : 'active') : ''
              }`}
            />
            <div
              className={`vapi-orb-core ${callState !== 'idle' ? callState : ''}`}
              onClick={!isActive ? startCall : undefined}
            >
              {!isActive ? (
                <svg
                  className={`vapi-mic-icon ${isSpeaking ? 'speaking' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="3" width="6" height="11" rx="3" />
                  <path d="M19 10a7 7 0 01-14 0" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                  <line x1="8" y1="22" x2="16" y2="22" />
                </svg>
              ) : (
                <div className="vapi-wave-bars">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`vapi-bar ${isSpeaking ? 'speaking' : ''}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Waveform Strip */}
          <div className="vapi-waveform-wrap">
            {!isActive ? (
              <span className="vapi-waveform-idle">── AWAITING SIGNAL ──</span>
            ) : (
              <canvas ref={canvasRef} className="vapi-waveform-canvas" />
            )}
          </div>

          {/* Start Button (idle) */}
          {!isActive && (
            <button className="vapi-btn-start" onClick={startCall}>
              Start Conversation
            </button>
          )}

          {/* Controls (during call) */}
          {isActive && (
            <div className="vapi-controls">
              <button
                className={`vapi-icon-btn ${muted ? 'muted' : ''}`}
                onClick={toggleMute}
                title={muted ? 'Unmute' : 'Mute'}
              >
                {muted ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="1" y1="1" x2="23" y2="23" />
                    <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
                    <path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23M12 19v3m-4 0h8" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 9v3a3 3 0 006 0V9" />
                    <path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23M12 19v3m-4 0h8" />
                  </svg>
                )}
              </button>
              <button className="vapi-btn-end" onClick={endCall}>
                End Call
              </button>
              <span className="vapi-timer">{formatTime(seconds)}</span>
            </div>
          )}

          {/* Footer */}
          {!isActive && (
            <div className="vapi-footer">
              <span>VIONEER</span>
              <span className="vapi-footer-sep">|</span>
              <span>AI VOICE</span>
              <span className="vapi-footer-sep">|</span>
              <span>v2.0</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VapiWidget;