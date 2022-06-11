var versionCode = "alfa 0.9";
//CANVAS WIDTH AND HEIGHT
var WIDTH = 600;
var HEIGHT = 600;

var COLORS = {white: "rgb(255, 255, 255)", black: "rgb(7, 5, 14)", blue: "rgb(27, 12, 242)", red: "rgb(242, 2, 2)"};

//Tablero 9*9
var tablero = [

    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]

];

var tableroP = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var mousePosX = 0;
var mousePosY = 0;
var clic = false;

var canvas = document.getElementById("TableroVista");
var ctx = canvas.getContext("2d");

var turnoActual = 1;
var jugador = 1;
var ai = -1;
var tableroactual = 4;

var juego_actual = false;

var CICLOS = 0;

var MOVIMEINTO = 0;

var switchAroo = 1;

var AIACTIVE = true;

var Nombre_jugador = ["jugador", "Agente"];

// --- Funciones ---

//Verifica si hay algun ganador, si hay algun ganador regresa 1, si no -1, en empate 0.
function Ganador(comprobacion) {
    var g = 1;
    if (comprobacion[0] + comprobacion[1] + comprobacion[2] === g * 3 || comprobacion[3] + comprobacion[4] + comprobacion[5] === g * 3 || comprobacion[6] + comprobacion[7] + comprobacion[8] === g * 3 || comprobacion[0] + comprobacion[3] + comprobacion[6] === g * 3 || comprobacion[1] + comprobacion[4] + comprobacion[7] === g * 3 ||
        comprobacion[2] + comprobacion[5] + comprobacion[8] === g * 3 || comprobacion[0] + comprobacion[4] + comprobacion[8] === g * 3 || comprobacion[2] + comprobacion[4] + comprobacion[6] === g* 3) {
        return g;
    }
    g = -1;
    if (comprobacion[0] + comprobacion[1] + comprobacion[2] === g * 3 || comprobacion[3] + comprobacion[4] + comprobacion[5] === g * 3 || comprobacion[6] + comprobacion[7] + comprobacion[8] === g* 3 || comprobacion[0] + comprobacion[3] + comprobacion[6] === g * 3 || comprobacion[1] + comprobacion[4] + comprobacion[7] === g * 3 ||
        comprobacion[2] + comprobacion[5] + comprobacion[8] === g * 3 || comprobacion[0] + comprobacion[4] + comprobacion[8] === g* 3 || comprobacion[2] + comprobacion[4] + comprobacion[6] === g * 3) {
        return g;
    }
    return 0;
}

//Verifica el estado del juego
function evaluacion(posicion, tableroactual) {
    var evale = 0;
    var tab = [];
    var evaluador = [1.4, 1, 1.4, 1, 1.75, 1, 1.4, 1, 1.4];
    for (var eh = 0; eh < 9; eh++){
        evale += evaluacionJusta(posicion[eh])*1.5*evaluador[eh];
        if(eh === tableroactual){
            evale += evaluacionJusta(posicion[eh])*evaluador[eh];
        }
        var tmpEv = Ganador(posicion[eh]);
        evale -= tmpEv*evaluador[eh];
        tab.push(tmpEv);
    }
    evale -= Ganador(tab)*5000;
    evale += evaluacionJusta(tab)*150;
    return evale;
}

