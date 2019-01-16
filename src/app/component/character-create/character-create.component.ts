import { Component, OnInit } from '@angular/core';
import { CharacterCreateService } from '../../Service/character-create.service';
import { Convert, Chara, Setting, Character, Skill,
      Behavior, Status, BaseStatus, FluctuationStatus,
      Items, Item, Weapon, Profile } from '../../model/character-info-model';

@Component({
  selector: 'app-character-create',
  templateUrl: './character-create.component.html',
  styleUrls: ['./character-create.component.css']
})
export class CharacterCreateComponent implements OnInit {
  private roll = '';
  private race = '';
  private name = '';
  private gender = '';
  private job = '';

  private str = '3D6';
  private con = '3D6';
  private pow = '3D6';
  private dex = '3D6';
  private app = '3D6';
  private siz = '2D6+6';
  private int = '2D6+6';
  private edu = '3D6+3';
  private income = '3D6';

  private SAN = 'pow*5';
  private luck = 'pow*5';
  private idea = 'int*5';
  private knowledge = 'edu*5';
  private health = '(con+size)/2';
  private mp = 'pow';
  private VocationalSkill = 'edu*20';
  private HobbySkill = 'int*10';
  private DamegeBonus = '';

  private Career = '';
  private Encounter = '';

  private strstock;
  private constock;
  private powstock;
  private dexstock;
  private appstock;
  private sizstock;
  private intstock;
  private edustock;
  private incomestock;

  private filename = 'octpot.json';


  private combats;
  private searchs;
  private behaviors;
  private negotiations;
  private knowledges;
  private wepons;
  private items;

  // Setting
  private stype;
  private srace;
  private sjob;
  private simages;
  // Setting.character
  private cname;
  private cgender;
  private cheight;
  private cweight;
  private cbirthplace;
  private chairColor;
  private ceyeColor;
  // Status
  // Status.basestatus
  private bstr;
  private bcon;
  private bpow;
  private bdex;
  private bsiz;
  private bapp;
  private bint;
  private bedu;
  private bincome_and_property;
  // Status.flutuationStatus
  private fsan;
  private fluck;
  private fidea;
  private fknowledge;
  private fhealth;
  private fmp;
  private fVocationalSkill;
  private fHobbySkill;
  private fDamegeBonus;
  // Status.reDice
  private diceStr = 3;
  private diceCon = 3;
  private dicePow = 3;
  private diceDex = 3;
  private diceApp = 3;
  private diceSiz = 3;
  private diceInt = 3;
  private diceEdu = 3;
  private diceIncome_and_property = 3;
  // Skill
  // profile
  private pCareer;
  private pEncounter;
  private pOtherMemo;

  private combatList;  // 戦闘技能の配列
  private searchList; // 探索技能の配列
  private behaviorList; // 行動技能の配列
  private negotiationList; // 交渉技能の配列
  private knowledgeList; // 知識技能の配列
  private weponList = []; // 所持品(武具)の配列
  private itemslist = [];  // 所持品(item)の配列

  // スキルポイント合計
  private combatPointAll = 0;
  private searchPointAll = 0;
  private behaviorPointAll = 0;
  private negotiationPointAll = 0;
  private knowledgePointAll = 0;

  constructor(private characre: CharacterCreateService) {
    this.generateCombatskillFrame();
    this.generateSearchskillFrame();
    this.generateBehaviorskillFrame();
    this.generateNegotiationskillFrame();
    this.generateKnowledgeskillFrame();
    this.generateWeponFrame();
    this.generateItemFrame();
  }


