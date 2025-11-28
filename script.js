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

function init() {
    renderScores();
    updateDealerUI();
}

function resetGame() {
    if(!confirm("Reset all scores to 25000?")) return;
    scores = [25000, 25000, 25000, 25000];
    riichiSticks = 0;
    honba = 0;
    dealerIndex = 0;
    renderScores();
    updateHeader();
    updateDealerUI();
}

function renderScores() {
    for (let i = 0; i < 4; i++) {
        document.getElementById(`score-${i}`).textContent = scores[i];
        // Highlight if negative
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
    // Mark dealer visually
    for (let i = 0; i < 4; i++) {
        const card = document.getElementById(`p${i}`);
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
    
    // Hide loser selection if Tsumo
    const loserSection = document.getElementById('loser-section');
    if (winType === 'tsumo') loserSection.style.display = 'none';
    else loserSection.style.display = 'block';
    
    // Re-render to disable winner in loser list
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
            if (selectedLoser === i) selectedLoser = null; // Can't win from self
            renderPlayerSelects();
        };
        winnerContainer.appendChild(btn);
    }

    // Loser Buttons
    for(let i=0; i<4; i++) {
        const btn = document.createElement('button');
        let className = 'toggle-btn';
        if (selectedLoser === i) className += ' active';
        
        // Disable if same as winner
        if (selectedWinner === i) {
            className += ' disabled';
            btn.disabled = true;
            btn.style.opacity = '0.3';
        }

        btn.className = className;
        btn.textContent = playerNames[i];
        btn.onclick = () => {
            selectedLoser = i;
            renderPlayerSelects();
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

    // Add Riichi Sticks to Winner
    scores[selectedWinner] += (riichiSticks * 1000);
    riichiSticks = 0;

    // Add Honba Bonuses (300 per honba for Ron, split for Tsumo usually handled in total)
    // Standard: Ron = points + (300 * honba). Tsumo = points + (300 * honba) [split payment]
    // Note: User inputs BASE points usually? Or Total? 
    // To be simple, let's assume input is total hand value (without honba) and we add honba logic.
    const honbaBonusTotal = honba * 300; 

    if (winType === 'ron') {
        if (selectedLoser === null) { alert("Select who dealt in"); return; }
        
        const totalTransfer = rawPoints + honbaBonusTotal;
        scores[selectedWinner] += totalTransfer;
        scores[selectedLoser] -= totalTransfer;

    } else {
        // Tsumo
        // Dealer Tsumo: All others pay 1/3 of total (rounded up)
        // Non-Dealer Tsumo: Dealer pays 1/2, others 1/4
        
        // Simplification: The input points usually specific. 
        // E.g. Mangan Tsumo is 4000/2000 (8000 total).
        // If user clicks "8000", does it mean 8000 total? Or 8000 payment?
        // Convention: User clicks the TOTAL value (e.g. 8000).
        
        const isDealerWin = (selectedWinner === dealerIndex);
        const totalPoints = rawPoints; // Base total
        
        // Honba payment in Tsumo is "all pay 100 each" = 300 total
        
        if (isDealerWin) {
            // Total 12000 (4000 all). 
            // payment per person = (Total / 3)
            // We need to handle rounding standard: usually 100s
            let payment = Math.ceil((totalPoints / 3) / 100) * 100;
            
            // Each loser pays 'payment' + 100*honba
            const individualHonba = 100 * honba;
            
            for(let i=0; i<4; i++) {
                if(i !== selectedWinner) {
                    scores[i] -= (payment + individualHonba);
                    scores[selectedWinner] += (payment + individualHonba);
                }
            }
        } else {
            // Non-dealer win. Dealer pays 2x, others 1x.
            // Total = 2x + x + x = 4x.
            // x = Total / 4.
            let basePayment = Math.ceil((totalPoints / 4) / 100) * 100;
            let dealerPayment = basePayment * 2; // Usually simplified like this, sometimes rounding differs slightly on exact tables

            const individualHonba = 100 * honba;

            for(let i=0; i<4; i++) {
                if(i === selectedWinner) continue;
                
                let payment = (i === dealerIndex) ? dealerPayment : basePayment;
                payment += individualHonba;
                
                scores[i] -= payment;
                scores[selectedWinner] += payment;
            }
        }
    }

    // Dealer Rotation Logic
    // If Dealer Won: Honba +1, Dealer stays.
    // If Dealer Lost/Someone else won: Honba = 0, Dealer rotates.
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
            <input type="checkbox" id="tenpai-check-${i}" ${i===dealerIndex ? 'checked': ''}> <!-- default dealer checked mostly for convenience -->
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

    // Scoring
    if (tenpaiCount > 0 && tenpaiCount < 4) {
        const pot = 3000;
        const winAmount = pot / tenpaiCount;
        const loseAmount = pot / (4 - tenpaiCount);

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
    
    honba++; // Honba always increases on draw
    
    if (!dealerIsTenpai) {
        dealerIndex = (dealerIndex + 1) % 4;
    }

    renderScores();
    updateHeader();
    updateDealerUI();
    closeModals();
}

// Start
init();