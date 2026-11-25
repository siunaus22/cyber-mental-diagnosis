import { DIAGNOSIS_TYPES, type DiagnosisId, type MetricScores } from '../data/diagnosisData';

/**
 * Bilibili Toy SDK 全局注入接口类型定义
 * 参考 Bilibili Toy 平台文档：容器会自动注入 toy-sdk.js 并挂载到 window.toy
 */
export interface BilibiliToyBridge {
  available?: () => boolean;
  getCloudStorage?: (params: { key: string }) => Promise<{ value?: string; data?: string } | string | null>;
  setCloudStorage?: (params: { key: string; value: string }) => Promise<unknown>;
  removeCloudStorage?: (params: { key: string }) => Promise<unknown>;
  // 共享数据接口（用于全站玩家共享计数/统计，注意平台流控码 307044）
  getSharedStorage?: (params: { key: string }) => Promise<{ value?: string; data?: string } | string | null>;
  setSharedStorage?: (params: { key: string; value: string }) => Promise<unknown>;
  share?: (params: { path?: string; title?: string; desc?: string }) => Promise<unknown>;
}

declare global {
  interface Window {
    toy?: BilibiliToyBridge;
  }
}

export interface CloudDiagnosisRecord {
  patientId: string;
  diagnosedAt: string;
  diagnosisId: DiagnosisId;
  diagnosisTitle: string;
  metrics: MetricScores;
}

export interface SharedDiagnosisStats {
  totalDiagnoses: number;
  counts: Record<DiagnosisId, number>;
  source: 'bilibili-toy-cloud' | 'local-fallback';
  rateLimited?: boolean;
}

export interface SdkCallResult<T> {
  ok: boolean;
  data: T;
  source: 'bilibili-toy-cloud' | 'local-fallback';
  errorCode?: number | string;
  message?: string;
}

const CLOUD_SAVE_KEY = 'cyber_mental_diagnosis_2026_latest';
const SHARED_STATS_KEY = 'cyber_mental_diagnosis_2026_global_stats';
const LOCAL_STATS_STORAGE_KEY = 'cmd_2026_local_shared_stats';
const LOCAL_SAVE_STORAGE_KEY = 'cmd_2026_local_cloud_save';

// 防止高频触发 Bilibili Toy 共享存储流控 (错误码 307044)
let lastSharedWriteAt = 0;
const SHARED_WRITE_THROTTLE_MS = 10_000;

function createSeedStats(): Record<DiagnosisId, number> {
  return {
    'intermittent-ambition': 1842,
    'cyber-hamster': 1529,
    'high-functioning-introvert': 1674,
    'ddl-warlord': 1388,
    'early-retired': 1490,
    'pure-joker': 1265,
    '2am-philosopher': 1412,
    'cyber-wooden-fish': 1196,
  };
}

function parseRawValue(res: unknown): string | null {
  if (!res) return null;
  if (typeof res === 'string') return res;
  if (typeof res === 'object') {
    const obj = res as Record<string, unknown>;
    if (typeof obj.value === 'string') return obj.value;
    if (typeof obj.data === 'string') return obj.data;
  }
  return null;
}

function extractErrorCode(err: unknown): number | string | undefined {
  if (err && typeof err === 'object') {
    const e = err as Record<string, unknown>;
    if (typeof e.code === 'number' || typeof e.code === 'string') return e.code;
    if (typeof e.errCode === 'number' || typeof e.errCode === 'string') return e.errCode;
  }
  return undefined;
}

export function isToySdkAvailable(): boolean {
  if (typeof window === 'undefined' || !window.toy) return false;
  if (typeof window.toy.available === 'function') {
    try {
      return Boolean(window.toy.available());
    } catch {
      return false;
    }
  }
  return true;
}

/**
 * 1. 个人云存档：保存用户最近一次诊断小票
 */
export async function saveDiagnosisToCloud(
  record: CloudDiagnosisRecord
): Promise<SdkCallResult<void>> {
  const serialized = JSON.stringify(record);

  // 始终写入本地缓存，确保离线/本地预览可回溯
  try {
    localStorage.setItem(LOCAL_SAVE_STORAGE_KEY, serialized);
  } catch {
    // ignore storage quota errors
  }

  if (isToySdkAvailable() && typeof window.toy?.setCloudStorage === 'function') {
    try {
      await window.toy.setCloudStorage({
        key: CLOUD_SAVE_KEY,
        value: serialized,
      });
      return {
        ok: true,
        data: undefined,
        source: 'bilibili-toy-cloud',
        message: '已同步至 B 站云存档',
      };
    } catch (err) {
      return {
        ok: false,
        data: undefined,
        source: 'local-fallback',
        errorCode: extractErrorCode(err),
        message: '云存档同步失败，已暂存本地',
      };
    }
  }

  return {
    ok: true,
    data: undefined,
    source: 'local-fallback',
    message: '本地预览模式：已保存至本地缓存',
  };
}

/**
 * 2. 个人云存档：读取用户历史诊断记录
 */
