var amqp = require('amqplib/callback_api');
let protoBuf = require("protobufjs");
let byteBuffer = protoBuf.ByteBuffer;        

let builder = protoBuf.loadProtoFile('./searchRequest.proto');
let searchRequestProto = builder.build('SearchRequest');

let searchRequest = {
    query: "Hello, World",
    page_number: 1,
    result_per_page: 10
};

amqp.connect('amqp://192.168.99.100', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'task_queue';
    searchRequest.query = process.argv.slice(2).join(' ') || "Hello World!";
    var msg = searchRequestProto.encode(searchRequest).toBuffer();

    ch.assertQueue(q, {durable: true});
    ch.sendToQueue(q, new Buffer(msg), {persistent: false});
   // console.log(" [x] Sent '%s'", msg);
  });
  setTimeout(function() { conn.close(); process.exit(0) }, 500);
}); 
