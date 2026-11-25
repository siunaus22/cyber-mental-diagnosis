export interface MetricScores {
  stayUp: number;   // 熬夜指数
  abstract: number; // 抽象浓度
  slacking: number; // 摸鱼含金量
  overthink: number;// 内耗程度
}

export interface QuizOption {
  id: string;
  label: string;
  text: string;
  metrics: MetricScores;
  /** 可选：对特定诊断人格的额外亲和度加分 */
  affinity?: Partial<Record<DiagnosisId, number>>;
}

export interface QuizQuestion {
  id: number;
  code: string;
  category: string;
  question: string;
  options: QuizOption[];
}

export type DiagnosisId =
  | 'intermittent-ambition'
  | 'cyber-hamster'
  | 'high-functioning-introvert'
  | 'ddl-warlord'
  | 'early-retired'
  | 'pure-joker'
  | '2am-philosopher'
  | 'cyber-wooden-fish';

export interface DiagnosisType {
  id: DiagnosisId;
  title: string;
  shortName: string;
  icdCode: string; // 赛博 ICD 编码
  severity: string;
  summary: string;
  symptoms: string[];
  prescriptions: [string, string, string];
  bestBuddyId: DiagnosisId;
  buddyReason: string;
  /** 理想特征向量（0-100），用于匹配最契合的诊断结果 */
  idealProfile: MetricScores;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    code: 'Q01 // 02:00 AM',
    category: '睡眠节律检测',
    question: '凌晨两点十七分，你还没睡，此时你的手机屏幕大概率停留在：',
    options: [
      {
        id: '1A',
        label: 'A',
        text: '刚看完“10分钟学会剪辑/Python/英语”，并顺手塞进吃灰收藏夹',
        metrics: { stayUp: 16, abstract: 6, slacking: 8, overthink: 12 },
        affinity: { 'cyber-hamster': 18, 'intermittent-ambition': 10 },
      },
      {
        id: '1B',
        label: 'B',
        text: '在 B 站/小红书评论区跟网友激情对线，或围观抽象热梗',
        metrics: { stayUp: 15, abstract: 18, slacking: 10, overthink: 4 },
        affinity: { 'pure-joker': 16, 'cyber-wooden-fish': 10 },
      },
      {
        id: '1C',
        label: 'C',
        text: '复盘三年前某次公开社死现场，脚趾已经在地板抠出三室一厅',
        metrics: { stayUp: 18, abstract: 4, slacking: 4, overthink: 20 },
        affinity: { '2am-philosopher': 18, 'high-functioning-introvert': 10 },
      },
      {
        id: '1D',
        label: 'D',
        text: '已经睡了？不存在的，我正在和明早 8 点交的方案极限拉扯',
        metrics: { stayUp: 20, abstract: 8, slacking: 6, overthink: 10 },
        affinity: { 'ddl-warlord': 20 },
      },
    ],
  },
  {
    id: 2,
    code: 'Q02 // DDL ALERT',
    category: '压力应激反应',
    question: '距离作业/工作 DDL 还剩 48 小时，你的大脑运行状态是：',
    options: [
      {
        id: '2A',
        label: 'A',
        text: '时间还很充裕，先打两把游戏/刷会儿视频奖励一下准备开始的自己',
        metrics: { stayUp: 10, abstract: 10, slacking: 18, overthink: 6 },
        affinity: { 'ddl-warlord': 14, 'intermittent-ambition': 12 },
      },
      {
        id: '2B',
        label: 'B',
        text: '内心焦虑到胃痛，但身体像被焊在床上，一动不动刷了一下午手机',
        metrics: { stayUp: 12, abstract: 6, slacking: 12, overthink: 18 },
        affinity: { 'intermittent-ambition': 18, '2am-philosopher': 10 },
      },
      {
        id: '2C',
        label: 'C',
        text: '只要我把文档标题建好、字体调好，四舍五入就已经做完 80% 了',
        metrics: { stayUp: 8, abstract: 14, slacking: 16, overthink: 6 },
        affinity: { 'cyber-wooden-fish': 14, 'early-retired': 10 },
      },
      {
        id: '2D',
        label: 'D',
        text: '48 小时？太早了，我只在最后 3 小时开启肾上腺素暴走模式',
        metrics: { stayUp: 16, abstract: 12, slacking: 14, overthink: 4 },
        affinity: { 'ddl-warlord': 20 },
      },
    ],
  },
  {
    id: 3,
    code: 'Q03 // MSG: "在吗"',
    category: '社交信号响应',
    question: '微信/QQ 突然弹出一条没有下文的消息：“在吗？”，你的第一反应是：',
    options: [
      {
        id: '3A',
        label: 'A',
        text: '瞬间开启防空警报，长按不读，思考是不是自己哪里得罪人了',
        metrics: { stayUp: 6, abstract: 4, slacking: 6, overthink: 20 },
        affinity: { 'high-functioning-introvert': 18, '2am-philosopher': 10 },
      },
      {
        id: '3B',
        label: 'B',
        text: '假装没看见，等半小时后发个“刚在忙/刚睡醒，咋啦~”试探敌情',
        metrics: { stayUp: 4, abstract: 8, slacking: 14, overthink: 12 },
        affinity: { 'high-functioning-introvert': 12, 'early-retired': 10 },
      },
      {
        id: '3C',
        label: 'C',
        text: '直接甩过去一个“在的但取决于什么事.jpg”或抽象猫猫表情包',
        metrics: { stayUp: 4, abstract: 18, slacking: 10, overthink: 2 },
        affinity: { 'pure-joker': 16, 'cyber-wooden-fish': 12 },
      },
      {
        id: '3D',
        label: 'D',
        text: '内心：只要我不点开，这件事在量子力学上就没有发生过',
        metrics: { stayUp: 6, abstract: 12, slacking: 16, overthink: 8 },
        affinity: { 'early-retired': 16, 'cyber-wooden-fish': 10 },
      },
    ],
  },
  {
    id: 4,
    code: 'Q04 // FOOD DELIVERY',
    category: '决策能耗测试',
    question: '点外卖滑了整整 35 分钟手机，最后你大概率下单了什么？',
    options: [
      {
        id: '4A',
        label: 'A',
        text: '绕了一大圈，还是点回常吃的那家黄焖鸡/猪脚饭/麻辣烫',
        metrics: { stayUp: 4, abstract: 6, slacking: 10, overthink: 14 },
        affinity: { 'early-retired': 12, 'high-functioning-introvert': 10 },
      },
      {
        id: '4B',
        label: 'B',
        text: '被满减和凑单算到头晕，干脆怒吃一包泡面或直接睡了',
        metrics: { stayUp: 10, abstract: 10, slacking: 12, overthink: 14 },
        affinity: { 'intermittent-ambition': 12, '2am-philosopher': 10 },
      },
      {
        id: '4C',
        label: 'C',
        text: '选了一家名字很抽象的新店，抱着“不好吃就当买教训”的乐子心态',
        metrics: { stayUp: 6, abstract: 18, slacking: 8, overthink: 2 },
        affinity: { 'pure-joker': 18 },
      },
      {
        id: '4D',
        label: 'D',
        text: '边挑边把 5 家店都先加进“下次一定试试”的收藏夹里',
        metrics: { stayUp: 6, abstract: 8, slacking: 12, overthink: 10 },
        affinity: { 'cyber-hamster': 18 },
      },
    ],
  },
  {
    id: 5,
    code: 'Q05 // FAVORITES TAB',
    category: '数字囤积症候群',
    question: '打开你的 B 站收藏夹 / 浏览器书签，里面目前是什么生态？',
    options: [
      {
        id: '5A',
        label: 'A',
        text: '《从零开始的教程》《高分电影》《减脂餐合集》，收藏即学会',
        metrics: { stayUp: 10, abstract: 6, slacking: 10, overthink: 10 },
        affinity: { 'cyber-hamster': 22, 'intermittent-ambition': 10 },
      },
      {
        id: '5B',
        label: 'B',
        text: '全是发疯文学、鬼畜切片、猫猫发癫视频，精神食粮库',
        metrics: { stayUp: 10, abstract: 20, slacking: 12, overthink: 2 },
        affinity: { 'pure-joker': 16, 'cyber-wooden-fish': 14 },
      },
      {
        id: '5C',
        label: 'C',
        text: '空空如也或者乱成一锅粥，看完就划走，绝不留恋',
        metrics: { stayUp: 6, abstract: 8, slacking: 16, overthink: 4 },
        affinity: { 'early-retired': 18 },
      },
      {
        id: '5D',
        label: 'D',
        text: '深夜情感电台、心理自救指南、以及如何停止内耗的 100 个方法',
        metrics: { stayUp: 12, abstract: 4, slacking: 6, overthink: 20 },
        affinity: { '2am-philosopher': 18, 'high-functioning-introvert': 10 },
      },
    ],
  },
  {
    id: 6,
    code: 'Q06 // WORKPLACE / CLASS',
    category: '摸鱼含金量评估',
    question: '在工位或教室里，当老师/老板突然从背后经过时，你的肌肉记忆是：',
    options: [
      {
        id: '6A',
        label: 'A',
        text: '0.2 秒 Alt+Tab 切回代码/PPT/Excel，并顺手皱起眉头装作在思考',
        metrics: { stayUp: 4, abstract: 10, slacking: 20, overthink: 6 },
        affinity: { 'ddl-warlord': 12, 'cyber-wooden-fish': 12 },
      },
      {
        id: '6B',
        label: 'B',
        text: '其实在摸鱼，但吓得心跳飙到 140，事后复盘半小时“他刚才看到没”',
        metrics: { stayUp: 6, abstract: 6, slacking: 14, overthink: 18 },
        affinity: { 'high-functioning-introvert': 14, 'intermittent-ambition': 10 },
      },
      {
        id: '6C',
        label: 'C',
        text: '面不改色继续看，甚至想问他一句“这梗你觉得好笑吗”',
        metrics: { stayUp: 6, abstract: 18, slacking: 16, overthink: 0 },
        affinity: { 'pure-joker': 16, 'early-retired': 12 },
      },
      {
        id: '6D',
        label: 'D',
        text: '早就把电脑屏幕调成极低亮度+防窥膜，并在带薪拉屎中度过半小时',
        metrics: { stayUp: 4, abstract: 12, slacking: 22, overthink: 4 },
        affinity: { 'early-retired': 16, 'cyber-wooden-fish': 10 },
      },
    ],
  },
  {
    id: 7,
    code: 'Q07 // OFFLINE SOCIAL',
    category: '线下电量消耗率',
    question: '周末被迫参加一场 6 人以上的线下聚餐，你在饭局上的真实形态是：',
    options: [
      {
        id: '7A',
        label: 'A',
        text: '微笑点头专业户，唯一台词是“哈哈确实”、“谢谢老板/服务员”',
        metrics: { stayUp: 4, abstract: 6, slacking: 8, overthink: 16 },
        affinity: { 'high-functioning-introvert': 22 },
      },
      {
        id: '7B',
        label: 'B',
        text: '埋头干饭，灵魂已经出窍去想回家后要看什么剧',
        metrics: { stayUp: 6, abstract: 8, slacking: 16, overthink: 6 },
        affinity: { 'early-retired': 16, 'cyber-wooden-fish': 10 },
      },
      {
        id: '7C',
        label: 'C',
        text: '表面配合社交，暗中把在场每个人的发言记录成抽象素材',
        metrics: { stayUp: 6, abstract: 18, slacking: 10, overthink: 6 },
        affinity: { 'pure-joker': 18 },
      },
      {
        id: '7D',
        label: 'D',
        text: '散场回家的路上反复回味自己刚才哪句话是不是说得不够得体',
        metrics: { stayUp: 10, abstract: 4, slacking: 4, overthink: 22 },
        affinity: { '2am-philosopher': 16, 'high-functioning-introvert': 14 },
      },
    ],
  },
  {
    id: 8,
    code: 'Q08 // NEW YEAR PLAN',
    category: '间歇性励志周期',
    question: '每逢周一凌晨或月初，你立下“从明天起早睡早起/背单词/健身”的 Flag 后：',
    options: [
      {
        id: '8A',
        label: 'A',
        text: '当晚兴奋到 3 点才睡，第二天直接睡过头，Flag 顺延到下个月',
        metrics: { stayUp: 16, abstract: 10, slacking: 14, overthink: 12 },
        affinity: { 'intermittent-ambition': 22 },
      },
      {
        id: '8B',
        label: 'B',
        text: '先买齐装备、下载 5 个打卡 App、收藏 20 个教程，然后精疲力竭',
        metrics: { stayUp: 10, abstract: 8, slacking: 10, overthink: 12 },
        affinity: { 'cyber-hamster': 18, 'intermittent-ambition': 12 },
      },
      {
        id: '8C',
        label: 'C',
        text: '早就看透了，现在立 Flag 只立“今天也要顺利活下来”',
        metrics: { stayUp: 6, abstract: 12, slacking: 16, overthink: 4 },
        affinity: { 'early-retired': 18, 'cyber-wooden-fish': 12 },
      },
      {
        id: '8D',
        label: 'D',
        text: '平时不动如山，只有体检报告/成绩单快出来前突击三天',
        metrics: { stayUp: 14, abstract: 10, slacking: 14, overthink: 8 },
        affinity: { 'ddl-warlord': 18 },
      },
    ],
  },
  {
    id: 9,
    code: 'Q09 // MENTAL STABILITY',
    category: '精神稳定度抽检',
    question: '当你遇到一件极其离谱、让人血压飙升的破事时，你通常会：',
    options: [
      {
        id: '9A',
        label: 'A',
        text: '深吸一口气，打开赛博木鱼连敲 50 下：“算了，功德+1”',
        metrics: { stayUp: 4, abstract: 16, slacking: 12, overthink: 6 },
        affinity: { 'cyber-wooden-fish': 22 },
      },
      {
        id: '9B',
        label: 'B',
        text: '立刻截图发给 3 个好朋友，并配上长达 200 字的阴阳怪气解说',
        metrics: { stayUp: 6, abstract: 18, slacking: 10, overthink: 6 },
        affinity: { 'pure-joker': 16, 'high-functioning-introvert': 8 },
      },
      {
        id: '9C',
        label: 'C',
        text: '表面：“好的收到没问题！”，内心已把对方拉进黑名单 800 次',
        metrics: { stayUp: 8, abstract: 8, slacking: 10, overthink: 18 },
        affinity: { 'high-functioning-introvert': 14, '2am-philosopher': 12 },
      },
      {
        id: '9D',
        label: 'D',
        text: '“毁灭吧赶紧的”，然后该喝奶茶喝奶茶，天塌了有高个子顶着',
        metrics: { stayUp: 6, abstract: 12, slacking: 18, overthink: 2 },
        affinity: { 'early-retired': 18 },
      },
    ],
  },
  {
    id: 10,
    code: 'Q10 // FINAL CHECK',
    category: '2026 终极精神写照',
    question: '如果现在给你一张 2026 年“无限续杯”的电子愿望券，你最想兑换：',
    options: [
      {
        id: '10A',
        label: 'A',
        text: '每天睡够 8 小时且第二天精力充沛的超能力',
        metrics: { stayUp: 16, abstract: 4, slacking: 8, overthink: 12 },
        affinity: { '2am-philosopher': 12, 'ddl-warlord': 10, 'intermittent-ambition': 10 },
      },
      {
        id: '10B',
        label: 'B',
        text: '所有收藏夹里的技能自动下载并安装进大脑',
        metrics: { stayUp: 8, abstract: 10, slacking: 12, overthink: 8 },
        affinity: { 'cyber-hamster': 20 },
      },
      {
        id: '10C',
        label: 'C',
        text: '不用社交、不用内耗、银行卡自动每个月多一笔退休金',
        metrics: { stayUp: 4, abstract: 8, slacking: 18, overthink: 10 },
        affinity: { 'early-retired': 18, 'high-functioning-introvert': 12 },
      },
      {
        id: '10D',
        label: 'D',
        text: '永远能接住全网最新抽象热梗，并保持精神状态领先版本 3.0',
        metrics: { stayUp: 8, abstract: 20, slacking: 10, overthink: 2 },
        affinity: { 'pure-joker': 18, 'cyber-wooden-fish': 12 },
      },
    ],
  },
];

