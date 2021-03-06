import { Component, OnInit } from '@angular/core';
import { CharacterCreateService } from '../../Service/character-create.service';
import { SkillList } from '../../model/skillList';
import { JobList } from '../../model/jobList';
import { CharacterManagementService } from '../../Service/character-management.service';
import {
  Convert,
  Chara,
  Setting,
  Character,
  Skill,
  Behavior,
  Status,
  BaseStatus,
  FluctuationStatus,
  Items,
  Item,
  Weapon,
  Profile
} from '../../model/character-info-model';
import { tryCatch } from 'rxjs/internal-compatibility';
import { Router } from '@angular/router';

@Component({
  selector: 'app-character-create',
  templateUrl: './character-create.component.html',
  styleUrls: ['./character-create.component.css']
})
export class CharacterCreateComponent implements OnInit {

  private filename = 'octpot.json';

  private jobList = [];
  // Setting
  private stype;
  private srace;
  private sjob;
  private sjobName;
  private sjobDescription = '';
  private sjobSkills = [];
  private simages;
  // Setting.character
  private cname;
  private cgender;
  private cage;
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

  private combatList = [];  // 戦闘技能の配列
  private searchList = []; // 探索技能の配列
  private behaviorList = []; // 行動技能の配列
  private negotiationList = []; // 交渉技能の配列
  private knowledgeList = []; // 知識技能の配列
  private weponList = []; // 所持品(武具)の配列
  private itemslist = [];  // 所持品(item)の配列

  // スキルポイント合計
  private combatPointAll = [0];
  private searchPointAll = [0];
  private behaviorPointAll = [0];
  private negotiationPointAll = [0];
  private knowledgePointAll = [0];

  // 保有ポイント全部
  private professionalPoint = 0;
  private interestPoint = 0;
  // 使用できる保有ポイント
  private remProfessionalPoint = 0;
  private remInterestPoint = 0;

  constructor(private characre: CharacterCreateService, private characterManagement: CharacterManagementService, private router: Router) {
    // 全職業のリストを取得する
    this.jobList = new JobList().getAllJob();
    console.log(this.jobList);
    // 何のスキルがあるか配列から読み込むメソッド達を使う
    let skillList = new SkillList();
    this.combatList = skillList.combatList;
    this.searchList = skillList.searchList;
    this.behaviorList = skillList.behaviorList;
    this.negotiationList = skillList.negotiationList;
    this.knowledgeList = skillList.knowledgeList;
    this.generateWeponFrame();
    this.generateItemFrame();
  }

  selectJob(event) {
    this.jobList.forEach((job) => {
      if (job.jobName === this.sjobName) {
        this.sjobDescription = job.description;
        this.sjobSkills = job.skills.join(',');
      }
    });
  }

