# Moje Cyfrowe Prawa — nowa strona WWW

Statyczna strona (HTML/CSS/JS, bez frameworków i bez builda) gotowa do publikacji na GitHub Pages.

## Struktura plików

```
index.html                  – strona główna (wszystkie sekcje)
polityka-prywatnosci.html   – wersja robocza polityki prywatności (do weryfikacji prawnej)
regulamin.html              – wersja robocza regulaminu (do weryfikacji prawnej)
404.html                    – strona błędu 404
robots.txt, sitemap.xml     – podstawowe SEO techniczne
assets/css/style.css        – design system i style
assets/js/main.js           – nawigacja mobilna, zakładki, animacje, formularz
assets/img/favicon.svg      – ikona strony
```

## 1. Wgranie kodu do repozytorium (git)

Pliki zostały zapisane bezpośrednio w folderze repozytorium na Twoim komputerze
(`C:\Script\GitHub_RSM\www-pixel`). Ponieważ w tej sesji nie udało się uruchomić
powłoki na Twoim komputerze (znany, tymczasowy problem po aktualizacji Windows
z 8 września), commit i push trzeba wykonać ręcznie — w terminalu, w GitHub
Desktop albo w innym kliencie Git:

```bash
cd C:\Script\GitHub_RSM\www-pixel
git add .
git commit -m "Nowa strona WWW: bezpieczenstwo, prawa cyfrowe, RODO, kontakt"
git push -u origin main
```

Repozytorium nie miało jeszcze żadnego commita, więc to będzie pierwsza wersja
na GitHubie.

## 2. Uruchomienie formularza kontaktowego (Formspree)

Formularz „Umów rozmowę telefoniczną” wysyła zgłoszenia przez zewnętrzną
usługę [Formspree](https://formspree.io) — statyczna strona (GitHub Pages)
nie może sama wysyłać e-maili.

1. Załóż darmowe konto na [formspree.io](https://formspree.io), używając
   adresu **sklep@apb-expert.pl**.
2. Utwórz nowy formularz (New Form) — Formspree wygeneruje adres w formacie
   `https://formspree.io/f/XXXXXXXX`.
3. W pliku `index.html` znajdź linię:

   ```html
   <form id="booking-form" data-endpoint="https://formspree.io/f/TWOJ_ID_FORMULARZA" ...>
   ```

   i podmień `TWOJ_ID_FORMULARZA` na swój prawdziwy identyfikator z Formspree.
4. Formspree przy pierwszym prawdziwym zgłoszeniu z formularza wyśle e-mail
   z prośbą o potwierdzenie adresu — potwierdź go, żeby zgłoszenia zaczęły
   przychodzić.
5. Darmowy plan Formspree pozwala na ograniczoną liczbę zgłoszeń miesięcznie —
   jeśli ruch na stronie wzrośnie, warto rozważyć plan płatny.

Formularz ma wbudowane proste pole-pułapkę na boty (`_gotcha`) — nie trzeba
nic w nim zmieniać.

## 3. Publikacja na GitHub Pages

1. W repozytorium na GitHubie wejdź w **Settings → Pages**.
2. W sekcji „Build and deployment” wybierz źródło: **Deploy from a branch**,
   branch `main`, folder `/ (root)`.
3. Po chwili strona będzie dostępna pod adresem
   `https://<twoja-nazwa-uzytkownika>.github.io/www-pixel/`.

### Podpięcie własnej domeny (mojecyfroweprawa.pl)

Jeśli chcesz, by strona działała pod dotychczasową domeną:

1. Utwórz w repozytorium plik `CNAME` (bez rozszerzenia) z jedną linią:
   `mojecyfroweprawa.pl`
2. U dostawcy domeny ustaw rekord `A` wskazujący na adresy IP GitHub Pages
   (aktualną listę adresów podaje [dokumentacja GitHub Pages](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site))
   albo rekord `CNAME` na `<twoja-nazwa-uzytkownika>.github.io`, jeśli
   konfigurujesz subdomenę.
3. W ustawieniach GitHub Pages włącz „Enforce HTTPS”.

## 4. Co jeszcze warto uzupełnić

Poniższe elementy zostały świadomie oznaczone jako wersja robocza / placeholder,
żeby nic nie zostało zmyślone:

- **Polityka prywatności i regulamin** (`polityka-prywatnosci.html`,
  `regulamin.html`) — treść wymaga sprawdzenia przez prawnika lub IOD przed
  publikacją, zwłaszcza że formularz zbiera dane osobowe.
- **Linki do social media** w stopce — obecnie brak linków do Facebooka/
  Instagrama, dodaj je w `index.html` w sekcji `<footer>`.
- **Obrazek og:image** (do udostępniania linku w social media) — strona nie
  ma jeszcze grafiki 1200×630 px; można ją dodać i podpiąć w `<head>`.
- **Godziny umawiania rozmów** (pon.–pt., 9:00–17:00) to założenie przyjęte
  przy budowie strony — zmień je w sekcji Kontakt i w `assets/js/main.js`
  (lista godzin w `<select>`), jeśli pracujesz w innych godzinach.
- **Grafika Pixela** — obecna maskotka to nowa, odrębna ilustracja SVG
  inspirowana koncepcją Pixela (a nie kopia istniejącej grafiki). Jeśli wolisz
  wykorzystać oryginalną grafikę 3D, podmień SVG w `index.html` na plik
  graficzny (np. `assets/img/pixel.png` + prosta animacja CSS `@keyframes`
  na klasie `.pixel-figure`).

## 5. Edycja treści

Cała strona to jeden plik `index.html` podzielony na sekcje z komentarzami
(`<!-- NAZWA SEKCJI -->`). Kolory, odstępy i typografia są zdefiniowane jako
zmienne CSS na górze pliku `assets/css/style.css` (`:root { ... }`) — zmiana
koloru marki w jednym miejscu aktualizuje całą stronę.
