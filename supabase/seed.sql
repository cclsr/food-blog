-- ============================================================
-- 小食粥记 · 示例数据（由 scripts/gen-seed.ts 自动生成，请勿手改）
-- 用法：先跑 schema.sql 建表，再把本文件粘进 Supabase SQL Editor 运行
-- ============================================================

truncate menu_items, menu_lists, photos, foods restart identity cascade;

-- 美食帖
insert into foods (slug, title, excerpt, cover, date, tags, body, ingredients, steps) values (
  'tonkotsu-ramen', '在家复刻一碗豚骨拉面', '熬了 6 小时的浓汤，泡面再也回不去了。', 'https://loremflickr.com/640/480/ramen?lock=11', '2026-05-28',
  ARRAY['日料', '汤面', '进阶']::text[], ARRAY['一直想在家做出店里那种乳白色的豚骨汤，这次终于成功了。关键是猪骨要先焯水去腥，然后大火滚煮——小火是熬不出奶白色的。', '面条用的是碱水面，劲道。配上溏心蛋、叉烧和海苔，端上桌的那一刻特别有成就感。']::text[], ARRAY['猪筒骨 1kg', '碱水面 2 人份', '鸡蛋 2 个', '叉烧若干', '海苔、葱花']::text[], ARRAY['猪骨冷水下锅焯水，撇去浮沫后洗净。', '换清水，大火滚煮 6 小时，中途补水。', '煮溏心蛋（沸水 6 分半），剥壳备用。', '面条煮 2 分钟，盛入碗中倒入热汤，码上配料即可。']::text[]
);
insert into foods (slug, title, excerpt, cover, date, tags, body, ingredients, steps) values (
  'tomato-egg', '番茄炒蛋的三个小秘密', '国民下饭菜，做好了能多吃两碗饭。', 'https://loremflickr.com/640/480/tomato?lock=22', '2026-05-20',
  ARRAY['家常菜', '快手', '新手友好']::text[], ARRAY['番茄炒蛋人人都会，但好吃的关键在细节：鸡蛋要嫩、番茄要出沙、一点点糖提鲜。', '我喜欢蛋先炒到七分熟盛出，最后再回锅，这样蛋始终是嫩的。']::text[], ARRAY['番茄 2 个', '鸡蛋 3 个', '糖 1 小勺', '盐适量', '葱花']::text[], ARRAY['鸡蛋打散加少许盐，热油快速滑炒至七分熟盛出。', '番茄切块下锅炒出红油和沙。', '加糖和盐调味，倒回鸡蛋翻炒均匀，撒葱花出锅。']::text[]
);
insert into foods (slug, title, excerpt, cover, date, tags, body, ingredients, steps) values (
  'tiramisu', '免烤箱提拉米苏', '周末甜点，冷藏一夜就能吃。', 'https://loremflickr.com/640/480/tiramisu?lock=33', '2026-05-12',
  ARRAY['烘焙', '甜点', '无需烤箱']::text[], ARRAY['不需要烤箱，只要会打发就能做。马斯卡彭一定要用好的，是灵魂。', '手指饼干蘸一下浓缩咖啡，别泡太久会散。冷藏一夜让它定型，第二天撒可可粉开吃。']::text[], ARRAY['马斯卡彭 250g', '手指饼干 1 包', '浓缩咖啡 200ml', '蛋黄 2 个', '可可粉']::text[], ARRAY['蛋黄加糖隔水打发至发白，拌入马斯卡彭。', '手指饼干蘸咖啡铺一层，抹一层芝士糊，重复。', '冷藏 6 小时以上，吃前筛可可粉。']::text[]
);
insert into foods (slug, title, excerpt, cover, date, tags, body, ingredients, steps) values (
  'street-bbq', '城东那家撸串小店探店', '烟火气十足，烤腰子一绝。', 'https://loremflickr.com/640/480/barbecue?lock=44', '2026-05-04',
  ARRAY['探店', '烧烤', '宵夜']::text[], ARRAY['朋友推荐的苍蝇馆子，藏在巷子里，晚上九点之后才是高峰。', '烤腰子嫩得没有一点腥味，孜然给得足。再来一扎啤酒，夏天的快乐不过如此。']::text[], NULL, NULL
);
insert into foods (slug, title, excerpt, cover, date, tags, body, ingredients, steps) values (
  'avocado-salad', '牛油果鸡胸沙拉', '健身餐也可以很好吃。', 'https://loremflickr.com/640/480/salad?lock=55', '2026-04-26',
  ARRAY['轻食', '沙拉', '健康']::text[], ARRAY['减脂期的救星。鸡胸用黑胡椒和柠檬腌一下煎，一点都不柴。', '牛油果、小番茄、玉米粒一拌，淋上油醋汁，清爽饱腹。']::text[], ARRAY['鸡胸肉 1 块', '牛油果 1 个', '小番茄、玉米粒', '柠檬、黑胡椒', '油醋汁']::text[], ARRAY['鸡胸用柠檬汁、黑胡椒腌 15 分钟，煎熟切片。', '所有蔬菜切好放碗里。', '铺上鸡胸，淋油醋汁拌匀。']::text[]
);
insert into foods (slug, title, excerpt, cover, date, tags, body, ingredients, steps) values (
  'soup-dumpling', '周末包了一笼小笼包', '皮薄馅大，咬开一口汤。', 'https://loremflickr.com/640/480/dumpling?lock=66', '2026-04-18',
  ARRAY['面点', '进阶', '周末']::text[], ARRAY['汤汁的秘密是皮冻——猪皮熬的冻拌进肉馅，蒸熟就化成汤。', '捏褶子手残了几个，但味道不打折。蘸点香醋姜丝，绝。']::text[], ARRAY['面粉 300g', '猪肉馅 250g', '皮冻 150g', '姜、葱', '香醋']::text[], ARRAY['面粉加温水和成光滑面团，醒 30 分钟。', '肉馅拌入剁碎的皮冻和调料。', '擀皮包馅捏褶，上锅大火蒸 8 分钟。']::text[]
);

