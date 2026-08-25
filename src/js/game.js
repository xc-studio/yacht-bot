const INIT_GAME = {
    turn: 0,
    rollsLeft: 2,
    score: 0,
    dice: [null, null, null, null, null],
    keep: [false, false, false, false, false],
    roleScore: new Array(12).fill(0),
    usedRole: new Array(12).fill(false),
    bonus: false,
    finish: false,
};

let GAME = deepcopy(INIT_GAME);
let BOT_GAME = inherit(INIT_GAME, { lastExpected: 192 });

const GAME_HISTORY = [];

const CATEGORY_NAME = YachtSolver.getCategoryDisplay();

function init() {
    const tbody = document.querySelector("#status-display tbody");
    for (let i = 0; i < 12; i++) {
        const tr = document.createElement("tr");
        const name = document.createElement("th");
        const point = document.createElement("td");

        tr.dataset.categoryIndex = i;

        name.textContent = CATEGORY_NAME[i];
        point.textContent = 0;

        tr.appendChild(name);
        tr.appendChild(point);

        tbody.appendChild(tr);

        ELEMENT.game.roleDisplay.row.push(tr);
        ELEMENT.game.roleDisplay.name.push(name);
        ELEMENT.game.roleDisplay.point.push(point);
    }
}

function initStatus() {
    GAME = deepcopy(INIT_GAME);
    BOT_GAME = inherit(INIT_GAME, { lastExpected: 192 });
    GAME_HISTORY.length = 0;
    GAME_HISTORY.push(deepcopy(GAME));
    updateDisplay();
    ELEMENT.status.style.display = "block";
}

function teacherReponse() {
    if (GAME.finish) {
        DIALOGUE.gameCommon.finished.log();
        return;
    }

    const res = YachtSolver.getBestAction({
        dice: GAME.dice,
        usedMask: makeRoleMask(),
        upperSum: makeUpperSum(),
        rollsLeft: GAME.rollsLeft,
        accumulatedScore: GAME.score + (GAME.bonus ? 35 : 0),
    });

    if (res.actionType === "keep") {
        let str = "";
        for (let i = 0; i < 5; i++) {
            if (res.keepPositions.includes(i + 1)) {
                str += `[red]${GAME.dice[i]}[/] `;
            } else {
                str += `${GAME.dice[i]} `;
            }
        }
        str = str.trim();
        DIALOGUE.teach.showKeepCand.log(str, res.totalExpected.toFixed(1));
    } else if (res.actionType === "terminal") {
        DIALOGUE.teach.showActionCand.log(res.categoryName, res.score, res.totalExpected.toFixed(1));
    }
    GAME.rollsLeft--;
    updateDisplay();
    GAME_HISTORY.push(deepcopy(GAME));
}

function updateDisplay() {
    ELEMENT.game.turn.textContent = `${DIALOGUE.gameCommon.display.turn.get()} ${GAME.turn}`;
    ELEMENT.game.roll.textContent = `${DIALOGUE.gameCommon.display.rollsLeft.get()} : ${GAME.rollsLeft + 1}`;
    let str = GAME.dice.join(", ");
    if (GAME.dice.includes(null)) {
        str = `<span style="color: ${COLORS.cursor};">Enter your dice rolls.</span>`;
    }
    ELEMENT.game.dice.innerHTML = `${DIALOGUE.gameCommon.display.dice.get()} : ${str}`;
    if (GAME.bonus) {
        ELEMENT.game.score.textContent = `${DIALOGUE.gameCommon.display.score.get()} : ${GAME.score + 35} (Bonus +35)`;
    } else {
        ELEMENT.game.score.textContent = `${DIALOGUE.gameCommon.display.score.get()} : ${GAME.score}`;
    }
    ELEMENT.game.upperSum.textContent = `${DIALOGUE.gameCommon.display.upperSum.get()} : ${makeUpperSum(GAME, 300)} / 63`;
    for (let i = 0; i < 12; i++) {
        if (GAME.usedRole[i]) ELEMENT.game.roleDisplay.row[i].classList.add("used");
        else ELEMENT.game.roleDisplay.row[i].classList.remove("used");
        ELEMENT.game.roleDisplay.point[i].textContent = GAME.roleScore[i];
    }
}

