# Kulturwerk — Berliner Schriftstellerinnen und Schriftsteller e.V.

Mehrseitige, statische Website (HTML/CSS/JS, kein Build-Tool). Mutig & edel:
Pinsel-/Spritzer-Identität, vier Markenfarben als System, literarische Typografie
(Cormorant Garamond + DM Sans), volle Breite, ruhige Bewegung.

## Seiten
- `index.html` — Start, mit Hero-Intro (Logo → Foto blüht durch Kreis auf → Farbspritzer)
- `ueber-uns.html` — Über uns (Auftrag, Arbeit, Vorstand)
- `foerdermitglieder.html` — Fördermitglieder (Vorteile, Stufen)
- `foerderprojekte.html` — Förderprojekte (Stapelkarten)
- `veranstaltungen.html` — Veranstaltungen (Formate, Termine)
- `kontakt.html` — Kontakt (Formspree)

## Technik
- GSAP (CDN) für die Hero-Intro, IntersectionObserver für Reveals, Lucide Icons
- Geteilt: `styles.css`, `main.js`; Assets in `assets/`
- GitHub-Pages-tauglich (relative Pfade, `.nojekyll`)
- `prefers-reduced-motion` wird respektiert; ohne JS bleibt der Endzustand sichtbar

## Lokal
```bash
python3 -m http.server 8080
```

## Hinweis
Gestalterisches Konzept. Texte, Kennzahlen, Termine und Kontaktdaten sind
beispielhaft und vor einer Veröffentlichung mit dem Verein abzustimmen.
Logos © Verein. Fotos: Unsplash. Nicht der offizielle Internetauftritt.
