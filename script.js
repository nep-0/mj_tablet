// Game State
let scores = [25000, 25000, 25000, 25000];
let playersRiichi = [false, false, false, false];
let riichiSticks = 0;
let honba = 0;
let dealerIndex = 0; // 0=East, 1=South, etc.
let prevalentWind = 0; // 0=East, 1=South, etc.

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

let TRANSLATIONS = {};

// UI State for Win Modal
let selectedWinner = null;
let selectedLoser = null;
let winType = 'ron'; // 'ron' or 'tsumo'
let selectedPoints = 0;

// Helper: Round up to nearest 100
const roundUp100 = (val) => Math.ceil(val / 100) * 100;

let SCORE_TABLES = {};

async function init() {
    try {
        const [translationsResponse, scoreTablesResponse] = await Promise.all([
            fetch('translations.json'),
            fetch('score_tables.json')
        ]);

        if (!translationsResponse.ok) throw new Error('Failed to load translations');
        if (!scoreTablesResponse.ok) throw new Error('Failed to load score tables');

        TRANSLATIONS = await translationsResponse.json();
        SCORE_TABLES = await scoreTablesResponse.json();

        initPlayerNames();
        updateLanguageUI();
        renderScores();
        updateDealerUI();
        updateHeader();
        checkOrientation();
        window.addEventListener('resize', checkOrientation);
    } catch (error) {
        console.error('Initialization error:', error);
        alert('Failed to load game data. Please refresh the page.');
    }
}

function checkOrientation() {
    if (window.innerHeight > window.innerWidth) {
        alert(TRANSLATIONS[currentLang].alerts.portraitAlert);
    }
}

function changeLanguage(lang) {
    currentLang = lang;
    updateLanguageUI();
    updateDealerUI(); // Update winds
    updateHeader(); // Update round display
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
    prevalentWind = 0;
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

    const t = TRANSLATIONS[currentLang];
    const windName = t.winds[prevalentWind];
    const roundNum = dealerIndex + 1;
    
    let roundText = "";
    if (currentLang === 'en') {
        roundText = `${windName} ${roundNum}`;
    } else {
        roundText = `${windName}${roundNum}${t.roundSuffix}`;
    }
    
    const roundEl = document.getElementById('round-display');
    if(roundEl) roundEl.textContent = roundText;
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
        dealerIndex++;
        if (dealerIndex > 3) {
            dealerIndex = 0;
            prevalentWind = (prevalentWind + 1) % 4;
        }
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
        dealerIndex++;
        if (dealerIndex > 3) {
            dealerIndex = 0;
            prevalentWind = (prevalentWind + 1) % 4;
        }
    }

    // Reset Riichi status for next round
    playersRiichi = [false, false, false, false];

    renderScores();
    updateHeader();
    updateDealerUI();
    closeModals();
}

init();