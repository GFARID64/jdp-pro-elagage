# Site artisan local (template Digiluce)

Générateur statique : tout le contenu est dans `site.json`, le design dans `style.css`, la logique dans `build.js`.

## Déployer sur Cloudflare Pages
1. Pousser ce dossier sur GitHub.
2. Cloudflare > Workers & Pages > Create > Pages > Connect to Git.
3. Build command : `npm run build`. Output directory : `dist`.

## Démo puis production
- Démo : `"demo": true` (noindex, robots.txt bloquant, pas de sitemap utile).
- Production : `"demo": false` et `"domain"` = vrai nom de domaine. Le canonical, le sitemap et l'indexation s'activent. Ajouter le domaine dans Cloudflare Pages > Custom domains.

## À compléter avant la mise en ligne
- `formAction` : créer un formulaire sur formspree.io (ou Web3Forms) et coller l'URL.
- `photos` : ajouter les images dans un dossier `public/img/` (copier vers `dist`) puis lister `{ "src": "/img/1.webp", "alt": "Description précise" }`.
- Vérifier les informations (adresse, horaires, services) avec le client, et déclarer la fiche Google comme `sameAs`.

## Nouveau prospect
Dupliquer le dépôt et modifier uniquement `site.json` : nom, coordonnées, SIRET, services (slug, nom, texte), villes avec un texte unique chacune, FAQ. Adapter la couleur dans `:root` de `style.css`.
