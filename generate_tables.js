
const roundUp100 = (val) => Math.ceil(val / 100) * 100;

const hans = [1, 2, 3, 4, 5, 6, 8, 11, 13];
const fus = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110];

const tables = {
    dealer_ron: {},
    non_dealer_ron: {},
    dealer_tsumo: {}, // Everyone pays this
    non_dealer_tsumo_dealer: {}, // Dealer pays this
    non_dealer_tsumo_child: {} // Child pays this
};

hans.forEach(han => {
    tables.dealer_ron[han] = {};
    tables.non_dealer_ron[han] = {};
    tables.dealer_tsumo[han] = {};
    tables.non_dealer_tsumo_dealer[han] = {};
    tables.non_dealer_tsumo_child[han] = {};

    fus.forEach(fu => {
        let basic = 0;
        if (han >= 13) basic = 8000;
        else if (han >= 11) basic = 6000;
        else if (han >= 8) basic = 4000;
        else if (han >= 6) basic = 3000;
        else if (han === 5) basic = 2000;
        else {
            basic = fu * Math.pow(2, 2 + han);
            if (basic > 2000) basic = 2000; // Mangan cap for < 5 han
        }

        // Calculate payments
        tables.dealer_ron[han][fu] = roundUp100(basic * 6);
        tables.non_dealer_ron[han][fu] = roundUp100(basic * 4);
        
        tables.dealer_tsumo[han][fu] = roundUp100(basic * 2);
        
        tables.non_dealer_tsumo_dealer[han][fu] = roundUp100(basic * 2);
        tables.non_dealer_tsumo_child[han][fu] = roundUp100(basic);
    });
});

console.log("const SCORE_TABLES = " + JSON.stringify(tables, null, 4) + ";");