//Funcion MinMax
function MinMax(posicion, tableroX, profundidad, alfa, beta, jugadorMinMax) {
    CICLOS++;

    var tmpPlay = -1;

    var calcEval = evaluacion(posicion, tableroX);
    if(profundidad <= 0 || Math.abs(calcEval) > 5000) {
        return {"mE": calcEval, "tP": tmpPlay};
    }
    //si ya esta ganada una partidad -1
    if(tableroX !== -1 && Ganador(posicion[tableroX]) !== 0){
        tableroX = -1;
    }
    //En caso de que el tablero este lleno -1
    if(tableroX !== -1 && !posicion[tableroX].includes(0)){
        tableroX = -1;
    }

    if(jugadorMinMax){
        var maxEval = -Infinity;
        for(var mm = 0; mm < 9; mm++){
            var evalut = -Infinity;
            //Cuando se tiene un movimiento libre
            if(tableroX === -1){
                for(var trr = 0; trr < 9; trr++){
                    //Tableros ya ganados
                    if(Ganador(posicion[mm]) === 0){
                        if(posicion[mm][trr] === 0){
                            posicion[mm][trr] = ai;
                            evalut = MinMax(posicion, trr, profundidad-1, alfa, beta, false).mE;
                            posicion[mm][trr] = 0;
                        }
                        if(evalut > maxEval){
                            maxEval = evalut;
                            tmpPlay = mm;
                        }
                        alfa = Math.max(alfa, evalut);
                    }
                }
                if(beta <= alfa){
                    break;
                }
            //Cuando se establece un tablero, solo recorre este.
            }else{
                if(posicion[tableroX][mm] === 0){
                    posicion[tableroX][mm] = ai;
                    evalut = MinMax(posicion, mm, profundidad-1, alfa, beta, false);
                    posicion[tableroX][mm] = 0;
                }
                var blop = evalut.mE;
                if(blop > maxEval){
                    maxEval = blop;
                    //Guarda el tablero que se esta juganfo
                    tmpPlay = evalut.tP;
                }
                alfa = Math.max(alfa, blop);
                if(beta <= alfa){
                    break;
                }
            }
        }
        return {"mE": maxEval, "tP": tmpPlay};
    }else{
        //para el caso min
        var minEval = Infinity;
        for(var mm = 0; mm < 9; mm++){
            var evalua = Infinity;
            if(tableroX === -1){
                for(var trr = 0; trr < 9; trr++){
                    if(Ganador(posicion[mm]) === 0){
                        if(posicion[mm][trr] === 0){
                            posicion[mm][trr] = jugador;
                            evalua = MinMax(posicion, trr, profundidad-1, alfa, beta, true).mE;
                            posicion[mm][trr] = 0;
                        }
                        if(evalua < minEval){
                            minEval = evalua;
                            tmpPlay = mm;
                        }
                        beta = Math.min(beta, evalua);
                    }

                }
                if(beta <= alfa){
                    break;
                }
            }else{
                if(posicion[tableroX][mm] === 0){
                    posicion[tableroX][mm] = jugador;
                    evalua = MinMax(posicion, mm, profundidad-1, alfa, beta, true);
                    posicion[tableroX][mm] = 0;
                }
                var blep = evalua.mE;
                if(blep < minEval){
                    minEval = blep;
                    tmpPlay = evalua.tP;
                }
                beta = Math.min(beta, blep);
                if(beta <= alfa){
                    break;
                }
            }
        }
        return {"mE": minEval, "tP": tmpPlay};
    }
}

//MinMax para evaluar
function MinMax_UnTablero(posicion, profundidad, alfa, beta, jugadorMinMax) {
    CICLOS++;

    if(Ganador(posicion) !== 0){
        if(profundidad > 0){
            return -Ganador(posicion)*10-signo(-Ganador(posicion))*profundidad*0.5;
        }else{
            return -Ganador(posicion)*10-signo(-Ganador(posicion))*profundidad*0.1;
        }
    }

    var contador = 0;
    for(var i = 0; i < 9; i++){
        if(posicion[i] !== 0) contador++;
    }
    if(contador === 9 || profundidad === 1000){return 0;}

    if(jugadorMinMax){
        var maxEval = -Infinity;
        for(var t in posicion){
            if(posicion[t] === 0){
                posicion[t] = ai;
                var evalu = MinMax_UnTablero(posicion, profundidad+1, alfa, beta, false);
                posicion[t] = 0;
                maxEval = Math.max(maxEval, evalu);
                alfa = Math.max(alfa, evalu);
                if(beta <= alfa){
                    break;
                }
            }
        }
        return maxEval;
    }else{
        var minEval = Infinity;
        for(var t in posicion){
            if(posicion[t] === 0){
                posicion[t] = jugador;
                var evalu = MinMax_UnTablero(posicion, profundidad+1, alfa, beta, true);
                posicion[t] = 0;
                minEval = Math.min(minEval, evalu);
                beta = Math.min(beta, evalu);
                if(beta <= alfa){
                    break;
                }
            }
        }
        return minEval;
    }
}

