const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 17;
const STRONG_ATTACK_VALUE = 14;
const HEALING_VALUE = 14;
let hasBonusLife = true;
let battleLog = [];
let lastLoggedEntry;

// ----------
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";
// ------

function getChosenMaxLife() {
  const enteredValue = prompt("choose max life for you and the monster", "100");

  let parsedValue = parseInt(enteredValue);

  if (isNaN(parsedValue) || parsedValue <= 0 || parsedValue > 500) {
    throw { message: "Invalid user input. Not a nummber!" };
  }
  return parsedValue;
}

let chosenMaxLife;

try {
  chosenMaxLife = getChosenMaxLife();
} catch (error) {
  console.log(error);
  chosenMaxLife = 100;
  alert(" what you have entered is not a number. default max life is 100. ");
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;

adjustHealthBars(chosenMaxLife); // this is from vendor file

function attackMonster(mode) {
  const damage = dealMonsterDamage(mode); // this function from vender file & (mode) from attackHandler()
  currentMonsterHealth -= damage;
  let logEvent =
    mode === ATTACK_VALUE
      ? LOG_EVENT_PLAYER_ATTACK
      : LOG_EVENT_PLAYER_STRONG_ATTACK;

  writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
  endRound();
}

function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE); // this function from vender file
  currentPlayerHealth -= playerDamage;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    currentPlayerHealth = initialPlayerHealth;
    alert("you would have been dead if it's not for the bonus life");
    setPlayerHealth(initialPlayerHealth); // this function from vender file
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("YOU HAVE WON");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "YOU HAVE WON",
      currentMonsterHealth,
      currentPlayerHealth
    );
    reset();
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("MOSTER HAS WON");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "MONSTER HAS WON",
      currentMonsterHealth,
      currentPlayerHealth
    );
    reset();
  } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
    alert("DRAW!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "DRAW",
      currentMonsterHealth,
      currentPlayerHealth
    );
    reset();
  } else if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
}

function attackHandler() {
  attackMonster(ATTACK_VALUE);
}
function strongAttackHandler() {
  attackMonster(MONSTER_ATTACK_VALUE);
}

function healHandler() {
  let healValue;
  if (currentPlayerHealth + HEALING_VALUE >= chosenMaxLife) {
    alert("you can't increase maximum health");
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEALING_VALUE;
  }
  increasePlayerHealth(healValue); // this function from vender file
  currentPlayerHealth += healValue;

  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function reset() {
  currentPlayerHealth = chosenMaxLife;
  currentMonsterHealth = chosenMaxLife;
  resetGame(chosenMaxLife); // this function from vender file
}

function writeToLog(ev, val, monsterHealth, playerHealth) {
  let logEntry;
  if (ev === LOG_EVENT_PLAYER_ATTACK) {
    logEntry = {
      target: "MONSTER",
      event: ev,
      value: val,
      finalMonsterHealth: monsterHealth,
      finalPlayerhealth: playerHealth,
    };
  } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    logEntry = {
      target: "MONSTER",
      event: ev,
      value: val,
      finalMonsterHealth: monsterHealth,
      finalPlayerhealth: playerHealth,
    };
  } else if (ev === LOG_EVENT_MONSTER_ATTACK) {
    logEntry = {
      target: "PLAYER",
      event: ev,
      value: val,
      finalMonsterHealth: monsterHealth,
      finalPlayerhealth: playerHealth,
    };
  } else if (ev === LOG_EVENT_PLAYER_HEAL) {
    logEntry = {
      event: ev,
      value: val,
      finalMonsterHealth: monsterHealth,
      finalPlayerhealth: playerHealth,
    };
  } else if (ev === LOG_EVENT_GAME_OVER) {
    logEntry = {
      event: ev,
      value: val,
      finalMonsterHealth: monsterHealth,
      finalPlayerhealth: playerHealth,
    };
  }
  battleLog.push(logEntry);
}

function printToLogHandler() {
  for (let i = 0; i < 3; i++) console.log("-----");
  // console.log(battleLog);

  let i = 0;
  for (const logEntry of battleLog) {
    if ((!lastLoggedEntry && lastLoggedEntry !== 0) || lastLoggedEntry < i) {
      console.log(`# ${i}`);
      for (const key in logEntry) {
        console.log(` ${key} ==> ${logEntry[key]}`);
      }
      lastLoggedEntry = i;
      break;
    }
    i++;
  }
}

// Buttons event listeners
attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healHandler);
logBtn.addEventListener("click", printToLogHandler);