  // キーボードを使ったらもれなく値を0にするメソッド　(未使用)
  dontKyetype(point, skill, index, listName, pointName) {
    if ( pointName === 'job' ) {
      switch (listName) {
        case 'combat' :
          this.combatList[index].jobPoint = '';
          this.combatList[index].jobPoint = 0;
          break;
          case 'search' :
          this.searchList[index].jobPoint = '';
          this.searchList[index].jobPoint = 0;
          break;
        case 'behavior' :
          this.behaviorList[index].jobPoint = '';
          this.behaviorList[index].jobPoint = 0;
          break;
        case 'negotiation' :
          this.negotiationList[index].jobPoint = '';
          this.negotiationList[index].jobPoint = 0;
          break;
        case 'knowledge' :
          this.knowledgeList[index].jobPoint = '';
          this.knowledgeList[index].jobPoint = 0;
          break;
      }
    }else if (pointName === 'hobby' ) {
      switch (listName) {
        case 'combat' :
          this.combatList[index].hobbyPoint = '';
          this.combatList[index].hobbyPoint = 0;
          break;
        case 'search' :
          this.searchList[index].hobbyPoint = '';
          this.searchList[index].hobbyPoint = 0;
          break;
        case 'behavior' :
          this.behaviorList[index].hobbyPoint = '';
          this.behaviorList[index].hobbyPoint = 0;
          break;
        case 'negotiation' :
          this.negotiationList[index].hobbyPoint = '';
          this.negotiationList[index].hobbyPoint = 0;
          break;
        case 'knowledge' :
          this.knowledgeList[index].hobbyPoint = '';
          this.knowledgeList[index].hobbyPoint = 0;
          break;
      }
    }else if (pointName === 'growth') {
      switch (listName) {
        case 'combat' :
          this.combatList[index].growthPoint = '';
          this.combatList[index].growthPoint = 0;
          break;
        case 'search' :
          this.searchList[index].growthPoint = '';
          this.searchList[index].growthPoint = 0;
          break;
        case 'behavior' :
          this.behaviorList[index].growthPoint = '';
          this.behaviorList[index].growthPoint = 0;
          break;
        case 'negotiation' :
          this.negotiationList[index].growthPoint = '';
          this.negotiationList[index].growthPoint = 0;
          break;
        case 'knowledge' :
          this.knowledgeList[index].growthPoint = '';
          this.knowledgeList[index].growthPoint = 0;
          break;
      }
    }else if (pointName === 'other') {
      switch (listName) {
        case 'combat' :
          this.combatList[index].otherPoint = '';
          this.combatList[index].otherPoint = 0;
          break;
        case 'search' :
          this.searchList[index].otherPoint = '';
          this.searchList[index].otherPoint = 0;
          break;
        case 'behavior' :
          this.behaviorList[index].otherPoint = '';
          this.behaviorList[index].otherPoint = 0;
          break;
        case 'negotiation' :
          this.negotiationList[index].otherPoint = '';
          this.negotiationList[index].otherPoint = 0;
          break;
        case 'knowledge' :
          this.knowledgeList[index].otherPoint = '';
          this.knowledgeList[index].otherPoint = 0;
          break;
      }
    }
  }

  totalSingleSkillPoint(pointName) { // pointNameで指定されたポイント(職業P or 興味P)の合計値を返す
    let usedPoint = 0;
    if ( pointName === 'job' ) {
      this.combatList.forEach(function(skill){
        usedPoint += skill['jobPoint'];
      });
      this.searchList.forEach(function(skill){
        usedPoint += skill['jobPoint'];
      });
      this.behaviorList.forEach(function(skill){
        usedPoint += skill['jobPoint'];
      });
      this.negotiationList.forEach(function(skill){
        usedPoint += skill['jobPoint'];
      });
      this.knowledgeList.forEach(function(skill){
        usedPoint += skill['jobPoint'];
      });

    }else if (pointName === 'hobby' ) {
      this.combatList.forEach(function(skill){
        usedPoint += skill['hobbyPoint'];
      });
      this.searchList.forEach(function(skill){
        usedPoint += skill['hobbyPoint'];
      });
      this.behaviorList.forEach(function(skill){
        usedPoint += skill['hobbyPoint'];
      });
      this.negotiationList.forEach(function(skill){
        usedPoint += skill['hobbyPoint'];
      });
      this.knowledgeList.forEach(function(skill){
        usedPoint += skill['hobbyPoint'];
      });
    }
    return usedPoint;
  }

  // point: どのオブジェクトが発火したか skill; スキルの名前 index: そのスキルがそのスキル配列の何番目かcombatlist[index]
  // listName: スキルリストの名前combat,search... pointName: jobポイントかhobbyポイントか
  totalcalc(event, skill, index, listName, pointName) {  // 残り使えるスキルポイントを計算する。pointNameで職業Pか趣味Pか判定する
    let point = event.target.valueAsNumber; // 入力されていた値をin
    this.inputSkillArray(point, index, listName, pointName); // 指定スキルに入力された値をin
    if (!this.underHundredTotalSkillPoint(point, skill, index, listName, pointName)) {
      // 指定スキルの合計が99以下でない場合スキル値を0に戻す
      this.inputSkillArray(0, index, listName, pointName);
      return;
    }

    // 職業P興味Pの合計値が割り振れる範囲内か
    if (pointName === 'job') {
      if (this.professionalPoint - this.totalSingleSkillPoint('job') <= -1) {
        this.inputSkillArray(0, index, listName, pointName);
      }
    } else if (pointName === 'hobby') {
      if (this.interestPoint - this.totalSingleSkillPoint('hobby') <= -1) {
        this.inputSkillArray(0, index, listName, pointName);
      }
    }
  }

