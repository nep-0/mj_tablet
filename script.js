// Game State
let scores = [25000, 25000, 25000, 25000];
let playersRiichi = [false, false, false, false];
let riichiSticks = 0;
let honba = 0;
let dealerIndex = 0; // 0=East, 1=South, etc.

// Detect Browser Language
let currentLang = 'en';
try {
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('ja')) {
        currentLang = 'ja';
    } else if (browserLang.startsWith('zh')) {
        currentLang = 'zh';
    }
} catch (e) {
    console.warn("Language detection failed, defaulting to English");
}

const TRANSLATIONS = {
    en: {
        title: "Riichi Mahjong Scorer",
        riichiSticks: "Riichi Sticks",
        honba: "Honba",
        reset: "Reset Game",
        rotate: "Rotate ↻",
        shuffle: "Shuffle ⤮",
        win: "Win (Agari)",
        draw: "Draw (Ryuukyoku)",
        riichi: "Riichi",
        ron: "Ron",
        tsumo: "Tsumo",
        whoWon: "Who Won?",
        whoDealt: "Who Dealt In?",
        handValue: "Hand Value",
        han: "Han",
        fu: "Fu",
        score: "Score:",
        base: "Base:",
        total: "Total:",
        cancel: "Cancel",
        confirmWin: "Confirm Win",
        confirmDraw: "Confirm Draw",
        drawTitle: "Draw (Ryuukyoku)",
        tenpaiSelect: "Select players who are <strong>Tenpai</strong>:",
        player: "Player",
        winds: ["East", "South", "West", "North"],
        alerts: {
            resetConfirm: "Reset all scores to 25000?",
            riichiNotEnough: "Not enough points for Riichi!",
            riichiAlready: "Player has already declared Riichi!",
            selectWinner: "Select a winner",
            selectLoser: "Select who dealt in",
            shuffleConfirm: "Shuffle player seats?"
        },
        hanOptions: {
            1: "1 Han", 2: "2 Han", 3: "3 Han", 4: "4 Han",
            5: "5 Han (Mangan)", 6: "6-7 Han (Haneman)",
            8: "8-10 Han (Baiman)", 11: "11-12 Han (Sanbaiman)",
            13: "13+ Han (Yakuman)"
        },
        fuOptions: {
            20: "20 Fu", 25: "25 Fu (7 Pairs)", 30: "30 Fu",
            40: "40 Fu", 50: "50 Fu", 60: "60 Fu",
            70: "70 Fu", 80: "80 Fu", 90: "90 Fu",
            100: "100 Fu", 110: "110 Fu"
        }
    },
    ja: {
        title: "リーチ麻雀点数計算",
        riichiSticks: "立直棒",
        honba: "本場",
        reset: "リセット",
        rotate: "席替え(回転) ↻",
        shuffle: "席替え(乱数) ⤮",
        win: "和了",
        draw: "流局",
        riichi: "立直",
        ron: "ロン",
        tsumo: "ツモ",
        whoWon: "和了者",
        whoDealt: "放銃者",
        handValue: "翻・符",
        han: "翻",
        fu: "符",
        score: "点数:",
        base: "素点:",
        total: "合計:",
        cancel: "キャンセル",
        confirmWin: "決定",
        confirmDraw: "決定",
        drawTitle: "流局",
        tenpaiSelect: "<strong>聴牌</strong>しているプレイヤーを選択:",
        player: "プレイヤー",
        winds: ["東", "南", "西", "北"],
        alerts: {
            resetConfirm: "点数を25000点にリセットしますか？",
            riichiNotEnough: "点棒が足りません！",
            riichiAlready: "既に立直しています！",
            selectWinner: "和了者を選択してください",
            selectLoser: "放銃者を選択してください",
            shuffleConfirm: "席をシャッフルしますか？"
        },
        hanOptions: {
            1: "1翻", 2: "2翻", 3: "3翻", 4: "4翻",
            5: "5翻 (満貫)", 6: "6-7翻 (跳満)",
            8: "8-10翻 (倍満)", 11: "11-12翻 (三倍満)",
            13: "13翻+ (役満)"
        },
        fuOptions: {
            20: "20符", 25: "25符 (七対子)", 30: "30符",
            40: "40符", 50: "50符", 60: "60符",
            70: "70符", 80: "80符", 90: "90符",
            100: "100符", 110: "110符"
        }
    },
    zh: {
        title: "立直麻将计分器",
        riichiSticks: "立直棒",
        honba: "本场",
        reset: "重置",
        rotate: "换位(旋转) ↻",
        shuffle: "换位(随机) ⤮",
        win: "和牌",
        draw: "流局",
        riichi: "立直",
        ron: "荣和",
        tsumo: "自摸",
        whoWon: "和牌者",
        whoDealt: "放铳者",
        handValue: "点数计算",
        han: "番",
        fu: "符",
        score: "点数:",
        base: "基本点:",
        total: "合计:",
        cancel: "取消",
        confirmWin: "确定",
        confirmDraw: "确定",
        drawTitle: "流局",
        tenpaiSelect: "选择<strong>听牌</strong>的玩家:",
        player: "玩家",
        winds: ["东", "南", "西", "北"],
        alerts: {
            resetConfirm: "重置所有分数为25000？",
            riichiNotEnough: "点数不足！",
            riichiAlready: "玩家已立直！",
            selectWinner: "请选择和牌者",
            selectLoser: "请选择放铳者",
            shuffleConfirm: "随机分配座位？"
        },
        hanOptions: {
            1: "1番", 2: "2番", 3: "3番", 4: "4番",
            5: "5番 (满贯)", 6: "6-7番 (跳满)",
            8: "8-10番 (倍满)", 11: "11-12番 (三倍满)",
            13: "13番+ (役满)"
        },
        fuOptions: {
            20: "20符", 25: "25符 (七对子)", 30: "30符",
            40: "40符", 50: "50符", 60: "60符",
            70: "70符", 80: "80符", 90: "90符",
            100: "100符", 110: "110符"
        }
    }
};

