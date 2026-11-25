import { useEffect, useState } from 'react';
import type { CloudDiagnosisRecord } from '../services/toySdk';

interface BootScreenProps {
  onStart: () => void;
  previousSave: CloudDiagnosisRecord | null;
  onViewPrevious?: () => void;
}

const BOOT_LOGS = [
  'CYBER-BIOS v2026.11 (C) Bilibili Toy Medical Lab',
  'CPU: BrainCell(TM) 2.4GHz (Overclocked by Iced Americano)',
  'MEM: 640K Should Be Enough For Today... [OK]',
  'CHECK: Dopamine Reserve ............. LOW (12%)',
  'CHECK: Sleep Debt Counter ........... OVERFLOW',
  'MOUNT: /dev/cyber-ward/thermal-printer0 [READY]',
  'STATUS: Waiting for patient intake...',
];

export function BootScreen({ onStart, previousSave, onViewPrevious }: BootScreenProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (visibleLines < BOOT_LOGS.length) {
      const timer = setTimeout(() => {
        setVisibleLines((v) => v + 1);
      }, 170);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setReady(true), 220);
      return () => clearTimeout(timer);
    }
  }, [visibleLines]);

  return (
    <div className="win98-window boot-window">
      <div className="win98-titlebar">
        <div className="win98-titlebar-left">
          <span className="win98-title-icon">🩺</span>
          <span>CYBER_DIAGNOSIS_2026.EXE</span>
        </div>
        <div className="win98-titlebar-controls" aria-hidden="true">
          <span className="win98-ctrl-btn">_</span>
          <span className="win98-ctrl-btn">□</span>
          <span className="win98-ctrl-btn">×</span>
        </div>
      </div>

      <div className="win98-body">
        <div className="crt-screen">
          <div className="crt-scanlines" aria-hidden="true" />
          <div className="crt-header">
            <span className="crt-badge">SYSTEM BOOT // 2026 EDITION</span>
            <span className="crt-blink">● ONLINE</span>
          </div>

          <h1 className="boot-title">
            电子精神状态诊断书
            <span className="boot-subtitle">CYBER MENTAL STATUS DIAGNOSTIC TERMINAL</span>
          </h1>

          <div className="boot-terminal-box">
            {BOOT_LOGS.slice(0, visibleLines).map((line, idx) => (
              <div key={idx} className="boot-log-line">
                <span className="boot-prompt">&gt;</span> {line}
              </div>
            ))}
            {!ready && <span className="terminal-cursor">█</span>}
          </div>

          <div className="boot-notice">
            [临床提示] 本系统包含 10 项当代人类精神状态抽检，耗时约 60 秒。检测完毕将由热敏打印机自动出纸，请勿在结果出炉前拔掉电源。
          </div>
        </div>

        <div className="boot-actions">
          <button
            type="button"
            className="win98-btn win98-btn-primary"
            onClick={onStart}
          >
            ▶ 立即挂号接诊 (START)
          </button>

          {previousSave && onViewPrevious && (
            <button
              type="button"
              className="win98-btn"
              onClick={onViewPrevious}
            >
              📄 查看上次诊断 ({previousSave.patientId})
            </button>
          )}
        </div>
      </div>

      <div className="win98-statusbar">
        <span>READY</span>
        <span>热敏纸余量: 99%</span>
      </div>
    </div>
  );
}
