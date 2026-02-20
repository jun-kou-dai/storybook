/**
 * Story definitions for nano-storybook
 * Each story renders a component from memonomaryoku in isolation
 */

// Demo data (from the app's fallback system)
const DEMO = {
  ichigeki: '勝負は「やるか」じゃなく「工程を先に見せるか」で決まる。',
  branching: [
    '条件1：施行日＋財源が明示された場合 → 支持率は維持される',
    '条件2：「先送り」発言が増えた場合 → 信頼が急落し野党に攻撃材料を与える',
    '条件3：給付が主語になった場合 → 減税の本質から逸れて迷走する',
  ],
  onepager: [
    '第1章【状況】：高市内閣は「年内減税」を掲げたが、具体的工程が未公表',
    '第2章【問題】：「やるかやらないか」の議論に終始し、「いつ・いくら・財源は」が欠落',
    '第3章【仮説】：有権者は「減税の有無」より「計画の具体性」で政権を評価する',
    '第4章【検証】：過去3政権の支持率推移を見ると、具体的数字を出した直後に支持率が上昇している',
    '第5章【結論】：施行日と財源を同時に出すことが唯一の勝ち筋',
    '第6章【行動】：今週中に「施行日＋財源＋中止条件」の3点セットを発表する',
  ],
  counter: {
    objection: '反論：「財源がないなら絵空事。赤字国債を増やすだけなら無責任だ」',
    response: '処理：出口条件と中止条件を工程に入れる。「GDP成長率がX%を下回ったら自動停止」のトリガーを設計し、財政規律との両立を示す。',
  },
  next_action: '今日やること：高市内閣の減税発言を3つの一次ソースで確認し、「施行日＋財源」が出ているかだけチェックする（15分以内）。',
};

const GATE_LOG_SAMPLE = [
  '--- 試行 1 ---',
  'スキーマ検証: OK',
  'Quality Gate: PASS',
];

const GATE_LOG_RETRY = [
  '--- 試行 1 ---',
  'スキーマ検証: OK',
  'Quality Gate失格: NGワード5個検出（閾値3）: 重要, バランス, 検討, 慎重に, 総合的',
  '--- 試行 2 ---',
  'スキーマ検証: OK',
  'Quality Gate: PASS',
];

const GATE_LOG_FALLBACK = [
  '--- 試行 1 ---',
  'エラー: [gemini-2.5-flash] 429 Too Many Requests',
  '--- 試行 2 ---',
  'エラー: [gemini-2.5-flash] 429 Too Many Requests',
  '--- 試行 3 ---',
  'エラー: [gemini-2.0-flash] 429 Too Many Requests',
  '--- フォールバック発動 ---',
  '原因: 上記エラーにより全試行失敗。API Keyとモデルの利用可否を確認してください。',
];