// UI State for Win Modal
let selectedWinner = null;
let selectedLoser = null;
let winType = 'ron'; // 'ron' or 'tsumo'
let selectedPoints = 0;

// Helper: Round up to nearest 100
const roundUp100 = (val) => Math.ceil(val / 100) * 100;

const SCORE_TABLES = {
    "dealer_ron": {
        "1": {
            "20": 1000,
            "25": 1200,
            "30": 1500,
            "40": 2000,
            "50": 2400,
            "60": 2900,
            "70": 3400,
            "80": 3900,
            "90": 4400,
            "100": 4800,
            "110": 5300
        },
        "2": {
            "20": 2000,
            "25": 2400,
            "30": 2900,
            "40": 3900,
            "50": 4800,
            "60": 5800,
            "70": 6800,
            "80": 7700,
            "90": 8700,
            "100": 9600,
            "110": 10600
        },
        "3": {
            "20": 3900,
            "25": 4800,
            "30": 5800,
            "40": 7700,
            "50": 9600,
            "60": 11600,
            "70": 12000,
            "80": 12000,
            "90": 12000,
            "100": 12000,
            "110": 12000
        },
        "4": {
            "20": 7700,
            "25": 9600,
            "30": 11600,
            "40": 12000,
            "50": 12000,
            "60": 12000,
            "70": 12000,
            "80": 12000,
            "90": 12000,
            "100": 12000,
            "110": 12000
        },
        "5": {
            "20": 12000,
            "25": 12000,
            "30": 12000,
            "40": 12000,
            "50": 12000,
            "60": 12000,
            "70": 12000,
            "80": 12000,
            "90": 12000,
            "100": 12000,
            "110": 12000
        },
        "6": {
            "20": 18000,
            "25": 18000,
            "30": 18000,
            "40": 18000,
            "50": 18000,
            "60": 18000,
            "70": 18000,
            "80": 18000,
            "90": 18000,
            "100": 18000,
            "110": 18000
        },
        "8": {
            "20": 24000,
            "25": 24000,
            "30": 24000,
            "40": 24000,
            "50": 24000,
            "60": 24000,
            "70": 24000,
            "80": 24000,
            "90": 24000,
            "100": 24000,
            "110": 24000
        },
        "11": {
            "20": 36000,
            "25": 36000,
            "30": 36000,
            "40": 36000,
            "50": 36000,
            "60": 36000,
            "70": 36000,
            "80": 36000,
            "90": 36000,
            "100": 36000,
            "110": 36000
        },
        "13": {
            "20": 48000,
            "25": 48000,
            "30": 48000,
            "40": 48000,
            "50": 48000,
            "60": 48000,
            "70": 48000,
            "80": 48000,
            "90": 48000,
            "100": 48000,
            "110": 48000
        }
    },
    "non_dealer_ron": {
        "1": {
            "20": 700,
            "25": 800,
            "30": 1000,
            "40": 1300,
            "50": 1600,
            "60": 2000,
            "70": 2300,
            "80": 2600,
            "90": 2900,
            "100": 3200,
            "110": 3600
        },
        "2": {
            "20": 1300,
            "25": 1600,
            "30": 2000,
            "40": 2600,
            "50": 3200,
            "60": 3900,
            "70": 4500,
            "80": 5200,
            "90": 5800,
            "100": 6400,
            "110": 7100
        },
        "3": {
            "20": 2600,
            "25": 3200,
            "30": 3900,
            "40": 5200,
            "50": 6400,
            "60": 7700,
            "70": 8000,
            "80": 8000,
            "90": 8000,
            "100": 8000,
            "110": 8000
        },
        "4": {
            "20": 5200,
            "25": 6400,
            "30": 7700,
            "40": 8000,
            "50": 8000,
            "60": 8000,
            "70": 8000,
            "80": 8000,
            "90": 8000,
            "100": 8000,
            "110": 8000
        },
        "5": {
            "20": 8000,
            "25": 8000,
            "30": 8000,
            "40": 8000,
            "50": 8000,
            "60": 8000,
            "70": 8000,
            "80": 8000,
            "90": 8000,
            "100": 8000,
            "110": 8000
        },
        "6": {
            "20": 12000,
            "25": 12000,
            "30": 12000,
            "40": 12000,
            "50": 12000,
            "60": 12000,
            "70": 12000,
            "80": 12000,
            "90": 12000,
            "100": 12000,
            "110": 12000
        },
        "8": {
            "20": 16000,
            "25": 16000,
            "30": 16000,
            "40": 16000,
            "50": 16000,
            "60": 16000,
            "70": 16000,
            "80": 16000,
            "90": 16000,
            "100": 16000,
            "110": 16000
        },
        "11": {
            "20": 24000,
            "25": 24000,
            "30": 24000,
            "40": 24000,
            "50": 24000,
            "60": 24000,
            "70": 24000,
            "80": 24000,
            "90": 24000,
            "100": 24000,
            "110": 24000
        },
        "13": {
            "20": 32000,
            "25": 32000,
            "30": 32000,
            "40": 32000,
            "50": 32000,
            "60": 32000,
            "70": 32000,
            "80": 32000,
            "90": 32000,
            "100": 32000,
            "110": 32000
        }
    },
    "dealer_tsumo": {
        "1": {
            "20": 400,
            "25": 400,
            "30": 500,
            "40": 700,
            "50": 800,
            "60": 1000,
            "70": 1200,
            "80": 1300,
            "90": 1500,
            "100": 1600,
            "110": 1800
        },
        "2": {
            "20": 700,
            "25": 800,
            "30": 1000,
            "40": 1300,
            "50": 1600,
            "60": 2000,
            "70": 2300,
            "80": 2600,
            "90": 2900,
            "100": 3200,
            "110": 3600
        },
        "3": {
            "20": 1300,
            "25": 1600,
            "30": 2000,
            "40": 2600,
            "50": 3200,
            "60": 3900,
            "70": 4000,
            "80": 4000,
            "90": 4000,
            "100": 4000,
            "110": 4000
        },
        "4": {
            "20": 2600,
            "25": 3200,
            "30": 3900,
            "40": 4000,
            "50": 4000,
            "60": 4000,
            "70": 4000,
            "80": 4000,
            "90": 4000,
            "100": 4000,
            "110": 4000
        },
        "5": {
            "20": 4000,
            "25": 4000,
            "30": 4000,
            "40": 4000,
            "50": 4000,
            "60": 4000,
            "70": 4000,
            "80": 4000,
            "90": 4000,
            "100": 4000,
            "110": 4000
        },
        "6": {
            "20": 6000,
            "25": 6000,
            "30": 6000,
            "40": 6000,
            "50": 6000,
            "60": 6000,
            "70": 6000,
            "80": 6000,
            "90": 6000,
            "100": 6000,
            "110": 6000
        },
        "8": {
            "20": 8000,
            "25": 8000,
            "30": 8000,
            "40": 8000,
            "50": 8000,
            "60": 8000,
            "70": 8000,
            "80": 8000,
            "90": 8000,
            "100": 8000,
            "110": 8000
        },
        "11": {
            "20": 12000,
            "25": 12000,
            "30": 12000,
            "40": 12000,
            "50": 12000,
            "60": 12000,
            "70": 12000,
            "80": 12000,
            "90": 12000,
            "100": 12000,
            "110": 12000
        },
        "13": {
            "20": 16000,
            "25": 16000,
            "30": 16000,
            "40": 16000,
            "50": 16000,
            "60": 16000,
            "70": 16000,
            "80": 16000,
            "90": 16000,
            "100": 16000,
            "110": 16000
        }
    },
    "non_dealer_tsumo_dealer": {
        "1": {
            "20": 400,
            "25": 400,
            "30": 500,
            "40": 700,
            "50": 800,
            "60": 1000,
            "70": 1200,
            "80": 1300,
            "90": 1500,
            "100": 1600,
            "110": 1800
        },
        "2": {
            "20": 700,
            "25": 800,
            "30": 1000,
            "40": 1300,
            "50": 1600,
            "60": 2000,
            "70": 2300,
            "80": 2600,
            "90": 2900,
            "100": 3200,
            "110": 3600
        },
        "3": {
            "20": 1300,
            "25": 1600,
            "30": 2000,
            "40": 2600,
            "50": 3200,
            "60": 3900,
            "70": 4000,
            "80": 4000,
            "90": 4000,
            "100": 4000,
            "110": 4000
        },
        "4": {
            "20": 2600,
            "25": 3200,
            "30": 3900,
            "40": 4000,
            "50": 4000,
            "60": 4000,
            "70": 4000,
            "80": 4000,
            "90": 4000,
            "100": 4000,
            "110": 4000
        },
        "5": {
            "20": 4000,
            "25": 4000,
            "30": 4000,
            "40": 4000,
            "50": 4000,
            "60": 4000,
            "70": 4000,
            "80": 4000,
            "90": 4000,
            "100": 4000,
            "110": 4000
        },
        "6": {
            "20": 6000,
            "25": 6000,
            "30": 6000,
            "40": 6000,
            "50": 6000,
            "60": 6000,
            "70": 6000,
            "80": 6000,
            "90": 6000,
            "100": 6000,
            "110": 6000
        },
        "8": {
            "20": 8000,
            "25": 8000,
            "30": 8000,
            "40": 8000,
            "50": 8000,
            "60": 8000,
            "70": 8000,
            "80": 8000,
            "90": 8000,
            "100": 8000,
            "110": 8000
        },
        "11": {
            "20": 12000,
            "25": 12000,
            "30": 12000,
            "40": 12000,
            "50": 12000,
            "60": 12000,
            "70": 12000,
            "80": 12000,
            "90": 12000,
            "100": 12000,
            "110": 12000
        },
        "13": {
            "20": 16000,
            "25": 16000,
            "30": 16000,
            "40": 16000,
            "50": 16000,
            "60": 16000,
            "70": 16000,
            "80": 16000,
            "90": 16000,
            "100": 16000,
            "110": 16000
        }
    },
    "non_dealer_tsumo_child": {
        "1": {
            "20": 200,
            "25": 200,
            "30": 300,
            "40": 400,
            "50": 400,
            "60": 500,
            "70": 600,
            "80": 700,
            "90": 800,
            "100": 800,
            "110": 900
        },
        "2": {
            "20": 400,
            "25": 400,
            "30": 500,
            "40": 700,
            "50": 800,
            "60": 1000,
            "70": 1200,
            "80": 1300,
            "90": 1500,
            "100": 1600,
            "110": 1800
        },
        "3": {
            "20": 700,
            "25": 800,
            "30": 1000,
            "40": 1300,
            "50": 1600,
            "60": 2000,
            "70": 2000,
            "80": 2000,
            "90": 2000,
            "100": 2000,
            "110": 2000
        },
        "4": {
            "20": 1300,
            "25": 1600,
            "30": 2000,
            "40": 2000,
            "50": 2000,
            "60": 2000,
            "70": 2000,
            "80": 2000,
            "90": 2000,
            "100": 2000,
            "110": 2000
        },
        "5": {
            "20": 2000,
            "25": 2000,
            "30": 2000,
            "40": 2000,
            "50": 2000,
            "60": 2000,
            "70": 2000,
            "80": 2000,
            "90": 2000,
            "100": 2000,
            "110": 2000
        },
        "6": {
            "20": 3000,
            "25": 3000,
            "30": 3000,
            "40": 3000,
            "50": 3000,
            "60": 3000,
            "70": 3000,
            "80": 3000,
            "90": 3000,
            "100": 3000,
            "110": 3000
        },
        "8": {
            "20": 4000,
            "25": 4000,
            "30": 4000,
            "40": 4000,
            "50": 4000,
            "60": 4000,
            "70": 4000,
            "80": 4000,
            "90": 4000,
            "100": 4000,
            "110": 4000
        },
        "11": {
            "20": 6000,
            "25": 6000,
            "30": 6000,
            "40": 6000,
            "50": 6000,
            "60": 6000,
            "70": 6000,
            "80": 6000,
            "90": 6000,
            "100": 6000,
            "110": 6000
        },
        "13": {
            "20": 8000,
            "25": 8000,
            "30": 8000,
            "40": 8000,
            "50": 8000,
            "60": 8000,
            "70": 8000,
            "80": 8000,
            "90": 8000,
            "100": 8000,
            "110": 8000
        }
    }
};