export async function loadDiagnosisFromCloud(): Promise<SdkCallResult<CloudDiagnosisRecord | null>> {
  if (isToySdkAvailable() && typeof window.toy?.getCloudStorage === 'function') {
    try {
      const rawRes = await window.toy.getCloudStorage({ key: CLOUD_SAVE_KEY });
      const rawStr = parseRawValue(rawRes);
      if (rawStr) {
        return {
          ok: true,
          data: JSON.parse(rawStr) as CloudDiagnosisRecord,
          source: 'bilibili-toy-cloud',
        };
      }
    } catch {
      // fallback to localStorage below
    }
  }

  try {
    const localRaw = localStorage.getItem(LOCAL_SAVE_STORAGE_KEY);
    if (localRaw) {
      return {
        ok: true,
        data: JSON.parse(localRaw) as CloudDiagnosisRecord,
        source: 'local-fallback',
      };
    }
  } catch {
    // ignore parse error
  }

  return {
    ok: true,
    data: null,
    source: isToySdkAvailable() ? 'bilibili-toy-cloud' : 'local-fallback',
  };
}

/**
 * 3. 全站共享数据统计：上报本次诊断并获取全站各人格分布
 *    已内置节流与 307044 流控降级处理
 */
export async function reportAndFetchSharedStats(
  diagnosisId: DiagnosisId
): Promise<SdkCallResult<SharedDiagnosisStats>> {
  // 先读取本地统计作为基准
  let counts = createSeedStats();
  try {
    const saved = localStorage.getItem(LOCAL_STATS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<Record<DiagnosisId, number>>;
      for (const id of Object.keys(DIAGNOSIS_TYPES) as DiagnosisId[]) {
        if (typeof parsed[id] === 'number') {
          counts[id] = parsed[id]!;
        }
      }
    }
  } catch {
    // ignore
  }

  // 如果处于 Bilibili Toy 容器且支持共享存储
  if (
    isToySdkAvailable() &&
    typeof window.toy?.getSharedStorage === 'function' &&
    typeof window.toy?.setSharedStorage === 'function'
  ) {
    try {
      const rawRes = await window.toy.getSharedStorage({ key: SHARED_STATS_KEY });
      const rawStr = parseRawValue(rawRes);
      if (rawStr) {
        const remote = JSON.parse(rawStr) as Partial<Record<DiagnosisId, number>>;
        for (const id of Object.keys(DIAGNOSIS_TYPES) as DiagnosisId[]) {
          if (typeof remote[id] === 'number') {
            counts[id] = remote[id]!;
          }
        }
      }

      counts[diagnosisId] = (counts[diagnosisId] ?? 0) + 1;

      const now = Date.now();
      if (now - lastSharedWriteAt >= SHARED_WRITE_THROTTLE_MS) {
        lastSharedWriteAt = now;
        await window.toy.setSharedStorage({
          key: SHARED_STATS_KEY,
          value: JSON.stringify(counts),
        });
      }

      const totalDiagnoses = Object.values(counts).reduce((sum, n) => sum + n, 0);
      return {
        ok: true,
        source: 'bilibili-toy-cloud',
        data: { totalDiagnoses, counts, source: 'bilibili-toy-cloud' },
      };
    } catch (err) {
      const code = extractErrorCode(err);
      const rateLimited = code === 307044 || String(code) === '307044';
      const totalDiagnoses = Object.values(counts).reduce((sum, n) => sum + n, 0);
      return {
        ok: false,
        source: 'local-fallback',
        errorCode: code,
        message: rateLimited ? '共享统计触发平台流控 (307044)，已降级本地统计' : '共享统计同步异常',
        data: { totalDiagnoses, counts, source: 'local-fallback', rateLimited },
      };
    }
  }

  // 本地降级模式：累加本地计数并持久化
  counts[diagnosisId] = (counts[diagnosisId] ?? 0) + 1;
  try {
    localStorage.setItem(LOCAL_STATS_STORAGE_KEY, JSON.stringify(counts));
  } catch {
    // ignore
  }
  const totalDiagnoses = Object.values(counts).reduce((sum, n) => sum + n, 0);
  return {
    ok: true,
    source: 'local-fallback',
    data: { totalDiagnoses, counts, source: 'local-fallback' },
  };
}

/**
 * 4. 呼起 Bilibili Toy 原生分享面板（本地环境降级为系统分享或复制文案）
 */
export async function shareToBilibili(diagnosisTitle: string): Promise<SdkCallResult<string>> {
  if (isToySdkAvailable() && typeof window.toy?.share === 'function') {
    try {
      await window.toy.share({
        path: 'index.html',
        title: `我的2026电子精神状态：${diagnosisTitle}`,
        desc: '快来测测你的赛博精神状态，领取专属热敏诊断小票！',
      });
      return { ok: true, data: '已呼起 B 站分享面板', source: 'bilibili-toy-cloud' };
    } catch (err) {
      return {
        ok: false,
        data: 'B 站分享呼起失败',
        source: 'bilibili-toy-cloud',
        errorCode: extractErrorCode(err),
      };
    }
  }

  const shareText = `【电子精神状态诊断书 2026版】我的诊断结果是：${diagnosisTitle}！你也来测测看~`;
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(shareText);
      return { ok: true, data: '已复制分享文案到剪贴板', source: 'local-fallback' };
    } catch {
      // ignore
    }
  }
  return { ok: true, data: shareText, source: 'local-fallback' };
}
