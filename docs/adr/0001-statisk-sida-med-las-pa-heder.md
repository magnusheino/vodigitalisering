# Statisk sida där låsning och deadline gäller på heder

Julkalendern byggs som en helt statisk sida (HTML, JS och CSS i `dist/`) så att den kan kopieras till valfri webbhotell eller GitHub Pages utan server. Följden är att alla uppdragstexter ligger i den publicerade koden. Att en lucka är låst före sitt datum, och stängd för inlämning efter 23:59 svensk tid, bestäms därför i besökarens webbläsare och kan kringgås, t.ex. via "Visa källa" eller förhandsgranskningsparametern `?datum=`. Det accepterar vi: kalendern är ett lättsamt kollegaskoj, och det som verkligen räknas, inlämningen, sker i Teams där sidan ändå inte kan styra något.

## Considered Options

- **Server eller serverlös funktion som lämnar ut uppdrag per datum**: skulle stoppa tjuvkikandet, men kräver drift och binder sidan till en viss värd.
- **Krypterade uppdragstexter som låses upp per datum**: nyckeln måste ändå finnas på klienten, så det blir bara obegripligare utan att bli säkrare.