-- 朋友菜单
with l as (
  insert into menu_lists (title, description, sort) values ('周末聚餐想吃的', '下次朋友来家里，从这里挑几道做。', 0) returning id
)
insert into menu_items (list_id, name, note, done, by_who, sort)
select l.id, v.name, v.note, v.done, v.by_who, v.sort from l,
(values
  ('麻辣香锅', '多放藕片和午餐肉', false, '小美', 0),
  ('可乐鸡翅', '上次很受欢迎', true, '我', 1),
  ('酸菜鱼', '买黑鱼片', false, '阿伟', 2),
  ('烤盘菜', '省事又热闹', false, '我', 3)
) as v(name, note, done, by_who, sort);

with l as (
  insert into menu_lists (title, description, sort) values ('想打卡的餐厅', '刷到的、朋友安利的，逐个去吃。', 1) returning id
)
insert into menu_items (list_id, name, note, done, by_who, sort)
select l.id, v.name, v.note, v.done, v.by_who, v.sort from l,
(values
  ('巷子口的潮汕牛肉火锅', NULL, true, '阿伟', 0),
  ('新开的那家云南菜', '据说菌子汤一绝', false, '小美', 1),
  ('城南日料 Omakase', '要提前订位', false, '我', 2)
) as v(name, note, done, by_who, sort);

-- 照片墙
insert into photos (src, caption, food_slug, sort) values ('https://loremflickr.com/640/480/ramen?lock=11', '六小时熬出的豚骨汤', 'tonkotsu-ramen', 0);
insert into photos (src, caption, food_slug, sort) values ('https://loremflickr.com/640/480/tiramisu?lock=33', '撒可可粉的瞬间', 'tiramisu', 1);
insert into photos (src, caption, food_slug, sort) values ('https://loremflickr.com/640/480/coffee?lock=71', '做甜点配的手冲', NULL, 2);
insert into photos (src, caption, food_slug, sort) values ('https://loremflickr.com/640/480/barbecue?lock=44', '烟火气满满的夜市', 'street-bbq', 3);
insert into photos (src, caption, food_slug, sort) values ('https://loremflickr.com/640/480/salad?lock=55', '清爽的健身餐', 'avocado-salad', 4);
insert into photos (src, caption, food_slug, sort) values ('https://loremflickr.com/640/480/dumpling?lock=66', '歪歪扭扭但好吃的褶子', 'soup-dumpling', 5);
insert into photos (src, caption, food_slug, sort) values ('https://loremflickr.com/640/480/noodle?lock=81', '深夜的一碗面', NULL, 6);
insert into photos (src, caption, food_slug, sort) values ('https://loremflickr.com/640/480/dessert?lock=91', '周末的甜品时间', NULL, 7);
insert into photos (src, caption, food_slug, sort) values ('https://loremflickr.com/640/480/tomato?lock=22', '番茄出沙的样子', 'tomato-egg', 8);
