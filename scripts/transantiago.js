//http://www.transantiago.cl/predictor/prediccion?codsimt=PA420&codser=504
var generar = function(){
  var num_aleatorio = Math.round(Math.random()*(25000000-5000000))+5000000;
  var rut = new Rut(num_aleatorio.toString(), true);
  return rut.getNiceRut()
}


//var generarPlantilla = function (flag) {
//  var element = '<div id="template" style="height:250px; width:700px;">'+
  //                  '<div  style=" width: 150px;height: 150px;background-color:'+flag.color+'; border-radius:40px; float:left; margin-right:2px;">'+
    //                    '<p style="padding-left:46px;padding-top:10px; color:white; font-size:40px; "> '+
      //                  flag.servicio+
        //              '</p>'+
          //          '</div>     '+
            //        '<div style=" padding-top:1px; font-weight:bold; font-size:20px;" >'+
              //          '<p>Destino :'+ flag.destino+'<p>'+
                //        '<p>Tiempo estimado :'+flag.horaprediccionbus1 +'</p>'+
                  //      '<p>Siguiente bus a : '+flag.horaprediccionbus2+'</p>'+
    //                '</div>'+
      //            '</div>';
  //  return element;
//};


var generarPlantilla = function (items) {
  var arrItems = [];

  items.item.forEach(function (flag) {
    var arrField = {
      "title": flag.servicio,
      "value": "1ER bus "+ flag.horaprediccionbus1 + "\n 2DO bus :"+flag.horaprediccionbus2,
      "short":false
    };
    arrItems.push(arrField);
  });

    var element = {
      "attachments": [
          {
              "fallback": "Required plain-text summary of the attachment.",
              "color": "#36a64f",
              "pretext": "Consulta para la parada ",
              "text": "Tiempo de espera recorridos",
              "fields": arrItems,
              "footer": "TRANSANTIAGO",
              "footer_icon": "http://www.transantiago.cl/imagenes/paginas/20150720095411-10.png"

          }
      ]
  };
  return element;
}



module.exports = function(robot) {
  robot.respond(/transantiago(.*)/i, function(msg) {
    const args = msg.match[1].split(' ')[1];
    var resp = [];
    if(args){
      cod = args.toUpperCase();
        var url = 'http://www.transantiago.cl/predictor/prediccion?codsimt='+cod+'&codser=';
        console.log("url solicitud : " + url);
        robot.http(url).get()(function (err,res,body) {
          if(err || res.statusCode !==200){
            msg.send('Algo pasó, intente nuevamente.');
            return robot.emit('error', err || new Error(`Status code ${res.statusCode}`), msg)
          }
          if (body.indexOf('<') > -1) {
            msg.send('Error, verifique el codigo de paradero');
          }else{
            res.setEncoding('utf-8');
            var data = JSON.parse(body);
            if (data) {
              var element = 'payload= { '+
    '"username": "SALE BOT",'+
  '  "icon_url": "example.com/img/icon.jpg",'+
    '"attachments": [{'+
      '  "fallback": "This attachement isnt supported.",'+
        '"title": "VALENTINES DAY OFFER",'+
      '  "color": "#9C1A22",'+
        '"pretext": "Todays list of awesome offers picked for you",'+
        '"author_name": "Preethi",'+
        '"author_icon": "http://media02.hongkiat.com/author/preethi.jpg",'+
        '"fields": [{'+
          '  "title": "Sites",'+
          '  "value": "_<http://www.amazon.com|Amazon>_\n_<http://www.ebay.com|Ebay>_",'+
            '"short": true'+
      '  }, {'+
          '  "title": "Offer Code",'+
          '  "value": "UI90O22\n-",'+
            '"short": true'+
      '  }],'+
      '  "mrkdwn_in": ["text", "fields"],'+
    '    "text": "Just click the site names and start buying. Get *extra reduction with the offer code*, if provided.",'+
    '    "thumb_url": "http://example.com/thumbnail.jpg"'+
    '}]'+
'}';

               //generarPlantilla(data.servicios);
              msg.send(element);
            } else {
              msg.send('Error!');
            }
          }
        });
    }
  });
};