function init() {
    initPlayerNames();
    updateLanguageUI();
    renderScores();
    updateDealerUI();
    updateHeader();
}

function changeLanguage(lang) {
    currentLang = lang;
    updateLanguageUI();
    updateDealerUI(); // Update winds
}

function updateLanguageUI() {
    const t = TRANSLATIONS[currentLang];
    
    // Update Title
    document.title = t.title;

    // Sync Dropdown
    const langSelect = document.getElementById('lang-select');
    if(langSelect) langSelect.value = currentLang;

    // Update elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            if (key === 'tenpaiSelect') {
                el.innerHTML = t[key];
            } else {
                el.textContent = t[key];
            }
        }
    });

    // Update Player Placeholders
    for(let i=0; i<4; i++) {
        const input = document.querySelector(`#p${i} .player-name`);
        input.placeholder = `${t.player} ${i+1}`;
    }

    // Update Dropdowns
    const hanSelect = document.getElementById('han-select');
    const fuSelect = document.getElementById('fu-select');
    
    // Save current values
    const currentHan = hanSelect.value;
    const currentFu = fuSelect.value;

    hanSelect.innerHTML = '';
    for (const [val, text] of Object.entries(t.hanOptions)) {
        const opt = document.createElement('option');
        opt.value = val;
        opt.textContent = text;
        hanSelect.appendChild(opt);
    }
    hanSelect.value = currentHan || "1";

    fuSelect.innerHTML = '';
    for (const [val, text] of Object.entries(t.fuOptions)) {
        const opt = document.createElement('option');
        opt.value = val;
        opt.textContent = text;
        fuSelect.appendChild(opt);
    }
    fuSelect.value = currentFu || "30";
}

