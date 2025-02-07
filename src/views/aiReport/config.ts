//报告类型
export const REPORT_TYPE = {
  1: 'Pdf',
  2: 'PurePdf',
}

// 模式列表
export const MODE_LIST = [
  {
    id: 'yqfenxi',
    name: '舆情分析',
    icon: 'assay-icon',
  },
  {
    id: 'qdyanpan',
    name: '前端研判',
    icon: 'judge-icon',
  },
]

// 模型对参
export const PROMPT_PROP = {
  shijiangaishu: 'summaryPrompt',
  fengxiandengji: 'eventLevel',
  chuzhijianyi: 'advicePrompt',
  fengxianyujing: 'warningPrompt',
  lishichuli: 'casePrompt',
  shengchenganli: 'casePromptList',
  huiyingchuzhi: 'filePrompt',
  guanlianredian: 'searchPrompt',
}

// 影响力
export const EFFECT_PROP = {
  comment_report: '评论量',
  hot_report: '热度值',
  share_report: '传播量',
}

// 数据趋势label
export const ECHART_LABEL = {
  comment: '评论量',
  interact: '互动量',
  read: '阅读量',
  origin: '原创量',
  collect: '收藏量',
  share: '分享量',
  rank: '榜位值',
  hot: '热度值',
}

// 数据源zh
export const SOURCE_ZH = {
  weibo: '微博',
  baidu: '百度',
  douyin: '抖音',
  zhihu: '知乎',
  guangdong: '广东',
  pingshan: '坪山',
  shenzhen: '深圳',
  shanxi: '陕西',
  xian: '西安',
  xianyang: '咸阳',
  pengpai: '澎湃',
  toutiao: '头条',
  anliku: '案例库',
  chudian: '触电新闻app',
  dute: '读特新闻',
  jingbao: '晶报数字报',
  nandu: '南方都市报',
  nfhot: '南方都市报热点',
  nfplus: '南方plus',
  oe: '奥一网',
  psnews: '坪山新闻',
  szbbs: '深圳论坛',
  szhome: '深圳家园论坛',
  sznews: '深圳新闻',
  szplus: '深圳plus',
  szwz: '深圳问政',
  ysz: '壹深圳',
  rmbkps: '人民网必看(坪山)',
  rmbksz: '人民网必看(深圳)',
  bili: 'B站',
  fenghuang: '凤凰新闻',
  hk: '好看视频',
  jinyang: '金羊网',
  sohu: '搜狐',
  tieba: '贴吧',
  wangyi: '网易新闻',
  xigua: '西瓜视频',
  sina: '新浪新闻',
  pszy: '头条号坪山之眼',
  dyxc: '头条号第一现场',
}

// 模型type白名单
export const PROMPT_WHITE_TYPE = ['fengxiandengji', 'shengchenganli']
