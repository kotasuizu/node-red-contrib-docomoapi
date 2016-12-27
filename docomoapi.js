/**
 * Copyright (c) 2016 Kota Suizu
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 **/

module.exports = function(RED) {
    "use strict";
    var request = require('request');

    var DIALOGUE_URL = 'https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue?APIKEY=';

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

    // Dialogue NodeIO処理
    function Dialogue(n) {
        RED.nodes.createNode(this, n);

        this.docomoapiConfig = RED.nodes.getNode(n.docomoapiconfig);

        var node = this;
        this.on('input', function(msg) {
            if (_isTypeOf('String', msg.payload.utt)) {

                var myUrl = DIALOGUE_URL + node.docomoapiConfig.key;

                var requestBody = {
                    "utt": msg.payload.utt, // 必須　String
                    "context": msg.payload.context, // String
                    "nickname": msg.payload.nickname, // String
                    "nickname_y": msg.payload.nickname_y, // String カタカナ
                    "sex": msg.payload.sex, // String 男 or 女
                    "bloodtype": msg.payload.bloodtype, // String A, B, O, AB
                    "birthdateY": msg.payload.birthdateY, // int
                    "birthdateM": msg.payload.birthdateM, // int
                    "birthdateD": msg.payload.birthdateD, // int
                    "age": msg.payload.age, // int
                    "constellations": msg.payload.constellations, // String 星座名
                    "place": msg.payload.place, // String
                    "mode": msg.payload.mode, // String dialog or srtr
                    "t": msg.payload.t // int
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
            } else {
                node.error("Failed to API Call. Payload is not String.");
            }
        });
    }
    RED.nodes.registerType("Dialogue", Dialogue);

    function _isTypeOf(type, obj) {
        var clas = Object.prototype.toString.call(obj).slice(8, -1);
        return obj !== undefined && obj !== null && clas === type;
    }
}