//Evaluacion para un tablero pequeno.
function tableroUnico(pos, cuadrado){
    pos[cuadrado] = ai;
    var evaluacion = 0;
    //Preferir centros sobre esquinas
    var puntos = [0.2, 0.17, 0.2, 0.17, 0.22, 0.17, 0.2, 0.17, 0.2];

    var a = 2;
    evaluacion+=puntos[cuadrado];
    //Prefiere crear parejas
    e = -2;
    if(pos[0] + pos[1] + pos[2] === e || pos[3] + pos[4] + pos[5] === e || pos[6] + pos[7] + pos[8] === e || pos[0] + pos[3] + pos[6] === e || pos[1] + pos[4] + pos[7] === e ||
        pos[2] + pos[5] + pos[8] === e || pos[0] + pos[4] + pos[8] === e || pos[2] + pos[4] + pos[6] === e) {
        evaluacion += 1;
    }
    //Busca primero la victoria
    e = -3;
    if(pos[0] + pos[1] + pos[2] === e || pos[3] + pos[4] + pos[5] === e || pos[6] + pos[7] + pos[8] === e || pos[0] + pos[3] + pos[6] === e || pos[1] + pos[4] + pos[7] === e ||
        pos[2] + pos[5] + pos[8] === e || pos[0] + pos[4] + pos[8] === e || pos[2] + pos[4] + pos[6] === e) {
        evaluacion += 5;
    }

    //Bloque si puede
    pos[cuadrado] = jugador;

    e = 3;
    if(pos[0] + pos[1] + pos[2] === e || pos[3] + pos[4] + pos[5] === e || pos[6] + pos[7] + pos[8] === e || pos[0] + pos[3] + pos[6] === e || pos[1] + pos[4] + pos[7] === e ||
        pos[2] + pos[5] + pos[8] === e || pos[0] + pos[4] + pos[8] === e || pos[2] + pos[4] + pos[6] === e) {
        evaluacion += 2;
    }

    pos[cuadrado] = ai;
    evaluacion-=Ganador(pos)*15;
    pos[cuadrado] = 0;
    return evaluacion;
}