export const DIAGNOSIS_TYPES: Record<DiagnosisId, DiagnosisType> = {
  'intermittent-ambition': {
    id: 'intermittent-ambition',
    title: '间歇性踌躇满志，持续性混吃等死型',
    shortName: '踌躇混吃型',
    icdCode: 'CYB-2026-F40.4',
    severity: '临床表现：昼夜雄心勃勃 / 白天电量告急',
    summary:
      '你拥有全宇宙最宏伟的夜间人生规划，以及全人类最脆弱的晨间执行力。每到深夜 1 点就想重塑自我，醒来后只想原谅自己。',
    symptoms: [
      '备忘录里躺着 17 份《本月重启计划》',
      '在“我一定要卷死所有人”和“算了活着就行”之间无缝切换',
      '对自己的拖延深感愧疚，但愧疚完继续刷短视频',
    ],
    prescriptions: [
      '每日服用 20 分钟无脑猫猫视频，降低不必要的自我道德审判。',
      '禁止在凌晨两点做任何人生重大决定、下单健身卡或买网课。',
      '把今日目标从“改变世界”下调为“喝完这杯水就算成功”。',
    ],
    bestBuddyId: 'ddl-warlord',
    buddyReason: '他能用最后 3 小时的恐怖爆发力，帮你把拖延了三周的计划强行落地。',
    idealProfile: { stayUp: 76, abstract: 50, slacking: 78, overthink: 80 },
  },
  'cyber-hamster': {
    id: 'cyber-hamster',
    title: '赛博仓鼠（收藏夹吃灰十万个）型',
    shortName: '赛博仓鼠型',
    icdCode: 'CYB-2026-H88.0',
    severity: '临床表现：数字囤积癖 / 收藏即学会综合征',
    summary:
      '你的大脑认为只要点击了“收藏”和“稍后再看”，知识就已经通过光纤顺着指尖流进了海马体。你的收藏夹比多数人的大学课表还要充实。',
    symptoms: [
      '收藏夹分类精细到“干货/美食/剪辑/摸鱼/以后肯定用”',
      '看到“建议收藏”“干货预警”手指会自动条件反射',
      '真正需要用时，宁愿重新搜一遍也不想翻自己收藏夹',
    ],
    prescriptions: [
      '每周允许自己清空 3 个再也不会点开的教程，释放赛博仓鼠颊囊。',
      '默念三遍：“点过赞了就等于练过了，收藏了就等于掌握了”。',
      '把最想看的一个视频直接拖进桌面，别再让它沉入 999+ 的深海。',
    ],
    bestBuddyId: 'early-retired',
    buddyReason: '他会用毫无波澜的松弛感告诉你：那些教程不看也不会怎样。',
    idealProfile: { stayUp: 68, abstract: 48, slacking: 64, overthink: 66 },
  },
  'high-functioning-introvert': {
    id: 'high-functioning-introvert',
    title: '高功能社恐（线上重拳出击，线下谢谢老板）型',
    shortName: '高功能社恐型',
    icdCode: 'CYB-2026-S10.1',
    severity: '临床表现：键盘社交王者 / 现实电量 5%',
    summary:
      '在群聊和评论区你是妙语连珠的互联网嘴替，一旦走进电梯遇见熟人，瞬间丧失语言系统，只剩礼貌微笑与“哈哈是的”。',
    symptoms: [
      '发一段 30 字微信前要反复删改并检查标点符号情绪',
      '听到门外有邻居动静会先站在玄关等 30 秒再出门',
      '每次被迫寒暄后需要独自躺平 2 小时回血',
    ],
    prescriptions: [
      '社交后出现电量告急属正常生理反应，请立即回家戴上降噪耳机。',
      '记住黄金法则：其实别人 5 分钟后就忘了你刚才那句话。',
      '每日允许自己合法已读不回 2 条非紧急“在吗”消息。',
    ],
    bestBuddyId: 'pure-joker',
    buddyReason: '他能替你在饭局上接住所有尴尬冷场，你只需要在旁边安心干饭。',
    idealProfile: { stayUp: 52, abstract: 46, slacking: 58, overthink: 88 },
  },
  'ddl-warlord': {
    id: 'ddl-warlord',
    title: 'DDL 极限反杀战神型',
    shortName: 'DDL 战神型',
    icdCode: 'CYB-2026-D99.9',
    severity: '临床表现：平时稳如老狗 / 终局肾上腺素狂飙',
    summary:
      '常规时间里你的生产力接近于零，但只要距离截止时间不足 3 小时，你的大脑会自动超频 300%，双手在键盘上敲出残影。',
    symptoms: [
      '没有压力就无法开机，越临近交稿思路越清晰',
      '深刻理解“23:59 提交”和“00:00 提交”在宇宙尺度上的区别',
      '每次交完都发誓下次一定提前做，然后下次继续卡点绝杀',
    ],
    prescriptions: [
      '请在日历里给自己多设一个“虚假 DDL”，虽然大概率骗不过自己。',
      '极限冲刺期间请勿只靠冰美式续命，记得补充真实碳水。',
      '交完作业后立刻奖励自己一顿好的，别马上陷入空虚。',
    ],
    bestBuddyId: 'intermittent-ambition',
    buddyReason: '你们俩凑在一起，一个负责画大饼，一个负责最后三小时把它烙出来。',
    idealProfile: { stayUp: 88, abstract: 60, slacking: 76, overthink: 44 },
  },
  'early-retired': {
    id: 'early-retired',
    title: '精神已提前退休型',
    shortName: '提前退休型',
    icdCode: 'CYB-2026-R65.0',
    severity: '临床表现：年纪轻轻心态 60 岁 / 情绪稳如磐石',
    summary:
      '肉体还在上学或打工，但灵魂早已拎着保温杯在公园遛弯。面对画大饼和内卷，你的内心毫无波澜，甚至想问食堂今天吃什么。',
    symptoms: [
      '口头禅是“都行”“随便”“问题不大”“到点下班”',
      '对一切突发奇想的加班/团建免疫，情绪稳定得像台老式冰箱',
      '周末最大的娱乐项目是晒太阳、散步和什么都不干',
    ],
    prescriptions: [
      '继续保持这份珍贵的松弛感，你是身边内耗朋友们的定海神针。',
      '偶尔也可以为一件微不足道的小事（比如限定甜品）小小兴奋一下。',
      '注意别在摸鱼时过于安详，容易被误认为已经睡着。',
    ],
    bestBuddyId: '2am-philosopher',
    buddyReason: '当他凌晨两点疯狂内耗的时候，只有你能一句“多大点事，睡吧”直接治好他。',
    idealProfile: { stayUp: 40, abstract: 56, slacking: 90, overthink: 28 },
  },
  'pure-joker': {
    id: 'pure-joker',
    title: '纯度 99% 乐子人型',
    shortName: '纯度乐子人',
    icdCode: 'CYB-2026-J00.7',
    severity: '临床表现：万物皆可成梗 / 赛博瓜田常驻居民',
    summary:
      '世界是一场巨大的草台班子，而你是前排自带瓜子和高清截屏仪的 VIP 观众。再离谱的遭遇，经过你的大脑都能在 5 秒内转换成地狱笑话。',
    symptoms: [
      '聊天记录里表情包数量远超文字，没图不会说话',
      '遇到倒霉事第一反应不是哭，而是“这不发个朋友圈太可惜了”',
      '对互联网热梗的响应速度堪比 5G 基站',
    ],
    prescriptions: [
      '切勿把所有严肃对话都用抽象表情包回复，容易挨打。',
      '每日保持 15 分钟严肃阅读，防止大脑彻底格式化成梗百科。',
      '继续把快乐传染给周围的低电量人类，你是赛博世界的小太阳。',
    ],
    bestBuddyId: 'high-functioning-introvert',
    buddyReason: '你负责在前面输出一万个笑话，他负责在旁边安静鼓掌并给你点外卖。',
    idealProfile: { stayUp: 62, abstract: 95, slacking: 68, overthink: 22 },
  },
  '2am-philosopher': {
    id: '2am-philosopher',
    title: '凌晨两点哲学家（兼职自我反省大师）型',
    shortName: '两点哲学家',
    icdCode: 'CYB-2026-P02.0',
    severity: '临床表现：夜间大脑过载 / 往事高清回放',
    summary:
      '白天看起来平平无奇，一到凌晨两点准时开启宇宙终极追问与历史尴尬瞬间 4K 重制版。你的内耗功率足以点亮半个小区。',
    symptoms: [
      '能精准记起 2019 年自己说错的一句废话并持续懊恼',
      '别人回复慢了 10 分钟，大脑已经演完 8 集《他是不是讨厌我》',
      '明明什么都没干，但每天都觉得自己好累',
    ],
    prescriptions: [
      '物理隔离疗法：凌晨 1 点准时把手机扔到手臂够不到的地方。',
      '记住“99% 的内耗都是大脑在无聊时自己编的恐怖片”。',
      '如果实在睡不着，不如起来喝口温水，别在被窝里审讯自己。',
    ],
    bestBuddyId: 'early-retired',
    buddyReason: '他自带“没关系无所谓”钝感力光环，能帮你把 80% 的精神内耗直接屏蔽。',
    idealProfile: { stayUp: 90, abstract: 38, slacking: 46, overthink: 96 },
  },
  'cyber-wooden-fish': {
    id: 'cyber-wooden-fish',
    title: '赛博木鱼敲击手（功德与发疯并存）型',
    shortName: '赛博木鱼手',
    icdCode: 'CYB-2026-M77.7',
    severity: '临床表现：精神美丽 / 间歇性赛博超度',
    summary:
      '你已经在发疯和悟道之间找到了完美的动态平衡。一边在心里默念“退退退”，一边敲着电子木鱼积攒功德，用幽默感给苦涩生活做赛博超度。',
    symptoms: [
      '手机里常备“电子木鱼 / 好运喷雾 / 禁止焦绿”壁纸',
      '遇到奇葩先笑出声，然后慈悲地祝对方身体健康',
      '精神状态介于“随时准备发疯”和“已看破红尘”之间',
    ],
    prescriptions: [
      '今日份电子功德已达标，可以停止继续看抽象新闻了。',
      '把发疯的能量分 10% 给现实生活，去吃顿好吃的碳水。',
      '保持“允许一切发生”的禅意，但记得顺手关掉闹钟前的最后一个弹窗。',
    ],
    bestBuddyId: 'cyber-hamster',
    buddyReason: '他囤了一万个好东西，你负责帮他挑选并给他的焦虑敲木鱼超度。',
    idealProfile: { stayUp: 60, abstract: 82, slacking: 78, overthink: 48 },
  },
};

