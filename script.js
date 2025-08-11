 class RhythmTyper {
    constructor() {
    this.score = 0;
    this.level = 1;
    this.lives = 3;
    this.fallingWords = [];
    this.gameRunning = false;
    this.currentWord = null;
    this.combo = 0;
    this.fallSpeed = 50;
                
this.wordLists = {
    nerdy: [
        'console.log', 'function', 'variable', 'algorithm', 'binary',
        'recursion', 'polymorphism', 'encapsulation', 'inheritance',
        'debugging', 'boolean', 'integer', 'string', 'array',
        'object', 'class', 'method', 'parameter', 'return',
        'if statement', 'for loop', 'while loop', 'try catch',
        'git commit', 'pull request', 'merge conflict', 'stackoverflow'],
    pickup: [
        'hello world', 'you compile my heart', 'null pointer exception',
        'syntax error', 'runtime error', 'infinite loop of love',
        'your beauty breaks my code', '404 heart not found',
        'access granted', 'connection established', 'data overflow',
        'system overload', 'fatal attraction', 'memory leak'],
    code: [
        'const x = 42', 'if (true)', 'return false', '{ key: value }',
        '[1,2,3,4]', 'npm install', 'git push', 'sudo rm -rf',
        'SELECT * FROM', 'DROP TABLE', 'CREATE DATABASE',
        'public class', 'private int', 'void main', 'import java',
        'def __init__', 'print("hello")', 'let result =', 'async await'],
    random: [
        'keyboard warrior', 'caffeine required', 'stackoverflow saved me',
        'merge conflicts', 'production bug', 'works on my machine',
        'legacy code', 'technical debt', 'code review',
        'pair programming', 'rubber duck', 'hello world',
        'banana for scale', 'lorem ipsum', 'placeholder text']
};
                
this.allWords = [
...this.wordLists.nerdy,
...this.wordLists.pickup,
...this.wordLists.code,
...this.wordLists.random
]; 
this.init();
}
            
init() {
    this.typeInput = document.getElementById('typeInput');
    this.inputDisplay = document.getElementById('inputDisplay');
    this.gameArea = document.getElementById('gameArea');
                
    this.typeInput.addEventListener('input', (e) => this.handleInput(e));
    this.typeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
    this.submitWord();
}
});
                
// Click to select words
this.gameArea.addEventListener('click', (e) => {
    if (e.target.classList.contains('falling-word')) {
    this.selectWord(e.target);
}
});
}
            
startGame() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('header').style.display = 'flex';
    document.getElementById('inputArea').style.display = 'block';
                
this.gameRunning = true;
this.score = 0;
this.level = 1;
this.lives = 3;
this.combo = 0;
this.fallSpeed = 50;
this.fallingWords = [];
                
this.updateDisplay();
this.typeInput.focus();
this.gameLoop();
this.spawnWords();
}
            
gameLoop() {
if (!this.gameRunning) return;
                
this.updateFallingWords();
this.checkCollisions();
                
requestAnimationFrame(() => this.gameLoop());
}
            
spawnWords() {
    if (!this.gameRunning) return;
                
    const word = this.getRandomWord();
    const wordElement = document.createElement('div');
    wordElement.className = 'falling-word';
    wordElement.textContent = word;
    wordElement.style.left = Math.random() * (window.innerWidth - 200) + 'px';
    wordElement.style.top = '0px';
                
    this.gameArea.appendChild(wordElement);
    this.fallingWords.push({
    element: wordElement,
    word: word,
    y: 0,
    speed: this.fallSpeed + Math.random() * 20
});
                
// Schedule next word spawn
    const spawnDelay = Math.max(800 - (this.level * 50), 300);
    setTimeout(() => this.spawnWords(), spawnDelay);
}
            
updateFallingWords() {
    this.fallingWords.forEach((wordObj, index) => {
    wordObj.y += wordObj.speed / 60; // 60 FPS
    wordObj.element.style.top = wordObj.y + 'px';
                    
// Remove if out of bounds
if (wordObj.y > window.innerHeight - 150) {
this.loseLife();
this.removeWord(index);
    }
  });
}
        
