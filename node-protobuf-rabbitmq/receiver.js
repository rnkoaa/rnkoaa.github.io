var amqp = require('amqplib/callback_api');
let protoBuf = require("protobufjs");
let byteBuffer = protoBuf.ByteBuffer;        

let builder = protoBuf.loadProtoFile('./searchRequest.proto');
let searchRequestProto = builder.build('SearchRequest');

amqp.connect('amqp://192.168.99.100', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'task_queue';

    ch.assertQueue(q, {durable: true});
    ch.prefetch(1);
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, function(msg) {
      var secs = msg.content.toString().split('.').length - 1;

      //console.log(searchRequestProto.decode(msg));
      let decodedMsg = searchRequestProto.decode(msg.content);
    //  console.log(decodedMsg);
      console.log(" [x] Received %s", decodedMsg);
      setTimeout(function() {
        console.log(" [x] Done");
        ch.ack(msg);
      }, secs * 1000);
    }, {noAck: false});
  });
});