function esc(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function escAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export const stories = [
  // ===== Layout =====
  {
    id: 'header',
    title: 'Header',
    category: 'Layout',
    description: 'App header with gradient title and subtitle',
    render: (c) => {
      c.innerHTML = `
        <div class="header">
          <h1>武器メモ / 次の一手メーカー</h1>
          <p>事実を1文入力するだけで、議論に使える5枚の「武器カード」を自動生成します</p>
        </div>
      `;
    },
  },

  {
    id: 'container',
    title: 'Container',
    category: 'Layout',
    description: 'Main content wrapper with max-width 800px, centered layout.',
    render: (c) => {
      c.innerHTML = `
        <div class="container" style="background:rgba(233,69,96,0.05);border:1px dashed var(--accent);padding:16px">
          <p style="color:var(--text-secondary);font-size:0.85rem;text-align:center">.container — max-width: 800px, margin: 0 auto, padding: 16px</p>
          <div class="input-section" style="margin-top:12px">
            <label>Example content inside container</label>
            <textarea placeholder="Container constrains all content to 800px max width" style="width:100%;background:#16213e;border:1px solid #2a2a4a;border-radius:8px;color:#eee;padding:12px;font-size:1rem;resize:vertical;min-height:40px;font-family:inherit"></textarea>
          </div>
        </div>
      `;
    },
  },

  // ===== Input =====
  {
    id: 'fact-textarea',
    title: 'Fact Textarea',
    category: 'Input',
    description: 'Main input area for entering a fact. Shown empty and with sample text.',
    render: (c) => {
      c.innerHTML = `
        <div class="input-section" style="max-width:600px">
          <label>Fact（事実を1文で）— Empty</label>
          <textarea id="sb-fact-empty" placeholder="例：高市内閣、今年中に減税できる？やらないと人気落ちる" style="width:100%;background:#16213e;border:1px solid #2a2a4a;border-radius:8px;color:#eee;padding:12px;font-size:1rem;resize:vertical;min-height:60px;font-family:inherit"></textarea>

          <label style="margin-top:16px">Fact（事実を1文で）— Filled</label>
          <textarea style="width:100%;background:#16213e;border:1px solid #2a2a4a;border-radius:8px;color:#eee;padding:12px;font-size:1rem;resize:vertical;min-height:60px;font-family:inherit">高市内閣、今年中に減税できる？やらないと人気落ちる</textarea>
        </div>
      `;
    },
  },
  {
    id: 'mode-select',
    title: 'Mode Select',
    category: 'Input',
    description: 'Domain selector with 5 options. Custom mode reveals a text input field.',
    render: (c) => {
      c.innerHTML = `
        <div class="input-section" style="max-width:400px">
          <div class="input-group">
            <label>Mode — Default</label>
            <select style="width:100%;background:#16213e;border:1px solid #2a2a4a;border-radius:8px;color:#eee;padding:8px 12px;font-size:0.9rem">
              <option value="admin" selected>行政・政策</option>
              <option value="gym">ジム経営</option>
              <option value="product">プロダクト開発</option>
              <option value="personal">個人の意思決定</option>
              <option value="custom">カスタム（自由入力）</option>
            </select>
          </div>

          <div class="input-group" style="margin-top:16px">
            <label>Mode — Custom selected</label>
            <select style="width:100%;background:#16213e;border:1px solid #2a2a4a;border-radius:8px;color:#eee;padding:8px 12px;font-size:0.9rem">
              <option value="custom" selected>カスタム（自由入力）</option>
            </select>
            <input type="text" class="mode-custom-input active" placeholder="例：教育、投資、飲食店経営..." value="飲食店経営" />
          </div>
        </div>
      `;
    },
  },
  {
    id: 'tone-slider',
    title: 'Tone Slider',
    category: 'Input',
    description: 'Tone range from super-casual (0) to super-formal (4). Labels update dynamically.',
    render: (c) => {
      const tones = ['超カジュアル', 'カジュアル', '標準', 'フォーマル', '超フォーマル'];
      let html = '<div class="input-section" style="max-width:400px">';
      tones.forEach((label, i) => {
        html += `
          <div class="input-group" style="margin-bottom:12px">
            <label>Tone = ${i} (${label})</label>
            <input type="range" min="0" max="4" value="${i}" style="width:100%;background:#16213e;border:1px solid #2a2a4a;border-radius:8px;color:#eee;padding:8px 12px" />
            <div class="tone-display">${label}</div>
          </div>
        `;
      });
      html += '</div>';
      c.innerHTML = html;
    },
  },
  {
    id: 'api-key',
    title: 'API Key Section',
    category: 'Input',
    description: 'API key input with connection test button and hint text.',
    render: (c) => {
      c.innerHTML = `
        <div class="input-section" style="max-width:500px">
          <div class="api-key-section">
            <label>Gemini API Key（任意）— Empty</label>
            <div class="api-key-row">
              <input type="password" placeholder="AIza..." style="flex:1;background:#16213e;border:1px solid #2a2a4a;border-radius:8px;color:#eee;padding:8px 12px;font-size:0.85rem" />
              <button class="btn btn-test">接続テスト</button>
            </div>
            <div class="api-key-hint">空欄ならデモデータで動作確認できます。<a href="#">無料でKeyを取得</a></div>
          </div>

          <div class="api-key-section" style="margin-top:20px">
            <label>Gemini API Key（任意）— Filled</label>
            <div class="api-key-row">
              <input type="password" value="AIzaSyDummyKey12345" style="flex:1;background:#16213e;border:1px solid #2a2a4a;border-radius:8px;color:#eee;padding:8px 12px;font-size:0.85rem" />
              <button class="btn btn-test">接続テスト</button>
            </div>
          </div>
        </div>
      `;
    },
  },

  // ===== Buttons =====
  {
    id: 'btn-primary',
    title: 'Primary Button (生成)',
    category: 'Buttons',
    description: 'Main generate button with gradient background. Shows default, hover (apply via class), and disabled states.',
    render: (c) => {
      c.innerHTML = `
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <button class="btn btn-primary">生成</button>
          <button class="btn btn-primary" disabled>生成 (disabled)</button>
        </div>
      `;
    },
  },
  {
    id: 'btn-secondary',
    title: 'Secondary Button (別案)',
    category: 'Buttons',
    description: 'Alternative generation button with border style.',
    render: (c) => {
      c.innerHTML = `
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <button class="btn btn-secondary">別案</button>
          <button class="btn btn-secondary" disabled>別案 (disabled)</button>
        </div>
      `;
    },
  },
  {
    id: 'btn-danger',
    title: 'Danger Button (反対側強め)',
    category: 'Buttons',
    description: 'Strong counter button with danger/red border.',
    render: (c) => {
      c.innerHTML = `
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <button class="btn btn-danger">反対側強め</button>
          <button class="btn btn-danger" disabled>反対側強め (disabled)</button>
        </div>
      `;
    },
  },
  {
    id: 'btn-clear',
    title: 'Clear Button (クリア)',
    category: 'Buttons',
    description: 'Reset button with muted style.',
    render: (c) => {
      c.innerHTML = `
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <button class="btn btn-clear">クリア</button>
          <button class="btn btn-clear" disabled>クリア (disabled)</button>
        </div>
      `;
    },
  },
  {
    id: 'btn-api-test',
    title: 'API Test Button (接続テスト)',
    category: 'Buttons',
    description: 'Connection test button in default and testing (disabled) states.',
    render: (c) => {
      c.innerHTML = `
        <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center">
          <button class="btn btn-test">接続テスト</button>
          <button class="btn btn-test" disabled style="opacity:0.5;cursor:not-allowed">テスト中...</button>
        </div>
      `;
    },
  },
  {
    id: 'button-row',
    title: 'Button Row (Full)',
    category: 'Buttons',
    description: 'All four buttons together as they appear in the app, with hint and description text.',
    render: (c) => {
      c.innerHTML = `
        <div class="input-section" style="max-width:600px">
          <div class="button-hint">※ まずFactを入力してから「生成」を押してください。API Key空欄ならデモで動きます。</div>
          <div class="button-row">
            <button class="btn btn-primary">生成</button>
            <button class="btn btn-secondary">別案</button>
            <button class="btn btn-danger">反対側強め</button>
            <button class="btn btn-clear">クリア</button>
          </div>
          <div class="button-desc">
            <span><strong>生成</strong>＝武器カード作成</span>
            <span><strong>別案</strong>＝違う角度で再生成</span>
            <span><strong>反対側強め</strong>＝最強の反論付き</span>
            <span><strong>クリア</strong>＝全部消す</span>
          </div>
        </div>
      `;
    },
  },

  // ===== Feedback =====
  {
    id: 'loading',
    title: 'Loading Spinner',
    category: 'Feedback',
    description: 'Loading state shown during AI generation. Normally hidden; shown here in active state.',
    render: (c) => {
      c.innerHTML = `
        <div class="loading active" style="display:block">
          <div class="spinner"></div>
          <div class="loading-text">生成中... Quality Gate判定中...</div>
        </div>
      `;
    },
  },
  {
    id: 'error-message',
    title: 'Error Message',
    category: 'Feedback',
    description: 'Error banner displayed when generation fails.',
    render: (c) => {
      c.innerHTML = `
        <div class="error-message active" style="display:block">
          エラー: [gemini-2.5-flash] 429 Too Many Requests
        </div>
      `;
    },
  },
  {
    id: 'demo-banner',
    title: 'Demo Banner',
    category: 'Feedback',
    description: 'Warning banner shown in demo mode (no API key). Variants: normal, alternative, strong_counter.',
    render: (c) => {
      c.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:12px">
          <div class="demo-banner">
            デモモード — API Keyを入力すると、あなたの入力内容に合わせたAI回答が生成されます
          </div>
          <div class="demo-banner">
            【別案】 デモモード — API Keyを入力すると、あなたの入力内容に合わせたAI回答が生成されます
          </div>
          <div class="demo-banner">
            【反対側強め】 デモモード — API Keyを入力すると、あなたの入力内容に合わせたAI回答が生成されます
          </div>
        </div>
      `;
    },
  },
  {
    id: 'fallback-warning',
    title: 'Fallback Warning',
    category: 'Feedback',
    description: 'Red warning banner shown when AI generation failed and fallback data is used.',
    render: (c) => {
      c.innerHTML = `
        <div class="fallback-warning">
          ⚠ AI生成に失敗したため、固定テンプレートを表示中です。<br>
          エラー: [gemini-2.0-flash] 429 Too Many Requests<br>
          <small>API Keyが正しいか確認してください。下の「Quality Gate Log」に詳細があります。</small>
        </div>
      `;
    },
  },
  {
    id: 'api-test-result',
    title: 'API Test Result',
    category: 'Feedback',
    description: 'Connection test result in 3 states: testing, success, failure.',
    render: (c) => {
      c.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:12px;max-width:500px">
          <div class="api-test-result testing" style="display:block">
            Gemini API に接続中...
          </div>
          <div class="api-test-result success" style="display:block">
            gemini-2.5-flash: OK — OK
            gemini-2.0-flash: OK — OK
          </div>
          <div class="api-test-result failure" style="display:block">
            gemini-2.5-flash: NG — API key not valid
            gemini-2.0-flash: NG — API key not valid
          </div>
        </div>
      `;
    },
  },

  // ===== Flow Diagram =====
  {
    id: 'flow-default',
    title: 'Flow Diagram — Default',
    category: 'Flow Diagram',
    description: 'Quality gate flow visualization in default state (no highlights).',
    render: (c) => {
      c.innerHTML = `
        <div class="flow-section">
          <h3>無難排除フロー</h3>
          <div class="flow-diagram">
            <span class="flow-step generate">生成</span>
            <span class="flow-arrow">&rarr;</span>
            <span class="flow-step gate">Quality Gate</span>
            <span class="flow-arrow">&rarr;</span>
            <span class="flow-step ok">OK</span>
            <span class="flow-arrow">|</span>
            <span class="flow-step retry">再生成(max2)</span>
            <span class="flow-arrow">&rarr;</span>
            <span class="flow-step fallback">Fallback</span>
          </div>
        </div>
      `;
    },
  },
  {
    id: 'flow-ok',
    title: 'Flow Diagram — OK',
    category: 'Flow Diagram',
    description: 'Flow with OK step highlighted (first attempt passed).',
    render: (c) => {
      c.innerHTML = `
        <div class="flow-section">
          <h3>無難排除フロー — attempt 1, passed</h3>
          <div class="flow-diagram">
            <span class="flow-step generate">生成</span>
            <span class="flow-arrow">&rarr;</span>
            <span class="flow-step gate">Quality Gate</span>
            <span class="flow-arrow">&rarr;</span>
            <span class="flow-step ok active">OK</span>
            <span class="flow-arrow">|</span>
            <span class="flow-step retry">再生成(max2)</span>
            <span class="flow-arrow">&rarr;</span>
            <span class="flow-step fallback">Fallback</span>
          </div>
        </div>
      `;
    },
  },
  {
    id: 'flow-retry',
    title: 'Flow Diagram — Retry',
    category: 'Flow Diagram',
    description: 'Flow with retry step highlighted (passed on 2nd or 3rd attempt).',
    render: (c) => {
      c.innerHTML = `
        <div class="flow-section">
          <h3>無難排除フロー — attempt 2+, passed after retry</h3>
          <div class="flow-diagram">
            <span class="flow-step generate">生成</span>
            <span class="flow-arrow">&rarr;</span>
            <span class="flow-step gate">Quality Gate</span>
            <span class="flow-arrow">&rarr;</span>
            <span class="flow-step ok">OK</span>
            <span class="flow-arrow">|</span>
            <span class="flow-step retry active">再生成(max2)</span>
            <span class="flow-arrow">&rarr;</span>
            <span class="flow-step fallback">Fallback</span>
          </div>
        </div>
      `;
    },
  },
  {
    id: 'flow-fallback',
    title: 'Flow Diagram — Fallback',
    category: 'Flow Diagram',
    description: 'Flow with fallback step highlighted (all attempts failed).',
    render: (c) => {
      c.innerHTML = `
        <div class="flow-section">
          <h3>無難排除フロー — all attempts failed</h3>
          <div class="flow-diagram">
            <span class="flow-step generate">生成</span>
            <span class="flow-arrow">&rarr;</span>
            <span class="flow-step gate">Quality Gate</span>
            <span class="flow-arrow">&rarr;</span>
            <span class="flow-step ok">OK</span>
            <span class="flow-arrow">|</span>
            <span class="flow-step retry">再生成(max2)</span>
            <span class="flow-arrow">&rarr;</span>
            <span class="flow-step fallback active">Fallback</span>
          </div>
        </div>
      `;
    },
  },

  // ===== Cards =====
  {
    id: 'card-ichigeki',
    title: 'Card: Ichigeki (#1)',
    category: 'Cards',
    description: 'Single-line conclusion card. "One-hit" statement.',
    render: (c) => {
      c.innerHTML = `
        <div style="max-width:600px">
          <div class="card">
            <div class="card-header">
              <div class="card-title">
                <span class="card-number">1</span>
                <span class="card-label">一撃</span>
              </div>
              <button class="btn-copy" data-copy-text="${escAttr(DEMO.ichigeki)}">Copy</button>
            </div>
            <div class="card-body"><p>${esc(DEMO.ichigeki)}</p></div>
          </div>
        </div>
      `;
    },
  },
  {
    id: 'card-branching',
    title: 'Card: Branching (#2)',
    category: 'Cards',
    description: '3-condition branching card with left-accent border items.',
    render: (c) => {
      const items = DEMO.branching.map((v) => `<div class="branch-item">${esc(v)}</div>`).join('');
      c.innerHTML = `
        <div style="max-width:600px">
          <div class="card">
            <div class="card-header">
              <div class="card-title">
                <span class="card-number">2</span>
                <span class="card-label">分岐（3条件）</span>
              </div>
              <button class="btn-copy" data-copy-text="${escAttr(DEMO.branching.join('\n'))}">Copy</button>
            </div>
            <div class="card-body">${items}</div>
          </div>
        </div>
      `;
    },
  },
  {
    id: 'card-onepager',
    title: 'Card: Onepager (#3)',
    category: 'Cards',
    description: '6-chapter one-pager card with structured analysis.',
    render: (c) => {
      const items = DEMO.onepager.map((v) => `<div class="chapter-item">${esc(v)}</div>`).join('');
      c.innerHTML = `
        <div style="max-width:600px">
          <div class="card">
            <div class="card-header">
              <div class="card-title">
                <span class="card-number">3</span>
                <span class="card-label">一枚（6章）</span>
              </div>
              <button class="btn-copy" data-copy-text="${escAttr(DEMO.onepager.join('\n'))}">Copy</button>
            </div>
            <div class="card-body">${items}</div>
          </div>
        </div>
      `;
    },
  },
  {
    id: 'card-counter',
    title: 'Card: Counter (#4)',
    category: 'Cards',
    description: 'Counter-argument card with OBJECTION (red) and RESPONSE (green) blocks.',
    render: (c) => {
      c.innerHTML = `
        <div style="max-width:600px">
          <div class="card">
            <div class="card-header">
              <div class="card-title">
                <span class="card-number">4</span>
                <span class="card-label">反対側</span>
              </div>
              <button class="btn-copy" data-copy-text="${escAttr(DEMO.counter.objection + '\n' + DEMO.counter.response)}">Copy</button>
            </div>
            <div class="card-body">
              <div class="counter-block objection">
                <div class="counter-label">OBJECTION</div>
                <p>${esc(DEMO.counter.objection)}</p>
              </div>
              <div class="counter-block response">
                <div class="counter-label">RESPONSE</div>
                <p>${esc(DEMO.counter.response)}</p>
              </div>
            </div>
          </div>
        </div>
      `;
    },
  },
  {
    id: 'card-next-action',
    title: 'Card: Next Action (#5)',
    category: 'Cards',
    description: 'Concrete next action card. Must be specific (passes Quality Gate).',
    render: (c) => {
      c.innerHTML = `
        <div style="max-width:600px">
          <div class="card">
            <div class="card-header">
              <div class="card-title">
                <span class="card-number">5</span>
                <span class="card-label">次の一手</span>
              </div>
              <button class="btn-copy" data-copy-text="${escAttr(DEMO.next_action)}">Copy</button>
            </div>
            <div class="card-body"><p>${esc(DEMO.next_action)}</p></div>
          </div>
        </div>
      `;
    },
  },
  {
    id: 'card-all-five',
    title: 'All 5 Cards',
    category: 'Cards',
    description: 'Complete card output as seen after generation, with demo banner.',
    render: (c) => {
      const defs = [
        { key: 'ichigeki', label: '一撃', number: 1 },
        { key: 'branching', label: '分岐（3条件）', number: 2 },
        { key: 'onepager', label: '一枚（6章）', number: 3 },
        { key: 'counter', label: '反対側', number: 4 },
        { key: 'next_action', label: '次の一手', number: 5 },
      ];

      let html = '<div style="max-width:600px">';
      html += '<div class="demo-banner">デモモード — API Keyを入力すると、あなたの入力内容に合わせたAI回答が生成されます</div>';
      html += '<div style="margin-top:16px">';

      for (const def of defs) {
        const val = DEMO[def.key];
        let bodyHtml = '';
        let copyText = '';

        switch (def.key) {
          case 'ichigeki':
          case 'next_action':
            bodyHtml = `<p>${esc(val)}</p>`;
            copyText = val;
            break;
          case 'branching':
            bodyHtml = val.map((v) => `<div class="branch-item">${esc(v)}</div>`).join('');
            copyText = val.join('\n');
            break;
          case 'onepager':
            bodyHtml = val.map((v) => `<div class="chapter-item">${esc(v)}</div>`).join('');
            copyText = val.join('\n');
            break;
          case 'counter':
            bodyHtml = `
              <div class="counter-block objection">
                <div class="counter-label">OBJECTION</div>
                <p>${esc(val.objection)}</p>
              </div>
              <div class="counter-block response">
                <div class="counter-label">RESPONSE</div>
                <p>${esc(val.response)}</p>
              </div>`;
            copyText = `${val.objection}\n${val.response}`;
            break;
        }

        html += `
          <div class="card">
            <div class="card-header">
              <div class="card-title">
                <span class="card-number">${def.number}</span>
                <span class="card-label">${def.label}</span>
              </div>
              <button class="btn-copy" data-copy-text="${escAttr(copyText)}">Copy</button>
            </div>
            <div class="card-body">${bodyHtml}</div>
          </div>
        `;
      }

      html += '</div></div>';
      c.innerHTML = html;
    },
  },
  {
    id: 'copy-button',
    title: 'Copy Button States',
    category: 'Cards',
    description: 'Copy button in default and copied states.',
    render: (c) => {
      c.innerHTML = `
        <div style="display:flex;gap:16px;align-items:center">
          <button class="btn-copy">Copy</button>
          <button class="btn-copy copied" style="border-color:#2ed573;color:#2ed573">Copied!</button>
        </div>
      `;
    },
  },

  // ===== Meta =====
  {
    id: 'meta-info',
    title: 'Meta Info',
    category: 'Meta',
    description: 'Attempt count display, with and without fallback badge.',
    render: (c) => {
      c.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:12px">
          <div class="meta-info active" style="display:block">
            試行回数: 1
          </div>
          <div class="meta-info active" style="display:block">
            試行回数: 3 <span class="fallback-badge">FALLBACK</span>
          </div>
        </div>
      `;
    },
  },
  {
    id: 'gate-log',
    title: 'Gate Log',
    category: 'Meta',
    description: 'Quality Gate log in various scenarios: pass on first try, pass after retry, fallback.',
    render: (c) => {
      c.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:16px">
          <div class="gate-log active" style="display:block">
            <h3>Quality Gate ログ — Pass (attempt 1)</h3>
            <pre>${esc(GATE_LOG_SAMPLE.join('\n'))}</pre>
          </div>
          <div class="gate-log active" style="display:block">
            <h3>Quality Gate ログ — Pass after retry</h3>
            <pre>${esc(GATE_LOG_RETRY.join('\n'))}</pre>
          </div>
          <div class="gate-log active" style="display:block">
            <h3>Quality Gate ログ — Fallback</h3>
            <pre>${esc(GATE_LOG_FALLBACK.join('\n'))}</pre>
          </div>
        </div>
      `;
    },
  },
];
