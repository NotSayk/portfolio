// === Terminal Portfolio — script principal ===
class TerminalPortfolio {
    constructor() {
        this.commands = {
            help: this.showHelp.bind(this),
            about: this.showAbout.bind(this),
            skills: this.showSkills.bind(this),
            projects: this.showProjects.bind(this),
            experience: this.showExperience.bind(this),
            contact: this.showContact.bind(this),
            clear: this.clearTerminal.bind(this),
            ls: this.listFiles.bind(this),
            pwd: this.showCurrentPath.bind(this),
            whoami: this.showUser.bind(this),
            date: this.showDate.bind(this),
            cat: this.catFile.bind(this),
            neofetch: this.showSystemInfo.bind(this),
            tree: this.showTree.bind(this),
            history: this.showHistory.bind(this),
            theme: this.toggleTheme.bind(this)
        };
        
        this.commandHistory = [];
        this.historyIndex = -1;
        this.currentPath = '~';
        this.isTyping = false;
        this.autoScroll = true;
        this.userScrolledUp = false;
        
        this.init();
    }
    
    // — Initialisation & écran de chargement —
    init() {
        this.startLoadingScreen();
    }
    
    startLoadingScreen() {
        const progressFill = document.getElementById('progress-fill');
        const progressPercentage = document.getElementById('progress-percentage');
        const loadingScreen = document.getElementById('loading-screen');
        const terminalContainer = document.getElementById('terminal-container');
        
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
                
                setTimeout(() => {
                    this.finishLoading(loadingScreen, terminalContainer);
                }, 300);
            }
            