//Evaluacion Justa 
function evaluacionJusta(pos){
    var evaluacion = 0;
    var puntos = [0.2, 0.17, 0.2, 0.17, 0.22, 0.17, 0.2, 0.17, 0.2];

    for(var bw in pos){
        evaluacion -= pos[bw]*puntos[bw];
    }

    var e = 2;
    if(pos[0] + pos[1] + pos[2] === e || pos[3] + pos[4] + pos[5] === e || pos[6] + pos[7] + pos[8] === e) {
        evaluacion -= 6;
    }
    if(pos[0] + pos[3] + pos[6] === e || pos[1] + pos[4] + pos[7] === e || pos[2] + pos[5] + pos[8] === e) {
        evaluacion -= 6;
    }
    if(pos[0] + pos[4] + pos[8] === e || pos[2] + pos[4] + pos[6] === e) {
        evaluacion -= 7;
    }

    e = -1;
    if((pos[0] + pos[1] === 2*e && pos[2] === -e) || (pos[1] + pos[2] === 2*e && pos[0] === -e) || (pos[0] + pos[2] === 2*e && pos[1] === -e)
        || (pos[3] + pos[4] === 2*e && pos[5] === -e) || (pos[3] + pos[5] === 2*e && pos[4] === -e) || (pos[5] + pos[4] === 2*e && pos[3] === -e)
        || (pos[6] + pos[7] === 2*e && pos[8] === -e) || (pos[6] + pos[8] === 2*e && pos[7] === -e) || (pos[7] + pos[8] === 2*e && pos[6] === -e)
        || (pos[0] + pos[3] === 2*e && pos[6] === -e) || (pos[0] + pos[6] === 2*e && pos[3] === -e) || (pos[3] + pos[6] === 2*e && pos[0] === -e)
        || (pos[1] + pos[4] === 2*e && pos[7] === -e) || (pos[1] + pos[7] === 2*e && pos[4] === -e) || (pos[4] + pos[7] === 2*e && pos[1] === -e)
        || (pos[2] + pos[5] === 2*e && pos[8] === -e) || (pos[2] + pos[8] === 2*e && pos[5] === -e) || (pos[5] + pos[8] === 2*e && pos[2] === -e)
        || (pos[0] + pos[4] === 2*e && pos[8] === -e) || (pos[0] + pos[8] === 2*e && pos[4] === -e) || (pos[4] + pos[8] === 2*e && pos[0] === -e)
        || (pos[2] + pos[4] === 2*e && pos[6] === -e) || (pos[2] + pos[6] === 2*e && pos[4] === -e) || (pos[4] + pos[6] === 2*e && pos[2] === -e)){
        evaluacion-=9;
    }

    e = -2;
    if(pos[0] + pos[1] + pos[2] === e || pos[3] + pos[4] + pos[5] === e || pos[6] + pos[7] + pos[8] === e) {
        evaluacion += 6;
    }
    if(pos[0] + pos[3] + pos[6] === e || pos[1] + pos[4] + pos[7] === e || pos[2] + pos[5] + pos[8] === e) {
        evaluacion += 6;
    }
    if(pos[0] + pos[4] + pos[8] === e || pos[2] + pos[4] + pos[6] === e) {
        evaluacion += 7;
    }

    e = 1;
    if((pos[0] + pos[1] === 2*e && pos[2] === -e) || (pos[1] + pos[2] === 2*e && pos[0] === -e) || (pos[0] + pos[2] === 2*e && pos[1] === -e)
        || (pos[3] + pos[4] === 2*e && pos[5] === -e) || (pos[3] + pos[5] === 2*e && pos[4] === -e) || (pos[5] + pos[4] === 2*e && pos[3] === -e)
        || (pos[6] + pos[7] === 2*e && pos[8] === -e) || (pos[6] + pos[8] === 2*e && pos[7] === -e) || (pos[7] + pos[8] === 2*e && pos[6] === -e)
        || (pos[0] + pos[3] === 2*e && pos[6] === -e) || (pos[0] + pos[6] === 2*e && pos[3] === -e) || (pos[3] + pos[6] === 2*e && pos[0] === -e)
        || (pos[1] + pos[4] === 2*e && pos[7] === -e) || (pos[1] + pos[7] === 2*e && pos[4] === -e) || (pos[4] + pos[7] === 2*e && pos[1] === -e)
        || (pos[2] + pos[5] === 2*e && pos[8] === -e) || (pos[2] + pos[8] === 2*e && pos[5] === -e) || (pos[5] + pos[8] === 2*e && pos[2] === -e)
        || (pos[0] + pos[4] === 2*e && pos[8] === -e) || (pos[0] + pos[8] === 2*e && pos[4] === -e) || (pos[4] + pos[8] === 2*e && pos[0] === -e)
        || (pos[2] + pos[4] === 2*e && pos[6] === -e) || (pos[2] + pos[6] === 2*e && pos[4] === -e) || (pos[4] + pos[6] === 2*e && pos[2] === -e)){
        evaluacion+=9;
    }

    evaluacion -= Ganador(pos)*12;

    return evaluacion;
}
//Devuelbe el signo 1,-1 o 0
function signo(x){
    if(x > 0){
        return 1;
    }else if(x < 0){
        return -1;
    }else{
        return 0;
    }
}

