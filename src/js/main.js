const COMMAND = {
    help: help,
    mode: showMode,
    clear: CLS,
    version: showVersion,
    settings: showSettings,
    reset: resetSettings,
    setting: changeSetting,
    japanese: changeLang2JP,
    english: changeLang2EN,
    about: showAbout,
    rule: showRule,
    teach: startTeachMode,
    game: startGameMode,
};

const TEACH_COMMAND = inherit(
    COMMAND,
    {
        dice: loadDice,
        set: chooseRole,
        undo: undo,
    },
    ["teach", "game"],
);

const GAME_COMMAND = inherit(
    COMMAND,
    {
        keep: keep,
        set: chooseRoleGame,
        opponent: showBotInfo,
    },
    ["teach", "game"],
);

function help([val] = []) {
    if (val === undefined) {
        if (STAT.modeInternal === "home") DIALOGUE.home.help.log();
        if (STAT.modeInternal === "teach") DIALOGUE.teach.help.log();
        if (STAT.modeInternal === "game") DIALOGUE.game.help.log();
        emptyLine();
    } else {
        const newVal = val === "on" ? true : false;
        SETTINGS.guideEnable = newVal;
        if (newVal) DIALOGUE.home.toggleHelp.enable.log();
        else DIALOGUE.home.toggleHelp.disable.log();
    }
}

function showMode() {
    DIALOGUE.mode.display.log(STAT.mode);
}

function CLS() {
    document.querySelector("#output-display").innerHTML = "";
}

function showVersion() {
    DIALOGUE.systemInfo.log();
    emptyLine();
}

function showSettings([key] = []) {
    if (key !== undefined && !key.startsWith("-")) {
        console.log(key);
        const val = search(SETTINGS, key);
        if (val === "No item found") DIALOGUE.settings.invaildKey.log();
        else log(`* [yellow]${key}[/] : ${syntaxHighlight(val)}`, { pref: false, escape: false });
        return;
    }
    DIALOGUE.settings.title.log();
    expandSettings(SETTINGS);
    emptyLine();
}

function search(obj, key) {
    for (const k of Object.keys(obj)) {
        if (k === key) {
            return obj[k];
        }

        if (typeof obj[k] === "object" && obj[k] !== null && !Array.isArray(obj[k])) {
            const res = search(obj[k], key);
            if (res !== "No item fouond") return res;
        }
    }
    return "No item found";
}

function expandSettings(obj) {
    for (const [key, val] of Object.entries(obj)) {
        if (Array.isArray(val)) {
            log(`* [yellow]${key}[/] : ${syntaxHighlight(JSON.stringify(val))}`, {
                pref: false,
                escape: false,
            });
        } else if (typeof val === "object" && val !== null) {
            expandSettings(val);
        } else {
            log(`* [yellow]${key}[/] : ${syntaxHighlight(val)}`, { pref: false, escape: false });
        }
    }
}

function resetSettings() {
    SETTINGS = deepcopy(INIT_SETTINGS);
    DIALOGUE.settings.reset.log();
}

function changeSetting([key, val] = []) {
    if (LOCKED_SETTINGS.includes(key)) {
        DIALOGUE.settings.locked.log(key);
        kill(true);
    }
    try {
        const res = searchAndChange(SETTINGS, key, val);
        if (res) {
            DIALOGUE.settings.success.log(key, val);
            changeLanguage();
        } else DIALOGUE.settings.reject.log(key, val);
    } catch (e) {
        if (Array.isArray(ALLOWED_VALUES[key]))
            DIALOGUE.settings.invalidType.log(
                key,
                ALLOWED_VALUES[key].map((el) => `[italic]${String(el)}[/]`).join(", "),
            );
        else {
            DIALOGUE.settings.invalidType.log(key, `[italic]${ALLOWED_VALUES[key]}[/]`);
        }
    }
}

function changeLanguage() {
    if (SETTINGS.language === "en") {
        DIALOGUE = DIALOGUE_EN;
        return;
    }

    if (SETTINGS.language === "ja") {
        DIALOGUE = DIALOGUE_JA;
        return;
    }

    DIALOGUE = DIALOGUE_EN;
}

function changeLang2JP() {
    SETTINGS.language = "ja";
    changeLanguage();
}

function changeLang2EN() {
    SETTINGS.language = "en";
    changeLanguage();
}

function searchAndChange(obj, key, val) {
    for (const k of Object.keys(obj)) {
        if (k === key) {
            if (!Array.isArray(ALLOWED_VALUES[k]) && typeof val !== ALLOWED_VALUES[k]) throw new Error("Invalid type");
            if (Array.isArray(ALLOWED_VALUES[k]) && !ALLOWED_VALUES[k].includes(val)) throw new Error("Invalid type");
            obj[k] = val;
            return true;
        }

        if (typeof obj[k] === "object" && obj[k] !== null && !Array.isArray(obj[k])) {
            const res = searchAndChange(obj[k], key, val);
            if (res) return true;
        }
    }
    return false;
}

function showAbout() {
    DIALOGUE.about.log();
    emptyLine();
}

function showRule() {
    if (STAT.modeInternal === "home") DIALOGUE.home.rule.log();
    if (STAT.modeInternal === "teach") DIALOGUE.teach.rule.log();
    if (STAT.modeInternal === "game") DIALOGUE.game.rule.log();
    emptyLine();
}

function loadDice(dice) {
    if (GAME.rollsLeft < 0) {
        DIALOGUE.gameCommon.noRollsLeft.log();
        return;
    }
    if (dice.length < 5) {
        DIALOGUE.teach.diceRejectMin.log();
        return;
    }
    if (dice.length > 5) {
        DIALOGUE.teach.diceRejectMax.log();
        return;
    }
    if (Math.min(...dice) >= 1 && Math.max(...dice) <= 6) {
        const arr = [...dice].sort();
        for (let i = 0; i < 5; i++) GAME.dice[i] = arr[i];
        teacherReponse();
    } else {
        DIALOGUE.gameCommon.invalidDiceRoll.log();
        return;
    }
}

