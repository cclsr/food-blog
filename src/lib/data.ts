// ⚠️ 第 2 步用的假数据（mock data）。
// 第 3 步会把这些换成 Supabase 数据库里的真实内容，页面代码基本不用改。

export type Food = {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  date: string;
  tags: string[];
  body: string[];
  ingredients?: string[];
  steps?: string[];
};

export type MenuItem = {
  name: string;
  note?: string;
  done: boolean;
  by: string; // 谁加的
};

export type MenuList = {
  title: string;
  desc: string;
  items: MenuItem[];
};

export type Photo = {
  src: string;
  caption: string;
  foodSlug?: string; // 关联到某篇美食帖
};

// 用 loremflickr 拿真实的美食图片（mockup 用），seed 固定保证每次一样
const img = (keyword: string, lock: number) =>
  `https://loremflickr.com/640/480/${keyword}?lock=${lock}`;

export const foods: Food[] = [
  {
    slug: "tonkotsu-ramen",
    title: "在家复刻一碗豚骨拉面",
    excerpt: "熬了 6 小时的浓汤，泡面再也回不去了。",
    cover: img("ramen", 11),
    date: "2026-05-28",
    tags: ["日料", "汤面", "进阶"],
    body: [
      "一直想在家做出店里那种乳白色的豚骨汤，这次终于成功了。关键是猪骨要先焯水去腥，然后大火滚煮——小火是熬不出奶白色的。",
      "面条用的是碱水面，劲道。配上溏心蛋、叉烧和海苔，端上桌的那一刻特别有成就感。",
    ],
    ingredients: ["猪筒骨 1kg", "碱水面 2 人份", "鸡蛋 2 个", "叉烧若干", "海苔、葱花"],
    steps: [
      "猪骨冷水下锅焯水，撇去浮沫后洗净。",
      "换清水，大火滚煮 6 小时，中途补水。",
      "煮溏心蛋（沸水 6 分半），剥壳备用。",
      "面条煮 2 分钟，盛入碗中倒入热汤，码上配料即可。",
    ],
  },
  {
    slug: "tomato-egg",
    title: "番茄炒蛋的三个小秘密",
    excerpt: "国民下饭菜，做好了能多吃两碗饭。",
    cover: img("tomato", 22),
    date: "2026-05-20",
    tags: ["家常菜", "快手", "新手友好"],
    body: [
      "番茄炒蛋人人都会，但好吃的关键在细节：鸡蛋要嫩、番茄要出沙、一点点糖提鲜。",
      "我喜欢蛋先炒到七分熟盛出，最后再回锅，这样蛋始终是嫩的。",
    ],
    ingredients: ["番茄 2 个", "鸡蛋 3 个", "糖 1 小勺", "盐适量", "葱花"],
    steps: [
      "鸡蛋打散加少许盐，热油快速滑炒至七分熟盛出。",
      "番茄切块下锅炒出红油和沙。",
      "加糖和盐调味，倒回鸡蛋翻炒均匀，撒葱花出锅。",
    ],
  },
  {
    slug: "tiramisu",
    title: "免烤箱提拉米苏",
    excerpt: "周末甜点，冷藏一夜就能吃。",
    cover: img("tiramisu", 33),
    date: "2026-05-12",
    tags: ["烘焙", "甜点", "无需烤箱"],
    body: [
      "不需要烤箱，只要会打发就能做。马斯卡彭一定要用好的，是灵魂。",
      "手指饼干蘸一下浓缩咖啡，别泡太久会散。冷藏一夜让它定型，第二天撒可可粉开吃。",
    ],
    ingredients: ["马斯卡彭 250g", "手指饼干 1 包", "浓缩咖啡 200ml", "蛋黄 2 个", "可可粉"],
    steps: [
      "蛋黄加糖隔水打发至发白，拌入马斯卡彭。",
      "手指饼干蘸咖啡铺一层，抹一层芝士糊，重复。",
      "冷藏 6 小时以上，吃前筛可可粉。",
    ],
  },
  {
    slug: "street-bbq",
    title: "城东那家撸串小店探店",
    excerpt: "烟火气十足，烤腰子一绝。",
    cover: img("barbecue", 44),
    date: "2026-05-04",
    tags: ["探店", "烧烤", "宵夜"],
    body: [
      "朋友推荐的苍蝇馆子，藏在巷子里，晚上九点之后才是高峰。",
      "烤腰子嫩得没有一点腥味，孜然给得足。再来一扎啤酒，夏天的快乐不过如此。",
    ],
  },
  {
    slug: "avocado-salad",
    title: "牛油果鸡胸沙拉",
    excerpt: "健身餐也可以很好吃。",
    cover: img("salad", 55),
    date: "2026-04-26",
    tags: ["轻食", "沙拉", "健康"],
    body: [
      "减脂期的救星。鸡胸用黑胡椒和柠檬腌一下煎，一点都不柴。",
      "牛油果、小番茄、玉米粒一拌，淋上油醋汁，清爽饱腹。",
    ],
    ingredients: ["鸡胸肉 1 块", "牛油果 1 个", "小番茄、玉米粒", "柠檬、黑胡椒", "油醋汁"],
    steps: [
      "鸡胸用柠檬汁、黑胡椒腌 15 分钟，煎熟切片。",
      "所有蔬菜切好放碗里。",
      "铺上鸡胸，淋油醋汁拌匀。",
    ],
  },
  {
    slug: "soup-dumpling",
    title: "周末包了一笼小笼包",
    excerpt: "皮薄馅大，咬开一口汤。",
    cover: img("dumpling", 66),
    date: "2026-04-18",
    tags: ["面点", "进阶", "周末"],
    body: [
      "汤汁的秘密是皮冻——猪皮熬的冻拌进肉馅，蒸熟就化成汤。",
      "捏褶子手残了几个，但味道不打折。蘸点香醋姜丝，绝。",
    ],
    ingredients: ["面粉 300g", "猪肉馅 250g", "皮冻 150g", "姜、葱", "香醋"],
    steps: [
      "面粉加温水和成光滑面团，醒 30 分钟。",
      "肉馅拌入剁碎的皮冻和调料。",
      "擀皮包馅捏褶，上锅大火蒸 8 分钟。",
    ],
  },
];