export interface DiagnosisResult {
  patientId: string;
  diagnosedAt: string;
  diagnosis: DiagnosisType;
  buddy: DiagnosisType;
  metrics: MetricScores;
  answerIds: string[];
}

function clampMetric(val: number, min = 12, max = 98): number {
  return Math.max(min, Math.min(max, Math.round(val)));
}

export function generatePatientId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 6; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `CYB-26-${suffix}`;
}

export function formatDiagnosisTime(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
}

export function calculateDiagnosis(selectedOptions: QuizOption[]): DiagnosisResult {
  const raw: MetricScores = { stayUp: 0, abstract: 0, slacking: 0, overthink: 0 };
  const affinityScores: Record<DiagnosisId, number> = {
    'intermittent-ambition': 0,
    'cyber-hamster': 0,
    'high-functioning-introvert': 0,
    'ddl-warlord': 0,
    'early-retired': 0,
    'pure-joker': 0,
    '2am-philosopher': 0,
    'cyber-wooden-fish': 0,
  };

  for (const opt of selectedOptions) {
    raw.stayUp += opt.metrics.stayUp;
    raw.abstract += opt.metrics.abstract;
    raw.slacking += opt.metrics.slacking;
    raw.overthink += opt.metrics.overthink;
    if (opt.affinity) {
      for (const [key, bonus] of Object.entries(opt.affinity)) {
        affinityScores[key as DiagnosisId] += bonus ?? 0;
      }
    }
  }

  // 归一化到 15 - 98 区间，避免出现全 0 或全 100
  const metrics: MetricScores = {
    stayUp: clampMetric((raw.stayUp / 145) * 85 + 12),
    abstract: clampMetric((raw.abstract / 155) * 85 + 12),
    slacking: clampMetric((raw.slacking / 155) * 85 + 12),
    overthink: clampMetric((raw.overthink / 155) * 85 + 10),
  };

  // 综合“亲和度加分”与“四维向量匹配度”选择最佳诊断类型
  let bestId: DiagnosisId = 'intermittent-ambition';
  let bestScore = -Infinity;

  for (const type of Object.values(DIAGNOSIS_TYPES)) {
    const dist =
      Math.abs(metrics.stayUp - type.idealProfile.stayUp) +
      Math.abs(metrics.abstract - type.idealProfile.abstract) +
      Math.abs(metrics.slacking - type.idealProfile.slacking) +
      Math.abs(metrics.overthink - type.idealProfile.overthink);
    const profileScore = 100 - dist * 0.35;
    const totalScore = affinityScores[type.id] * 1.45 + profileScore;
    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestId = type.id;
    }
  }

  const diagnosis = DIAGNOSIS_TYPES[bestId];
  const buddy = DIAGNOSIS_TYPES[diagnosis.bestBuddyId];

  return {
    patientId: generatePatientId(),
    diagnosedAt: formatDiagnosisTime(),
    diagnosis,
    buddy,
    metrics,
    answerIds: selectedOptions.map((o) => o.id),
  };
}
