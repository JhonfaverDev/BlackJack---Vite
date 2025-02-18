import './style.css';
import _ from 'underscore';

/**
 * 2C = Two of Clubs (Tréboles)
 * 2D = Two of Diamonds (Diamantes)
 * 2H = Two of Hearts (Corazones)
 * 2S = Two of Spades (Espadas)
 */

// Patron modulo 

/**
 * El patrón módulo se basa en el concepto de funciones de cierre. Una función de cierre es una función que tiene acceso a las variables de su ámbito léxico, 
 * incluso después de que la función externa haya terminado de ejecutarse.
    Para crear un módulo, se define una función anónima que se ejecuta inmediatamente. Esta función anónima crea un nuevo ámbito y define las variables y funciones que 
    forman parte del módulo. A continuación, se devuelve un objeto que contiene las funciones públicas del módulo.
*/

const miModulo = (() => { // Función anónima autoinvocada 
  'use strict'; // Modo estricto de JavaScript

  let deck = [];  // Baraja
  const tipos = ['C', 'D', 'H', 'S'],
        especiales = ['A', 'J', 'Q', 'K'];

  let puntosJugadores = [];

  // Referencias del HTML
  const btnPedir      = document.querySelector('#btnPedir'),
        btnDetener    = document.querySelector('#btnDetener'),
        btnNuevo      = document.querySelector('#btnNuevo');

  const divCartasJugadores = document.querySelectorAll('.divCartas'), 
        puntosHTML =  document.querySelectorAll('small');
          

  const inicializarJuego = ( numJugadores = 2 ) => {
      deck = crearDeck();
      
      puntosJugadores = [];
      for (let i = 0; i < numJugadores; i++) {
          puntosJugadores.push(0);
      }

      puntosHTML.forEach(elem => elem.innerText = 0); // Reiniciar los puntos en el HTML
      divCartasJugadores.forEach(elem => elem.innerHTML = ''); // Reiniciar las cartas en el HTML

      btnPedir.disabled = false;
      btnDetener.disabled = false;
  }



  // Esta función crea una nueva baraja
  const crearDeck = () => {
      deck = [];
      for (let i = 2; i <= 10; i++) {
          for (let tipo of tipos) {
              deck.push(i + tipo);
          }
      }

      for (let tipo of tipos) {
          for (let esp of especiales) {
              deck.push(esp + tipo);
          }
      }
      return _.shuffle(deck);;
  }

  crearDeck();

  // Esta función me permite tomar una carta
  const pedirCarta = () => {

      if (deck.length === 0) {
          throw 'No hay cartas en el deck';
      }

       // Tomar la última carta de la baraja
      return deck.pop();
  }

  const valorCarta = (carta) => {
      const valor = carta.substring(0, carta.length - 1); // Tomar el valor de la carta
      return (isNaN(valor)) ?  // Si no es un número para eso es el metodo isNaN
          (valor === 'A') ? 11 : 10  // Si es A vale 11, si no vale 10
          : valor * 1; // Multiplicar por 1 para convertirlo a número y no dejarlo en string
  }

  // turno: 0 = primer jugador y el último será la computadora
  const acumularPuntos = (carta, turno) => {
      puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
      puntosHTML[turno].innerText = puntosJugadores[turno];

      return puntosJugadores[turno];

  }

  const crearCarta = (carta, turno) => {
      const imgCarta = document.createElement('img');
          imgCarta.src = `assets/cartas/${carta}.png`;
          imgCarta.classList.add('carta');
          divCartasJugadores[turno].append(imgCarta);
  }

  const determinarGanador = () => {

      const [puntosMinimos, puntosComputadora] = puntosJugadores; // Destructuración de arreglos

      setTimeout(() => {
          if (puntosComputadora === puntosMinimos) {
              alert('Nadie gana :(');
          } else if (puntosMinimos > 21) {
              alert('Computadora gana');
          } else if (puntosComputadora > 21) {
              alert('Jugador gana');
          } else {
              alert('Computadora gana');
          }
      }, 100);
  }


  // turno de la computadora
  const turnoComputadora = (puntosMinimos) => {
      
      let puntosComputadora = 0;

      do {
          const carta = pedirCarta();
          puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
          crearCarta(carta, puntosJugadores.length - 1);


      } while ((puntosComputadora < puntosMinimos) && (puntosMinimos <= 21));

      determinarGanador();
  }

  // Eventos
  btnPedir.addEventListener('click', () => {
      const carta = pedirCarta();
      const puntosJugador = acumularPuntos(carta, 0);
      crearCarta(carta, 0);

      if (puntosJugador > 21) {
          console.warn('Lo siento, perdiste');
          btnPedir.disabled = true;
          btnDetener.disabled = true;
          turnoComputadora(puntosJugador);
      } else if (puntosJugador === 21) {
          console.warn('21, genial!');
          btnPedir.disabled = true;
          btnDetener.disabled = true;
          turnoComputadora(puntosJugador);
      }
  });

  btnDetener.addEventListener('click', () => {
      btnPedir.disabled = true;
      btnDetener.disabled = true; 
      turnoComputadora(puntosJugador[0]);
  });

  btnNuevo.addEventListener('click', () => {
      inicializarJuego();
  });

  return {
      nuevoJuego: inicializarJuego
  };

})();