function initPlayerNames() {
    for(let i=0; i<4; i++) {
        const input = document.querySelector(`#p${i} .player-name`);
        // Load saved name
        const savedName = localStorage.getItem(`player-name-${i}`);
        if (savedName) {
            input.value = savedName;
        }

        // Save on change
        input.addEventListener('change', (e) => {
            localStorage.setItem(`player-name-${i}`, e.target.value);
        });
    }
}

function rotateSeats() {
    const names = [];
    for(let i=0; i<4; i++) {
        names.push(document.querySelector(`#p${i} .player-name`).value);
    }
    
    // Rotate: P3 -> P0, P0 -> P1, etc.
    const last = names.pop();
    names.unshift(last);
    
    for(let i=0; i<4; i++) {
        const input = document.querySelector(`#p${i} .player-name`);
        input.value = names[i];
        localStorage.setItem(`player-name-${i}`, names[i]);
    }
}

function shuffleSeats() {
    if(!confirm(TRANSLATIONS[currentLang].alerts.shuffleConfirm)) return;
    
    const names = [];
    for(let i=0; i<4; i++) {
        names.push(document.querySelector(`#p${i} .player-name`).value);
    }
    
    // Fisher-Yates Shuffle
    for (let i = names.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [names[i], names[j]] = [names[j], names[i]];
    }
    
    for(let i=0; i<4; i++) {
        const input = document.querySelector(`#p${i} .player-name`);
        input.value = names[i];
        localStorage.setItem(`player-name-${i}`, names[i]);
    }
}

