# Kulturwerk der deutschen Schriftsteller\*innen e.V. — Website

Mehrseitige, statische Website im „Editorial-Elegant"-Stil (reines HTML/CSS/JS,
kein Build-Tool). Bildorientierter Hero mit animierter Architektur-Illustration
(Aquarell-Sketch), literarische Typografie und dezente Scroll-Animationen.

## Seiten
- `index.html` — Startseite (Hero, Auftrag, Stats, Zitat, Förderfelder, Marquee, CTA)
- `verein.html` — Der Verein: Auftrag, Geschichte-Timeline, Leitung & Vorstand
- `foerderung.html` — Was das Kulturwerk fördert
- `kontakt.html` — Kontaktformular (Formspree)

## Technik
- Lucide Icons via CDN (keine Emojis)
- Google Fonts: Cormorant Garamond, EB Garamond, Jost
- Geteilt: `styles.css`, `main.js`
- GitHub-Pages-tauglich (relative Pfade, `.nojekyll`)

## Lokal starten
```bash
python3 -m http.server 8080
```

## Hinweis
Gestalterisches Konzept auf Basis öffentlich zugänglicher Informationen zum
Kulturwerk und zum Verband deutscher Schriftsteller\*innen (VS in ver.di).
Namen aktueller Vorstandsmitglieder und konkrete Kontaktdaten sind vor einer
Veröffentlichung mit dem Verein abzustimmen. Nicht der offizielle Internetauftritt.
