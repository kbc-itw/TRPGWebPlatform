import {Injectable} from '@angular/core';
import * as client from 'socket.io-client';
import {BehaviorSubject} from 'rxjs';
import * as moment from 'moment';

@Injectable()
export class ChatRoomCreateService {
  // ホスト側が使うルーム作成クラス
  // ルームを作成、peerを作成、channelを作成
  // こっちでio.onでスタンバっといて入室者側のconnectが来たらoffer投げるようにするか
  // passはあとでいいか
  // peerは一人につき一つ必要
  // channelも？
  private message_peer;
  private file_peer;
  private io;
  private message_channel;
  private file_channel;
  private member = [];
  private id;
  private name;
  private pass;
  public data = new BehaviorSubject<string>(null);
  private date: string;

  constructor() {
  }

  io_connect() {
    this.io = client.connect('http://150.95.205.204:80/');
    this.io.on('connect', (socket) => {
      console.log('connect');
    });
  }

  create(pass, name) {
    console.groupCollapsed('createFunction(service)');
    console.log('constructor', 'from', 'service');
    this.message_peer = new RTCPeerConnection({iceServers: [{urls: 'stun:stun.l.google.com:19302'}]});
    this.file_peer = new RTCPeerConnection({iceServers: [{urls: 'stun:stun.l.google.com:19302'}]});
    this.message_channel = this.message_peer.createDataChannel('message_channel');
    this.file_channel = this.file_peer.createDataChannel('file_channel');
    this.member.push({peer: this.message_peer, channel: this.message_channel, file: this.file_channel});
    this.date = moment().format('YY/MM/DD HH:mm');
    this.name = name;
    this.pass = pass;
    this.data.next('ルームを作成しました。');
    console.profile('ondatachannel');
    this.dc();
    console.profileEnd();

    console.profile('onicecadidate');
    this.cd();
    console.profileEnd();

    console.profile('connectFunction');
    this.connect(pass);
    console.profileEnd();

    console.groupEnd();
  }

  dc() {
    this.member.forEach((e) => {
      console.log('peer; ', e.peer);
      console.log('channel: ', e.channel);
      console.log(e.file);
    });
    this.member[this.member.length - 1].peer.ondatachannel = (e) => {
      console.groupCollapsed('dcFunction');
      // e.channelにtestが格納されているのでそれを使う
      console.log('ondDataChannel');
      // console.log(e.candidate.candidate.split(' ')[4]); // address
      console.log(this.member[this.member.length - 1].channel);
      console.groupEnd();
    };
    this.member[this.member.length - 1].channel.onopen = () => {
      console.log('DataChannelOpen');
      this.message_peer = new RTCPeerConnection({iceServers: [{urls: 'stun:stun.l.google.com:19302'}]});
      this.file_peer = new RTCPeerConnection({iceServers: [{urls: 'stun:stun.l.google.com:19302'}]});
      this.message_channel = this.message_peer.createDataChannel('message_channel');
      this.file_channel = this.file_peer.createDataChannel('file_channel');
      this.member.push({peer: this.message_peer, channel: this.message_channel, file: this.file_channel});
      console.log(this.member);
      try {
        this.dc();
        this.cd();
      } catch (e) {
        console.log('local dc and cd');
        console.log(e);
      }
    };
    this.member[this.member.length - 1].channel.onmessage = (event) => {
      console.log('データチャネルメッセージ取得:', event.data);
      console.log(event);
      console.log(typeof event.data);
      if (false) {
        // jsonかどうか見分けて処理を分ける。
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaajbjasbcbcjbcj');
      }
      var val = event.data;
      this.data.next(val);
      this.member.forEach((e) => {
        console.log(event);
        console.log('e: ', e);
        console.log('e.peer: ', e.peer);
        console.log('e.channel: ', e.channel);
        if (e.channel.readyState === 'open') {
          e.channel.send(val);
        }
      });
    };
    this.member[this.member.length - 1].channel.onclose = () => {
      console.log('DataChannelClose');
    };
    this.member[this.member.length - 1].channel.onerror = (err) => {
      console.log(err);
    };
  }

  cd() {
    this.member[this.member.length - 1].peer.onicecandidate = (e) => {
      console.groupCollapsed('onicecadidate');
      if (e.candidate) {
        this.io.emit('candidate', {candidate: e.candidate, sdp: this.member[this.member.length - 1].peer.localDescription.sdp});
      } else {
        console.log('candi  err');
        return;
      }
      console.groupEnd();
    };
    /*
    this.peer.onicecandidate = (e) => {
      console.groupCollapsed('onicecadidate');
      if (e.candidate) {
        this.io.emit('candidate', {candidate: e.candidate, sdp: this.peer.localDescription.sdp});
      }else {
        console.log('candi  err');
        return;
      }
      console.groupEnd();
    };
    */
  }