function resetGame() {
    if(!confirm(TRANSLATIONS[currentLang].alerts.resetConfirm)) return;
    scores = [25000, 25000, 25000, 25000];
    playersRiichi = [false, false, false, false];
    riichiSticks = 0;
    honba = 0;
    dealerIndex = 0;
    init();
}

function renderScores() {
    for (let i = 0; i < 4; i++) {
        document.getElementById(`score-${i}`).textContent = scores[i];
        const el = document.getElementById(`score-${i}`);
        if(scores[i] < 0) el.style.color = '#ff6b6b';
        else el.style.color = 'white';

        // Update Riichi Button State
        const btn = document.querySelector(`#p${i} .btn-riichi`);
        if (playersRiichi[i]) {
            btn.disabled = true;
            btn.classList.add('disabled');
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        } else {
            btn.disabled = false;
            btn.classList.remove('disabled');
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        }
    }
}

function updateHeader() {
    document.getElementById('pot-sticks').textContent = riichiSticks;
    document.getElementById('honba-count').textContent = honba;
}

function updateDealerUI() {
    const winds = TRANSLATIONS[currentLang].winds;
    for (let i = 0; i < 4; i++) {
        const card = document.getElementById(`p${i}`);
        const windText = document.getElementById(`wind-${i}`);
        
        // Calculate player's wind based on dealer position
        // (PlayerIndex - DealerIndex + 4) % 4 -> 0=E, 1=S, 2=W, 3=N
        const relativeWind = (i - dealerIndex + 4) % 4;
        windText.textContent = winds[relativeWind];

        if (i === dealerIndex) card.classList.add('dealer');
        else card.classList.remove('dealer');
    }
}

