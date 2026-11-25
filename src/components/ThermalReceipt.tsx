import { useEffect, useMemo, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import type { DiagnosisResult } from '../data/diagnosisData';
import type { SharedDiagnosisStats } from '../services/toySdk';
import { shareToBilibili } from '../services/toySdk';

interface ThermalReceiptProps {
  result: DiagnosisResult;
  sharedStats: SharedDiagnosisStats | null;
  cloudStatusMsg: string;
  onRetake: () => void;
}

function buildAsciiBar(value: number, width = 10): string {
  const filled = Math.max(0, Math.min(width, Math.round((value / 100) * width)));
  const empty = width - filled;
  return `${'█'.repeat(filled)}${'░'.repeat(empty)}`;
}

function SawtoothEdge({ flip = false }: { flip?: boolean }) {
  const teethCount = 28;
  const step = 360 / teethCount;
  const points: string[] = [];
  if (!flip) {
    points.push('0,12');
    for (let i = 0; i < teethCount; i++) {
      const xMid = i * step + step / 2;
      const xEnd = (i + 1) * step;
      points.push(`${xMid.toFixed(1)},0`);
      points.push(`${xEnd.toFixed(1)},12`);
    }
  } else {
    points.push('0,0');
    for (let i = 0; i < teethCount; i++) {
      const xMid = i * step + step / 2;
      const xEnd = (i + 1) * step;
      points.push(`${xMid.toFixed(1)},12`);
      points.push(`${xEnd.toFixed(1)},0`);
    }
  }

  return (
    <svg
      className="receipt-sawtooth"
      viewBox="0 0 360 12"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polygon points={points.join(' ')} fill="#fcfaf2" />
    </svg>
  );
}

function BarcodeSvg({ seed }: { seed: string }) {
  const bars = useMemo(() => {
    const items: { x: number; w: number }[] = [];
    let cursor = 4;
    for (let i = 0; i < 42; i++) {
      const charCode = seed.charCodeAt(i % seed.length);
      const w = ((charCode + i * 7) % 3) + 1;
      const gap = ((charCode + i * 3) % 3) + 1.5;
      items.push({ x: cursor, w });
      cursor += w + gap;
    }
    return { items, totalWidth: cursor + 4 };
  }, [seed]);

  return (
    <svg
      className="receipt-barcode-svg"
      viewBox={`0 0 ${bars.totalWidth} 40`}
      preserveAspectRatio="none"
      aria-label={`条形码 ${seed}`}
    >
      {bars.items.map((bar, idx) => (
        <rect
          key={idx}
          x={bar.x}
          y={0}
          width={bar.w}
          height={40}
          fill="#1f1f1f"
        />
      ))}
    </svg>
  );
}

export function ThermalReceipt({
  result,
  sharedStats,
  cloudStatusMsg,
  onRetake,
}: ThermalReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [previewPngUrl, setPreviewPngUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setIsPrinting(true);
    const timer = setTimeout(() => setIsPrinting(false), 1450);
    return () => clearTimeout(timer);
  }, [result.patientId]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  const handleExportPng = async () => {
    if (!receiptRef.current || exporting) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: '#1f2937',
        useCORS: true,
        logging: false,
      });
      const dataUrl = canvas.toDataURL('image/png');
      setPreviewPngUrl(dataUrl);

      const link = document.createElement('a');
      link.download = `电子精神状态诊断书-${result.patientId}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('已生成高清诊断小票 PNG，若未自动下载可长按下方图片保存');
    } catch {
      showToast('图片生成失败，请截图保存');
    } finally {
      setExporting(false);
    }
  };

  const handleShare = async () => {
    const res = await shareToBilibili(result.diagnosis.title);
    showToast(res.data || '已触发分享');
  };

  const sameTypeCount = sharedStats?.counts[result.diagnosis.id] ?? 0;
  const totalCount = sharedStats?.totalDiagnoses ?? 0;
  const sameTypePct =
    totalCount > 0 ? ((sameTypeCount / totalCount) * 100).toFixed(1) : '0.0';

  const metricsRows = [
    { label: '熬夜指数', value: result.metrics.stayUp, tag: result.metrics.stayUp >= 75 ? 'HIGH' : 'NORM' },
    { label: '抽象浓度', value: result.metrics.abstract, tag: result.metrics.abstract >= 75 ? 'MAX!' : 'OK' },
    { label: '摸鱼含金量', value: result.metrics.slacking, tag: result.metrics.slacking >= 75 ? 'PRO' : 'STD' },
    { label: '内耗程度', value: result.metrics.overthink, tag: result.metrics.overthink >= 75 ? 'WARN' : 'LOW' },
  ];

  return (
    <div className="result-stage">
      {/* 模拟热敏打印机出纸口 */}
      <div className="printer-head">
        <div className="printer-led-row">
          <span className={`printer-led ${isPrinting ? 'is-printing' : 'is-done'}`} />
          <span className="printer-model">EPSON CYBER-POS TM-2026</span>
          <span className="printer-state">
            {isPrinting ? 'PRINTING...' : 'PAPER READY'}
          </span>
        </div>
        <div className="printer-slot" aria-hidden="true" />
      </div>

      {/* 出纸滑出容器 */}
      <div className="printer-chute">
        <div className={`receipt-slide-wrapper ${isPrinting ? 'is-animating' : 'is-settled'}`}>
          <div className="receipt-capture-pad" ref={receiptRef}>
            <SawtoothEdge />
            <div className="receipt-paper">
              <div className="receipt-header">
                <div className="receipt-hospital">BILIBILI TOY 赛博精神卫生中心</div>
                <div className="receipt-doc-title">电子精神状态诊断书 (2026版)</div>
                <div className="receipt-divider">================================</div>
                <div className="receipt-meta-grid">
                  <span>患者编号: {result.patientId}</span>
                  <span>科室: 互联网急诊科</span>
                  <span>诊断时间: {result.diagnosedAt}</span>
                  <span>ICD编码: {result.diagnosis.icdCode}</span>
                </div>
                <div className="receipt-divider">--------------------------------</div>
              </div>

              <div className="receipt-diagnosis-block">
                <div className="receipt-label">[ 临床诊断结论 ]</div>
                <div className="receipt-diagnosis-title">
                  【{result.diagnosis.title}】
                </div>
                <div className="receipt-severity">{result.diagnosis.severity}</div>
                <p className="receipt-summary">{result.diagnosis.summary}</p>
              </div>

              <div className="receipt-divider">--------------------------------</div>

              <div className="receipt-metrics-block">
                <div className="receipt-label">[ 核心指标化验单 // LAB REPORT ]</div>
                <div className="receipt-metrics-table">
                  {metricsRows.map((row) => (
                    <div key={row.label} className="metric-row">
                      <span className="metric-name">{row.label}</span>
                      <span className="metric-bar">[{buildAsciiBar(row.value)}]</span>
                      <span className="metric-val">{String(row.value).padStart(2, '0')}%</span>
                      <span className="metric-tag">{row.tag}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="receipt-divider">--------------------------------</div>

              <div className="receipt-rx-block">
                <div className="receipt-label">[ 赛博处方笺 // Rx ]</div>
                <ol className="receipt-rx-list">
                  {result.diagnosis.prescriptions.map((rx, idx) => (
                    <li key={idx}>
                      <span className="rx-num">0{idx + 1}.</span> {rx}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="receipt-divider">--------------------------------</div>

              <div className="receipt-buddy-block">
                <div className="receipt-label">[ 最适合你的赛博病友 ]</div>
                <div className="buddy-name">★ {result.buddy.title}</div>
                <p className="buddy-reason">配伍说明：{result.diagnosis.buddyReason}</p>
              </div>

              {sharedStats && (
                <>
                  <div className="receipt-divider">--------------------------------</div>
                  <div className="receipt-stats-block">
                    <span>全站累计接诊: {totalCount.toLocaleString()} 人次</span>
                    <span>同型病友占比: {sameTypePct}% ({sameTypeCount}人)</span>
                  </div>
                </>
              )}

              <div className="receipt-divider">================================</div>

              <div className="receipt-footer">
                <BarcodeSvg seed={result.patientId} />
                <div className="receipt-barcode-code">*{result.patientId}*</div>
                <div className="receipt-stamp">电子处方专用章 // 2026 VALID</div>
                <div className="receipt-disclaimer">
                  * 本诊断仅供赛博娱乐与情绪共鸣，请按时吃饭睡觉 *
                </div>
              </div>
            </div>
            <SawtoothEdge flip />
          </div>
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="result-actions-panel win98-window">
        <div className="win98-body result-actions-body">
          <div className="cloud-sync-status">
            <span>☁ {cloudStatusMsg}</span>
            {sharedStats && (
              <span className="sdk-mode-pill">
                {sharedStats.source === 'bilibili-toy-cloud' ? 'TOY CLOUD' : 'LOCAL SANDBOX'}
              </span>
            )}
          </div>

          <div className="result-btn-grid">
            <button
              type="button"
              className="win98-btn win98-btn-primary"
              onClick={handleExportPng}
              disabled={exporting || isPrinting}
            >
              {exporting ? '⏳ 正在生成 PNG...' : '💾 一键导出 PNG 小票'}
            </button>
            <button
              type="button"
              className="win98-btn"
              onClick={handleShare}
              disabled={isPrinting}
            >
              📤 分享给病友
            </button>
            <button
              type="button"
              className="win98-btn"
              onClick={onRetake}
            >
              🔄 重新挂号测试
            </button>
          </div>

          {toast && <div className="win98-toast">{toast}</div>}

          {previewPngUrl && (
            <div className="png-preview-box">
              <div className="png-preview-tip">
                已生成诊断小票图片（手机端可长按下方图片保存/转发）：
              </div>
              <img
                src={previewPngUrl}
                alt="电子精神状态诊断书 PNG"
                className="png-preview-img"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