removeWord(index) {
if (this.fallingWords[index]) {
this.fallingWords[index].element.remove();
this.fallingWords.splice(index, 1);
    }
}
            
selectWord(element) {
// Clear previous selection
document.querySelectorAll('.falling-word').forEach(w => {
w.classList.remove('typing');
});
                
element.classList.add('typing');
this.currentWord = element;
this.typeInput.value = '';
this.inputDisplay.textContent = element.textContent;
this.typeInput.focus();
}
            
handleInput(e) {
if (!this.currentWord) return;
                
const typed = e.target.value.toLowerCase();
const target = this.currentWord.textContent.toLowerCase();
                
if (target.startsWith(typed)) {
this.currentWord.style.background = 'rgba(40,167,69,0.3)';
} else {
    this.currentWord.style.background = 'rgba(220,53,69,0.3)';
    }
}
            
            submitWord() {
                if (!this.currentWord) return;
                
                const typed = this.typeInput.value.toLowerCase();
                const target = this.currentWord.textContent.toLowerCase();
                
                if (typed === target) {
                    this.correctWord();
                } else {
                    this.incorrectWord();
                }
            }
            
            correctWord() {
                const wordIndex = this.fallingWords.findIndex(w => w.element === this.currentWord);
                
                if (wordIndex !== -1) {
                    this.score += (this.currentWord.textContent.length * 10) + (this.combo * 5);
                    this.combo++;
                    
                    // Create particles
                    this.createParticles(this.currentWord);
                    
                    // Show combo if > 3
                    if (this.combo > 3) {
                        this.showCombo();
                    }
                    
                    this.removeWord(wordIndex);
                    this.currentWord = null;
                    this.typeInput.value = '';
                    this.inputDisplay.textContent = 'Great! Keep going...';
                    
                    this.updateDisplay();
                    this.checkLevelUp();
                }
            }
            
            incorrectWord() {
                this.combo = 0;
                this.currentWord.classList.remove('typing');
                this.currentWord = null;
                this.typeInput.value = '';
                this.inputDisplay.textContent = 'Try again...';
            }
            
            createParticles(element) {
                const rect = element.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                for (let i = 0; i < 5; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    particle.style.left = centerX + (Math.random() - 0.5) * 40 + 'px';
                    particle.style.top = centerY + (Math.random() - 0.5) * 40 + 'px';
                    particle.style.width = Math.random() * 8 + 4 + 'px';
                    particle.style.height = particle.style.width;
                    
                    document.body.appendChild(particle);
                    setTimeout(() => particle.remove(), 1000);
                }
            }
            
            showCombo() {
                const comboElement = document.createElement('div');
                comboElement.className = 'combo';
                comboElement.textContent = `${this.combo}x COMBO!`;
                document.body.appendChild(comboElement);
                setTimeout(() => comboElement.remove(), 800);
            }
            
            loseLife() {
                this.lives--;
                this.combo = 0;
                this.updateDisplay();
                
                if (this.lives <= 0) {
                    this.gameOver();
                }
            }
            
            checkLevelUp() {
                if (this.score > this.level * 500) {
                    this.level++;
                    this.fallSpeed += 10;
                    this.updateDisplay();
                    
                    // Show level up message
                    const levelUp = document.createElement('div');
                    levelUp.className = 'combo';
                    levelUp.textContent = `LEVEL ${this.level}!`;
                    levelUp.style.color = '#ff6b6b';
                    document.body.appendChild(levelUp);
                    setTimeout(() => levelUp.remove(), 800);
                }
            }
            
            updateDisplay() {
                document.getElementById('score').textContent = this.score;
                document.getElementById('level').textContent = this.level;
                
                const livesContainer = document.getElementById('lives');
                livesContainer.innerHTML = '';
                for (let i = 0; i < this.lives; i++) {
                    const heart = document.createElement('span');
                    heart.className = 'heart';
                    heart.textContent = '❤️';
                    livesContainer.appendChild(heart);
                }
            }
            
            getRandomWord() {
                return this.allWords[Math.floor(Math.random() * this.allWords.length)];
            }
            
            checkCollisions() {
                // This is handled in updateFallingWords
            }
            
            gameOver() {
                this.gameRunning = false;
                this.fallingWords.forEach(wordObj => wordObj.element.remove());
                this.fallingWords = [];
                
                const menu = document.getElementById('menu');
                menu.style.display = 'block';
                menu.innerHTML = `
                    <h1>🎮 Game Over!</h1>
                    <p style="font-size: 1.5em; margin: 20px 0;">Final Score: ${this.score}</p>
                    <p style="margin-bottom: 20px;">Level Reached: ${this.level}</p>
                    <button onclick="game.startGame()">Play Again</button>
                    <button onclick="location.reload()">Main Menu</button>
                `;
                
                document.getElementById('header').style.display = 'none';
                document.getElementById('inputArea').style.display = 'none';
            }
        }
        
        function showInstructions() {
            const menu = document.getElementById('menu');
            menu.innerHTML = `
                <h1>📖 Instructions</h1>
                <div style="text-align: left; margin: 20px 0;">
                    <p>• Click on falling words to select them</p>
                    <p>• Type the word exactly as shown</p>
                    <p>• Press Enter to submit</p>
                    <p>• Don't let words hit the bottom!</p>
                    <p>• Build combos for bonus points</p>
                    <p>• Speed increases each level</p>
                </div>
                <button onclick="location.reload()">Back to Menu</button>
            `;
        }
        
        // Initialize game
        const game = new RhythmTyper();
        
        let currentTheme = 'yellow';
        let isDarkMode = false;
        
        function toggleDarkMode() {
            isDarkMode = !isDarkMode;
            document.body.classList.toggle('dark-mode', isDarkMode);
            const icon = document.getElementById('modeIcon');
            const text = document.getElementById('modeText');
            
            if (isDarkMode) {
                icon.textContent = '☀️';
                
            } else {
                icon.textContent = '🌙';
                
            }
        }
        
        function toggleDropdown() {
            const dropdown = document.getElementById('themeDropdown');
            const arrow = document.getElementById('dropdownArrow');
            dropdown.classList.toggle('show');
            arrow.textContent = dropdown.classList.contains('show') ? '▲' : '▼';
        }
        
        function setTheme(theme) {
            currentTheme = theme;
            
            // Remove existing theme classes
            document.body.classList.remove('theme-coral', 'theme-green', 'theme-blue');
            
            // Apply theme class (yellow is default, no class needed)
            if (theme !== 'yellow') {
                document.body.classList.add(`theme-${theme}`);
            }
            
            toggleDropdown();
        }
        
        function showCreator() {
            alert('Created by: Me\n\nRhymekey - A fun typing game to improve your skills while enjoying nerdy content!\n\nFeatures vibrant themes and smooth gameplay!');
        }
        
        // Close dropdown when clicking outside
        window.onclick = function(event) {
            if (!event.target.matches('.dropdown-btn') && !event.target.matches('.dropdown-btn *')) {
                const dropdown = document.getElementById('themeDropdown');
                if (dropdown.classList.contains('show')) {
                    toggleDropdown();
                }
            }
        }
        
        function startGame() {
            game.startGame();
        }
        
        function showInstructions() {
            const menu = document.getElementById('menu');
            menu.innerHTML = `
                <h1>📖 Instructions</h1>
                <div style="text-align: left; margin: 20px 0;">
                    <p>• Click on falling words to select them</p>
                    <p>• Type the word exactly as shown</p>
                    <p>• Press Enter to submit</p>
                    <p>• Don't let words hit the bottom!</p>
                    <p>• Build combos for bonus points</p>
                    <p>• Speed increases each level</p>
                    <p>• Use themes and dark mode for customization</p>
                </div>
                <button onclick="location.reload()">Back to Menu</button>
            `;
        }