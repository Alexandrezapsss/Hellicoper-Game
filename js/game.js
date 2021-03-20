// iniciate function start
function start() {
    $("#inicioGame").hide(); //Ocult window iniciate

    $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
    $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
    $("#fundoGame").append("<div id='inimigo2'></div>");
    $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
    $("#fundoGame").append("<div id='placar'></div>");
    $("#fundoGame").append("<div id='energia'></div>");



    //Principais variaveis do game

    var jogo = {};
    var fimdejogo = false;
    var energiaAtual = 3;
    var TECLA = {
        W: 87,
        S: 83,
        D: 68
    };

    jogo.pressionou = [];

    var velocidade = 5;
    var posicaoY = parseInt(Math.random() * 334);//vai variar a posição do inimigo1 de posição entre 0 e 334.
    var podeAtirar = true;
    //Variaveis paraas pontuações
    var pontos = 0;
    var salvos = 0;
    var perdidos = 0;
    //Variaveis para os sons do Game.
    var somDisparo=document.getElementById("somDisparo");
    var somExplosao=document.getElementById("somExplosao");
    var musica=document.getElementById("musica");
    var somGameover=document.getElementById("somGameover");
    var somPerdido=document.getElementById("somPerdido");
    var somResgate=document.getElementById("somResgate");

    //fim das variaveis do game.

    //Função para tocar a musica de fundo.

    //Música em loop
    musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false);
    musica.play();
    //Fim Musica de Fundo

    //Verifica se o Jogador Pressionou uma tecla
    $(document).keydown(function (e) { // o "keydown verifica se tem alguma tecla pressionada"
        jogo.pressionou[e.which] = true;
    });

    $(document).keyup(function (e) {
        jogo.pressionou[e.which] = false;
    })

    //fim da verificação de tecla

    //Game Loop 
    jogo.time = setInterval(loop, 30); //Para pegar a variavel "jogo", e aplicar um time para repetir a função "loop"

    function loop() {

        movefundo();
        movejogador();
        moveinimigo1();
        moveinimigo2();
        moveamigo();
        colisao();
        placar();
        energia();
    }
    // Fim da função "loop"

    //Inicio da função para se mover o fundo

    function movefundo() {
        //Lembre ela só está subtraindo 1px, o efeito de fato da animação e pelo fato da função está sendo chamada no loop a cada 30 milisegundos.
        esquerda = parseInt($("#fundoGame").css("background-position")); //Criamos uma variavel "esquerda" e pegamos a div e sua posição definida pelo css e convertemos para um valor tipo INT pois sua posição inicial vai ser convertida para 0 
        $("#fundoGame").css("background-position", esquerda - 1);//Animação para mover a esquerda como indicamos a variavel que a sua posição e zero para realizar a animação usamos uma operação no background position que "-1" para imagem ser puxada para a esqueda da sua posição inicial que é 0    
    }
    //Fim da função mover o fundo

    //Função para Mover o Jogador - Ela foi chamda na função loop para ser constantemente chamada.

    function movejogador() {
        if (jogo.pressionou[TECLA.W]) {
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top", topo - 10);
            //Chamar uma condição para evitar que o helicoptero saia da tela
            if (topo <= 0) {
                $("#jogador").css("top", topo + 10);

            }//Fim da verificação do helicoptero dentro da tela
        }
        if (jogo.pressionou[TECLA.S]) {
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top", topo + 10);
            //Evitar que o heicoptero saia da tela por baixo
            if (topo >= 434) {
                $("#jogador").css("top", topo - 10);
            }// fim da verificação dentro da tela "Baixo".
        }
        if (jogo.pressionou[TECLA.D]) {
            //Função para disparo
            disparo();
        }
    }
    //Fim da função mover jogador

    //Começo da Função para mover o inimigo 1 tem que criar um valor randomico para alterar a posição do mesmo.

    function moveinimigo1() {
        posicaoX = parseInt($("#inimigo1").css("left"));
        $("#inimigo1").css("left", posicaoX - velocidade);
        $("#inimigo1").css("top", posicaoY);

        if (posicaoX <= 0) {
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
        }
    }
    //Fim da Função do Mover inimigo 1

    //Começo da Função Mover Inimigo2
    function moveinimigo2() {
        posicaoX = parseInt($("#inimigo2").css("left"));
        $("#inimigo2").css("left", posicaoX - 3);

        if (posicaoX <= 0) {

            $("#inimigo2").css("left", 775);

        }
    } // Fim da função Move inimigo2

    //Começo da Função Para mover o amigo

    function moveamigo() {

        posicaoX = parseInt($("#amigo").css("left"));
        $("#amigo").css("left", posicaoX + 1);

        if (posicaoX > 906) {

            $("#amigo").css("left", 0);

        }

    } // fim da função Mover amigo

    //Função para disparo.

    function disparo() {
        if (podeAtirar == true) {
            somDisparo.play();
            podeAtirar = false;

            topo = parseInt($("#jogador").css("top"));
            posicaoX = parseInt($("#jogador").css("left"))
            tiroX = posicaoX + 190;
            topoTiro = topo + 37;
            $("#fundoGame").append("<div id='disparo'></div");
            $("#disparo").css("top", topoTiro);
            $("#disparo").css("left", tiroX);

            var tempoDisparo = window.setInterval(executaDisparo, 30);

        } //Fecha podeAtirar
        function executaDisparo() {
            posicaoX = parseInt($("#disparo").css("left"));
            $("#disparo").css("left", posicaoX + 15);
            if (posicaoX > 900) {
                window.clearInterval(tempoDisparo);
                tempoDisparo = null;
                $("#disparo").remove();
                podeAtirar = true;
            }
        }// Fecha o Executa Disparo
    }// Fim do Disparo

    //Função para Detectar a Colisoes - JQUERY COLLISION
    function colisao() {
        var colisao1 = ($("#jogador").collision($("#inimigo1")));
        var colisao2 = ($("#jogador").collision($("#inimigo2")));
        var colisao3 = ($("#disparo").collision($("#inimigo1")));
        var colisao4 = ($("#disparo").collision($("#inimigo2")));
        var colisao5 = ($("#jogador").collision($("#amigo")));
        var colisao6 = ($("#inimigo2").collision($("#amigo")));
        // jogador com o inimigo1

        if (colisao1.length > 0) {
            energiaAtual--;
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X, inimigo1Y);

            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
        }
        //fim jogador com o inimigo 1

        // jogador com o inimigo2 
        if (colisao2.length > 0) {
            energiaAtual--;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2(inimigo2X, inimigo2Y);

            $("#inimigo2").remove();

            reposicionaInimigo2();

        }
        //Fim Jogador com o Inimigo 2

        // Disparo com o inimigo1

        if (colisao3.length > 0) {
            velocidade= velocidade + 0.2; // Aumenta a Dificuldade quando o inimigo é abatido pelo tiro.
            pontos = pontos + 100;
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));

            explosao1(inimigo1X, inimigo1Y);
            $("#disparo").css("left", 950);

            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);

        }//Fim dispararo inimigo 1

        // Disparo com o inimigo2

        if (colisao4.length > 0) {
            pontos = pontos + 50;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            $("#inimigo2").remove();

            explosao2(inimigo2X, inimigo2Y);
            $("#disparo").css("left", 950);

            reposicionaInimigo2();

        }//Fim Disparo inimigo 2

        // jogador com o amigo
        if (colisao5.length > 0) {
            somResgate.play();
            salvos++;
            reposicionaAmigo();
            $("#amigo").remove();
        }
        //Fim do Jogador com amigo

        //Inimigo2 com o amigo

        if (colisao6.length > 0) {
            perdidos++;
            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            explosao3(amigoX, amigoY);
            $("#amigo").remove();

            reposicionaAmigo();

        }
        //Fim Colisao do inimigo com amigo

    } //Fim da função colisao()

    //Função para as Explosoes
    //Explosão 1
    function explosao1(inimigo1X, inimigo1Y) {
        somExplosao.play();
        $("#fundoGame").append("<div id='explosao1'></div");
        $("#explosao1").css("background-image", "url(imgs/explosao.png)");
        var div = $("#explosao1");
        div.css("top", inimigo1Y);
        div.css("left", inimigo1X);
        div.animate({ width: 200, opacity: 0 }, "slow");

        var tempoExplosao = window.setInterval(removeExplosao, 1000);

        function removeExplosao() {

            div.remove();
            window.clearInterval(tempoExplosao);
            tempoExplosao = null;

        }

    } // Fim da função explosao1()

    //Reposiciona Inimigo2

    function reposicionaInimigo2() {

        var tempoColisao4 = window.setInterval(reposiciona4, 5000);

        function reposiciona4() {
            window.clearInterval(tempoColisao4);
            tempoColisao4 = null;

            if (fimdejogo == false) {

                $("#fundoGame").append("<div id=inimigo2></div");

            }

        }
    }// Fim do reposiona o inimigo 2

    //Explosão2

    function explosao2(inimigo2X, inimigo2Y) {
        somExplosao.play();
        $("#fundoGame").append("<div id='explosao2'></div");
        $("#explosao2").css("background-image", "url(imgs/explosao.png)");
        var div2 = $("#explosao2");
        div2.css("top", inimigo2Y);
        div2.css("left", inimigo2X);
        div2.animate({ width: 200, opacity: 0 }, "slow");

        var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);

        function removeExplosao2() {

            div2.remove();
            window.clearInterval(tempoExplosao2);
            tempoExplosao2 = null;

        }


    }
    // Fim da função explosao2()

    //Explosão3

    function explosao3(amigoX, amigoY) {
        somPerdido.play();
        $("#fundoGame").append("<div id='explosao3' class='anima4'></div");
        $("#explosao3").css("top", amigoY);
        $("#explosao3").css("left", amigoX);
        var tempoExplosao3 = window.setInterval(resetaExplosao3, 1000);
        function resetaExplosao3() {
            $("#explosao3").remove();
            window.clearInterval(tempoExplosao3);
            tempoExplosao3 = null;

        }

    }
    // Fim da função explosao3

    //Reposiciona Amigo

    function reposicionaAmigo() {

        var tempoAmigo = window.setInterval(reposiciona6, 6000);

        function reposiciona6() {
            window.clearInterval(tempoAmigo);
            tempoAmigo = null;

            if (fimdejogo == false) {

                $("#fundoGame").append("<div id='amigo' class='anima3'></div>");

            }

        }

    } // Fim da função reposicionaAmigo()
    // vai somente calcular as pontuações
    function placar() {

        $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");

    } //fim da função placar()

    //Barra de energia

    function energia() {

        if (energiaAtual == 3) {

            $("#energia").css("background-image", "url(imgs/energia3.png)");
        }

        if (energiaAtual == 2) {

            $("#energia").css("background-image", "url(imgs/energia2.png)");
        }

        if (energiaAtual == 1) {

            $("#energia").css("background-image", "url(imgs/energia1.png)");
        }

        if (energiaAtual == 0) {

            $("#energia").css("background-image", "url(imgs/energia0.png)");

            //Função Game Over pois a Barra de energia está no 0 
            gameOver();
        }

    } // Fim da função energia()
    //Inicio da Função Game over
    function gameOver() {
        fimdejogo=true;
        musica.pause();
        somGameover.play();
        
        window.clearInterval(jogo.timer);
        jogo.timer=null;
        
        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();
        
        $("#fundoGame").append("<div id='fim'></div>");
        
        $("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>");
        } // Fim da função gameOver();

}//Fim da Função Start   

//Reinicia o Jogo
		
function reiniciaJogo() {
	somGameover.pause();
	$("#fim").remove();
	start();
	
} //Fim da função reiniciaJogo