  // 引数listNameとindexで指定されたスキルポイントの合計値が100以上か未満かを判定
  // 100以上：false  100未満：true
  underHundredTotalSkillPoint(point, skill, index, listName, pointName) { // 各スキルの合計値が99を超えないようにする
    let totalSkillPoint = 0;
    let choiceSkill;
    switch (listName) {
      case 'combat' :
        choiceSkill = this.combatList[index];
        break;
      case 'search' :
        choiceSkill = this.searchList[index];
        break;
      case 'behavior' :
        choiceSkill = this.behaviorList[index];
        break;
      case 'negotiation' :
        choiceSkill = this.negotiationList[index];
        break;
      case 'knowledge' :
        choiceSkill = this.knowledgeList[index];
        break;
    }
    totalSkillPoint += choiceSkill['initialValue'];
    totalSkillPoint += choiceSkill['jobPoint'];
    totalSkillPoint += choiceSkill['hobbyPoint'];
    totalSkillPoint += choiceSkill['growthPoint'];
    totalSkillPoint += choiceSkill['otherPoint'];
    if ( totalSkillPoint >= 100 ) {
      return false;
    }
    return true;
  }

  // 引数を元にスキル配列にポイントを入力
  // point: ポイント pointName: 職業Pか興味Pか listName: どの技能か(戦闘、探索...etc) index: 技能の何番目の配列のスキルか
  inputSkillArray(point, index, listName, pointName) {
    if ( pointName === 'job' ) {
      switch (listName) {
        case 'combat' :
          this.combatList[index].jobPoint = null;
          this.combatList[index].jobPoint = point;
          break;
        case 'search' :
          this.searchList[index].jobPoint = null;
          this.searchList[index].jobPoint = point;
          break;
        case 'behavior' :
          this.behaviorList[index].jobPoint = null;
          this.behaviorList[index].jobPoint = point;
          break;
        case 'negotiation' :
          this.negotiationList[index].jobPoint = null;
          this.negotiationList[index].jobPoint = point;
          break;
        case 'knowledge' :
          this.knowledgeList[index].jobPoint = null;
          this.knowledgeList[index].jobPoint = point;
          break;
      }
      this.remProfessionalPoint = this.professionalPoint - this.totalSingleSkillPoint('job');
    }else if (pointName === 'hobby' ) {
      switch (listName) {
        case 'combat' :
        this.combatList[index].hobbyPoint = null;
        this.combatList[index].hobbyPoint = point;
          break;
        case 'search' :
          this.searchList[index].hobbyPoint = null;
          this.searchList[index].hobbyPoint = point;
          break;
        case 'behavior' :
          this.behaviorList[index].hobbyPoint = null;
          this.behaviorList[index].hobbyPoint = point;
          break;
        case 'negotiation' :
          this.negotiationList[index].hobbyPoint = null;
          this.negotiationList[index].hobbyPoint = point;
          break;
        case 'knowledge' :
          this.knowledgeList[index].hobbyPoint = null;
          this.knowledgeList[index].hobbyPoint = point;
          break;
      }
      this.remInterestPoint = this.interestPoint - this.totalSingleSkillPoint('hobby');
    }else if (pointName === 'growth' ) {
      switch (listName) {
        case 'combat' :
        this.combatList[index].growthPoint = null;
        this.combatList[index].growthPoint = point;
          break;
        case 'search' :
          this.searchList[index].growthPoint = null;
          this.searchList[index].growthPoint = point;
          break;
        case 'behavior' :
          this.behaviorList[index].growthPoint = null;
          this.behaviorList[index].growthPoint = point;
          break;
        case 'negotiation' :
          this.negotiationList[index].growthPoint = null;
          this.negotiationList[index].growthPoint = point;
          break;
        case 'knowledge' :
          this.knowledgeList[index].growthPoint = null;
          this.knowledgeList[index].growthPoint = point;
          break;
      }
    }else if (pointName === 'other' ) {
      switch (listName) {
        case 'combat' :
        this.combatList[index].otherPoint = null;
        this.combatList[index].otherPoint = point;
          break;
        case 'search' :
          this.searchList[index].otherPoint = null;
          this.searchList[index].otherPoint = point;
          break;
        case 'behavior' :
          this.behaviorList[index].otherPoint = null;
          this.behaviorList[index].otherPoint = point;
          break;
        case 'negotiation' :
          this.negotiationList[index].otherPoint = null;
          this.negotiationList[index].otherPoint = point;
          break;
        case 'knowledge' :
          this.knowledgeList[index].otherPoint = null;
          this.knowledgeList[index].otherPoint = point;
          break;
      }
    }

  }