// --- Actions ---

function declareRiichi(playerIdx) {
    if (playersRiichi[playerIdx]) {
        alert(TRANSLATIONS[currentLang].alerts.riichiAlready);
        return;
    }
    if (scores[playerIdx] < 1000) {
        alert(TRANSLATIONS[currentLang].alerts.riichiNotEnough);
        return;
    }
    scores[playerIdx] -= 1000;
    playersRiichi[playerIdx] = true;
    riichiSticks++;
    renderScores();
    updateHeader();
}

// --- Modal Logic ---

function openWinModal() {
    document.getElementById('win-modal').classList.remove('hidden');
    selectedWinner = null;
    selectedLoser = null;
    winType = 'ron';
    selectedPoints = 0;
    
    // Reset Inputs
    document.getElementById('han-select').value = "1";
    document.getElementById('fu-select').value = "30";

    renderPlayerSelects();
    updateWinTypeUI();
    updateCalculatedScore();
}

function closeModals() {
    document.getElementById('win-modal').classList.add('hidden');
    document.getElementById('draw-modal').classList.add('hidden');
}

function setWinType(type) {
    winType = type;
    updateWinTypeUI();
}

function updateWinTypeUI() {
    document.getElementById('btn-ron').classList.toggle('active', winType === 'ron');
    document.getElementById('btn-tsumo').classList.toggle('active', winType === 'tsumo');
    
    const loserSection = document.getElementById('loser-section');
    loserSection.style.display = (winType === 'tsumo') ? 'none' : 'block';
    
    renderPlayerSelects();
    updateCalculatedScore();
}

