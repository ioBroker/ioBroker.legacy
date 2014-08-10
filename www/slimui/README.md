# SlimUI

ein sehr leichtgewichtiges Framework zur Erstellung von CCU.IO WebUIs. Gemacht für alte Browser und langsame Clients.
"Vanilla" JavaScript, es werden keine Bibliotheken wie jQuery o.Ä. eingesetzt.

* Kommuniziert mit CCU.IO über die SimpleAPI (nur Ajax, keine Websockets)
* sehr kompakt: weniger als 350 Zeilen Code, minifiziert nur 5,5kB groß
* Verwendet Douglas Crockfords json2.js falls der Browser kein JSON.parse() unterstützt - https://github.com/douglascrockford/JSON-js
* hält den globalen Namensraum sauber

## Browser-Kompatibilität

bitte meldet Browser auf denen ihr SlimUI getestet habt damit ich diese Liste ergänzen kann.

### erfolgreich getestet:
* Internet Explorer 6, 7, 8 (Windows XP)
* Opera 10.10 (Windows XP)
* Firefox 3.6 (Windows XP)
* Android Browser (Android 4.0.4)
* Safari (iOS 4.2.1)

## Dokumentation

SlimUI benötigt CCU.IO Version >= 1.0.21

### Elemente

Elemente die mit CCU.IO verknüpft werden sollen benötigen das Attribut data-dp mit einer Datenpunkt-ID.
Folgende Elemente können verknüpft werden:

* button
* input type=button
* input type=checkbox
* input type=text
* input type=number
* select
* span
* div


### Attribute
#### data-dp

Eine Datenpunkt-ID, ein Datenpunkt Name oder ein Kanalname;DATAPOINT

Beispiele:

```
data-dp="12345"
data-dp="BidCos-RF.EEQ1234567:1.TEMPERATURE"
data-dp="Temperatur Garten;TEMPERATURE"
```

#### data-val

Für Button-Elemente und Input-Elemente vom Typ Button muss zusätzlich das Attribut data-val angegeben werden das den
Wert beinhaltet auf den der Datenpunkt gesetzt wird wenn der Button geklickt wird.

#### data-digits

Anzahl Nachkommstellen bei Anzeige von numerischen Werten

#### data-timestamp

Wenn data-timestamp="true" wird statt dem Wert der Zeitstempel der letzten Änderung angezeigt

#### data-toggle

Kann bei Button-Elementen und Input-Elementen vom Typ Button angegeben werden - dann wird statt einen Wert zu setzen der
aktuelle Wert umgekehrt. In diesem Fall kann das Attribut data-val weggelassen werden.

#### data-class

Kann bei Div- und Span-Elementen verwendet werden. Ist z.B. data-class="status" wird dem Element bei einem Wert von 1
die Klasse "status-1" und bei einem Wert von 0 die Klass "status-0" zugewiesen.

### diverse Beispiele siehe index.html

## Changelog

### 1.0.0
* Formatierung von Werten (Anzahl Nachkommastellen)
* Button Toggle (erfordert CCU.IO 1.0.21)
* Unterstützung für Anzeige von Timestamps (erfordert CCU.IO 1.0.21)
* CSS Klasse in Abhängigkeit von Wert setzen
* Datenpunkte können auch über Name oder Kanalname;DATAPOINT adressiert werden
* Input value nicht updaten solange Element focus hat
* globalen Namensraum sauber gehalten
* pollingInterval 3s

### 0.0.4
* eigener Ajax Wrapper, suchjs rausgeschmissen
* IE Fixes
* Firefox Fixes

### 0.0.3
* pollValues und updateElements implementiert

### 0.0.2
* setValue implementiert


## Lizenz

Copyright (c) 2014 hobbyquaker [http://hobbyquaker.github.io](http://hobbyquaker.github.io)

Lizenz: [CC BY-NC 3.0](http://creativecommons.org/licenses/by-nc/3.0/de/)

Sie dürfen das Werk bzw. den Inhalt vervielfältigen, verbreiten und öffentlich zugänglich machen,
Abwandlungen und Bearbeitungen des Werkes bzw. Inhaltes anfertigen zu den folgenden Bedingungen:

  * **Namensnennung** - Sie müssen den Namen des Autors/Rechteinhabers in der von ihm festgelegten Weise nennen.
  * **Keine kommerzielle Nutzung** - Dieses Werk bzw. dieser Inhalt darf nicht für kommerzielle Zwecke verwendet werden.

Wobei gilt:
Verzichtserklärung - Jede der vorgenannten Bedingungen kann aufgehoben werden, sofern Sie die ausdrückliche Einwilligung des Rechteinhabers dazu erhalten.

Die Veröffentlichung dieser Software erfolgt in der Hoffnung, daß sie Ihnen von Nutzen sein wird, aber OHNE IRGENDEINE GARANTIE, sogar ohne die implizite Garantie der MARKTREIFE oder der VERWENDBARKEIT FÜR EINEN BESTIMMTEN ZWECK. Die Nutzung dieser Software erfolgt auf eigenes Risiko!
