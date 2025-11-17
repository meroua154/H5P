Cette application Next.js permet d'héberger et de diffuser des modules H5P (HTML5 Package) sans dépendance à des plateformes externes. Upload, extraction automatique et visualisation .


# Installer les dépendances
npm install

# Installer les packages H5P
npm install h5p-standalone adm-zip lucide-react

# Démarrer le serveur
npm run dev

📁 Structure du projet

.
├── app/
│   ├── h5p/
│   │   └── page.tsx                    # Interface principale
│   └── api/h5p/
│       ├── upload/route.ts             # Upload .h5p
│       ├── list/route.ts               # Liste modules
│       ├── delete/route.ts             # Suppression
│       └── extract/[id]/route.ts       # Extraction + viewer
├── components/
│   └── H5PViewer.tsx                   # Viewer iframe
├── public/h5p-modules/                 # Stockage modules
│   └── module-{timestamp}/
│       ├── content.h5p                 # Fichier original
│       ├── metadata.json               # Métadonnées
│       ├── viewer.html                 # Viewer généré
│       └── content/                    # Contenu extrait
└── viewer.html                         # Template viewer


🎯 Architecture des modules

public/h5p-modules/module-1234567890/
├── content.h5p          # ← Fichier .h5p original (téléchargeable)
├── metadata.json        # ← Titre, date d'upload, moduleId
├── viewer.html          # ← Viewer HTML généré automatiquement
└── content/             # ← Contenu extrait du .h5p
    ├── h5p.json         # Configuration H5P
    ├── content/
    │   └── content.json # Données du contenu
    └── ...              # Bibliothèques et assets

