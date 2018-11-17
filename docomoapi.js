/**
 * Copyright (c) 2016- 2018 Kota Suizu
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 **/

module.exports = function(RED) {
  "use strict";
  var request = require('request');

  var DIALOGUE_REGIST_URL = 'https://api.apigw.smt.docomo.ne.jp/naturalChatting/v1/registration?APIKEY=';
  var DIALOGUE_URL = 'https://api.apigw.smt.docomo.ne.jp/naturalChatting/v1/dialogue?APIKEY=';

  var KNOWLEDGEQA_REGIST_URL = 'https://api.apigw.smt.docomo.ne.jp/naturalKnowledge/v1/registration?APIKEY=';
  var KNOWLEDGEQA_URL = 'https://api.apigw.smt.docomo.ne.jp/naturalKnowledge/v1/dialogue?APIKEY=';

  // APIKey情報を保持するConfig
  function DocomoAPIConfig(n) {
    RED.nodes.createNode(this, n);
    this.key = n.key;
    var credentials = this.credentials;
    if ((credentials) && (credentials.hasOwnProperty("key"))) {
      this.key = credentials.key;
    }
  }
  RED.nodes.registerType("docomoapi-config", DocomoAPIConfig, {
    credentials: {
      key: {
        type: "password"
      }
    }
  });


  // NaturalChatting Registration NodeIO処理
  function NaturalChattingRegistration(n) {
    RED.nodes.createNode(this, n);

    this.docomoapiConfig = RED.nodes.getNode(n.docomoapiconfig);
    this.botid = n.botid;
    this.appkind = n.appkind;

    var node = this;
    this.on('input', function(msg) {

      if (_isTypeOf('String', msg.payload.botid)) {
        node.botid = msg.payload.botId;
      }

      if (_isTypeOf('String', msg.payload.appKind)) {
        node.appkind = msg.payload.appKind;
      }

      var myUrl = "";
      if (node.botid === "Chatting") {
        myUrl = DIALOGUE_REGIST_URL + node.docomoapiConfig.key;
      } else if (node.botid === "Knowledge") {
        myUrl = KNOWLEDGEQA_REGIST_URL + node.docomoapiConfig.key;
      }



      var requestBody = {
        'botId': node.botid,
        'appKind': node.appkind
      };
      // console.log("▼ requestBody");
      // console.log(requestBody);

      var options = {
        url: myUrl,
        headers: {
          'Content-Type': 'application/json'
        },
        // auth: {
        //     user: "",
        //     password: ""
        // },
        json: true,
        body: requestBody
      };

      request.post(options, function(err, response, body) {
        if (response.statusCode === 200) {
          msg.payload = body;
          node.send(msg);
          node.log(RED._('Succeeded to API Call.'));
        } else {
          node.error("Failed to API Call. StatusCode is " + response.statusCode + ".");
        };
      });

    });
  }
  RED.nodes.registerType("NaturalChattingRegistration", NaturalChattingRegistration);


  // Dialogue NodeIO処理
  function Dialogue(n) {
    RED.nodes.createNode(this, n);

    this.docomoapiConfig = RED.nodes.getNode(n.docomoapiconfig);

    var node = this;
    this.on('input', function(msg) {
      if (_isTypeOf('String', msg.payload.voiceText)) {

      } else {
        node.error("Failed to API Call. [msg.payload.utt] is not String.");
      }

      if (_isTypeOf('String', msg.payload.appId)) {

      } else {
        node.error("Failed to API Call. [msg.payload.appId] is not String.");
      }

      var myTime = _getCurrentTime();
      var appRecvTime;
      if (_isTypeOf('String', msg.payload.appRecvTime)) {
        appRecvTime = msg.payload.appRecvTime;
      } else {
        appRecvTime = myTime;
      }

      var myUrl = DIALOGUE_URL + node.docomoapiConfig.key;

      // var clientData = {
      //     'option' : {
      //         'nickname' : '',
      //         'nicknameY' : '',
      //         'sex' : '',
      //         'bloodtype' : '',
      //         'birthdateY' : '',
      //         'birthdateM' : '',
      //         'birthdateD' : '',
      //         'age' : '',
      //         'constellations' : '',
      //         'place' : '',
      //         'mode' : '',
      //         't' : ''
      //     }
      // }


      var requestBody = {
        'language': 'ja-JP', // 必須　String (ja-JP)
        'botId': 'Chatting', // 必須　String (Chatting)
        'appId': msg.payload.appId, // 必須　String
        'voiceText': msg.payload.voiceText, // 必須　String (200)
        'clientData': msg.payload.clientData, // Object
        'appRecvTime': appRecvTime, // 必須　String (yyyy-MM-dd hh:mm:ss)
        'appSendTime': myTime // 必須　String (yyyy-MM-dd hh:mm:ss)
      };


      var options = {
        url: myUrl,
        headers: {
          'Content-Type': 'application/json'
        },
        // auth: {
        //     user: "",
        //     password: ""
        // },
        json: true,
        body: requestBody
      };

      request.post(options, function(err, response, body) {
        if (response.statusCode === 200) {
          msg.payload = body;
          node.send(msg);
          node.log(RED._('Succeeded to API Call.'));
        } else {
          node.error("Failed to API Call. StatusCode is " + response.statusCode + ".");
        };
      });
    });
  }
  RED.nodes.registerType("Dialogue", Dialogue);





  // KnowledgeQA NodeIO処理
  function KnowledgeQA(n) {
    RED.nodes.createNode(this, n);

    this.docomoapiConfig = RED.nodes.getNode(n.docomoapiconfig);

    var node = this;
    this.on('input', function(msg) {
      if (_isTypeOf('String', msg.payload.voiceText)) {

      } else {
        node.error("Failed to API Call. [msg.payload.utt] is not String.");
      }

      if (_isTypeOf('String', msg.payload.appId)) {

      } else {
        node.error("Failed to API Call. [msg.payload.appId] is not String.");
      }

      var myTime = _getCurrentTime();
      var appRecvTime;
      if (_isTypeOf('String', msg.payload.appRecvTime)) {
        appRecvTime = msg.payload.appRecvTime;
      } else {
        appRecvTime = myTime;
      }

      var myUrl = KNOWLEDGEQA_URL + node.docomoapiConfig.key;


      var requestBody = {
        'language': 'ja-JP', // 必須　String (ja-JP)
        'botId': 'Knowledge', // 必須　String (Knowledge)
        'appId': msg.payload.appId, // 必須　String
        'voiceText': msg.payload.voiceText, // 必須　String (200)
        'appRecvTime': appRecvTime, // 必須　String (yyyy-MM-dd hh:mm:ss)
        'appSendTime': myTime // 必須　String (yyyy-MM-dd hh:mm:ss)
      };


      var options = {
        url: myUrl,
        headers: {
          'Content-Type': 'application/json'
        },
        // auth: {
        //     user: "",
        //     password: ""
        // },
        json: true,
        body: requestBody
      };

      request.post(options, function(err, response, body) {
        if (response.statusCode === 200) {
          msg.payload = body;
          node.send(msg);
          node.log(RED._('Succeeded to API Call.'));
        } else {
          node.error("Failed to API Call. StatusCode is " + response.statusCode + ".");
        };
      });
    });
  }
  RED.nodes.registerType("KnowledgeQA", KnowledgeQA);



  function _isTypeOf(type, obj) {
    var clas = Object.prototype.toString.call(obj).slice(8, -1);
    return obj !== undefined && obj !== null && clas === type;
  }

  function _getCurrentTime() {
    var date = new Date();
    date.setHours(date.getHours() + 9);
    var d = date.getFullYear() + '-';
    d += ('00' + (date.getMonth() + 1)).slice(-2) + '-';
    d += ('00' + date.getDate()).slice(-2) + ' ';
    d += ('00' + date.getHours()).slice(-2) + ':';
    d += ('00' + date.getMinutes()).slice(-2) + ':';
    d += ('00' + date.getSeconds()).slice(-2);
    return d;
  }

}