export const menuLists: MenuList[] = [
  {
    title: "周末聚餐想吃的",
    desc: "下次朋友来家里，从这里挑几道做。",
    items: [
      { name: "麻辣香锅", note: "多放藕片和午餐肉", done: false, by: "小美" },
      { name: "可乐鸡翅", note: "上次很受欢迎", done: true, by: "我" },
      { name: "酸菜鱼", note: "买黑鱼片", done: false, by: "阿伟" },
      { name: "烤盘菜", note: "省事又热闹", done: false, by: "我" },
    ],
  },
  {
    title: "想打卡的餐厅",
    desc: "刷到的、朋友安利的，逐个去吃。",
    items: [
      { name: "巷子口的潮汕牛肉火锅", done: true, by: "阿伟" },
      { name: "新开的那家云南菜", note: "据说菌子汤一绝", done: false, by: "小美" },
      { name: "城南日料 Omakase", note: "要提前订位", done: false, by: "我" },
    ],
  },
];

export const photos: Photo[] = [
  { src: img("ramen", 11), caption: "六小时熬出的豚骨汤", foodSlug: "tonkotsu-ramen" },
  { src: img("tiramisu", 33), caption: "撒可可粉的瞬间", foodSlug: "tiramisu" },
  { src: img("coffee", 71), caption: "做甜点配的手冲" },
  { src: img("barbecue", 44), caption: "烟火气满满的夜市", foodSlug: "street-bbq" },
  { src: img("salad", 55), caption: "清爽的健身餐", foodSlug: "avocado-salad" },
  { src: img("dumpling", 66), caption: "歪歪扭扭但好吃的褶子", foodSlug: "soup-dumpling" },
  { src: img("noodle", 81), caption: "深夜的一碗面" },
  { src: img("dessert", 91), caption: "周末的甜品时间" },
  { src: img("tomato", 22), caption: "番茄出沙的样子", foodSlug: "tomato-egg" },
];
