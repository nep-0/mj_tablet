// Game State
let scores = [25000, 25000, 25000, 25000];
let riichiSticks = 0;
let honba = 0;
let dealerIndex = 0; 

// UI State
let selectedWinner = null;
let selectedLoser = null;
let winType = 'ron'; 
let selectedPoints = 0;

// Helper for Mahjong Rounding (Round up to nearest 100)
const roundUp100 = (points) => Math.ceil(points / 100) * 100;

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
    for (let i = 0; i < 4; i++) {
        const card = document.getElementById(`p${i}`);
        const windLabel = document.getElementById(`wind-${i}`);
        
        // Calculate wind relative to dealer
        // Dealer is East, Next is South, etc.
        // (PlayerIndex - DealerIndex + 4) % 4: 0=E, 1=S, 2=W, 3=N
        const relWind = (i - dealerIndex + 4) % 4;
        const winds = ['East', 'South', 'West', 'North'];
        windLabel.textContent = winds[relWind];

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
        if (selectedWinner === i) className += ' disabled';

        btn.className = className;
        btn.disabled = (selectedWinner === i);
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
    
    let inputPoints = parseInt(document.getElementById('custom-points').value) || 0;
    if (inputPoints === 0) { alert("Enter points"); return; }

    // 1. Transfer Riichi Sticks
    scores[selectedWinner] += (riichiSticks * 1000);
    riichiSticks = 0;

    // 2. Calculate Hand Points
    if (winType === 'ron') {
        if (selectedLoser === null) { alert("Select who dealt in"); return; }
        
        // Ron: Payer pays (Points + 300*Honba)
        const totalPay = inputPoints + (300 * honba);
        scores[selectedWinner] += totalPay;
        scores[selectedLoser] -= totalPay;

    } else {
        // Tsumo Logic
        // Honba: Every player pays 100 extra. Total bonus = 300*honba.
        const isDealerWin = (selectedWinner === dealerIndex);
        const individualHonba = 100 * honba;
        
        if (isDealerWin) {
            // Dealer Tsumo: Everyone pays 1/3 of total
            // Calculation: (Total / 3) rounded up
            const basePayment = roundUp100(inputPoints / 3);
            
            for(let i=0; i<4; i++) {
                if(i !== selectedWinner) {
                    scores[i] -= (basePayment + individualHonba);
                    scores[selectedWinner] += (basePayment + individualHonba);
                }
            }
        } else {
            // Non-Dealer Tsumo: 
            // Dealer pays 2/4 of total (approx), Children pay 1/4 (approx)
            // Correct formula using input points as "Ron Equivalent":
            // Base = Points / 4. Child = Round(Base). Dealer = Round(Base * 2).
            
            const baseVal = inputPoints / 4;
            const childPayment = roundUp100(baseVal);
            const dealerPayment = roundUp100(baseVal * 2);

            for(let i=0; i<4; i++) {
                if(i === selectedWinner) continue;
                
                let payment = (i === dealerIndex) ? dealerPayment : childPayment;
                scores[i] -= (payment + individualHonba);
                scores[selectedWinner] += (payment + individualHonba);
            }
        }
    }

    // 3. Rotate Dealer / Honba
    // If Dealer Won (Ron or Tsumo): Honba++, Dealer Stays
    // If Dealer Lost: Honba=0, Dealer Rotates
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
        // Dealer usually checked by default for convenience in many apps, but let's leave unchecked
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

    // 1. Pot Split (3000 total)
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

    // 2. Dealer Rotation
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