function renderPlayerSelects() {
    const winnerContainer = document.getElementById('winner-select');
    const loserContainer = document.getElementById('loser-select');
    
    winnerContainer.innerHTML = '';
    loserContainer.innerHTML = '';

    const playerNames = [];
    for(let i=0; i<4; i++) {
        playerNames.push(document.querySelector(`#p${i} .player-name`).value || `${TRANSLATIONS[currentLang].player} ${i+1}`);
    }

    // Winner Buttons
    for(let i=0; i<4; i++) {
        const btn = document.createElement('button');
        btn.className = `toggle-btn ${selectedWinner === i ? 'active' : ''}`;
        btn.textContent = playerNames[i];
        btn.onclick = () => {
            selectedWinner = i;
            if (selectedLoser === i) selectedLoser = null;
            renderPlayerSelects();
            updateCalculatedScore();
        };
        winnerContainer.appendChild(btn);
    }

    // Loser Buttons
    for(let i=0; i<4; i++) {
        const btn = document.createElement('button');
        let className = 'toggle-btn';
        if (selectedLoser === i) className += ' active';
        if (selectedWinner === i) {
            className += ' disabled';
            btn.disabled = true;
        }

        btn.className = className;
        btn.textContent = playerNames[i];
        btn.onclick = () => {
            if(selectedWinner !== i) {
                selectedLoser = i;
                renderPlayerSelects();
            }
        };
        loserContainer.appendChild(btn);
    }
}

function updateCalculatedScore() {
    const han = parseInt(document.getElementById('han-select').value);
    const fu = parseInt(document.getElementById('fu-select').value);
    
    // Default to non-dealer if no winner selected yet
    const isDealer = (selectedWinner !== null) ? (selectedWinner === dealerIndex) : false;
    const isRon = (winType === 'ron');

    let baseTotal = 0;

    if (isRon) {
        if (isDealer) {
            baseTotal = SCORE_TABLES.dealer_ron[han][fu];
        } else {
            baseTotal = SCORE_TABLES.non_dealer_ron[han][fu];
        }
    } else {
        // Tsumo Total
        if (isDealer) {
            // Dealer Tsumo: Everyone pays the same
            const payment = SCORE_TABLES.dealer_tsumo[han][fu];
            baseTotal = payment * 3;
        } else {
            // Non-Dealer Tsumo
            const dealerPay = SCORE_TABLES.non_dealer_tsumo_dealer[han][fu];
            const childPay = SCORE_TABLES.non_dealer_tsumo_child[han][fu];
            baseTotal = dealerPay + (childPay * 2);
        }
    }

    // Calculate Bonuses
    // Honba: 300 points total (Ron: 300*honba from loser, Tsumo: 100*honba from each of 3 losers)
    const honbaPoints = 300 * honba;
    const riichiPoints = riichiSticks * 1000;
    const total = baseTotal + honbaPoints + riichiPoints;

    let breakdownHTML = '';
    if (honbaPoints > 0 || riichiPoints > 0) {
        breakdownHTML = `${baseTotal}`;
        if (riichiPoints > 0) breakdownHTML += ` <span style="color: white;">+</span> ${riichiPoints}`;
        if (honbaPoints > 0) breakdownHTML += ` <span style="color: white;">+</span> ${honbaPoints}`;
        breakdownHTML += ` <span style="color: white;">=</span>`;
    }

    document.getElementById('score-breakdown').innerHTML = breakdownHTML;
    document.getElementById('score-total').textContent = total;
}

