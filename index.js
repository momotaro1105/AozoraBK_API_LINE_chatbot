'use strict';
    
const line = require('@line/bot-sdk');
const request = require('request');
    
const config = {
    channelSecret: 'channelSecret',
    channelAccessToken: 'channelAccessToken'
};
    
const client = new line.Client(config);
    
exports.handler = (event, context) => {
    
    console.log(event);
    
    const replyToken = JSON.parse(event.body).events[0].replyToken;
    
    let reqMessage = JSON.parse(event.body).events[0].message.text;
    let resMessage = "";
    
    if (reqMessage == 'おはよう') {
        resMessage = 'ゆっくり寝れました？';
        return client.replyMessage(
        replyToken, 
        {
            'type': 'text',
            'text': resMessage
        });
        
    } else if (reqMessage == '残高') {
        resMessage;
        
        var request = require('request');
        var options = {
          'method': 'GET',
          'url': 'https://api.sunabar.gmo-aozora.com/personal/v1/accounts/balances',
          'headers': {
            'Accept': 'application/json;charset=UTF-8',
            'Content-Type': 'application/json;charset=UTF-8',
            'x-access-token': 'Y2RlOGU1ZWI5YTI2NzQwZGRhNTc4OWY4'
          }
        };
        
        request(options, function (error, response) {
          if (error) throw new Error(error);
          console.log(response.body);
          const data = JSON.parse(response.body);
          const balance = parseInt(data.balances[0].balance);
          console.log(balance.toLocaleString());
          resMessage = balance.toLocaleString() + '円';
          
          return client.replyMessage(
            replyToken, 
            {
                'type': 'text',
                'text': resMessage
            });
        });
        
        
   } else if (reqMessage == '明細') {
        resMessage;
        
        var request = require('request');
        var options = {
          'method': 'GET',
          'url': 'https://api.sunabar.gmo-aozora.com/personal/v1/accounts/transactions?accountId=301010004787&dateFrom=2022-08-09&dateTo=2022-09-01&nextItemKey=0',
          'headers': {
            'Accept': 'application/json;charset=UTF-8',
            'Content-Type': 'application/json;charset=UTF-8',
            'x-access-token': 'Y2RlOGU1ZWI5YTI2NzQwZGRhNTc4OWY4'
          }
        };
        
        request(options, function (error, response) {
          if (error) throw new Error(error);
          console.log(response.body);
          const data = JSON.parse(response.body);
          const count = data.count;
          
          if (count == 0) {
              resMessage = '本日の入金はありません';
          } else if (count > 0) {
              resMessage = '本日の入金明細:\n';
              for (let i=0; i<count; i++) {
                  if (data.transactions[i].transactionType === '1') {
                      resMessage += '入金　';
                  } else {
                      resMessage += '振込　';
                  }
                  resMessage += data.transactions[i].amount + '円 ' + data.transactions[i].remarks + '\n';
              }
                return client.replyMessage(
                replyToken, 
                {
                    'type': 'text',
                    'text': resMessage
                });
          }
        });

        
   } else if (reqMessage == '振込') {
        resMessage;
        
        var request = require('request');
        var options = {
          'method': 'POST',
          'url': 'https://api.sunabar.gmo-aozora.com/personal/v1/transfer/request',
          'headers': {
            'Accept': 'application/json;charset=UTF-8',
            'Content-Type': 'application/json;charset=UTF-8',
            'x-access-token': 'Y2RlOGU1ZWI5YTI2NzQwZGRhNTc4OWY4'
          },
          body: '{ \n	"accountId":"301010004787",\n	"transferDesignatedDate":"2022-08-09", \n	"transferDateHolidayCode":"1", \n	"totalCount":"1", \n	"totalAmount":"30000", \n	"transfers":\n	[\n		{ \n			"itemId":"1", \n			"transferAmount":"30000", \n			"beneficiaryBankCode":"0310",\n			"beneficiaryBranchCode":"301", \n			"accountTypeCode":"1", \n			"accountNumber":"0004770", \n			"beneficiaryName":"ｽﾅﾊﾞﾘｵ"\n		}\n	] \n}'
            
        };

        request(options, function (error, response) {
          if (error) throw new Error(error);
          const data = JSON.parse(response.body);
          console.log(data);
          
          if (data.resultCode == '2'){
            resMessage += '振込受付番号： ' + data.applyNo +  'で振込受付完了しました\n' + 'ログインしてお知らせからパスワードを入力してください\n' + 'https://bank.sunabar.gmo-aozora.com/bank/notices/important';
          }
            return client.replyMessage(
            replyToken, 
            {
                'type': 'text',
                'text': resMessage
            });
        });
        
    } else {
        return client.replyMessage(
        replyToken, 
        {
            'type': 'text',
            'text': '残高？明細？振込？'
        });
    }
};