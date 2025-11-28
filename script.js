// Game State
let scores = [25000, 25000, 25000, 25000];
let playersRiichi = [false, false, false, false];
let riichiSticks = 0;
let honba = 0;
let dealerIndex = 0; // 0=East, 1=South, etc.

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
    renderScores();
    updateDealerUI();
    updateHeader();
}

function resetGame() {
    if(!confirm("Reset all scores to 25000?")) return;
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
    const winds = ['East', 'South', 'West', 'North'];
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
        alert("Player has already declared Riichi!");
        return;
    }
    if (scores[playerIdx] < 1000) {
        alert("Not enough points for Riichi!");
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
        playerNames.push(document.querySelector(`#p${i} .player-name`).value || `Player ${i+1}`);
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
    if (selectedWinner === null) { alert("Select a winner"); return; }
    
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
        if (selectedLoser === null) { alert("Select who dealt in"); return; }
        
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
        playerNames.push(document.querySelector(`#p${i} .player-name`).value || `Player ${i+1}`);
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