function makeRoleMask(reference = GAME) {
    let mask = 0;
    for (let i = 0; i < 12; i++) {
        mask |= (1 & reference.usedRole[i]) << i;
    }
    return mask;
}

function makeUpperSum(reference = GAME, threshold = 63) {
    let score = 0;
    for (let i = 0; i < 6; i++) {
        score += reference.roleScore[i];
    }
    return Math.min(score, threshold);
}

function findCategoryIndex(name) {
    const target = String(name ?? "").trim();
    if (target === "") return -1;

    const normalizedTarget = target.toLowerCase();
    const directIndex = CATEGORY_NAME.findIndex((category) => category.toLowerCase() === normalizedTarget);
    if (directIndex !== -1) return directIndex;

    const aliases = {
        chance: "Choice",
        choice: "Choice",
        "4 of a kind": "4 of a Kind",
        "4 of a kind ": "4 of a Kind",
        "full house": "Full House",
        "fullhouse": "Full House",
        "s straight": "S. Straight",
        "small straight": "S. Straight",
        "l straight": "L. Straight",
        "large straight": "L. Straight",
        yacht: "Yacht",
    };

    const aliasKey = normalizedTarget.replace(/\s+/g, " ").trim();
    const aliasTarget = aliases[aliasKey];
    if (aliasTarget) {
        const aliasIndex = CATEGORY_NAME.findIndex((category) => category.toLowerCase() === aliasTarget.toLowerCase());
        if (aliasIndex !== -1) return aliasIndex;
    }

    return -1;
}

function choose(name) {
    if (GAME.finish) {
        DIALOGUE.gameCommon.finished.log();
        return;
    }
    if (GAME.dice.includes(null)) {
        DIALOGUE.teach.rollPrompt.log();
        return;
    }
    const categoryID = findCategoryIndex(name);
    if (categoryID === -1) {
        DIALOGUE.gameCommon.invalidRole.log();
        return;
    }
    const resolvedName = CATEGORY_NAME[categoryID];
    const score = YachtSolver.getCategoryScore(categoryID, GAME.dice);
    GAME.usedRole[categoryID] = true;
    GAME.roleScore[categoryID] = score;
    GAME.score += score;
    GAME.rollsLeft = 2;
    GAME.turn++;
    if (makeUpperSum() >= 63) GAME.bonus = true;
    updateDisplay();
    GAME_HISTORY.push(deepcopy(GAME));
    DIALOGUE.gameCommon.updateCategory.log(resolvedName, score);
    if (GAME.turn === 12) {
        GAME.finish = true;
        DIALOGUE.teach.finishMsg.log(GAME.score + (GAME.bonus ? 35 : 0));
    }
    return score;
}

function undo() {
    if (GAME_HISTORY.length <= 1) {
        DIALOGUE.gameCommon.emptyHistory.log();
        return;
    }
    GAME = GAME_HISTORY[GAME_HISTORY.length - 2];
    GAME_HISTORY.pop();
    DIALOGUE.gameCommon.successUndo.log();
    updateDisplay();
}

function rollDice(cnt = 5, assign = GAME) {
    const arr = [];
    for (let i = 0; i < cnt; i++) {
        arr.push(Math.floor(Math.random() * 6) + 1);
    }
    assign.rollsLeft--;
    return arr;
}

function roll(keep = [], assign = GAME) {
    const keeped = [];
    for (const el of keep) {
        keeped.push(assign.dice[el - 1]);
    }
    return keeped.concat(rollDice(5 - keep.length, assign));
}

