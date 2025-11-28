// Game State
let scores = [25000, 25000, 25000, 25000];
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

function init() {
    renderScores();
    updateDealerUI();
    updateHeader();
}

function resetGame() {
    if(!confirm("Reset all scores to 25000?")) return;
    scores = [25000, 25000, 25000, 25000];
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
    if (scores[playerIdx] < 1000) {
        alert("Not enough points for Riichi!");
        return;
    }
    scores[playerIdx] -= 1000;
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
    
    renderPlayerSelects();
    updateWinTypeUI();
    document.getElementById('custom-points').value = '';
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

function setPoints(pts) {
    selectedPoints = pts;
    document.getElementById('custom-points').value = pts;
}

function submitWin() {
    if (selectedWinner === null) { alert("Select a winner"); return; }
    
    let rawPoints = parseInt(document.getElementById('custom-points').value) || 0;
    if (rawPoints === 0) { alert("Enter points"); return; }

    // 1. Transfer Riichi Sticks to Winner
    scores[selectedWinner] += (riichiSticks * 1000);
    riichiSticks = 0;

    // 2. Calculate Hand Points
    const isDealerWin = (selectedWinner === dealerIndex);

    if (winType === 'ron') {
        if (selectedLoser === null) { alert("Select who dealt in"); return; }
        
        // Ron: Input points + (300 * honba)
        const totalPay = rawPoints + (300 * honba);
        
        scores[selectedWinner] += totalPay;
        scores[selectedLoser] -= totalPay;

    } else {
        // Tsumo
        // Honba payment: Every loser pays 100 * honba
        const honbaPayment = 100 * honba;

        if (isDealerWin) {
            // Dealer Tsumo: Everyone pays 1/3 of total
            // Formula: RoundUp(Total / 3)
            const paymentPerPerson = roundUp100(rawPoints / 3);
            
            for(let i=0; i<4; i++) {
                if(i !== selectedWinner) {
                    scores[i] -= (paymentPerPerson + honbaPayment);
                    scores[selectedWinner] += (paymentPerPerson + honbaPayment);
                }
            }
        } else {
            // Non-Dealer Tsumo
            // Child Pays: RoundUp(Total / 4)
            // Dealer Pays: RoundUp(Total / 2) -- Note: This is derived from Base*2, roughly Total/2
            
            // Accurate Calculation using the "Total" input:
            const baseForCalc = rawPoints / 4;
            const childPayment = roundUp100(baseForCalc); 
            const dealerPayment = roundUp100(baseForCalc * 2); // Fixed: Round AFTER multiplying

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

    renderScores();
    updateHeader();
    updateDealerUI();
    closeModals();
}

init();