# 🖥️ Terminal Portfolio - Samuel Ampeau

Un portfolio interactif en style terminal avec une interface de ligne de commande moderne et élégante.

## 📋 Description

Ce projet est un portfolio personnel conçu comme un terminal Unix/Linux interactif. Il offre une expérience utilisateur unique où les visiteurs peuvent naviguer à travers mes compétences, projets et informations professionnelles en utilisant des commandes shell familières.

## ✨ Fonctionnalités

- **Interface Terminal Interactive** : Navigation via commandes shell
- **Thème Clair/Sombre** : Basculez entre les thèmes avec la commande `theme`
- **Écran de Chargement Animé** : Animation de démarrage de type terminal
- **Historique de Commandes** : Navigation avec les flèches haut/bas
- **Mini-jeu Snake** : Jeu intégré accessible via la commande `snake`
- **Design Responsive** : Compatible mobile et desktop
- **Autocomplétion** : Suggestions de commandes avec la touche Tab

## 🎮 Commandes Disponibles

| Commande | Description |
|----------|-------------|
| `help` | Affiche toutes les commandes disponibles |
| `about` | Informations personnelles et biographie |
| `skills` | Liste des compétences techniques |
| `projects` | Présentation des projets réalisés |
| `experience` | Parcours professionnel |
| `contact` | Coordonnées et réseaux sociaux |
| `clear` | Efface l'écran du terminal |
| `ls` | Liste les fichiers du répertoire |
| `pwd` | Affiche le chemin actuel |
| `whoami` | Affiche l'utilisateur actuel |
| `date` | Affiche la date et l'heure |
| `cat <file>` | Affiche le contenu d'un fichier |
| `neofetch` | Informations système stylisées |
| `tree` | Structure des fichiers en arbre |
| `history` | Historique des commandes |
| `theme` | Bascule entre thème clair/sombre |
| `snake` | Lance le jeu Snake |

## 🚀 Installation

1. Clonez le repository :
```bash
git clone https://github.com/NotSayk/portfolio.git
```

2. Naviguez dans le dossier :
```bash
cd portfolio
```

3. Ouvrez `index.html` dans votre navigateur préféré ou utilisez un serveur local :
```bash
# Avec Python 3
python -m http.server 8000

# Avec Node.js (http-server)
npx http-server
```

4. Accédez à `http://localhost:8000` dans votre navigateur.

## 🛠️ Technologies Utilisées

- **HTML5** : Structure de la page
- **CSS3** : Styles et animations
- **JavaScript (Vanilla)** : Logique interactive
- **Google Fonts** : Police JetBrains Mono

## 📁 Structure du Projet

```
portfolio/
│
├── index.html          # Page principale
├── style.css           # Styles du terminal
├── script.js           # Logique principale
├── snake.js            # Jeu Snake
├── icon.png            # Favicon
└── README.md           # Documentation
```

## 🎨 Personnalisation

Pour personnaliser le portfolio :

1. **Informations personnelles** : Modifiez les méthodes dans `script.js` (`showAbout()`, `showContact()`, etc.)
2. **Styles** : Ajustez les couleurs et animations dans `style.css`
3. **Commandes** : Ajoutez de nouvelles commandes dans l'objet `commands` de la classe `TerminalPortfolio`

## 📱 Compatibilité

- ✅ Chrome/Edge (dernières versions)
- ✅ Firefox (dernières versions)
- ✅ Safari (dernières versions)
- ✅ Mobile (iOS & Android)

---

**Développé avec ❤️ par Samuel Ampeau**
