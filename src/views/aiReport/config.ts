export const PROMPT_URL = 'http://47.100.50.180:80/get_report'

// 模式列表
export const MODE_LIST = [
  {
    id: '1',
    name: '前端研判',
    icon: 'judge-icon',
  },
  {
    id: '2',
    name: '舆情分析',
    icon: 'assay-icon',
  },
]

export const MODE_PROP = {
  1: 'qdyanpan',
  2: 'yqfenxi',
}

// 模型对参
export const PROMPT_PROP = {
  shijiangaishu: 'summaryPrompt',
  fengxiandengji: 'eventLevel',
  chuzhijianyi: 'advicePrompt',
  fengxianyujing: 'warningPrompt',
  lishichuli: 'casePrompt',
  huiyingchuzhi: 'filePrompt',
  guanlianredian: 'searchPrompt',
}

export const EFFECT_PROP = {
  comment_report: '评论量',
  hot_report: '热度值',
  share_report: '传播量',
}

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
}
