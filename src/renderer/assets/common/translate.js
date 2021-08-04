let key = '吖哎安肮凹八挀扳邦勹陂奔伻皀边灬憋汃冫癶峬嚓偲参仓撡冊嵾噌叉犲辿伥抄车抻阷吃充抽出膗巛刅吹旾踔呲从凑粗汆镩蹿崔邨搓咑呆丹当刀恴揼灯仾嗲敁刁爹丁丟东吺剢耑叾吨多妸奀鞥仒发帆匚飞分丰覅仏垺夫旮侅干冈皋戈给根更工勾估瓜乖关光归丨呙妎咍兯夯茠诃黒拫亨乊叿齁乎花怀欢巟灰昏吙丌加戋江艽阶巾坕冂丩凥姢噘军咔开刊忼尻匼肎劥空廤扝夸蒯宽匡亏坤扩垃来兰啷捞仂雷塄唎俩嫾簗蹽咧厸伶溜咯龙娄噜驴孪掠抡捋嘸妈埋颟牤猫庅呅椚掹踎宀喵乜民名谬摸哞某母拏腉囡囔孬疒娞嫩莻妮拈娘鸟捏脌宁妞农羺奴女疟奻硸噢妑拍眅乓抛呸喷匉丕片剽氕姘乒钋剖仆七掐千呛悄切亲靑宆丘区峑炔夋亽呥穣荛惹人扔日戎厹嶿堧桵闰挼仨毢三桒掻色杀筛山伤弰奢申升尸収书刷衰闩双谁妁厶忪凁苏狻夊孙唆他囼坍汤仐忑膯剔天旫怗厅囲偷凸湍推吞乇屲歪乛尣危塭翁挝乌夕呷仙乡灱些忄兴凶休戌吅疶坃丫咽央幺倻膶一乚应哟佣优扜囦曰蒀帀災兂牂傮啫贼怎曽吒夈沾张佋蜇贞凧之中州朱抓拽专妆隹宒卓仔孖宗邹租劗厜尊昨'.split('');
let pinyin = 'AAiAnAngAoBaBaiBanBangBaoBeiBenBengBiBianBiaoBieBinBingBoBuCaCaiCanCangCaoCeCenCengChaChaiChanChangChaoCheChenChengChiChongChouChuChuaiChuanChuangChuiChunChuoCiCongCouCuCuanChuanCuanCuiCunCuoDaDaiDanDangDaoDeDenDengDiDiaDianDiaoDieDingDiuDongDouDuDuanDuiDunDuoEEnEngErFaFanFangFeiFenFengFiaoFoFouFuGaGaiGanGangGaoGeGeiGenGengGongGouGuGuaGuaiGuanGuangGuiGunGuoHaHaiHanHangHaoHeHeiHenHengHoHongHouHuHuaHuaiHuanHuangHuiHunHuoJiJiaJianJiangJiaoJieJinJingJiongJiuJuJuanJueJunKaKaiKanKangKaoKeKenKengKongKouKuKuaKuaiKuanKuangKuiKunKuoLaLaiLanLangLaoLeLeiLengLiLiaLianLiangLiaoLieLinLingLiuLoLongLouLuLvLuanLveLunLuoMMaMaiManMangMaoMeMeiMenMengMiMianMiaoMieMinMingMiuMoMouMeiMuNaNaiNanNangNaoNeNeiNenNNiNianNiangNiaoNieNinNingNiuNongNouNuNvNveNuanNuoOuPaPaiPanPangPaoPeiPenPengPiPianPiaoPiePinPingPoPouPuQiQiaQianQiangQiaoQieQinQingQiongQiuQuQuanQueQunRaRanRangRaoReRenRengRiRongRouRuRuanRuiRunRuoSaSaiSanSangSaoSeShaShaiShanShangShaoSheShenShengShiShouShuShuaShuaiShuanShuangShuiShuoSiSongSouSuSuanSuiSunSuoTaTaiTanTangTaoTeTengTiTianTiaoTieTingTongTouTuTuanTuiTunTuoWaWaiWanWangWeiWenWengWoWuXiXiaXianXiangXiaoXieXinXingXiongXiuXuXuanXueXunYaYanYangYaoYeYenYiYinYingYoYongYouYuYuanYueYunZaZaiZanZangZaoZeZeiZenZengZhaZhaiZhanZhangZhaoZheZhenZhengZhiZhongZhouZhuZhuaZhuaiZhuanZhuangZhuiZhunZhuoZaiZiZongZouZuZuanZuiZunZuo'.split(/(?=[A-Z])/g);
let cache = {};
let keyLen = key.length - 1;
let creg = /[\u4e00-\u9fa5]/;
let translate = word => {
  if (word.length > 1) {
    let ret = '';
    for (let i = 0; i < word.length; i++) {
      ret += translate(word[i]);
      if (i < word.length - 1) {
        ret += ',';
      }
    }
    return ret;
  }

  if (!creg.test(word)) {
    return word;
  }

  if (cache.hasOwnProperty(word)) {
    return cache[word];
  }
  let begin = 0;
  let end = keyLen;
  while (begin <= end) {
    let middle = Math.floor((begin + end) / 2);
    if (word.localeCompare(key[middle], 'zh-CN') < 0) {
      end = middle - 1;
    } else {
      begin = middle + 1;
    }
  }
  return (cache[word] = (pinyin[end] || '').toLowerCase());
};
export default translate;