// ----juego---- 

var mejorMovimiento = -1;
var mejorSituacion = [-Infinity, -Infinity, -Infinity, -Infinity, -Infinity, -Infinity, -Infinity, -Infinity, -Infinity];

function juego(){

    //estilo del tablero
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.lineWidth = 3;
    var cuadradoSize = WIDTH/4;

    if(turnoActual === -1 && juego_actual && AIACTIVE){

        console.log("Iniciar juego");
        mejorMovimiento = -1;
        mejorSituacion = [-Infinity, -Infinity, -Infinity, -Infinity, -Infinity, -Infinity, -Infinity, -Infinity, -Infinity];
        CICLOS = 0; 

        var contador = 0;
        for(var bt = 0; bt < tablero.length; bt++){
            if(Ganador(tablero[bt]) === 0){
                tablero[bt].forEach((v) => (v === 0 && contador++));
            }
        }

        if(tableroactual === -1 || Ganador(tablero[tableroactual]) !== 0){
            var guardarMinMax;

            console.log("Resto: " + contador);

            //tablero a juegar
            if(MOVIMEINTO < 10) {
                guardarMinMax = MinMax(tablero, -1, Math.min(4, contador), -Infinity, Infinity, true); //Putting math.min makes sure that MinMax doesn't run when the board is full
            }else if(MOVIMEINTO < 18){
                guardarMinMax = MinMax(tablero, -1, Math.min(5, contador), -Infinity, Infinity, true);
            }else{
                guardarMinMax = MinMax(tablero, -1, Math.min(6, contador), -Infinity, Infinity, true);
            }
            console.log(guardarMinMax.tP);
            tableroactual = guardarMinMax.tP;
        }

        //Movimiento si MinMax no determina alguno
        for (var i = 0; i < 9; i++) {
            if (tablero[tableroactual][i] === 0) {
                mejorMovimiento = i;
                break;
            }
        }


        if(mejorMovimiento !== -1) {
            for (var a = 0; a < 9; a++) {
                if (tablero[tableroactual][a] === 0) {
                    var puntuacion = tableroUnico(tablero[tableroactual], a, turnoActual)*45;
                    mejorSituacion[a] = puntuacion;
                }
            }

 //Ejecuta la funcion MinMax
  for(var b = 0; b < 9; b++){

    if(Ganador(tablero[tableroactual]) === 0){
     if (tablero[tableroactual][b] === 0) {
        tablero[tableroactual][b] = ai;
            var guardarMinMax;
         if(MOVIMEINTO < 20){
                guardarMinMax = MinMax(tablero, b, Math.min(5, contador), -Infinity, Infinity, false);
                 }else if(MOVIMEINTO < 32){
                console.log("PROFUNDIDAD");
                guardarMinMax = MinMax(tablero, b, Math.min(6, contador), -Infinity, Infinity, false);
                }else{
                     console.log("ULTIMA PRODUNDIDAD");
                    guardarMinMax = MinMax(tablero, b, Math.min(7, contador), -Infinity, Infinity, false);
                    }
            console.log(guardarMinMax);
            var puntuacion2 = guardarMinMax.mE;
            tablero[tableroactual][b] = 0;
            mejorSituacion[b] += puntuacion2;
                    }
                }
            }
            console.log(mejorSituacion);

            for(var i in mejorSituacion){
                if(mejorSituacion[i] > mejorSituacion[mejorMovimiento]){
                    mejorMovimiento = i;
                }
            }

            if(tablero[tableroactual][mejorMovimiento] === 0){
                tablero[tableroactual][mejorMovimiento] = ai;
                tableroactual = mejorMovimiento;
            }

            console.log(evaluacion(tablero, tableroactual));
        }
        turnoActual = -turnoActual;
    }

    shapeSize = cuadradoSize/6;

    //Guarda donde se realizo click
    if(clic === true && juego_actual) {
        for (var i in tablero) {
            if(tableroactual !== -1){i = tableroactual;if(tableroP[tableroactual] !== 0){continue;}}
            for (var j in tablero[i]) {
                if(tablero[i][j] === 0) {
                    if (mousePosX > (WIDTH / 3 - cuadradoSize) / 2 + cuadradoSize / 6 - shapeSize + (j % 3) * cuadradoSize / 3 + (i % 3) * WIDTH / 3 && mousePosX < (WIDTH / 3 - cuadradoSize) / 2 + cuadradoSize / 6 + shapeSize + (j % 3) * cuadradoSize / 3 + (i % 3) * WIDTH / 3) {
                        if (mousePosY > (WIDTH / 3 - cuadradoSize) / 2 + cuadradoSize / 6 - shapeSize + Math.floor(j / 3) * cuadradoSize / 3 + Math.floor(i / 3) * WIDTH / 3 && mousePosY < (WIDTH / 3 - cuadradoSize) / 2 + cuadradoSize / 6 + shapeSize + Math.floor(j / 3) * cuadradoSize / 3 + Math.floor(i / 3) * WIDTH / 3) {
                            tablero[i][j] = turnoActual;
                            tableroactual = j;
                            turnoActual = -turnoActual;
                            MOVIMEINTO++;
                            break;
                        }}
                    }}
                }}

    //Dibuja el tablero

    cuadradoSize = WIDTH/4;
    var shapeSize = WIDTH/36;

    ctx.strokeStyle = COLORS.black;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(WIDTH/3, 0);
    ctx.lineTo(WIDTH/3, WIDTH);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(WIDTH/3*2, 0);
    ctx.lineTo(WIDTH/3*2, WIDTH);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, WIDTH/3);
    ctx.lineTo(WIDTH, WIDTH/3);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, WIDTH/3*2);
    ctx.lineTo(WIDTH, WIDTH/3*2);
    ctx.stroke();

    ctx.lineWidth = 3;
    for(var i = 0; i < 3; i++){
        for(var j = 0; j < 3; j++){
            ctx.beginPath();
            ctx.moveTo(i*WIDTH/3 + (WIDTH/3-cuadradoSize)/2 + cuadradoSize/3, j*WIDTH/3 + (WIDTH/3 - cuadradoSize)/2);
            ctx.lineTo(i*WIDTH/3 + (WIDTH/3-cuadradoSize)/2 + cuadradoSize/3, j*WIDTH/3 + (WIDTH/3 - cuadradoSize)/2 + cuadradoSize);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(i*WIDTH/3 + (WIDTH/3-cuadradoSize)/2 + cuadradoSize*2/3, j*WIDTH/3 + (WIDTH/3 - cuadradoSize)/2);
            ctx.lineTo(i*WIDTH/3 + (WIDTH/3-cuadradoSize)/2 + cuadradoSize*2/3, j*WIDTH/3 + (WIDTH/3 - cuadradoSize)/2 + cuadradoSize);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(i*WIDTH/3 + (WIDTH/3 - cuadradoSize)/2, j*WIDTH/3 + (WIDTH/3-cuadradoSize)/2 + cuadradoSize/3);
            ctx.lineTo(i*WIDTH/3 + (WIDTH/3 - cuadradoSize)/2 + cuadradoSize, j*WIDTH/3 + (WIDTH/3-cuadradoSize)/2 + cuadradoSize/3);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(i*WIDTH/3 + (WIDTH/3 - cuadradoSize)/2, j*WIDTH/3 + (WIDTH/3-cuadradoSize)/2 + cuadradoSize*2/3);
            ctx.lineTo(i*WIDTH/3 + (WIDTH/3 - cuadradoSize)/2 + cuadradoSize, j*WIDTH/3 + (WIDTH/3-cuadradoSize)/2 + cuadradoSize*2/3);
            ctx.stroke();
        }
    }

    //Dubujar las X y O
    ctx.lineWidth = 5;

    for(var i in tablero){
        if(tableroP[i] === 0) {
            if (Ganador(tablero[i]) !== 0) {
                tableroP[i] = Ganador(tablero[i]);
            }
        }
        for(var j in tablero[i]){
            if(tablero[i][j] === 1*switchAroo){
                ctx.strokeStyle = COLORS.red;
                ctx.beginPath();
                ctx.moveTo((WIDTH/3-cuadradoSize)/2 + cuadradoSize/6 - shapeSize + (j%3)*cuadradoSize/3 + (i%3)*WIDTH/3, (WIDTH/3 - cuadradoSize)/2 + cuadradoSize/6 - shapeSize + Math.floor(j/3)*cuadradoSize/3 + Math.floor(i/3)*WIDTH/3);
                ctx.lineTo((WIDTH/3-cuadradoSize)/2 + cuadradoSize/6 + shapeSize + (j%3)*cuadradoSize/3 + (i%3)*WIDTH/3, (WIDTH/3 - cuadradoSize)/2 + cuadradoSize/6 + shapeSize + Math.floor(j/3)*cuadradoSize/3 + Math.floor(i/3)*WIDTH/3);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo((WIDTH/3-cuadradoSize)/2 + cuadradoSize/6 - shapeSize + (j%3)*cuadradoSize/3 + (i%3)*WIDTH/3, (WIDTH/3 - cuadradoSize)/2 + cuadradoSize/6 + shapeSize + Math.floor(j/3)*cuadradoSize/3 + Math.floor(i/3)*WIDTH/3);
                ctx.lineTo((WIDTH/3-cuadradoSize)/2 + cuadradoSize/6 + shapeSize + (j%3)*cuadradoSize/3 + (i%3)*WIDTH/3, (WIDTH/3 - cuadradoSize)/2 + cuadradoSize/6 - shapeSize + Math.floor(j/3)*cuadradoSize/3 + Math.floor(i/3)*WIDTH/3);
                ctx.stroke();
            }else if(tablero[i][j] === -1*switchAroo){
                ctx.strokeStyle = COLORS.blue;
                ctx.beginPath();
                ctx.ellipse((WIDTH/3-cuadradoSize)/2 + cuadradoSize/6 + (j%3)*cuadradoSize/3 + (i%3)*WIDTH/3, (WIDTH/3 - cuadradoSize)/2 + cuadradoSize/6 + Math.floor(j/3)*cuadradoSize/3 + Math.floor(i/3)*WIDTH/3, shapeSize*1.1, shapeSize*1.1, 0, 0, Math.PI*2);
                ctx.stroke();
            }
        }
    }

    //Verifica si hay algun ganador
    if(juego_actual){
        if (Ganador(tableroP) !== 0) {
            juego_actual = false;
            document.getElementById("winMenu").removeAttribute("hidden");
            if(Ganador(tableroP) === 1){
                document.getElementById("result").innerHTML = Nombre_jugador[0] + " Es el ganador";
            }else{
                document.getElementById("result").innerHTML = Nombre_jugador[1] + " Es el ganador";
            }
        }

        //Si ya no hay cuadros se declara el empate
        var contadorw = 0;
        for(var bt = 0; bt < tablero.length; bt++){
            if(Ganador(tablero[bt]) === 0){
                tablero[bt].forEach((v) => (v === 0 && contadorw++));
            }
        }

        if(contadorw === 0){
            juego_actual = false;
            document.getElementById("winMenu").removeAttribute("hidden");
            document.getElementById("result").innerHTML = "EMPATE";
        }
    }

    shapeSize = cuadradoSize/3;
    ctx.lineWidth = 20;

    //Dibujar las X y O Grandes
    for(var j in tableroP){
        if(tableroP[j] === 1*switchAroo){
            ctx.strokeStyle = COLORS.red;
            ctx.beginPath();
            ctx.moveTo(WIDTH/6 - shapeSize + (j%3)*WIDTH/3, WIDTH/6 - shapeSize + Math.floor(j/3)*WIDTH/3);
            ctx.lineTo(WIDTH/6 + shapeSize + (j%3)*WIDTH/3, WIDTH/6 + shapeSize + Math.floor(j/3)*WIDTH/3);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(WIDTH/6 - shapeSize + (j%3)*WIDTH/3, WIDTH/6 + shapeSize + Math.floor(j/3)*WIDTH/3);
            ctx.lineTo(WIDTH/6 + shapeSize + (j%3)*WIDTH/3, WIDTH/6 - shapeSize + Math.floor(j/3)*WIDTH/3);
            ctx.stroke();
        }else if(tableroP[j] === -1*switchAroo){
            ctx.strokeStyle = COLORS.blue;
            ctx.beginPath();
            ctx.ellipse(WIDTH/6 + (j%3)*WIDTH/3, WIDTH/6 + Math.floor(j/3)*WIDTH/3, shapeSize*1.1, shapeSize*1.1, 0, 0, Math.PI*2);
            ctx.stroke();
        }
    }

    if(tableroP[tableroactual] !== 0 || !tablero[tableroactual].includes(0)){tableroactual = -1;}

    //Destacar el tablero actual
    ctx.fillStyle = "#00ff0080";
    ctx.globalAlpha = 0.4;
    ctx.fillRect(WIDTH/3*(tableroactual%3), WIDTH/3*Math.floor(tableroactual/3), WIDTH/3, WIDTH/3);
    ctx.globalAlpha = 1;
    clic = false;
   
}
var keys;