  get_io() {
    return this.io;
  }

  get_member() {
    return this.member;
  }

  get_id() {
    return this.id;
  }

  get_name() {
    return this.name;
  }

  get_pass() {
    return this.pass;
  }

  // peer通信を始める準備
  connect(pass) {
    console.groupCollapsed('connectFunction');
    console.log('connect service');
    console.profile('sdpFunction');
    this.sdp();
    console.profileEnd();

    this.io.emit('create', {pass: pass});
    this.io.emit('id');
    console.groupCollapsed('ioのconnect');
    console.log('clientSide', 'connect');
    console.groupEnd();

    this.io.on('create', (e) => {
      console.log('create', e);
    });
    this.io.on('hello', (e) => {
      console.log('hello', e);
    });
    this.io.on('enter', (e) => {
      console.log('enter');
      console.log('client: ', e, 'が申請してきました。');
      this.offer(e);
    });
    this.io.on('id', (e) => {
      console.groupCollapsed('ioのid');
      console.log(e);
      this.id = e;
      console.groupEnd();
    });
    console.groupEnd();
  }

  // SDPofferが送られてきたときの処理
  sdp() {
    console.groupCollapsed('sdpFunction');
    console.log('from here socket function');
    // let answer = this.answer;
    this.io.on('SDP', (e) => {
      console.groupCollapsed('ioのSDP');
      console.log('clientSide', 'SDP');
      if (!e.sdp.sdp) {
        console.log('sdp.sdp is not property');
        return;
      }
      if (e.sdp.sdp !== this.member[this.member.length - 1].peer.localDescription.sdp) {
        console.log('check the sdp');
        var description = new RTCSessionDescription(e.sdp);
        console.log(description);
        this.member[this.member.length - 1].peer.setRemoteDescription(description, () => {
          console.log('peerDescription');
          console.log('desctype= ', description.type);
          if (description.type === 'offer') {
            console.log('sdp type is offer');
            console.log(this.member[this.member.length - 1].peer);
            console.profile('answerFunction');
            console.profileEnd();
          }
        });
      }
      console.groupEnd();
    });
    // candidateを受け取る処理
    this.io.on('candidate', (e) => {
      console.groupCollapsed('ioのcandidate');
      if (this.member[this.member.length - 1].peer.localDescription.sdp !== e.sdp) {
        console.log('candis ok');
        if (e.candidate) {
          var candidate = new RTCIceCandidate(e.candidate);
          this.member[this.member.length - 1].peer.addIceCandidate(candidate);
        }
      }
      console.groupEnd();
    });
    console.groupEnd();
  }

  // sdpを送る処理
  offer(client) {
    console.groupCollapsed('offerFunction');
    console.log('this from offer');
    this.member[this.member.length - 1].peer.createOffer((offer) => {
      this.member[this.member.length - 1].peer.setLocalDescription(new RTCSessionDescription(offer), () => {
        console.log('HostSide', 'offer');
        console.log(client);
        this.io.emit('offer', {sdp: offer}, {client: client});
      });
    }, function (error) {
      console.log(error);
    });
    console.groupEnd();
    return;
  }

  message(e, bool = false) {
    if (!bool) {
      var value: string = this.name + ': ' + e;
      try {
        this.member.forEach((e) => {
          console.log('--------------------------------------------------------------------', e);
          e.channel.send(value);
        });
        // this.member[this.member.length - 1].channel.send(value);
      } catch (e) {
        console.log('message: ');
        console.log(e);
      }
    } else if (bool) {
      // sercretdice
      var value: string = this.name + ': ' + 'シークレットダイス';
      try {
        this.member.forEach((e) => {
          console.log('--------------------------------------------------------------------', e);
          e.channel.send(value);
        });
      } catch (e) {
        console.log('message: ');
        console.log(e);
      }
      value = this.name + ': ' + e;
    }
    this.data.next(value);
  }

  leave() {
    this.io.close();
    var value = this.name + 'が退出しました。';
    try {
      this.member.forEach((e) => {
        if (e.channel.readyState === 'open') {
          console.log('--------------------------------------------------------------------', e);
          e.channel.send(value); // closeのほうが早いのでこれ意味ないかも
          e.channel.close();
        }
      });
      // this.member[this.member.length - 1].channel.send(value);
    } catch (e) {
      console.log('leave: ');
      console.log(e);
    }
    this.member = [];
    this.data.next(null);
  }
}