  // 各スキル値の合計値を計算します (現在未使用)
  totalSkillPoint() {
    this.combatPointAll = [];
    this.searchPointAll = [];
    this.behaviorPointAll = [];
    this.negotiationPointAll = [];
    this.knowledgePointAll = [];

    let com = 0;

    for ( let i = 0; i < this.combatList.length; i++) {
      let skillP = 0;
      skillP += this.combatList[i]['initialValue'];
      skillP += this.combatList[i]['jobPoint'];
      skillP += this.combatList[i]['hobbyPoint'];
      skillP += this.combatList[i]['growthPoint'];
      skillP += this.combatList[i]['otherPoint'];
      this.combatPointAll.push(skillP);
      com += skillP;
    }
    for ( let i = 0; i < this.searchList.length; i++) {
      let skillP = 0;
      skillP += this.searchList[i]['initialValue'];
      skillP += this.searchList[i]['jobPoint'];
      skillP += this.searchList[i]['hobbyPoint'];
      skillP += this.searchList[i]['growthPoint'];
      skillP += this.searchList[i]['otherPoint'];
      this.searchPointAll.push(skillP);
    }
    for ( let i = 0; i < this.behaviorList.length; i++) {
      let skillP = 0;
      skillP += this.behaviorList[i]['initialValue'];
      skillP += this.behaviorList[i]['jobPoint'];
      skillP += this.behaviorList[i]['hobbyPoint'];
      skillP += this.behaviorList[i]['growthPoint'];
      skillP += this.behaviorList[i]['otherPoint'];
      this.behaviorPointAll.push(skillP);
    }
    for ( let i = 0; i < this.negotiationList.length; i++) {
      let skillP = 0;
      skillP += this.negotiationList[i]['initialValue'];
      skillP += this.negotiationList[i]['jobPoint'];
      skillP += this.negotiationList[i]['hobbyPoint'];
      skillP += this.negotiationList[i]['growthPoint'];
      skillP += this.negotiationList[i]['otherPoint'];
      this.negotiationPointAll.push(skillP);
    }
    for ( let i = 0; i < this.negotiationList.length; i++) {
      let skillP = 0;
      skillP += this.negotiationList[i]['initialValue'];
      skillP += this.negotiationList[i]['jobPoint'];
      skillP += this.negotiationList[i]['hobbyPoint'];
      skillP += this.negotiationList[i]['growthPoint'];
      skillP += this.negotiationList[i]['otherPoint'];
      this.negotiationPointAll.push(skillP);
    }

  }