  throwDice(dicename) {
    let throwing = function(times, num, plus) {  // さいころ処理 times:回数 num:ダイスの面数 plus:あとで足す分
      let result = 0;  // ダイス合計
      function getRandomIntInclusive(max) {
        let min = Math.ceil(1);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      for (let i = 0; i < times; i++ ) {
        let res = getRandomIntInclusive(num);
        result += res;
      }
      result += dicePlus;
      return result;
    };

    let diceNum = 0;  // x面ダイス
    let diceTimes = 0;  // x回振る
    let dicePlus = 0;  // xプラス

    switch (dicename) {
      case 'str' :
        diceNum = 6;
        diceTimes = 3;
        break;

      case 'con' :
        diceNum = 6;
        diceTimes = 3;
        break;

      case 'pow' :
        diceNum = 6;
        diceTimes = 3;
        break;

      case 'dex' :
        diceNum = 6;
        diceTimes = 3;
        break;

      case 'app' :
        diceNum = 6;
        diceTimes = 3;
        break;

      case 'siz' :
        diceNum = 6;
        diceTimes = 2;
        dicePlus = 6;
        break;

      case 'int' :
        diceNum = 6;
        diceTimes = 2;
        dicePlus = 6;
        break;

      case 'edu' :
        diceNum = 6;
        diceTimes = 3;
        dicePlus = 3;
        break;

      case 'income' :
        diceNum = 6;
        diceTimes = 3;
        break;

      case 'allDice' :
        this.throwDice('str');
        this.throwDice('con');
        this.throwDice('pow');
        this.throwDice('dex');
        this.throwDice('app');
        this.throwDice('siz');
        this.throwDice('int');
        this.throwDice('edu');
        this.throwDice('income');
        break;
    }

    // ダイスを振って各項目に入れる
    if (!(dicename === 'allDice')) {
      let result = throwing(diceTimes, diceNum, dicePlus);
      switch (dicename) {
        case 'str' :
          this.bstr = result;
          break;

        case 'con' :
          this.bcon = result;
          if (this.bsiz) {
            this.fhealth = (this.bsiz + result) / 2;
          }
          break;

        case 'pow' :
          this.bpow = result;
          this.fsan = result * 5;
          this.fluck = result * 5;
          this.fmp = result;
          break;

        case 'dex' :
          this.bdex = result;
          break;

        case 'app' :
          this.bapp = result;
          break;

        case 'siz' :
          this.bsiz = result;
          if (this.bcon) {
            this.fhealth = Math.round((this.bcon + result) / 2);
          }
          break;

        case 'int' :
          this.bint = result;
          this.fidea = result * 5;
          this.fHobbySkill = result * 10;
          break;

        case 'edu' :
          this.bedu = result;
          this.fknowledge = result * 5;
          this.fVocationalSkill = result * 20;
          break;

        case 'income' :
          this.bincome_and_property = result;
          break;
      }
    }
  }

  // 戦闘技能枠の作成
  generateCombatskillFrame() {
    this.combatList = [
      {
        'skillName': '回避',
        'initialValue': 0,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': 'キック',
        'initialValue': 25,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '組付き',
        'initialValue': 25,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': 'こぶし（パンチ）',
        'initialValue': 50,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '頭突き',
        'initialValue': 10,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '投擲',
        'initialValue': 25,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': 'マーシャルアーツ',
        'initialValue': 1,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '拳銃',
        'initialValue': 20,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': 'サブマシンガン',
        'initialValue': 15,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': 'ショットガン',
        'initialValue': 30,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': 'マシンガン',
        'initialValue': 15,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': 'ライフル',
        'initialValue': 25,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      }
    ];

  }

  // 探索技能枠の作成
  generateSearchskillFrame() {
    this.searchList = [
      {
        'skillName': '応急手当',
        'initialValue': 30,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '鍵開け',
        'initialValue': 1,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '隠す',
        'initialValue': 15,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '隠れる',
        'initialValue': 10,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '聞き耳',
        'initialValue': 25,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '忍び歩き',
        'initialValue': 10,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '写真術',
        'initialValue': 10,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '精神分析',
        'initialValue': 1,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '追跡',
        'initialValue': 10,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '登攀',
        'initialValue': 40,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '図書館',
        'initialValue': 25,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '目星',
        'initialValue': 25,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      }
    ];

  }

  // 行動技能の作成
  generateBehaviorskillFrame() {
    this.behaviorList = [
        {
          'skillName': '運転（）',
          'initialValue': 20,
          'jobPoint': 0,
          'hobbyPoint': 0,
          'growthPoint': 0,
          'otherPoint': 0
        },
        {
          'skillName': '機械修理',
          'initialValue': 20,
          'jobPoint': 0,
          'hobbyPoint': 0,
          'growthPoint': 0,
          'otherPoint': 0
        },
        {
          'skillName': '重機械操作',
          'initialValue': 1,
          'jobPoint': 0,
          'hobbyPoint': 0,
          'growthPoint': 0,
          'otherPoint': 0
        },
        {
          'skillName': '乗馬',
          'initialValue': 1,
          'jobPoint': 0,
          'hobbyPoint': 0,
          'growthPoint': 0,
          'otherPoint': 0
        },
        {
          'skillName': '水泳',
          'initialValue': 25,
          'jobPoint': 0,
          'hobbyPoint': 0,
          'growthPoint': 0,
          'otherPoint': 0
        },
        {
          'skillName': '製作（）',
          'initialValue': 5,
          'jobPoint': 0,
          'hobbyPoint': 0,
          'growthPoint': 0,
          'otherPoint': 0
        },
        {
          'skillName': '操縦',
          'initialValue': 1,
          'jobPoint': 0,
          'hobbyPoint': 0,
          'growthPoint': 0,
          'otherPoint': 0
        },
        {
          'skillName': '跳躍',
          'initialValue': 25,
          'jobPoint': 0,
          'hobbyPoint': 0,
          'growthPoint': 0,
          'otherPoint': 0
        },
        {
          'skillName': '電気修理',
          'initialValue': 10,
          'jobPoint': 0,
          'hobbyPoint': 0,
          'growthPoint': 0,
          'otherPoint': 0
        },
        {
          'skillName': 'ナビゲート',
          'initialValue': 10,
          'jobPoint': 0,
          'hobbyPoint': 0,
          'growthPoint': 0,
          'otherPoint': 0
        },
        {
          'skillName': '変装',
          'initialValue': 1,
          'jobPoint': 0,
          'hobbyPoint': 0,
          'growthPoint': 0,
          'otherPoint': 0
        }
      ];

  }

  // 交渉技能の作成
  generateNegotiationskillFrame() {
    this.negotiationList = [
      {
        'skillName': '言いくるめ',
        'initialValue': 5,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '信用',
        'initialValue': 15,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '説得',
        'initialValue': 15,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '値切り',
        'initialValue': 5,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '母国語（）',
        'initialValue': 20,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      }
    ];

  }

  // 知識技能の作成
  generateKnowledgeskillFrame() {
    this.knowledgeList = [
      {
        'skillName': '医学',
        'initialValue': 5,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': 'オカルト',
        'initialValue': 5,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '化学',
        'initialValue': 1,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': 'クトゥルフ神話',
        'initialValue': 0,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '芸術（）',
        'initialValue': 5,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '経理',
        'initialValue': 10,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '考古学',
        'initialValue': 1,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': 'コンピューター',
        'initialValue': 1,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '心理学',
        'initialValue': 5,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '人類学',
        'initialValue': 1,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '生物学',
        'initialValue': 1,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '地質学',
        'initialValue': 1,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '電子工学',
        'initialValue': 1,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '天文学',
        'initialValue': 1,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '博物学',
        'initialValue': 10,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '物理学',
        'initialValue': 1,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '法律',
        'initialValue': 5,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '薬学',
        'initialValue': 1,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      },
      {
        'skillName': '歴史',
        'initialValue': 20,
        'jobPoint': 0,
        'hobbyPoint': 0,
        'growthPoint': 0,
        'otherPoint': 0
      }
    ];

  }

  // 所持品(wepon)枠の作成
  generateWeponFrame() {
    for (let i = 0; i < 5; i++) {
      let wepon = {
        name: '',
        successRate: 0,
        damage: '',
        range: '',
        attackCount: 0,
        loadingCount: 0,
        endurance: 0,
        other: ''
      } ;
      this.weponList[i] = wepon;
    }
    console.log(this.weponList);
  }

  // 所持品(item)の枠作成
  generateItemFrame() {
    for (let i = 0; i < 5; i++ ) {
      let item = {
        name: '',
        times: '',
        description: ''
      } ;
      this.itemslist[i] = item;
    }
    console.log(this.itemslist);
  }

  ngOnInit() {
  }

  test(type) {
    switch (type) {
      case 'str':
        this.strstock = this.characre.select(type);
        this.str = this.strstock[1];
        break;
      case 'con':
        this.constock = this.characre.select(type);
        this.con = this.constock[1];
        if (this.siz !== '2D6+6') {
          this. health = this.characre.status('health', this.con, this.siz);
        }
        break;
      case 'pow':
        this.powstock = this.characre.select(type);
        this.pow = this.powstock[1];
        this.SAN = this.characre.status('SAN', this.pow);
        this.luck = this.characre.status('luck', this.pow);
        this.mp = this.characre.status('mp', this.pow);
        break;
      case 'dex':
        this.dexstock = this.characre.select(type);
        this.dex = this.dexstock[1];
        break;
      case 'app':
        this.appstock = this.characre.select(type);
        this.app = this.appstock[1];
        break;
      case 'siz':
        this.sizstock = this.characre.select(type);
        this.siz = this.sizstock[1];
        if (this.con !== '3D6') {
          this. health = this.characre.status('health', this.con, this.siz);
        }
        break;
      case 'int':
        this.intstock = this.characre.select(type);
        this.int = this.intstock[1];
        this.idea = this.characre.status('idea', this.int);
        this.HobbySkill = this.characre.status('HobbySkill', this.int);
        break;
      case 'edu':
        this.edustock = this.characre.select(type);
        this.edu = this.edustock[1];
        this.knowledge = this.characre.status('knowledge', this.edu);
        this.VocationalSkill = this.characre.status('VocationalSkill', this.edu);
        break;
      case 'income':
        this.incomestock = this.characre.select(type);
        this.income = this.incomestock[1];
        break;
    }
    console.log('OK');
  }

  radiochange(e) {
    console.log(e.target);
    if (e.target.name === 'charElem') {
      this.roll = e.target.value;
      console.log(e.target.value);
    }else if (e.target.name === 'gender') {
      this.gender = e.target.value;
      console.log(e.target.value);
    }
  }

  racechange(e) {
    this.race = e.target.value;
    console.log(e.target.value);
  }

  textinput(e) {
    console.log(e.target);
    if (e.target.id === 'chara-name') {
      this.name = e.target.value;
      console.log(e.target.value);
    }else if (e.target.id === 'job') {
      this.job = e.target.value;
      console.log(e.target.value);
    }else if (e.target.name === 'Career') {
      this.Career = e.target.value;
      console.log(e.target.value);
    }else if (e.target.name === 'Encounter') {
      this.Encounter = e.target.value;
      console.log(e.target.value);
    }
  }

  download() {
    let basic = [ this.roll, this.race, this.name, this.gender, this.job ];
    let status = [ this.str, this.con, this.pow, this.dex, this.app, this.siz, this.int, this.edu, this.income ];
    let fstatus = [ this.SAN, this.luck, this.idea, this.knowledge, this.health, this.mp,
      this.VocationalSkill, this.HobbySkill, this.DamegeBonus ];
    let profile = [this.Career, this.Encounter];
    let json = this.characre.change(basic, status, fstatus, profile);
    // this.characre.save(json, document.getElementById('download'), this.filename)

    // Charaクラスを完成させる
    let newchara = new Chara();

    let newcharacter = new Character();
    newcharacter.name = this.cname;
    newcharacter.gender = this.cgender;
    newcharacter.height = this.cheight;
    newcharacter.weight = this.cweight;
    newcharacter.birthplace = this.cbirthplace;
    newcharacter.hairColor = this.chairColor;
    newcharacter.eyeColor = this.ceyeColor;

    let newsetting = new Setting();
    newsetting.type = this.stype;
    newsetting.race = this.srace;
    newsetting.job = this.sjob;
    newsetting.character = newcharacter;

    newchara.Setting = newsetting;  // charaに入れる

    let newskill = new Skill();
    this.combatList.forEach(function(skill) {
      let newbehavior = new Behavior();
      newbehavior.skillName = skill['skillName'];
      newbehavior.initialValue = skill['initialValue'];
      newbehavior.jobPoint = skill['jobPoint'];
      newbehavior.hobbyPoint = skill['hobbyPoint'];
      newbehavior.growthPoint = skill['growthPoint'];
      newbehavior.otherPoint = skill['otherPoint'];
      newskill.conbat.push(newbehavior);
    });
    this.searchList.forEach(function(skill) {
      let newbehavior = new Behavior();
      newbehavior.skillName = skill['skillName'];
      newbehavior.initialValue = skill['initialValue'];
      newbehavior.jobPoint = skill['jobPoint'];
      newbehavior.hobbyPoint = skill['hobbyPoint'];
      newbehavior.growthPoint = skill['growthPoint'];
      newbehavior.otherPoint = skill['otherPoint'];
      newskill.search.push(newbehavior);
    });
    this.behaviorList.forEach(function(skill) {
      let newbehavior = new Behavior();
      newbehavior.skillName = skill['skillName'];
      newbehavior.initialValue = skill['initialValue'];
      newbehavior.jobPoint = skill['jobPoint'];
      newbehavior.hobbyPoint = skill['hobbyPoint'];
      newbehavior.growthPoint = skill['growthPoint'];
      newbehavior.otherPoint = skill['otherPoint'];
      newskill.behavior.push(newbehavior);
    });
    this.negotiationList.forEach(function(skill) {
      let newbehavior = new Behavior();
      newbehavior.skillName = skill['skillName'];
      newbehavior.initialValue = skill['initialValue'];
      newbehavior.jobPoint = skill['jobPoint'];
      newbehavior.hobbyPoint = skill['hobbyPoint'];
      newbehavior.growthPoint = skill['growthPoint'];
      newbehavior.otherPoint = skill['otherPoint'];
      newskill.negotiation.push(newbehavior);
    });
    this.knowledgeList.forEach(function(skill) {
      let newbehavior = new Behavior();
      newbehavior.skillName = skill['skillName'];
      newbehavior.initialValue = skill['initialValue'];
      newbehavior.jobPoint = skill['jobPoint'];
      newbehavior.hobbyPoint = skill['hobbyPoint'];
      newbehavior.growthPoint = skill['growthPoint'];
      newbehavior.otherPoint = skill['otherPoint'];
      newskill.knowledge.push(newbehavior);
    });

    newchara.Skill = newskill;  // charaに入れる

    let newstatus = new Status();
    let newbaseStatus = new BaseStatus();
    newbaseStatus.str = this.bstr;
    newbaseStatus.con = this.bcon;
    newbaseStatus.pow = this.bpow;
    newbaseStatus.dex = this.bdex;
    newbaseStatus.siz = this.bsiz;
    newbaseStatus.app = this.bapp;
    newbaseStatus.int = this.bint;
    newbaseStatus.edu = this.bedu;
    newbaseStatus.income_and_property = this.bincome_and_property;
    newstatus.baseStatus = newbaseStatus;

    let newfluctuationStatus = new FluctuationStatus();
    newfluctuationStatus.san = this.fsan;
    newfluctuationStatus.luck = this.fluck;
    newfluctuationStatus.idea = this.fidea;
    newfluctuationStatus.knowledge = this.fknowledge;
    newfluctuationStatus.health = this.fhealth;
    newfluctuationStatus.mp = this.fmp;
    newfluctuationStatus.VocationalSkill = this.fVocationalSkill;
    newfluctuationStatus.HobbySkill = this.fHobbySkill;
    newfluctuationStatus.DamegeBonus = this.fDamegeBonus;
    newstatus.fluctuationStatus = newfluctuationStatus;

    newchara.Status = newstatus;  // charaに入れる

    let newitems = new Items();
    this.weponList.forEach(function(item) {
      if ( item.name ) {
        let newwepon = new Weapon();
        newwepon.weaponName = item.name;
        newwepon.successRate = item.successRate;
        newwepon.damage = item.damage;
        newwepon.range = item.range;
        newwepon.attackCount = item.attackCount;
        newwepon.loadingCount = item.loadingCount;
        newwepon.endurance = item.endurance;
        newwepon.other = item.other;
        newitems.weapon.push(newwepon);
      }
    });
    this.itemslist.forEach(function(item) {
      if ( item.name ) {
        let newitem = new Item();
        newitem.itemName = item.name;
        newitem.number = item.times;
        newitem.other = item.description;
        newitems.item.push(newitem);
      }
    });
    newchara.items = newitems;  // charaに入れる
    let newprofile = new Profile();
    newprofile.Career = this.pCareer;
    newprofile.Encounter = this.pEncounter;
    newprofile.otherMemo = this.pOtherMemo;
    newchara.profile = newprofile;  // charaに入れる

    let characterJson = Convert.charaToJson(newchara);  // CharaクラスをJSONに変換する

    this.characre.save(characterJson, document.getElementById('download'), this.filename);  // JSON文字列を保存させる

  }
}
