let money = 1000;  // Initial amount of money
let factories = 0;  // Initial number of factories
let goods = 0;  // Initial count of goods produced
const goodsToMoneyConversionRate = 2;  // Rate at which goods are converted to money

// Function to format numbers into compact notation
function formatNumber(num) {
    return new Intl.NumberFormat('en-US', {
        notation: "compact",
        compactDisplay: "short"
    }).format(num);
}

// Function to update the UI elements with current game stats
function updateUI() {
    document.getElementById('money').textContent = `$${formatNumber(money)}`;
    document.getElementById('factories-count').textContent = factories;
    document.getElementById('goods-count').textContent = formatNumber(goods);
    document.getElementById('buy-factory').disabled = money < 500;  // Disable buying factory if not enough money
}

// Load game data from local storage
function loadGame() {
    const savedData = localStorage.getItem('tycoonGameData');
    if (savedData) {
        const gameData = JSON.parse(savedData);
        money = gameData.money;
        factories = gameData.factories;
        goods = gameData.goods;
    }
    updateUI();  // Update UI with loaded data
}

// Save game data to local storage
function saveGame() {
    const gameData = {
        money: money,
        factories: factories,
        goods: goods
    };
    localStorage.setItem('tycoonGameData', JSON.stringify(gameData));
}

// Event listener for buying factories
document.getElementById('buy-factory').addEventListener('click', function() {
    if (money >= 500) {
        money -= 500;  // Reduce money by cost of one factory
        factories++;  // Increase factory count
        updateUI();  // Update UI to reflect changes
        saveGame();  // Save game state
    }
});

// Function to produce goods and convert goods to money
function produceAndSellGoods() {
    if (factories > 0) {
        goods += factories * 1;  // Produce goods, each factory produces 5 goods
        if (goods > 0) {
            let sellAmount = Math.min(goods, factories * 1);  // Can sell goods equal to what one cycle produces
            money += sellAmount * goodsToMoneyConversionRate;  // Convert goods to money
            goods -= sellAmount;  // Decrease goods by amount sold
        }
        updateUI();  // Update UI to reflect changes
        saveGame();  // Save game state
    }
}

// Setup for passive goods production and sales using performance.now()
let lastUpdateTime = performance.now();
const updateInterval = 1000 / 60; // Compute the update interval for 60Hz

function passiveProductionAndSales() {
    const now = performance.now();
    const deltaTime = now - lastUpdateTime;

    if (deltaTime >= updateInterval) {  // Ensure updates occur at 60Hz
        produceAndSellGoods();  // Produce and sell goods passively
        lastUpdateTime = now - (deltaTime % updateInterval);  // Adjust lastUpdateTime to account for any extra time beyond the desired interval
    }
    requestAnimationFrame(passiveProductionAndSales);  // Request next frame
}

// Initial calls to load game data and start production
loadGame();  // Load game state from local storage on start
requestAnimationFrame(passiveProductionAndSales);  // Start the passive production and sales process