            progressFill.style.width = progress + '%';
            progressPercentage.textContent = Math.floor(progress) + '%';
        }, 100);
    }
    
    finishLoading(loadingScreen, terminalContainer) {
        loadingScreen.classList.add('hidden');
        
        terminalContainer.classList.add('loaded');
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            this.initTerminal();
        }, 500);
    }
    
    // — Initialisation du terminal & événements —
    initTerminal() {
        this.terminalInput = document.getElementById('terminal-input');
        this.terminalOutput = document.getElementById('terminal-output');
        this.terminalBody = document.querySelector('.terminal-body');
        
        this.applySavedTheme();
        this.setupEventListeners();
        this.setCurrentDate();
        this.focusInput();
    }
    
    setupEventListeners() {
        this.terminalInput.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        document.addEventListener('click', (e) => {
            if (!this.isTyping && !window.getSelection().toString()) {
                const inputLine = document.querySelector('.terminal-input-line');
                if (inputLine && inputLine.contains(e.target)) {
                    this.focusInput();
                }
            }
        });
        
        this.terminalInput.addEventListener('blur', (e) => {
            setTimeout(() => {
                if (!window.getSelection().toString() && !this.isTyping) {
                    this.focusInput();
                }
            }, 200);
        });
        
        this.terminalBody.addEventListener('scroll', this.handleScroll.bind(this));
        
        this.terminalBody.addEventListener('wheel', this.handleWheel.bind(this));
        
        this.terminalOutput.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        });
        
        this.terminalOutput.addEventListener('selectstart', (e) => {
            e.stopPropagation();
        });
    }
    
    // — Gestion du clavier & navigation —
    handleKeyDown(e) {
        if (this.isTyping) return;
        
        switch(e.key) {
            case 'Enter':
                e.preventDefault();
                this.autoScroll = true;
                this.userScrolledUp = false;
                this.processCommand();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.navigateHistory(-1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.navigateHistory(1);
                break;
            case 'Tab':
                e.preventDefault();
                this.autoComplete();
                break;
        }
    }
    
    handleScroll() {
        const isAtBottom = this.terminalBody.scrollTop + this.terminalBody.clientHeight >= this.terminalBody.scrollHeight - 5;
        
        if (isAtBottom) {
            this.autoScroll = true;
            this.userScrolledUp = false;
        } else {
            this.userScrolledUp = true;
        }
    }
    
    handleWheel(e) {
        if (e.deltaY < 0) {
            this.autoScroll = false;
            this.userScrolledUp = true;
        }
    }
    
    // — Exécution & historique des commandes —
    processCommand() {
        const input = this.terminalInput.value.trim();
        if (!input) return;
        
        this.commandHistory.push(input);
        this.historyIndex = this.commandHistory.length;
        
        this.addLine(`<span class="user">user</span><span class="at">@</span><span class="host">portfolio</span><span class="colon">:</span><span class="path">${this.currentPath}</span><span class="dollar">$</span> ${input}`);
        
        this.executeCommand(input);
        
        this.terminalInput.value = '';
    }
    
    executeCommand(input) {
        const [command, ...args] = input.toLowerCase().split(' ');
        
        if (this.commands[command]) {
            this.commands[command](args);
        } else if (command) {
            this.addLine(`bash: ${command}: command not found`, 'text-error');
            this.addLine(`Type <span class="text-warning">'help'</span> to see available commands.`, 'system-info');
        }
        
        this.scrollToBottom();
    }
    
    // — Commandes: aide & contenu —
    showHelp() {
        this.addLine('');
        this.addLine('[?] <span class="text-info">Available commands:</span>');
        this.addLine('');
        this.addLine('<span class="text-warning">help</span>       Display this help menu');
        this.addLine('<span class="text-warning">about</span>      About me');
        this.addLine('<span class="text-warning">skills</span>     Technical skills');
        this.addLine('<span class="text-warning">projects</span>   My projects');
        this.addLine('<span class="text-warning">experience</span> Professional experience');
        this.addLine('<span class="text-warning">contact</span>    Contact information');
        this.addLine('<span class="text-warning">clear</span>      Clear terminal');
        this.addLine('<span class="text-warning">ls</span>         List files');
        this.addLine('<span class="text-warning">pwd</span>        Print working directory');
        this.addLine('<span class="text-warning">whoami</span>     Display current user');
        this.addLine('<span class="text-warning">date</span>       Display date and time');
        this.addLine('<span class="text-warning">cat</span>        Read file (ex: cat README.md)');
        this.addLine('<span class="text-warning">neofetch</span>   System information');
        this.addLine('<span class="text-warning">tree</span>       Portfolio tree structure');
        this.addLine('<span class="text-warning">history</span>    Command history');
        this.addLine('<span class="text-warning">theme</span>      Toggle or set theme (theme, theme dark, theme light)');
        this.addLine('');
        this.addLine('<span class="text-success">[!] Tips:</span>');
        this.addLine('• Use UP/DOWN arrows to navigate history');
        this.addLine('• Press TAB for autocompletion');
        this.addLine('');
    }
    
    showAbout() {
        const aboutText = `
<div class="content-section">
    <h3>>>> USER PROFILE</h3>
    <br/>
    <p>[*] Name:     Samuel Ampeau</p>
    <p>[*] Role:     Web & Application Developer</p>
    <p>[*] Location: Le Havre, France</p>
    <p>[*] Study:    BUT Computer Science - IUT du Havre</p>
    <br/>
    <p>Motivated student developer specializing in web and application</p>
    <p>development. Experience in collaborative project management and</p>
    <p>active participation in open-source. Adaptable, organized with</p>
    <p>excellent teamwork skills.</p>
    <br/>
    <p><span class="text-success">[!] Currently seeking internship as web/app developer!</span></p>
</div>`;
        this.typeMessage(aboutText);
    }
    
    showSkills() {
        const skillsText = `
<div class="content-section">
    <h3>>>> TECHNICAL SKILLS</h3>
    <br/>
    <p>[+] Programming Languages:</p>
    <div class="skill-list">
        <div class="skill-item">Python</div>
        <div class="skill-item">Java</div>
        <div class="skill-item">JavaScript</div>
        <div class="skill-item">HTML/CSS</div>
        <div class="skill-item">SQL</div>
        <div class="skill-item">C</div>
        <div class="skill-item">PHP</div>
    </div>
    <br/>
    <p>[+] Tools & Technologies:</p>
    <div class="skill-list">
        <div class="skill-item">Git</div>
        <div class="skill-item">Docker</div>
        <div class="skill-item">VirtualBox</div>
        <div class="skill-item">Java Swing</div>
        <div class="skill-item">Canva</div>
        <div class="skill-item">Office Suite</div>
    </div>
    <br/>
    <p>[+] Operating Systems:</p>
    <div class="skill-list">
        <div class="skill-item">Windows</div>
        <div class="skill-item">Ubuntu</div>
        <div class="skill-item">Debian</div>
        <div class="skill-item">Linux</div>
    </div>
    <br/>
    <p>[+] Languages: French (Native) | English (Advanced) | Spanish (Intermediate)</p>
</div>`;
        this.typeMessage(skillsText);
    }
    
    showProjects() {
        const projectsText = `
<div class="content-section">
    <h3>>>> PROJECT PORTFOLIO</h3>
    
    <div class="project-item">
        <div class="project-title">[#] Web Streaming Platform</div>
        <p>Video-on-demand website with containerized architecture. Front-end development and deployment management in collaborative environment.</p>
        <div class="project-tech">Tech: JavaScript, Docker, HTML/CSS</div>
    </div>
    <br/>
    <div class="project-item">
        <div class="project-title">[#] MPM Graph Manager</div>
        <p>Desktop application for graph management and visualization with intuitive GUI. Complete design and implementation.</p>
        <div class="project-tech">Tech: Java, Swing, Algorithms</div>
    </div>
    <br/>
    <div class="project-item">
        <div class="project-title">[#] Personal Portfolio</div>
        <p>Personal showcase website with interactive terminal interface. Modern design and unique user experience.</p>
        <div class="project-tech">Tech: HTML, CSS, JavaScript</div>
    </div>
    <br/>
    <div class="project-item">
        <div class="project-title">[#] Open-Source Contributions</div>
        <p>Active participation in collaborative projects on GitHub, particularly TrueStrech. Code and documentation contributions.</p>
        <div class="project-tech">Tech: Git, Collaboration, Documentation</div>
    </div>
</div>`;
        this.typeMessage(projectsText);
    }
    
    showExperience() {
        const experienceText = `
<div class="content-section">
    <h3>>>> EXPERIENCE & EDUCATION</h3>
    <div class="project-item">
        <div class="project-title">[+] BUT Computer Science</div>
        <p><span class="text-info">IUT du Havre</span> | 2024 - 2027</p>
        <p>• Algorithms & Programming • Web and Application Development</p>
        <p>• Database Management (SQL) • Operating Systems and Networks • Low-level Programming (C)</p>
    </div>
    <div class="project-item">
        <div class="project-title">[+] Logistics Technician</div>
        <p><span class="text-info">Raffinerie du Midi Coignières</span> | Aug 2025</p>
        <p>• Logistics management and organization • Work in industrial environment • Rigor and procedure compliance</p>
    </div>
    <div class="project-item">
        <div class="project-title">[+] Animation and Leadership</div>
        <p><span class="text-info">Scouts de France</span> | 2019 - 2025</p>
        <p>• Event organization • Supervision and animation • Team management and leadership • Soft skills development</p>
    </div>
</div>`;
        this.typeMessage(experienceText);
    }
    
    showContact() {
        const contactText = `
        <div class="content-section">
        <h3>>>> CONTACT INFORMATION</h3>
        <p>[*] Email:    <span class="text-info"><a href="mailto:samuel@ampeau.fr">samuel@ampeau.fr</a></span></p>
        <p>[*] Location: <span class="text-info">Le Havre, France</span></p>
        <p>[*] GitHub:   <span class="text-info"><a href="https://github.com/NotSayk" target="_blank" rel="noopener noreferrer">https://github.com/NotSayk</a></span></p>
        <p>[*] LinkedIn: <span class="text-info"><a href="https://www.linkedin.com/in/samuel-ampeau-2b1a4a358/" target="_blank" rel="noopener noreferrer">https://www.linkedin.com/in/samuel-ampeau-2b1a4a358/</a></span></p>
        <p></p>
        <p class="text-success">[!] Feel free to contact me to discuss internship opportunities!</p>
        <p class="text-warning">[>] Actively seeking web/app developer internship</p>
        </div>`;
        this.typeMessage(contactText);
    }
    
    // — Commandes système —
    listFiles() {
        const files = `
<span class="text-info">total 7</span>
drwxr-xr-x  2 user user 4096 Oct 11 2025 <span class="text-info">about/</span>
drwxr-xr-x  2 user user 4096 Oct 11 2025 <span class="text-info">skills/</span>
drwxr-xr-x  2 user user 4096 Oct 11 2025 <span class="text-info">projects/</span>
drwxr-xr-x  2 user user 4096 Oct 11 2025 <span class="text-info">experience/</span>
-rw-r--r--  1 user user 1024 Oct 11 2025 <span class="text-success">README.md</span>
-rw-r--r--  1 user user  256 Oct 11 2025 <span class="text-success">contact.txt</span>
-rw-r--r--  1 user user  512 Oct 11 2025 <span class="text-warning">cv.pdf</span>`;
        this.addLine(files, 'ls-output');
    }
    
    showCurrentPath() {
        this.addLine(`/home/user/portfolio`);
    }
    
    showUser() {
        this.addLine(`user`);
    }
    
    showDate() {
        this.addLine(new Date().toString());
    }
    
    catFile(args) {
        if (!args[0]) {
            this.addLine('cat: missing file operand', 'text-error');
            return;
        }
        
        const file = args[0].toLowerCase();
        switch(file) {
            case 'readme.md':
                this.addLine(`# Portfolio Terminal

Bienvenue dans mon portfolio interactif !

## Navigation
- Tapez \`help\` pour voir toutes les commandes
- Utilisez les flèches haut/bas pour naviguer dans l'historique
- Tab pour l'autocomplétion

## Sections disponibles
- about: Découvrez mon profil
- skills: Mes compétences techniques  
- projects: Mes réalisations
- experience: Mon parcours professionnel
- contact: Me contacter

Bonne exploration ! 🚀`);
                break;
            case 'contact.txt':
                this.addLine(`Email: votre.email@example.com
LinkedIn: linkedin.com/in/votre-profil
GitHub: github.com/votre-username
Téléphone: +33 6 12 34 56 78`);
                break;
            default:
                this.addLine(`cat: ${args[0]}: No such file or directory`, 'text-error');
        }
    }
    
    showSystemInfo() {
        const neofetchText = `
<span class="text-info">                    user@portfolio</span>
<span class="text-info">                    ---------------</span>
<span class="text-success">OS:</span> Portfolio Linux 1.0
<span class="text-success">Host:</span> GitHub Pages
<span class="text-success">Kernel:</span> JavaScript ES2022
<span class="text-success">Uptime:</span> ${Math.floor(performance.now() / 1000)} seconds
<span class="text-success">Packages:</span> npm, yarn, git
<span class="text-success">Shell:</span> portfolio-terminal
<span class="text-success">Resolution:</span> ${window.screen.width}x${window.screen.height}
<span class="text-success">Terminal:</span> Portfolio Terminal v1.0
<span class="text-success">CPU:</span> JavaScript V8 Engine
<span class="text-success">Memory:</span> ${navigator.deviceMemory || 'Unknown'} GB`;
        this.addLine(neofetchText);
    }
    
    showTree() {
        const treeText = `
<span class="text-info">portfolio/</span>
├── <span class="text-info">about/</span>
│   ├── <span class="text-success">profile.md</span>
├── <span class="text-info">skills/</span>
│   ├── <span class="text-success">programming-languages.json</span>
│   ├── <span class="text-success">tools-technologies.json</span>
│   └── <span class="text-success">operating-systems.json</span>
├── <span class="text-info">projects/</span>
│   ├── <span class="text-warning">web-streaming-platform/</span>
│   │   ├── <span class="text-success">frontend/</span>
│   │   ├── <span class="text-success">docker-compose.yml</span>
│   ├── <span class="text-warning">mpm-graph-manager/</span>
│   │   ├── <span class="text-success">src/</span>
│   ├── <span class="text-warning">personal-portfolio/</span>
│   │   ├── <span class="text-success">index.html</span>
│   │   ├── <span class="text-success">script.js</span>
│   │   └── <span class="text-success">style.css</span>
│   └── <span class="text-warning">open-source-contributions/</span>
│       ├── <span class="text-success">truestrech/</span>
│       └── <span class="text-success">documentation/</span>
├── <span class="text-info">experience/</span>
│   └── <span class="text-success">timeline.md</span>
├── <span class="text-success">README.md</span>
├── <span class="text-success">contact.txt</span>
└── <span class="text-warning">cv.pdf</span>`;
        this.addLine(treeText, 'tree-output');
    }
    
    showHistory() {
        this.commandHistory.forEach((cmd, index) => {
            this.addLine(`${index + 1}  ${cmd}`);
        });
    }
    
    clearTerminal() {
        this.terminalOutput.innerHTML = '';
        this.addLine('[SYSTEM] Terminal cleared.', 'text-success');
        this.autoScroll = true;
        this.userScrolledUp = false;
    }
    
    // — Utilitaires d'affichage —
    addLine(content, className = '') {
        const line = document.createElement('div');
        line.className = `line ${className} line-appear`;
        line.innerHTML = content;
        this.terminalOutput.appendChild(line);
        
        if (this.autoScroll && !this.userScrolledUp) {
            setTimeout(() => this.scrollToBottom(), 50);
        }
    }
    
    typeMessage(message, className = '') {
        this.isTyping = true;
        
        const line = document.createElement('div');
        line.className = `line ${className}`;
        line.innerHTML = message;
        this.terminalOutput.appendChild(line);
        
        setTimeout(() => {
            this.isTyping = false;
            this.focusInput();
            
            if (this.autoScroll && !this.userScrolledUp) {
                this.scrollToBottom();
            }
        }, 100);
    }
    
    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;
        
        this.historyIndex += direction;
        
        if (this.historyIndex < 0) {
            this.historyIndex = 0;
        } else if (this.historyIndex >= this.commandHistory.length) {
            this.historyIndex = this.commandHistory.length;
            this.terminalInput.value = '';
            return;
        }
        
        this.terminalInput.value = this.commandHistory[this.historyIndex] || '';
    }
    
    autoComplete() {
        const input = this.terminalInput.value.toLowerCase();
        const matches = Object.keys(this.commands).filter(cmd => cmd.startsWith(input));
        
        if (matches.length === 1) {
            this.terminalInput.value = matches[0];
        } else if (matches.length > 1) {
            this.addLine(`Suggestions: ${matches.join(', ')}`, 'text-info');
        }
    }
    
    focusInput() {
        if (!window.getSelection().toString()) {
            this.terminalInput.focus();
        }
    }
    
    scrollToBottom() {
        if (this.terminalBody && this.autoScroll && !this.userScrolledUp) {
            this.terminalBody.scrollTop = this.terminalBody.scrollHeight;
        }
    }
    
    setCurrentDate() {
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            dateElement.textContent = new Date().toLocaleString('fr-FR');
        }
    }
    
    // — Thèmes (clair/sombre) —
    applySavedTheme() {
        try {
            const saved = localStorage.getItem('portfolio-theme');
            const theme = saved === 'light' || saved === 'dark' ? saved : 'dark';
            document.documentElement.setAttribute('data-theme', theme);
        } catch (_) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }

    setTheme(theme) {
        const normalized = theme === 'light' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', normalized);
        try { localStorage.setItem('portfolio-theme', normalized); } catch (_) {}
        this.addLine(`[SYSTEM] Theme set to ${normalized}.`, 'text-info');
    }

    toggleTheme(args = []) {
        if (args.length && (args[0] === 'light' || args[0] === 'dark')) {
            this.setTheme(args[0]);
            return;
        }
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        this.setTheme(next);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TerminalPortfolio();
    startTitleTypingAnimation();
});

document.addEventListener('contextmenu', event => event.preventDefault());

// === Animation de saisie du titre du document ===
function startTitleTypingAnimation() {
    const texts = ["$ Terminal Portfolio", "Samuel Ampeau"];
    const placeholder = "$";
    const typeDelay = 300;
    const eraseDelay = 150;
    const holdAfterType = 350;
    const holdAfterErase = 270;
    let textIndex = 0;
    let charIndex = 0;
    let isErasing = false;

    document.title = placeholder;

    function tick() {
        const full = texts[textIndex];
        if (!isErasing) {
            charIndex = Math.min(charIndex + 1, full.length);
            document.title = full.slice(0, charIndex);
            if (charIndex === full.length) {
                setTimeout(() => { isErasing = true; tick(); }, holdAfterType);
            } else {
                setTimeout(tick, typeDelay);
            }
        } else {
            charIndex = Math.max(charIndex - 1, 0);
            document.title = charIndex > 0 ? full.slice(0, charIndex) : placeholder;
            if (charIndex === 0) {
                textIndex = (textIndex + 1) % texts.length;
                isErasing = false;
                setTimeout(tick, holdAfterErase);
            } else {
                setTimeout(tick, eraseDelay);
            }
        }
    }

    tick();
}