function chooseRole([role] = []) {
    if (role === undefined) {
        DIALOGUE.gameCommon.roleEmpty.log();
        return;
    }
    choose(role);
}

function keep(keepDice) {
    if (GAME.rollsLeft < 0) {
        DIALOGUE.gameCommon.noRollsLeft.log();
        return;
    }
    if (Math.min(...keepDice) < 1 || Math.max(...keepDice) > 5) {
        DIALOGUE.game.keepOutRange.log();
        return;
    }
    DIALOGUE.game.keepAccepted.log();
    const res = roll(keepDice);
    GAME.dice = [...res].sort();
    updateDisplay();
    DIALOGUE.game.displayDice.log(...GAME.dice);
}

function chooseRoleGame([role] = []) {
    if (role === undefined) {
        DIALOGUE.gameCommon.roleEmpty.log();
        return;
    }
    choose(role);
    throw new Error("Player's turn end");
}

async function main() {
    changeLanguage();
    logo();
    DIALOGUE.welcome.log();
    emptyLine();
    DIALOGUE.init.startInit.log();
    const initInfo = await YachtSolver.init({
        onProgress: ({ completedSlots, totalSlots, elapsedSeconds }) => {
            DIALOGUE.init.progress.log(completedSlots, totalSlots, elapsedSeconds.toFixed(1));
        },
    });
    if (initInfo.dpReady) {
        if (initInfo.loadedFromDB) {
            DIALOGUE.init.loadFromDB.log();
            DIALOGUE.init.successLoading.log();
        } else DIALOGUE.init.successInit.log(initInfo.timeSeconds.toFixed(1));
    } else {
        DIALOGUE.init.fail.log();
    }
    emptyLine();
    DIALOGUE.greeting.log();
    startREPL();
}

async function startREPL() {
    while (true) {
        if (SETTINGS.guideEnable) DIALOGUE.home.helpGuide.log();
        STAT.mode = DIALOGUE.mode.home.get();
        STAT.modeInternal = "home";
        try {
            const command = await input();
            await handleCommand(command);
        } catch (e) {
            if (e.message === "process killed") {
                DIALOGUE.exit.log();
            } else if (e.message !== "process killed (silent)") {
                DIALOGUE.error.log();
                log(`[red]\[ERROR\][/] ${e.stack}`);
            }
        }
    }
}

function parseCommand(cmd) {
    const tokenRegex =
        /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|--?[a-zA-Z0-9-]+(?:=(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\S+))?|\/\/.*$|#.*$|\s+|\S+/g;

    const tokens = cmd.match(tokenRegex);
    if (!tokens) return null;
    const filtered = tokens.filter(
        (token) => !/^\s+$/.test(token) && !token.startsWith("//") && !token.startsWith("#"),
    );
    const command = filtered[0]?.toLowerCase();
    const args = filtered
        .slice(1)
        .filter((token) => !token.startsWith("-"))
        .map((el) => normalize(el));
    const options = filtered.filter((token) => token.startsWith("-"));
    const formattedOptions = {};
    for (const opt of options) {
        if (opt.includes("=")) {
            const [key, ...vals] = opt.split("=");
            const val = vals[0];
            formattedOptions[key] = normalize(val);
        } else {
            formattedOptions[opt] = true;
        }
    }

    return [command, args, options];
}

async function handleCommand(cmd, list = COMMAND) {
    const res = parseCommand(cmd);
    const head = res[0];
    const args = res[1];
    const opts = res[2];
    if (Object.hasOwn(list, head)) await list[head](args, opts);
    else {
        DIALOGUE.cmdNotFound.log();
    }
}

async function startTeachMode() {
    STAT.mode = DIALOGUE.mode.teach.get();
    STAT.modeInternal = "teach";
    initStatus();
    DIALOGUE.teach.start.log();
    DIALOGUE.gameCommon.guide.log();
    try {
        while (true) {
            const cmd = await input();
            handleCommand(cmd, TEACH_COMMAND);
        }
    } catch (e) {
        if (e.message === "process killed") {
            ELEMENT.status.style.display = "none";
            kill();
        }
    }
}

async function startGameMode() {
    STAT.mode = DIALOGUE.mode.game.get();
    STAT.modeInternal = "game";
    initStatus();
    DIALOGUE.game.start.log();
    DIALOGUE.gameCommon.guide.log();
    try {
        while (true) {
            const initDice = rollDice();
            GAME.dice = initDice.sort();
            updateDisplay();
            DIALOGUE.game.displayDice.log(...GAME.dice);
            let playerTurn = true;
            while (playerTurn) {
                try {
                    const cmd = await input();
                    await handleCommand(cmd, GAME_COMMAND);
                } catch (e) {
                    console.log("a");
                    if (e.message === "Player's turn end") {
                        playerTurn = false;
                        break;
                    }
                }
            }
            console.log("player turn end");
            let botTurn = true;
            do {
                const res = await botAction();
                if (res) botTurn = false;
                await new Promise((resolve) => setTimeout(resolve, SETTINGS.ticker));
            } while (botTurn);
            if (GAME.turn === 12) {
                GAME.finish = true;
                BOT_GAME.finish = true;
                finish();
                break;
            }
        }
    } catch (e) {
        if (e.message === "process killed") {
            ELEMENT.status.style.display = "none";
            kill();
        } else {
            log(e.stack);
            throw e;
        }
    }
}

main();