function showBotInfo() {
    if (BOT_GAME.bonus) {
        DIALOGUE.game.botScoreWithBonus.log(BOT_GAME.score + 35);
    } else {
        DIALOGUE.game.botScore.log(BOT_GAME.score);
    }
    DIALOGUE.game.botUpperSum.log(makeUpperSum(BOT_GAME, 300));
    emptyLine();
    DIALOGUE.game.botRoleTitle.log();
    for (let i = 0; i < 12; i++) {
        if (BOT_GAME.usedRole[i]) {
            DIALOGUE.game.botRoleUsed.log(CATEGORY_NAME[i], BOT_GAME.roleScore[i]);
        } else {
            DIALOGUE.game.botRole.log(CATEGORY_NAME[i], BOT_GAME.roleScore[i]);
        }
    }
}

async function botAction() {
    const keepPos = [];
    for (let i = 0; i < 5; i++) {
        if (BOT_GAME.keep[i]) {
            keepPos.push(i + 1);
        }
    }

    const dice = BOT_GAME.rollsLeft === 2 ? roll([], BOT_GAME) : roll(keepPos, BOT_GAME);
    BOT_GAME.dice = dice.sort();
    DIALOGUE.game.botDiceDisplay.log(...dice);
    const act = YachtSolver.getBestAction({
        dice,
        usedMask: makeRoleMask(BOT_GAME),
        upperSum: makeUpperSum(BOT_GAME),
        rollsLeft: BOT_GAME.rollsLeft,
        accumulatedScore: BOT_GAME.score + (BOT_GAME.bonus ? 35 : 0),
    });
    if (act.actionType === "keep") {
        DIALOGUE.game.botKeepPos.log(act.keepPositions.join(", "));
        let str = "";
        for (let i = 0; i < 5; i++) {
            if (act.keepMask[i] === "1") {
                BOT_GAME.keep[i] = true;
                str += `[red]${BOT_GAME.dice[i]}[/] `;
            } else {
                BOT_GAME.keep[i] = false;
                str += `${BOT_GAME.dice[i]} `;
            }
        }
        DIALOGUE.game.botKeepColored.log(str);
    } else if (act.actionType === "terminal") {
        DIALOGUE.game.botFillCategory.log(act.categoryName);
        const score = YachtSolver.getCategoryScore(act.categoryIndex, BOT_GAME.dice);
        BOT_GAME.usedRole[act.categoryIndex] = true;
        BOT_GAME.roleScore[act.categoryIndex] = score;
        BOT_GAME.score += score;
        BOT_GAME.rollsLeft = 2;
        BOT_GAME.turn++;
        if (makeUpperSum(BOT_GAME) >= 63) BOT_GAME.bonus = true;
        DIALOGUE.game.botCategoryLog.log(act.categoryName, score);
    }
    const dist = act.totalExpected - BOT_GAME.lastExpected;
    if (dist >= 10) {
        DIALOGUE.game.good.log();
    } else if (dist >= 0) {
        DIALOGUE.game.okay.log();
    } else if (dist >= -10) {
        DIALOGUE.game.soso.log();
    } else {
        DIALOGUE.game.bad.log();
    }
    if (act.actionType === "terminal") {
        DIALOGUE.game.botTurnEnd.log();
        return true;
    }
    return false;
}

function finish() {
    const yourScore = GAME.score + (GAME.bonus ? 35 : 0);
    const botScore = BOT_GAME.score + (BOT_GAME.bonus ? 35 : 0);

    DIALOGUE.game.scoreDisplay.log(yourScore, botScore);
    emptyLine();

    STAT.statistics.total++;
    if (yourScore == botScore) {
        DIALOGUE.game.draw.log();
    } else if (yourScore > botScore) {
        DIALOGUE.game.win.log();
        STAT.statistics.win++;
    } else if (yourScore < botScore) {
        DIALOGUE.game.lose.log();
        STAT.statistics.lose++;
    } else {
        DIALOGUE.game.draw("ERROR", "ERROR");
    }
}

init();