function cordenadasMouse(mouseClic)
{
    var rect = canvas.getBoundingClientRect();
    mousePosX = mouseClic.clientX - rect.left;
    mousePosY = mouseClic.clientY - rect.top;
}

function click(){
    clic = true;
}
document.getElementById("TableroVista").onmousemove = cordenadasMouse;
document.getElementById("TableroVista").onclick = click;

window.addEventListener('keydown', function (e) {
    keys = (keys || []);
    keys[e.keyCode] = (e.tipo == "keydown");

    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }

}, false);
window.addEventListener('keyup', function (e) {
    keys[e.keyCode] = (e.tipo == "keydown");
}, false);

// ------- Recargar FUNCTION 

function Recargar() {
    localStorage.setItem("PuntuacionAlta", 0);
}

function inicarJuego(tipo){
    tablero = [

        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]

    ];

    tableroP = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    MOVIMEINTO = 0;

    //turnoActual = 1;
    tableroactual = -1;

    if(tipo === 0){
        AIACTIVE = true;
        juego_actual = true;
        Nombre_jugador[0] = "jugador";
        Nombre_jugador[1] = "Agente Inteligente";
    }else{
        AIACTIVE = false;
        juego_actual = true;
        switchAroo = 1;
        Nombre_jugador[0] = "jugador 1";
        Nombre_jugador[1] = "jugador 2";
    }
    document.getElementById("startMenu").setAttribute("hidden", "hidden");
    document.getElementById("turnMenu").setAttribute("hidden", "hidden");
}

function tipoJuego(tipo){
    if(tipo === 0){
        turnoActual = 1;
        switchAroo = 1;
    }else{
        turnoActual = -1;
        switchAroo = -1;
    }
    inicarJuego(0);
}


//Redibujar el tablero
function redibujar() {
    juego();
    requestAnimationFrame(redibujar);
}
requestAnimationFrame(redibujar);