  throwDice(dicename) {
    function throwing(times, num, plus) {  // さいころ処理 times:回数 num:ダイスの面数 plus:あとで足す分
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
    }

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
          if (this.bsiz) {
            let strPlusSiz = this.bstr + this.bsiz;
            if (strPlusSiz <= 12 ) {
              this.fDamegeBonus = '-1D6';
            }else if (strPlusSiz <= 16) {
              this.fDamegeBonus = '-1D4';
            }else if (strPlusSiz <= 24) {
              this.fDamegeBonus = '±0';
            }else if (strPlusSiz <= 32) {
              this.fDamegeBonus = '+1D4';
            }else if (strPlusSiz <= 40) {
              this.fDamegeBonus = '+1D6';
            }else if (strPlusSiz <= 56) {
              this.fDamegeBonus = '+2D6';
            }else if (strPlusSiz <= 72) {
              this.fDamegeBonus = '+3D6';
            }
          }
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
          this.combatList[0].initialValue = result * 2;
          break;

        case 'app' :
          this.bapp = result;
          break;

        case 'siz' :
          this.bsiz = result;
          if (this.bcon) {
            this.fhealth = Math.round((this.bcon + result) / 2);
          }
          if (this.bstr) {
            let strPlusSiz = this.bstr + this.bsiz;
            if (strPlusSiz <= 12 ) {
              this.fDamegeBonus = '-1D6';
            }else if (strPlusSiz <= 16) {
              this.fDamegeBonus = '-1D4';
            }else if (strPlusSiz <= 24) {
              this.fDamegeBonus = '±0';
            }else if (strPlusSiz <= 32) {
              this.fDamegeBonus = '+1D4';
            }else if (strPlusSiz <= 40) {
              this.fDamegeBonus = '+1D6';
            }else if (strPlusSiz <= 56) {
              this.fDamegeBonus = '+2D6';
            }else if (strPlusSiz <= 72) {
              this.fDamegeBonus = '+3D6';
            }
          }
          break;

        case 'int' :
          this.bint = result;
          this.fidea = result * 5;
          this.fHobbySkill = result * 10;
          this.interestPoint = result * 10;
          this.remInterestPoint = result * 10;
          break;

        case 'edu' :
          this.bedu = result;
          this.fknowledge = result * 5;
          this.fVocationalSkill = result * 20;
          this.professionalPoint = result * 20;
          this.remProfessionalPoint = result * 20;
          break;

        case 'income' :
          this.bincome_and_property = result;
          break;
      }
    }
    this.pointReset();
  }

  pointReset() {
    this.combatList.forEach(function(skill){
      skill.jobPoint = 0;
      skill.hobbyPoint = 0;
    });
    this.searchList.forEach(function(skill){
      skill.jobPoint = 0;
      skill.hobbyPoint = 0;
    });
    this.behaviorList.forEach(function(skill){
      skill.jobPoint = 0;
      skill.hobbyPoint = 0;
    });
    this.negotiationList.forEach(function(skill){
      skill.jobPoint = 0;
      skill.hobbyPoint = 0;
    });
    this.knowledgeList.forEach(function(skill){
      skill.jobPoint = 0;
      skill.hobbyPoint = 0;
    });
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
      this.weponList.push(wepon);
    }
  }

  // 所持品(item)の枠作成
  generateItemFrame() {
    for (let i = 0; i < 10; i++ ) {
      let item = {
        name: '',
        times: '',
        description: ''
      } ;
      this.itemslist[i] = item;
    }
  }

  // アイテム追加ボタンを押されたら、アイテム枠を追加する。
  addItem(itemType) {
    if (itemType === 'wepon') {
      let wepon = {
        name: '',
        successRate: 0,
        damage: '',
        range: '',
        attackCount: 0,
        loadingCount: 0,
        endurance: 0,
        other: ''
      };
      this.weponList.push(wepon);
    } else if (itemType === 'item') {
      let item = {
        name: '',
        times: '',
        description: ''
      };
      this.itemslist.push(item);
    }
  }

  // アイテム削除ボタンが押されたらそのアイテムを削除する
  deleteItem(itemType, index) {
    if (itemType === 'wepon') {
      this.weponList.splice(index, 1 );
    }else if (itemType === 'item') {
      this.itemslist.splice(index, 1 );
    }
  }

  ngOnInit() {
  }


  // JSONファイルで保存
  download() {
    let newchara = this.getCharaClass();
    let characterJson = Convert.charaToJson(newchara);  // CharaクラスをJSONに変換する

    this.filename = this.cname + '.json'; // ファイル名を[キャラクターの名前].jsonに
    this.characre.save(characterJson, document.getElementById('download'), this.filename);  // JSON文字列を保存させる
  }

  // ローカルストレージに保存
  saveLocal() {
    try {
      let charaClass = this.getCharaClass();
      this.characterManagement.setItem(this.stype, charaClass);
      alert('保存されました。');
      this.router.navigate(["/management"]);
    }catch (e) {
      alert('保存できませんでした。記述に誤りがないか確認してください');
    }
  }

  // 現在のキャラ情報をCharaクラスのオブジェクトにして返す
  getCharaClass() {
    // Charaクラスを完成させる
    let newchara = new Chara(0);

    let newcharacter = new Character(0);
    newcharacter.name = this.cname;
    newcharacter.gender = this.cgender;
    newcharacter.age = this.cage;
    newcharacter.height = this.cheight;
    newcharacter.weight = this.cweight;
    newcharacter.birthplace = this.cbirthplace;
    newcharacter.hairColor = this.chairColor;
    newcharacter.eyeColor = this.ceyeColor;

    let newsetting = new Setting(0);
    newsetting.type = this.stype;
    newsetting.race = this.srace;
    newsetting.job = this.sjobName;
    newsetting.character = newcharacter;

    newchara.Setting = newsetting;  // charaに入れる

    let newskill = new Skill(0);
    this.combatList.forEach(function(skill) {
      let newbehavior = new Behavior(0);
      newbehavior.skillName = skill['skillName'];
      newbehavior.initialValue = skill['initialValue'];
      newbehavior.jobPoint = skill['jobPoint'];
      newbehavior.hobbyPoint = skill['hobbyPoint'];
      newbehavior.growthPoint = skill['growthPoint'];
      newbehavior.otherPoint = skill['otherPoint'];
      newskill.conbat.push(newbehavior);
    });
    this.searchList.forEach(function(skill) {
      let newbehavior = new Behavior(0);
      newbehavior.skillName = skill['skillName'];
      newbehavior.initialValue = skill['initialValue'];
      newbehavior.jobPoint = skill['jobPoint'];
      newbehavior.hobbyPoint = skill['hobbyPoint'];
      newbehavior.growthPoint = skill['growthPoint'];
      newbehavior.otherPoint = skill['otherPoint'];
      newskill.search.push(newbehavior);
    });
    this.behaviorList.forEach(function(skill) {
      let newbehavior = new Behavior(0);
      newbehavior.skillName = skill['skillName'];
      newbehavior.initialValue = skill['initialValue'];
      newbehavior.jobPoint = skill['jobPoint'];
      newbehavior.hobbyPoint = skill['hobbyPoint'];
      newbehavior.growthPoint = skill['growthPoint'];
      newbehavior.otherPoint = skill['otherPoint'];
      newskill.behavior.push(newbehavior);
    });
    this.negotiationList.forEach(function(skill) {
      let newbehavior = new Behavior(0);
      newbehavior.skillName = skill['skillName'];
      newbehavior.initialValue = skill['initialValue'];
      newbehavior.jobPoint = skill['jobPoint'];
      newbehavior.hobbyPoint = skill['hobbyPoint'];
      newbehavior.growthPoint = skill['growthPoint'];
      newbehavior.otherPoint = skill['otherPoint'];
      newskill.negotiation.push(newbehavior);
    });
    this.knowledgeList.forEach(function(skill) {
      let newbehavior = new Behavior(0);
      newbehavior.skillName = skill['skillName'];
      newbehavior.initialValue = skill['initialValue'];
      newbehavior.jobPoint = skill['jobPoint'];
      newbehavior.hobbyPoint = skill['hobbyPoint'];
      newbehavior.growthPoint = skill['growthPoint'];
      newbehavior.otherPoint = skill['otherPoint'];
      newskill.knowledge.push(newbehavior);
    });

    newchara.Skill = newskill;  // charaに入れる

    let newstatus = new Status(0);
    let newbaseStatus = new BaseStatus(0);
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

    let newfluctuationStatus = new FluctuationStatus(0);
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

    let newitems = new Items(0);
    this.weponList.forEach(function(item) {
      if ( item.name ) {
        let newwepon = new Weapon(0);
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
        let newitem = new Item(0);
        newitem.itemName = item.name;
        newitem.number = item.times;
        newitem.other = item.description;
        newitems.item.push(newitem);
      }
    });
    newchara.items = newitems;  // charaに入れる
    let newprofile = new Profile(0);
    newprofile.Career = this.pCareer;
    newprofile.Encounter = this.pEncounter;
    newprofile.otherMemo = this.pOtherMemo;
    newchara.profile = newprofile;  // charaに入れる

    let characterJson = Convert.charaToJson(newchara);  // CharaクラスをJSONに変換する
    return Convert.toChara(characterJson);
  }
}
