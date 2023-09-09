var radius = 240; // qual o tamanho do raio
var autoRotate = true; //rotação automática ou não
var rotateSpeed = -60;// unidade: segundos/360 graus
var imgWidth = 120;//largura das imagens (unidade: px)
var imgHeight = 170; // altura das imagens (unidade: px)

// Link da música de fundo - defina 'null' se você não quiser tocar música de fundo
var bgMusicURL = 'https://api.soundcloud.com/tracks/143041228/stream?client_id=587aa2d384f7333a886010d5f52f302a';
var bgMusicControls = true; //Mostra o controle de música da UI

/*
 NOTE:
       + imgWidth, imgHeight will work for video
       + if imgWidth, imgHeight too small, play/pause button in <video> will be hidden
*/

//===================== start =======================
// animação começa após 1000 milissegundos
setTimeout (init, 1000);

//Define os elementos do DOM
var odrag = document.getElementById('drag-container');
var ospin = document.getElementById('spin-container');
var aImg = ospin.getElementsByTagName('img');
var aVid = ospin.getElementsByTagName('video');
var aEle = [...aImg, ...aVid]; //combinar 2 arrays

//Tamanho das imagens
ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";

//Tamanho do terreno - depende do raio
var ground = document.getElementById('ground');
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

//Inicialização do elementos
function init(deLayTime) {
      for (var i = 0; i < aEle.length; i++) {
            //Define a transformação para cada elemento
            aEle[i].style.transform = "rotateY(" + (i * (360 / aEle.length)) + "deg) translateZ(" + radius + "px)";
            aEle[i].style.transition = "transform 1s";
            aEle[i].style.transitionDelay = deLayTime || (aEle.length - i) / 4 + "s";
      }
}

//Aplica a transformação a um objeto
function applyTranform(obj) {
      //Restringir o ângulo da câmera (entre 0 e 180)
      if(tY > 180) tY = 180;
      if(tY < 0) tY = 0;

      //Aplique o ângulo
      obj.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)";
}

function playSpin(yes){
      ospin.style.animationPlayState = (yes?'running':'paused');
}

var sX, sY, nX, nY, desX = 0,
      desY = 0,
      tX = 0,
      tY = 10;

//rotação automática
if (autoRotate) {
      var animationName = (rotateSpeed > 0 ? 'spin' : 'spinRevert');
      ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
}

//adiciona música de fundo
if (bgMusicURL) {
      document.getElementById('music-container').innerHTML += `
      <audio src="${bgMusicURL}" ${bgMusicControls? 'controls': ''} autoplay loop><p>Se você está lendo isso é porque seu navegador não suporta o elemento áudio.</p></audio>
      `;
}

//Evento de clique e arraste
document.onpointerdown = function (e) {
      clearInterval(odrag.timer);
      e = e || window.event;
      var sX = e.clientX,
      sY = e.clientY;

      this.onpointermove = function (e){
            e = e || window.event;
            var nX = e.clientX;
            var nY = e.clientY;
            desX = nX - sX;
            desY = nY - sY;
            tX += desX * 0.1;
            tY += desY * 0.1;
            applyTranform(odrag);
            sX = nX;
            sY = nY;
      };

      this.onponterup = function (e) {
            odrag.timer = setInterval(function () {
                  desX *= 0.95;
                  desY *= 0.95;
                  tX += desX * 0.1;
                  tY += desY * 0.1;
                  applyTranform(odrag);
                  playSpin(false);
                  if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
                        clearInterval(odrag.timer);
                        playSpin(true);
                  }
            }, 17);
            this.onpointermove = this.onpointerup = null;
      };

      return false;
};

//Evento de ratação usando a roda do mouse
document.onmousewheel = function(e) {
      e = e || window.event;
      var d = e.wheelDelta / 20 || -e.detail;
      radius += d;
      init(1);
};