function submitWin() {
    if (selectedWinner === null) { alert(TRANSLATIONS[currentLang].alerts.selectWinner); return; }
    
    // Get Han/Fu
    const han = parseInt(document.getElementById('han-select').value);
    const fu = parseInt(document.getElementById('fu-select').value);

    // 1. Transfer Riichi Sticks to Winner
    scores[selectedWinner] += (riichiSticks * 1000);
    riichiSticks = 0;

    // 2. Calculate Hand Points
    const isDealerWin = (selectedWinner === dealerIndex);
    const honbaPayment = 100 * honba;

    if (winType === 'ron') {
        if (selectedLoser === null) { alert(TRANSLATIONS[currentLang].alerts.selectLoser); return; }
        
        // Ron Payment
        let pointValue = 0;
        if (isDealerWin) {
            pointValue = SCORE_TABLES.dealer_ron[han][fu];
        } else {
            pointValue = SCORE_TABLES.non_dealer_ron[han][fu];
        }
        
        const totalPay = pointValue + (300 * honba);
        
        scores[selectedWinner] += totalPay;
        scores[selectedLoser] -= totalPay;

    } else {
        // Tsumo
        if (isDealerWin) {
            // Dealer Tsumo: Everyone pays same amount
            const paymentPerPerson = SCORE_TABLES.dealer_tsumo[han][fu];
            
            for(let i=0; i<4; i++) {
                if(i !== selectedWinner) {
                    scores[i] -= (paymentPerPerson + honbaPayment);
                    scores[selectedWinner] += (paymentPerPerson + honbaPayment);
                }
            }
        } else {
            // Non-Dealer Tsumo
            const childPayment = SCORE_TABLES.non_dealer_tsumo_child[han][fu];
            const dealerPayment = SCORE_TABLES.non_dealer_tsumo_dealer[han][fu];

            for(let i=0; i<4; i++) {
                if(i === selectedWinner) continue;
                
                let payment = (i === dealerIndex) ? dealerPayment : childPayment;
                
                scores[i] -= (payment + honbaPayment);
                scores[selectedWinner] += (payment + honbaPayment);
            }
        }
    }

    // 3. Dealer Rotation
    // If Dealer wins (Ron or Tsumo), Honba increases, Dealer stays.
    // If Dealer loses, Honba resets to 0, Dealer rotates.
    if (selectedWinner === dealerIndex) {
        honba++;
    } else {
        honba = 0;
        dealerIndex = (dealerIndex + 1) % 4;
    }

    // Reset Riichi status for next round
    playersRiichi = [false, false, false, false];

    renderScores();
    updateHeader();
    updateDealerUI();
    closeModals();
}

// --- Draw Logic ---

function openDrawModal() {
    document.getElementById('draw-modal').classList.remove('hidden');
    const container = document.getElementById('tenpai-select');
    container.innerHTML = '';
    
    const playerNames = [];
    for(let i=0; i<4; i++) {
        playerNames.push(document.querySelector(`#p${i} .player-name`).value || `${TRANSLATIONS[currentLang].player} ${i+1}`);
    }

    for(let i=0; i<4; i++) {
        const div = document.createElement('div');
        div.className = 'tenpai-row';
        div.innerHTML = `
            <span>${playerNames[i]}</span>
            <input type="checkbox" id="tenpai-check-${i}">
        `;
        container.appendChild(div);
    }
}

function submitDraw() {
    let tenpaiCount = 0;
    let tenpaiIndices = [];

    for(let i=0; i<4; i++) {
        if(document.getElementById(`tenpai-check-${i}`).checked) {
            tenpaiCount++;
            tenpaiIndices.push(i);
        }
    }

    // Pot Split (3000)
    if (tenpaiCount > 0 && tenpaiCount < 4) {
        const winAmount = 3000 / tenpaiCount;
        const loseAmount = 3000 / (4 - tenpaiCount);

        for(let i=0; i<4; i++) {
            if (tenpaiIndices.includes(i)) {
                scores[i] += winAmount;
            } else {
                scores[i] -= loseAmount;
            }
        }
    }

    // Dealer Rotation
    // If Dealer is Tenpai: Dealer stays, Honba + 1
    // If Dealer is Noten: Dealer rotates, Honba + 1
    const dealerIsTenpai = tenpaiIndices.includes(dealerIndex);
    
    honba++; 
    
    if (!dealerIsTenpai) {
        dealerIndex = (dealerIndex + 1) % 4;
    }

    // Reset Riichi status for next round
    playersRiichi = [false, false, false, false];

    renderScores();
    updateHeader();
    updateDealerUI();
    closeModals();
}

init();