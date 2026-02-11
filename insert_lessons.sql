-- Inserowanie lekcji dla kursu "Kurs Python"
-- Zakładam, że course_id zostanie podstawione lub użyjesz subquery

-- Lekcja 1: Wprowadzenie do Pythona

INSERT INTO courses (title, description, price_cents, category, difficulty, instructor)
VALUES
('Kurs Python', 'Kurs wprowadzający do programowania w Pythonie.', 49900, 'Programowanie', 'Beginner', 'Dr. Adam Malinowski');

INSERT INTO lessons (course_id, title, content, lesson_order)
VALUES (
    (SELECT id FROM courses WHERE title = 'Kurs Python' LIMIT 1),
    'Wprowadzenie do Pythona',
    '{
        "duration": "45 min",
        "markdown": "# Wprowadzenie do Pythona\n\n## Czym jest Python?\n\nPython to wysokopoziomowy język programowania, który charakteryzuje się prostą składnią i czytelnym kodem. Został stworzony przez **Guido van Rossuma** w **1991 roku**.\n\n## Zastosowania Pythona\n\nPython jest używany w wielu dziedzinach:\n- Tworzenie aplikacji webowych\n- Analiza danych\n- Machine learning\n- Automatyzacja\n- Skrypty systemowe\n- I wiele innych\n\n## Pierwszy program\n\n```python\nprint(\"Hello, World!\")\nprint(\"Witaj w świecie Pythona!\")\n```\n\n## Quiz\n\n**Pytanie:** W którym roku powstał Python?\n\nA) 1989  \nB) 1991 ✓  \nC) 1995  \nD) 2000"
    }'::jsonb,
    1
);

-- Lekcja 2: Instalacja środowiska
INSERT INTO lessons (course_id, title, content, lesson_order)
VALUES (
    (SELECT id FROM courses WHERE title = 'Kurs Python' LIMIT 1),
    'Instalacja i konfiguracja środowiska',
    '{
        "duration": "30 min",
        "markdown": "# Instalacja i konfiguracja środowiska\n\n## Pobieranie Pythona\n\nPython możesz pobrać ze strony oficjalnej **python.org**. Dostępne są wersje dla:\n- Windows\n- macOS\n- Linux\n\n## Kroki instalacji\n\n1. Przejdź na stronę python.org/downloads\n2. Pobierz najnowszą wersję Pythona\n3. Uruchom instalator\n4. **Zaznacz opcję \"Add Python to PATH\"**\n5. Kliknij \"Install Now\"\n6. Zweryfikuj instalację komendą:\n\n```bash\npython --version\n```\n\n## Edytory kodu\n\nPopularne edytory do Pythona:\n- **Visual Studio Code** (polecany dla początkujących)\n- PyCharm\n- Sublime Text\n- Atom\n\n> 💡 **Tip:** Visual Studio Code jest darmowy i ma świetne wsparcie dla Pythona!"
    }'::jsonb,
    2
);

-- Lekcja 3: Zmienne i typy danych
INSERT INTO lessons (course_id, title, content, lesson_order)
VALUES (
    (SELECT id FROM courses WHERE title = 'Kurs Python' LIMIT 1),
    'Zmienne i typy danych',
    '{
        "duration": "60 min",
        "markdown": "# Zmienne i typy danych\n\n## Czym są zmienne?\n\nZmienne to **pojemniki na dane**. W Pythonie nie musisz deklarować typu zmiennej - jest on automatycznie wykrywany.\n\n## Tworzenie zmiennych\n\n```python\n# Liczby całkowite\nwiek = 25\n\n# Liczby zmiennoprzecinkowe\ncena = 19.99\n\n# Teksty (stringi)\nimie = \"Jan\"\n\n# Wartości logiczne\nczy_student = True\n```\n\n## Podstawowe typy danych\n\nPython ma kilka wbudowanych typów danych:\n\n| Typ | Nazwa | Przykład |\n|-----|-------|----------|\n| `int` | Liczby całkowite | `42` |\n| `float` | Liczby zmiennoprzecinkowe | `3.14` |\n| `str` | Teksty | `\\\"Hello\\\"` |\n| `bool` | Wartości logiczne | `True`, `False` |\n| `list` | Listy | `[1, 2, 3]` |\n| `dict` | Słowniki | `{\\\"klucz\\\": \\\"wartość\\\"}` |\n\n## Operacje na zmiennych\n\n```python\na = 10\nb = 5\n\n# Dodawanie\nsuma = a + b  # 15\n\n# Mnożenie\niloczyn = a * b  # 50\n\n# Łączenie stringów\npowitanie = \\\"Cześć \\\" + \\\"świecie!\\\"  # \\\"Cześć świecie!\\\"\n```\n\n## 📝 Ćwiczenie\n\nStwórz zmienne przechowujące:\n- Twoje imię\n- Twój wiek\n- Ulubiony kolor\n\nA następnie wyświetl je używając `print()`."
    }'::jsonb,
    3
);

-- Lekcja 4: Operatory i wyrażenia
INSERT INTO lessons (course_id, title, content, lesson_order)
VALUES (
    (SELECT id FROM courses WHERE title = 'Kurs Python' LIMIT 1),
    'Operatory i wyrażenia',
    '{
        "duration": "50 min",
        "markdown": "# Operatory i wyrażenia\n\n## Operatory arytmetyczne\n\nPython obsługuje standardowe operatory matematyczne:\n\n- `+` dodawanie\n- `-` odejmowanie\n- `*` mnożenie\n- `/` dzielenie\n- `//` dzielenie całkowite\n- `%` reszta z dzielenia\n- `**` potęgowanie\n\n### Przykłady operacji\n\n```python\nprint(10 + 5)   # 15\nprint(10 - 5)   # 5\nprint(10 * 5)   # 50\nprint(10 / 5)   # 2.0\nprint(10 // 3)  # 3\nprint(10 % 3)   # 1\nprint(2 ** 3)   # 8\n```\n\n## Operatory porównania\n\nOperatory porównania zwracają wartość `True` lub `False`:\n\n- `==` równe\n- `!=` różne\n- `>` większe\n- `<` mniejsze\n- `>=` większe lub równe\n- `<=` mniejsze lub równe\n\n### Porównania\n\n```python\nx = 10\ny = 5\n\nprint(x == y)  # False\nprint(x != y)  # True\nprint(x > y)   # True\nprint(x < y)   # False\n```\n\n## Quiz\n\n**Pytanie:** Jaki będzie wynik operacji: `17 // 5`?\n\nA) 3.4  \nB) 3 ✓  \nC) 2  \nD) 4"
    }'::jsonb,
    4
);

-- Lekcja 5: Instrukcje warunkowe
INSERT INTO lessons (course_id, title, content, lesson_order)
VALUES (
    (SELECT id FROM courses WHERE title = 'Kurs Python' LIMIT 1),
    'Instrukcje warunkowe (if, elif, else)',
    '{
        "duration": "55 min",
        "markdown": "# Instrukcje warunkowe (if, elif, else)\n\n## Instrukcja if\n\nInstrukcja `if` pozwala wykonać kod tylko wtedy, gdy warunek jest prawdziwy. \n\n> ⚠️ **Ważne:** Zwróć uwagę na **wcięcia** - w Pythonie są one obowiązkowe!\n\n### Podstawowy if\n\n```python\nwiek = 18\n\nif wiek >= 18:\n    print(\"Jesteś pełnoletni\")\n```\n\n## Instrukcja else\n\n`else` pozwala określić, co się stanie, gdy warunek nie jest spełniony.\n\n```python\nwiek = 15\n\nif wiek >= 18:\n    print(\"Możesz głosować\")\nelse:\n    print(\"Jeszcze nie możesz głosować\")\n```\n\n## Instrukcja elif\n\n`elif` (else if) pozwala sprawdzić **wiele warunków** po kolei.\n\n```python\nocena = 85\n\nif ocena >= 90:\n    print(\"Celujący\")\nelif ocena >= 75:\n    print(\"Bardzo dobry\")\nelif ocena >= 60:\n    print(\"Dobry\")\nelse:\n    print(\"Popraw\")\n```\n\n## 📝 Ćwiczenie\n\nNapisz program, który sprawdza czy liczba jest:\n- **Dodatnia** (> 0)\n- **Ujemna** (< 0)\n- **Równa zero** (== 0)"
    }'::jsonb,
    5
);

-- Lekcja 6: Pętle
INSERT INTO lessons (course_id, title, content, lesson_order)
VALUES (
    (SELECT id FROM courses WHERE title = 'Kurs Python' LIMIT 1),
    'Pętle (for i while)',
    '{
        "duration": "65 min",
        "markdown": "# Pętle (for i while)\n\n## Pętla for\n\nPętla `for` służy do **iteracji po sekwencji** (lista, string, zakres liczb).\n\n### Pętla for z range\n\n```python\n# Wyświetl liczby od 0 do 4\nfor i in range(5):\n    print(i)\n\n# Wyświetl liczby od 1 do 10\nfor i in range(1, 11):\n    print(i)\n```\n\n### Iteracja po liście\n\n```python\nowoce = [\"jabłko\", \"banan\", \"wiśnia\"]\n\nfor owoc in owoce:\n    print(owoc)\n```\n\n## Pętla while\n\nPętla `while` wykonuje kod **tak długo, jak warunek jest prawdziwy**.\n\n```python\nlicznik = 0\n\nwhile licznik < 5:\n    print(licznik)\n    licznik += 1\n```\n\n## Break i continue\n\n- `break` - **przerywa** pętlę\n- `continue` - **przechodzi** do następnej iteracji\n\n```python\n# Break - zatrzymuje pętlę\nfor i in range(10):\n    if i == 5:\n        break\n    print(i)  # 0, 1, 2, 3, 4\n\n# Continue - pomija resztę iteracji\nfor i in range(5):\n    if i == 2:\n        continue\n    print(i)  # 0, 1, 3, 4\n```\n\n> 💡 **Tip:** Używaj `for` gdy znasz liczbę iteracji, a `while` gdy iterujesz do spełnienia warunku."
    }'::jsonb,
    6
);

-- Lekcja 7: Listy
INSERT INTO lessons (course_id, title, content, lesson_order)
VALUES (
    (SELECT id FROM courses WHERE title = 'Kurs Python' LIMIT 1),
    'Listy i operacje na listach',
    '{
        "duration": "60 min",
        "markdown": "# Listy i operacje na listach\n\n## Czym jest lista?\n\nLista to **uporządkowana kolekcja elementów**, która może przechowywać różne typy danych. Listy są **mutowalne** - można je modyfikować.\n\n## Tworzenie list\n\n```python\n# Pusta lista\nlista = []\n\n# Lista z elementami\nliczby = [1, 2, 3, 4, 5]\nimiona = [\"Anna\", \"Jan\", \"Kasia\"]\nmieszana = [1, \"tekst\", True, 3.14]\n```\n\n## Dostęp do elementów\n\nElementy listy są **indeksowane od 0**. Możesz używać indeksów ujemnych do dostępu od końca.\n\n```python\nowoce = [\"jabłko\", \"banan\", \"wiśnia\"]\n\nprint(owoce[0])   # jabłko\nprint(owoce[1])   # banan\nprint(owoce[-1])  # wiśnia (ostatni element)\n```\n\n## Operacje na listach\n\n```python\nlista = [1, 2, 3]\n\n# Dodawanie elementu na końcu\nlista.append(4)  # [1, 2, 3, 4]\n\n# Wstawianie na pozycji\nlista.insert(0, 0)  # [0, 1, 2, 3, 4]\n\n# Usuwanie elementu\nlista.remove(2)  # [0, 1, 3, 4]\n\n# Długość listy\nprint(len(lista))  # 4\n\n# Sortowanie\nlista.sort()  # Sortuje w miejscu\n\n# Odwracanie\nlista.reverse()  # Odwraca w miejscu\n```\n\n## Quiz\n\n**Pytanie:** Jak dostać się do ostatniego elementu listy?\n\nA) `lista[0]`  \nB) `lista[-1]` ✓  \nC) `lista[last]`  \nD) `lista.last()`"
    }'::jsonb,
    7
);

-- Lekcja 8: Funkcje
INSERT INTO lessons (course_id, title, content, lesson_order)
VALUES (
    (SELECT id FROM courses WHERE title = 'Kurs Python' LIMIT 1),
    'Funkcje w Pythonie',
    '{
        "duration": "70 min",
        "markdown": "# Funkcje w Pythonie\n\n## Czym są funkcje?\n\nFunkcje to **bloki kodu**, które wykonują określone zadanie. Pozwalają:\n- Uniknąć powtarzania kodu\n- Lepiej organizować kod\n- Ułatwić testowanie\n- Zwiększyć czytelność\n\n## Definiowanie funkcji\n\n```python\ndef powitanie():\n    print(\"Witaj w Pythonie!\")\n\n# Wywołanie funkcji\npowitanie()\n```\n\n## Parametry funkcji\n\nFunkcje mogą **przyjmować parametry** - wartości przekazywane przy wywołaniu.\n\n```python\ndef powitaj(imie):\n    print(f\"Witaj, {imie}!\")\n\npowitaj(\"Anna\")  # Witaj, Anna!\npowitaj(\"Jan\")   # Witaj, Jan!\n```\n\n## Zwracanie wartości\n\nFunkcje mogą **zwracać wartości** używając słowa kluczowego `return`.\n\n```python\ndef dodaj(a, b):\n    return a + b\n\nwynik = dodaj(5, 3)\nprint(wynik)  # 8\n```\n\n## Domyślne wartości parametrów\n\nMożesz określić **domyślne wartości** dla parametrów.\n\n```python\ndef przedstaw_sie(imie, wiek=18):\n    print(f\"Jestem {imie} i mam {wiek} lat\")\n\nprzedstaw_sie(\"Anna\")      # Jestem Anna i mam 18 lat\nprzedstaw_sie(\"Jan\", 25)   # Jestem Jan i mam 25 lat\n```\n\n## 📝 Ćwiczenie\n\nNapisz funkcję `max_z_dwoch(a, b)`, która:\n- Przyjmuje dwie liczby\n- Zwraca większą z nich\n\n```python\ndef max_z_dwoch(a, b):\n    # Twój kod tutaj\n    pass\n\nprint(max_z_dwoch(10, 5))   # Powinno zwrócić 10\nprint(max_z_dwoch(3, 15))   # Powinno zwrócić 15\n```"
    }'::jsonb,
    8
);

-- ============ KURS JAVASCRIPT ============
INSERT INTO courses (title, description, price_cents, category, difficulty, instructor)
VALUES
('Kurs JavaScript', 'Zaawansowany kurs programowania w JavaScripcie. Od podstaw do zaawansowanych koncepcji.', 79900, 'Web Development', 'Intermediate', 'Mgr. Bartosz Nowak');

-- Lekcja 1: Podstawy JS
INSERT INTO lessons (course_id, title, content, lesson_order)
VALUES (
    (SELECT id FROM courses WHERE title = 'Kurs JavaScript' LIMIT 1),
    'Wprowadzenie do JavaScriptu',
    '{
        "duration": "50 min",
        "markdown": "# Wprowadzenie do JavaScriptu\n\n## Co to jest JavaScript?\n\nJavaScript to **dynamiczny język programowania**, który jest uruchamiany w przeglądarce internetowej. Jest kluczowym technologią do tworzenia interaktywnych stron internetowych.\n\n## Historia JavaScriptu\n\n- Stworzony przez **Brendan Eich** w 1995 roku\n- Pierwotnie o nazwie \"Mocha\", później \"LiveScript\"\n- Zmieniona nazwa na JavaScript dla celów marketingowych\n- Teraz standaryzowany jako **ECMAScript**\n\n## Zastosowania JavaScriptu\n\n- Interaktywne strony internetowe\n- Aplikacje webowe (React, Vue, Angular)\n- Backend (Node.js)\n- Aplikacje mobilne (React Native)\n- Automatyzacja\n\n## Pierwszy program w JavaScript\n\n```javascript\nconsole.log(\"Cześć JavaScript!\");\nalert(\"Witaj w JavaScripcie!\");\n```\n\n## Gdzie umieścić JavaScript?\n\nMożesz umieścić JavaScript:\n1. **Wewnątrz znacznika `<script>`** w HTML\n2. **W osobnym pliku** `.js`\n3. **Wewnątrz atrybutów** elementów HTML\n\n## Quiz\n\n**Pytanie:** Kto stworzył JavaScript?\n\nA) Guido van Rossum  \nB) Brendan Eich ✓  \nC) Dennis Ritchie  \nD) Bjarne Stroustrup"
    }'::jsonb,
    1
);

-- Lekcja 2: Zmienne i typy w JS
INSERT INTO lessons (course_id, title, content, lesson_order)
VALUES (
    (SELECT id FROM courses WHERE title = 'Kurs JavaScript' LIMIT 1),
    'Zmienne i typy danych w JavaScript',
    '{
        "duration": "55 min",
        "markdown": "# Zmienne i typy danych w JavaScript\n\n## Deklarowanie zmiennych\n\nW JavaScripcie możesz deklarować zmienne na 3 sposoby:\n\n```javascript\nvar stara_zmienna = \"to jest stara metoda\";  // var - unikaj tego\nlet zmienna = \"zmienna lokalna\";             // let - używaj tego\nconst stala = \"stała wartość\";                // const - dla stałych wartości\n```\n\n## Podstawowe typy danych\n\nJavaScript ma następujące typy:\n\n| Typ | Opis | Przykład |\n|---|---|---|\n| `number` | Liczby | `42`, `3.14` |\n| `string` | Teksty | `\\\"Cześć\\\"`, `\\\"Świat\\\"` |\n| `boolean` | Wartości logiczne | `true`, `false` |\n| `null` | Brak wartości | `null` |\n| `undefined` | Niezdefiniowana | `undefined` |\n| `object` | Obiekty | `{ imie: \\\"Jan\\\" }` |\n| `array` | Tablice | `[1, 2, 3]` |\n\n## Dynamiczne typowanie\n\nJavaScript ma **dynamiczne typowanie** - typ zmiennej można zmienić:\n\n```javascript\nlet x = 10;        // number\nx = \"tekst\";      // string\nx = true;         // boolean\nconsole.log(typeof x);  // \"boolean\"\n```\n\n## 📝 Ćwiczenie\n\nUtwórz zmienne zawierające:\n- Twoją nazwę (string)\n- Twój wiek (number)\n- Czy lubisz JavaScript (boolean)\n\nWyświetl je w konsoli za pomocą `console.log()`."
    }'::jsonb,
    2
);

-- Lekcja 3: Funkcje w JS
INSERT INTO lessons (course_id, title, content, lesson_order)
VALUES (
    (SELECT id FROM courses WHERE title = 'Kurs JavaScript' LIMIT 1),
    'Funkcje w JavaScripcie',
    '{
        "duration": "60 min",
        "markdown": "# Funkcje w JavaScripcie\n\n## Deklarowanie funkcji\n\nIstnieje kilka sposobów na deklarowanie funkcji:\n\n### Standardowa funkcja\n\n```javascript\nfunction powitaj(imie) {\n  return `Cześć, ${imie}!`;\n}\n\npowitaj(\"Anna\");  // \"Cześć, Anna!\"\n```\n\n### Funkcja strzałkowa (Arrow Function)\n\n```javascript\nconst dodaj = (a, b) => {\n  return a + b;\n};\n\n// Skrócona wersja\nconst odejmij = (a, b) => a - b;\n\ndodaj(5, 3);    // 8\nodejmij(5, 3);  // 2\n```\n\n## Parametry domyślne\n\n```javascript\nfunction przedstaw(imie, wiek = 18) {\n  console.log(`${imie} ma ${wiek} lat`);\n}\n\nprzedstaw(\"Jan\");        // Jan ma 18 lat\nprzedstaw(\"Anna\", 25);   // Anna ma 25 lat\n```\n\n## Rest parameters\n\n```javascript\nfunction suma(...liczby) {\n  return liczby.reduce((a, b) => a + b, 0);\n}\n\nsuma(1, 2, 3);      // 6\nsuma(5, 10, 15, 20); // 50\n```\n\n## 📝 Ćwiczenie\n\nUtwórz funkcję strzałkową `najwieksze(a, b, c)`, która zwraca największą z trzech liczb."
    }'::jsonb,
    3
);

-- ============ KURS DATA SCIENCE ============
INSERT INTO courses (title, description, price_cents, category, difficulty, instructor)
VALUES
('Kurs Data Science z Pythonem', 'Kompleksowy kurs analizy danych i machine learning z wykorzystaniem Pythona.', 99900, 'Data Science', 'Advanced', 'Dr. Katarzyna Lewandowska');

-- Lekcja 1: Numpy
INSERT INTO lessons (course_id, title, content, lesson_order)
VALUES (
    (SELECT id FROM courses WHERE title = 'Kurs Data Science z Pythonem' LIMIT 1),
    'Podstawy NumPy',
    '{
        "duration": "80 min",
        "markdown": "# Podstawy NumPy\n\n## Co to jest NumPy?\n\nNumPy to **biblioteka Pythona** do obliczeń naukowych. Dostarcza:\n- **Wielowymiarowe tablice** (arrays)\n- **Funkcje matematyczne**\n- **Operacje na macierzach**\n\n## Tworzenie tablic NumPy\n\n```python\nimport numpy as np\n\n# Tablica z listy\narr = np.array([1, 2, 3, 4, 5])\n\n# Tablica zer\nzeros = np.zeros(5)  # [0. 0. 0. 0. 0.]\n\n# Tablica jedynek\nones = np.ones((3, 3))  # Macierz 3x3 pełna jedynek\n\n# Tablica z zakresem\nrange_arr = np.arange(0, 10, 2)  # [0 2 4 6 8]\n\n# Tablica losowych wartości\nrandom_arr = np.random.rand(3, 3)  # Macierz 3x3 losowych wartości\n```\n\n## Operacje na tablicach\n\n```python\narr = np.array([1, 2, 3, 4, 5])\n\n# Kształt tablicy\nprint(arr.shape)  # (5,)\n\n# Typ danych\nprint(arr.dtype)  # int64\n\n# Podstawowe operacje\nprint(arr + 1)     # [2 3 4 5 6]\nprint(arr * 2)     # [2 4 6 8 10]\nprint(arr.sum())   # 15\nprint(arr.mean())  # 3.0\n```\n\n## Indeksowanie i slicing\n\n```python\narr = np.array([1, 2, 3, 4, 5])\n\n# Indeksowanie\nprint(arr[0])     # 1\nprint(arr[-1])    # 5\n\n# Slicing\nprint(arr[1:4])   # [2 3 4]\nprint(arr[::2])   # [1 3 5]\n```\n\n## Quiz\n\n**Pytanie:** Jaki będzie kształt macierzy utworzonej za pomocą `np.ones((3, 4))`?\n\nA) 4x3  \nB) 3x4 ✓  \nC) 12  \nD) (4, 3)"
    }'::jsonb,
    1
);

-- Lekcja 2: Pandas
INSERT INTO lessons (course_id, title, content, lesson_order)
VALUES (
    (SELECT id FROM courses WHERE title = 'Kurs Data Science z Pythonem' LIMIT 1),
    'Analiza danych z Pandas',
    '{
        "duration": "90 min",
        "markdown": "# Analiza danych z Pandas\n\n## Co to jest Pandas?\n\nPandas to **biblioteka do analizy danych** w Pythonie. Umożliwia:\n- Pracę z danymi tabelarycznymi\n- Czyszczenie danych\n- Transformacje danych\n- Analiza statystyczna\n\n## DataFrame - podstawowa struktura\n\n```python\nimport pandas as pd\n\n# Tworzenie DataFrame z listy słowników\ndata = {\n    \\\"imie\\\": [\\\"Anna\\\", \\\"Jan\\\", \\\"Maria\\\"],\n    \\\"wiek\\\": [25, 30, 28],\n    \\\"ocena\\\": [4.5, 3.8, 4.2]\n}\n\ndf = pd.DataFrame(data)\n```\n\n## Podstawowe operacje\n\n```python\n# Wyświetlenie pierwszych wierszy\nprint(df.head())\n\n# Informacje o DataFrame\nprint(df.info())\n\n# Statystyka opisowa\nprint(df.describe())\n\n# Wymiary\nprint(df.shape)  # (3, 3) - 3 wiersze, 3 kolumny\n```\n\n## Filtrowanie i selekcja\n\n```python\n# Wybór kolumny\nprint(df[\\\"imie\\\"])\n\n# Filtrowanie\ndoroslI = df[df[\\\"wiek\\\"] > 25]\n\n# Wielokrotne warunki\ndobrzy = df[(df[\\\"wiek\\\"] > 25) & (df[\\\"ocena\\\"] > 4.0)]\n```\n\n## Obsługa brakujących danych\n\n```python\n# Sprawdzenie brakujących wartości\nprint(df.isnull())\n\n# Usunięcie brakujących danych\ndf_clean = df.dropna()\n\n# Uzupełnienie brakujących danych\ndf_filled = df.fillna(0)\n```\n\n## 📝 Ćwiczenie\n\nUtwórz DataFrame ze studentami (imiona, oceny), a następnie:\n1. Wyświetl średnią ocenę\n2. Filtruj studentów z oceną > 4.0\n3. Sprawdź, czy są brakujące dane"
    }'::jsonb,
    2
);

-- Lekcja 3: Machine Learning Basics
INSERT INTO lessons (course_id, title, content, lesson_order)
VALUES (
    (SELECT id FROM courses WHERE title = 'Kurs Data Science z Pythonem' LIMIT 1),
    'Wprowadzenie do Machine Learning',
    '{
        "duration": "100 min",
        "markdown": "# Wprowadzenie do Machine Learning\n\n## Czym jest Machine Learning?\n\nMachine Learning to **gałąź sztucznej inteligencji**, w której komputery uczą się z danych bez jawnego programowania.\n\n## Typy Machine Learning\n\n| Typ | Opis | Przykład |\n|---|---|---|\n| **Nadzorowane** | Model uczy się z etykietowanych danych | Klasyfikacja, Regresja |\n| **Nienadzorowane** | Model szuka wzorców w danych | Clustering, Redukcja wymiarów |\n| **Wzmacniające** | Model uczy się przez nagrody/kary | Gry, Robotyka |\n\n## Podstawowy workflow\n\n1. **Zbieranie danych** - zdobywanie danych\n2. **Przygotowanie danych** - czyszczenie, normalizacja\n3. **Podział danych** - train/test\n4. **Wybór modelu** - algorytm\n5. **Trening** - nauczanie modelu\n6. **Ewaluacja** - ocena wydajności\n7. **Tuning** - optymalizacja\n\n## Regresja liniowa\n\n```python\nfrom sklearn.linear_model import LinearRegression\nimport numpy as np\n\n# Dane treningowe\nX = np.array([[1], [2], [3], [4], [5]])\ny = np.array([2, 4, 5, 4, 5])\n\n# Tworzenie i trening modelu\nmodel = LinearRegression()\nmodel.fit(X, y)\n\n# Predykcja\nprediction = model.predict([[6]])\nprint(prediction)  # [5.4]\n```\n\n## Metryki oceny\n\n- **MSE** (Mean Squared Error) - błąd średniokwadratowy\n- **RMSE** (Root Mean Squared Error) - pierwiastek z MSE\n- **R²** - współczynnik determinacji (0-1)\n\n## 📝 Ćwiczenie\n\nUtwórz prosty model regresji liniowej dla:\n- X: [1, 2, 3, 4, 5]\n- y: [2, 4, 6, 8, 10]\n\nA następnie zrób predykcję dla X=6"
    }'::jsonb,
    3
);

-- ============ KURS AI - GENEROWANIE OBRAZKÓW ============
INSERT INTO courses (title, description, price_cents, category, difficulty, instructor)
VALUES
('Kurs AI: Generowanie Obrazków', 'Naucz się tworzyć zachwycające obrazy za pomocą sztucznej inteligencji. DALL-E, Stable Diffusion i inne narzędzia.', 89900, 'AI', 'Intermediate', 'Mgr. Marcin Kowalski');

-- Lekcja 1: Wprowadzenie do generatywnej AI
INSERT INTO lessons (course_id, title, content, lesson_order)
VALUES (
    (SELECT id FROM courses WHERE title = 'Kurs AI: Generowanie Obrazków' LIMIT 1),
    'Wprowadzenie do generatywnej AI',
    '{
        "duration": "45 min",
        "markdown": "# Wprowadzenie do generatywnej AI\n\n## Co to jest generatywna AI?\n\nGeneratywna AI to gałąź sztucznej inteligencji, która **tworzy nowe zawartości** na podstawie danych treningowych. Może generować:\n- **Obrazy**\n- Tekst\n- Muzykę\n- Wideo\n- Kod\n\n## Popularne modele generatywne\n\n| Model | Twórca | Zastosowanie |\n|---|---|---|\n| **DALL-E** | OpenAI | Generowanie obrazów z tekstu |\n| **Stable Diffusion** | Stability AI | Open-source generowanie obrazów |\n| **Midjourney** | Midjourney Inc. | Tworzenie wysokiej jakości obrazów |\n| **GPT-4** | OpenAI | Generowanie tekstu i conversacja |\n| **Claude** | Anthropic | Zaawansowana analiza i generacja tekstu |\n\n## Jak działają modele diffusion?\n\nModele diffusion działają poprzez:\n1. **Szum** - dodawanie szumu do obrazu\n2. **Denoising** - stopniowe usuwanie szumu\n3. **Kierowanie tekstowe** - prompt mówi modelowi co generować\n\n## Etyczne zastosowanie\n\n> ⚠️ **Ważne:** Zawsze używaj narzędzi AI odpowiedzialnie. Szanuj prawa autorskie i prywatność innych osób."
    }'::jsonb,
    1
);

-- Lekcja 2: DALL-E i praktyka
INSERT INTO lessons (course_id, title, content, lesson_order)
VALUES (
    (SELECT id FROM courses WHERE title = 'Kurs AI: Generowanie Obrazków' LIMIT 1),
    'Praca z DALL-E',
    '{
        "duration": "60 min",
        "markdown": "# Praca z DALL-E\n\n## Co to jest DALL-E?\n\nDALL-E to model generatywny stworzony przez **OpenAI** do tworzenia obrazów z opisów tekstowych. Jest intuicyjny i potężny.\n\n## Dostęp do DALL-E\n\n```\n1. Przejdź na stronę: https://openai.com/dall-e\n2. Zaloguj się lub utwórz konto\n3. Kliknij \\\"Start creating\\\"\n4. Wpisz swój prompt\n```\n\n## Struktura dobrego prompta\n\nDobry prompt zawiera:\n- **Podmiot** - co chcesz wygenerować\n- **Styl** - jaki styl artystyczny\n- **Tło** - kontekst\n- **Lighting** - oświetlenie\n- **Rozdzielczość** - jakość\n\n## Przykładowe prompty\n\n```\n\\\"A serene Japanese garden with koi fish, cherry blossoms, \nstone lantern, traditional wooden bridge, morning light, \nhighly detailed, 4K\\\"​\n\n\\\"Steampunk airship flying over Victorian city, \ncoppery colors, detailed machinery, golden hour lighting, \ndigital art, trending on artstation\\\"​\n```\n\n## Porady praktyczne\n\n- Bądź **specyficzny** - im więcej szczegółów, tym lepiej\n- Używaj **słów kluczowych** z świata sztuki\n- Dodawaj **style** (oil painting, watercolor, 3D render)\n- Eksperymentuj z **kombinacjami**\n\n## 📝 Ćwiczenie\n\nUtwórz 3 prompty do DALL-E dla:\n1. Futurystycznego miasta\n2. Magicznego lasu\n3. Cyberpunkowej postaci"
    }'::jsonb,
    2
);

-- Lekcja 3: Stable Diffusion i narzędzia open-source
INSERT INTO lessons (course_id, title, content, lesson_order)
VALUES (
    (SELECT id FROM courses WHERE title = 'Kurs AI: Generowanie Obrazków' LIMIT 1),
    'Stable Diffusion i narzędzia open-source',
    '{
        "duration": "75 min",
        "markdown": "# Stable Diffusion i narzędzia open-source\n\n## Co to jest Stable Diffusion?\n\n**Stable Diffusion** to open-source model generowania obrazów. Zalety:\n- **Darmowy** do użytku lokalnego\n- **Open-source** - można go modyfikować\n- **Szybki** - działa na GPU\n- **Dostępny** - można go samemu zainstalować\n\n## Popularne interfejsy\n\n| Narzędzie | Opis |\n|---|---|\n| **Hugging Face** | Web interface - nie wymaga instalacji |\n| **Automatic1111 WebUI** | Zaawansowany interfejs lokalny |\n| **ComfyUI** | Node-based workflow |\n| **InvokeAI** | Użytkowniczy interfejs |\n\n## Instalacja Automatic1111\n\n```bash\n# Klonuj repozytorium\ngit clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git\n\n# Wejdź do folderu\ncd stable-diffusion-webui\n\n# Uruchom (Windows)\n.\\\\webui-user.bat\n```\n\n## Modele i Checkpointy\n\nPopularne modele:\n- **Realistic Vision** - fotorealistyczne obrazy\n- **DreamShaper** - artystyczne generacje\n- **Deliberate** - wszechstronne\n- **Epicrealism** - ultra realizm\n\n## Techniki zaawansowane\n\n- **LoRA** - dostrajanie modelu\n- **Embeddings** - uczenie się koncepcji\n- **Inpainting** - edycja obrazów\n- **Img2Img** - transformacja obrazów\n\n## 📝 Ćwiczenie\n\nZainstaluj Stable Diffusion i wygeneruj serię obrazów dla koncepcji gry wideo."
    }'::jsonb,
    3
);

-- ============ KURS SZTUCZNA INTELIGENCJA - LLM I CHATBOTY ============
INSERT INTO courses (title, description, price_cents, category, difficulty, instructor)
VALUES
('Sztuczna Inteligencja: LLM i Chatboty', 'Naucz się pracować z LLM (Large Language Models), budować chatboty i integrować AI z aplikacjami.', 119900, 'AI', 'Advanced', 'Dr. Ewa Nowak');

-- Lekcja 1: Czym są LLM?
INSERT INTO lessons (course_id, title, content, lesson_order)
VALUES (
    (SELECT id FROM courses WHERE title = 'Sztuczna Inteligencja: LLM i Chatboty' LIMIT 1),
    'Czym są Large Language Models?',
    '{
        "duration": "50 min",
        "markdown": "# Czym są Large Language Models?\n\n## Definicja LLM\n\n**Large Language Model (LLM)** to sztuczna inteligencja trenowana na ogromnej ilości tekstu. Może:\n- Odpowiadać na pytania\n- Pisać artykuły\n- Tłumaczyć języki\n- Pisać kod\n- Analizować tekst\n\n## Popularne LLM\n\n| Model | Twórca | Cechy |\n|---|---|---|\n| **GPT-4** | OpenAI | Najbardziej zaawansowany, wielomodal |\n| **GPT-3.5** | OpenAI | Szybki, tańszy |\n| **Claude 3** | Anthropic | Bezpieczny, długi kontekst |\n| **Llama 2** | Meta | Open-source, lokalnie |\n| **Gemini** | Google | Multimodal, integracja z ekosystemem |\n\n## Architektura Transformer\n\nLLM używają architektury **Transformer** bazującej na:\n- **Attention mechanism** - skupianie się na ważnych słowach\n- **Self-attention** - zrozumienie relacji między słowami\n- **Feed-forward networks** - przetwarzanie informacji\n\n## Jak działa predykcja?\n\n```\n1. Tokenizacja - tekst → tokens (słowa/znaki)\n2. Embedding - tokens → wektory numeryczne\n3. Transformer - przetwarzanie przez warstwy\n4. Output - predykcja następnego tokenu\n5. Iteracja - generowanie kolejnych słów\n```\n\n## Prompt Engineering\n\n> **Tip:** Umiejętność pisania dobrych promptów to kluczowa umiejętność w erze AI!"
    }'::jsonb,
    1
);

-- Lekcja 2: API OpenAI i integracja
INSERT INTO lessons (course_id, title, content, lesson_order)
VALUES (
    (SELECT id FROM courses WHERE title = 'Sztuczna Inteligencja: LLM i Chatboty' LIMIT 1),
    'API OpenAI i integracja z aplikacjami',
    '{
        "duration": "70 min",
        "markdown": "# API OpenAI i integracja z aplikacjami\n\n## Uzyskanie klucza API\n\n```\n1. Idź na https://platform.openai.com\n2. Zaloguj się\n3. Przejdź do \\\"API keys\\\"\n4. Kliknij \\\"Create new secret key\\\"\n5. Zapisz klucz w bezpiecznym miejscu\n```\n\n## Instalacja biblioteki Python\n\n```bash\npip install openai\n```\n\n## Prosty przykład\n\n```python\nfrom openai import OpenAI\n\nclient = OpenAI(api_key=\\\"your-api-key\\\")\n\nresponse = client.chat.completions.create(\n    model=\\\"gpt-4\\\",\n    messages=[\n        {\\\"role\\\": \\\"system\\\", \\\"content\\\": \\\"You are helpful assistant\\\"},\n        {\\\"role\\\": \\\"user\\\", \\\"content\\\": \\\"Cześć! Jak się masz?\\\"}\n    ],\n    temperature=0.7,\n    max_tokens=150\n)\n\nprint(response.choices[0].message.content)\n```\n\n## Parametry ważne\n\n| Parametr | Opis | Zakres |\n|---|---|---|\n| **temperature** | Kreatywność | 0.0 - 2.0 |\n| **max_tokens** | Maks. długość | 1 - 4096 |\n| **top_p** | Diversifikacja | 0.0 - 1.0 |\n| **presence_penalty** | Powtórzenia | -2.0 - 2.0 |\n\n## Buildowanie chatbota\n\n```python\nfrom openai import OpenAI\n\nclient = OpenAI()\nmessages = []\n\nwhile True:\n    user_input = input(\\\"You: \\\")\n    messages.append({\\\"role\\\": \\\"user\\\", \\\"content\\\": user_input})\n    \n    response = client.chat.completions.create(\n        model=\\\"gpt-3.5-turbo\\\",\n        messages=messages\n    )\n    \n    assistant_message = response.choices[0].message.content\n    messages.append({\\\"role\\\": \\\"assistant\\\", \\\"content\\\": assistant_message})\n    print(f\\\"Assistant: {assistant_message}\\\")\n```\n\n## 📝 Ćwiczenie\n\nUtwórz chatbota odpowiadającego na pytania o wybranym temacie (np. historia, geografia, receptury)."
    }'::jsonb,
    2
);

-- Lekcja 3: Zaawansowane techniki i best practices
INSERT INTO lessons (course_id, title, content, lesson_order)
VALUES (
    (SELECT id FROM courses WHERE title = 'Sztuczna Inteligencja: LLM i Chatboty' LIMIT 1),
    'Zaawansowane techniki i best practices',
    '{
        "duration": "80 min",
        "markdown": "# Zaawansowane techniki i best practices\n\n## Prompt Engineering - zaawansowane techniki\n\n### 1. Few-shot prompting\n\n```\nTłumacz angielskie słowa na polski.\n\nPrzykłady:\ncat -> kot\ndog -> pies\nhouse -> dom\n\nbird -> ?\n```\n\n### 2. Chain-of-Thought (CoT)\n\n```\nRozwiąż problem krok po kroku.\n\nProblem: 3 + 5 * 2 = ?\n\nZamiast: 13\nLepiej: \nPierwsz: 5 * 2 = 10\nDrugie: 3 + 10 = 13\n```\n\n## RAG (Retrieval-Augmented Generation)\n\nRAG łączy:\n- **Retrieval** - wyszukiwanie relewantnych dokumentów\n- **Augmented** - wzbogacenie kontekstu\n- **Generation** - tworzenie odpowiedzi\n\n```python\n# Pseudocode\ndocuments = search_knowledge_base(user_query)\ncontext = \\\" \\\".join(documents)\nprompt = f\\\"Context: {context}\\n\\nQuestion: {user_query}\\\"\nresponse = llm.generate(prompt)\n```\n\n## Fine-tuning vs. Few-shot\n\n| Aspekt | Few-shot | Fine-tuning |\n|---|---|---|\n| **Koszt** | Niski | Wysoki |\n| **Czas** | Szybko | Powoli |\n| **Dokładność** | Średnia | Wysoka |\n| **Dane** | Kilka przykładów | Tysiące przykładów |\n\n## Bezpieczeństwo i etyka\n\n- ✅ Validuj dane wejściowe\n- ✅ Monitoruj tokeny i koszty\n- ✅ Nie przechowuj kluczy w kodzie\n- ✅ Używaj environment variables\n- ✅ Rozważ bias w modelach\n- ✅ Szanuj prywatność użytkowników\n\n## Monitoring i optymalizacja\n\n```python\nimport logging\n\nlogging.basicConfig(level=logging.INFO)\nlogger = logging.getLogger(__name__)\n\nlogger.info(f\\\"API Call - Model: {model}, Tokens: {tokens}\\\")\nlogger.info(f\\\"Response time: {elapsed_time}s\\\")\n```\n\n## 📝 Ćwiczenie\n\nUtwórz system RAG który odpowiada na pytania oparte na własnej bazie wiedzy (np. dokumentacja produktu)."
    }'::jsonb,
    3
);

-- ============ KURS COMPUTER VISION - ANALIZA OBRAZÓW ============
INSERT INTO courses (title, description, price_cents, category, difficulty, instructor)
VALUES
('Computer Vision: Analiza i Przetwarzanie Obrazów', 'Naucz się analizować obrazy za pomocą AI. Detekcja obiektów, rozpoznawanie twarzy, klasyfikacja obrazów.', 109900, 'AI', 'Advanced', 'Dr. Paweł Górski');

-- Lekcja 1: Wprowadzenie do Computer Vision
INSERT INTO lessons (course_id, title, content, lesson_order)
VALUES (
    (SELECT id FROM courses WHERE title = 'Computer Vision: Analiza i Przetwarzanie Obrazów' LIMIT 1),
    'Wprowadzenie do Computer Vision',
    '{
        "duration": "55 min",
        "markdown": "# Wprowadzenie do Computer Vision\n\n## Co to jest Computer Vision?\n\n**Computer Vision** to dziedzina AI zajmująca się **uczeniem maszynowym na obrazach**. Pozwala komputerom:\n- Widzieć obrazy\n- Rozpoznawać obiekty\n- Analizować scene\n- Wykonywać zadania wizualne\n\n## Główne zadania CV\n\n| Zadanie | Opis | Przykład |\n|---|---|---|\n| **Klasyfikacja** | Określ typ obiektu | Czy to pies czy kot? |\n| **Detekcja** | Znajdź i zlokalizuj obiekty | Gdzie są osoby na zdjęciu? |\n| **Segmentacja** | Podziel obraz na części | Oddziel tło od osoby |\n| **Rozpoznawanie twarzy** | Identyfikuj twarze | Która osoba na zdjęciu? |\n| **OCR** | Czytaj tekst z obrazu | Tekst z dokumentu |\n\n## Popularne modele\n\n- **YOLO** - Szybka detekcja\n- **ResNet** - Klasyfikacja obrazów\n- **Mask R-CNN** - Segmentacja instancji\n- **Face Recognition** - Rozpoznawanie twarzy\n- **EfficientNet** - Efektywne modele\n\n## Przetwarzanie obrazów\n\n```python\nimport cv2\nimport numpy as np\n\n# Wczytaj obraz\nimage = cv2.imread(\\\"photo.jpg\\\")\n\n# Konwersja do RGB\nrgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)\n\n# Zmiana rozmiaru\nresized = cv2.resize(rgb_image, (224, 224))\n\n# Normalizacja\nnormalized = resized / 255.0\n```\n\n## Stack techniczny\n\n- **OpenCV** - Przetwarzanie obrazów\n- **PyTorch/TensorFlow** - Deep Learning\n- **YOLO** - Detekcja\n- **MediaPipe** - Pose, Hand detection\n\n## 📝 Ćwiczenie\n\nWczytaj obraz i aplikuj podstawowe filtry (blur, edge detection, threshold)."
    }'::jsonb,
    1
);

-- Lekcja 2: Detekcja obiektów z YOLO
INSERT INTO lessons (course_id, title, content, lesson_order)
VALUES (
    (SELECT id FROM courses WHERE title = 'Computer Vision: Analiza i Przetwarzanie Obrazów' LIMIT 1),
    'Detekcja obiektów z YOLO',
    '{
        "duration": "70 min",
        "markdown": "# Detekcja obiektów z YOLO\n\n## Co to jest YOLO?\n\n**You Only Look Once (YOLO)** to w pełni konwolucyjna sieć neuronowa do detekcji obiektów:\n- **Szybka** - przetwarza w real-time\n- **Dokładna** - wysokie mAP (mean Average Precision)\n- **Łatwa w użyciu** - prosty API\n\n## Wersje YOLO\n\n| Wersja | Rok | Cechy |\n|---|---|---|\n| **YOLOv5** | 2021 | Najpopularniejsza, PyTorch |\n| **YOLOv8** | 2023 | Najnowsza, SOTA performance |\n| **YOLOv9** | 2024 | Nowe architektury |\n| **YOLO Nano** | 2023 | Dla mobilnych urządzeń |\n\n## Instalacja i użycie\n\n```bash\n# Instalacja\npip install ultralytics\n```\n\n```python\nfrom ultralytics import YOLO\n\n# Wczytaj model\nmodel = YOLO(\\\"yolov8n.pt\\\")  # nano model\n\n# Detektuj obiekty\nresults = model.predict(\\\"image.jpg\\\", conf=0.5)\n\n# Wyświetl wyniki\nfor result in results:\n    boxes = result.boxes\n    for box in boxes:\n        x1, y1, x2, y2 = box.xyxy[0]\n        conf = box.conf[0]\n        cls = box.cls[0]\n        print(f\\\"Obiekt: {cls}, Pewność: {conf:.2%}\\\")\n```\n\n## Modele pre-trained\n\n```python\n# Różne rozmiary\nmodel_n = YOLO(\\\"yolov8n.pt\\\")  # nano - szybko\nmodel_s = YOLO(\\\"yolov8s.pt\\\")  # small\nmodel_m = YOLO(\\\"yolov8m.pt\\\")  # medium\nmodel_l = YOLO(\\\"yolov8l.pt\\\")  # large - dokładnie\n```\n\n## Real-time video\n\n```python\nimport cv2\nfrom ultralytics import YOLO\n\nmodel = YOLO(\\\"yolov8n.pt\\\")\ncap = cv2.VideoCapture(0)\n\nwhile True:\n    ret, frame = cap.read()\n    results = model(frame, conf=0.5)\n    \n    annotated_frame = results[0].plot()\n    cv2.imshow(\\\"YOLO Detection\\\", annotated_frame)\n    \n    if cv2.waitKey(1) & 0xFF == ord(\\\"q\\\"):\n        break\n\ncap.release()\ncv2.destroyAllWindows()\n```\n\n## 📝 Ćwiczenie\n\nUruchom YOLO na wideo i zliczy liczbę osób, samochodów i psów na każdej klatce."
    }'::jsonb,
    2
);

-- Lekcja 3: Face Recognition i zaawansowane techniki
INSERT INTO lessons (course_id, title, content, lesson_order)
VALUES (
    (SELECT id FROM courses WHERE title = 'Computer Vision: Analiza i Przetwarzanie Obrazów' LIMIT 1),
    'Face Recognition i zaawansowane techniki',
    '{
        "duration": "75 min",
        "markdown": "# Face Recognition i zaawansowane techniki\n\n## Rozpoznawanie twarzy - kroki\n\n```\n1. Detekcja twarzy - znalezienie twarzy w obrazie\n2. Alignment - wyrównanie twarzy\n3. Feature extraction - wyodrębnienie cech\n4. Matching - porównanie z bazą\n5. Verification/Identification - potwierdzenie tożsamości\n```\n\n## Popularne biblioteki\n\n| Biblioteka | Opis |\n|---|---|\n| **face_recognition** | Najprostsza w użyciu |\n| **DeepFace** | Wiele backendów, dokładna |\n| **InsightFace** | Zaawansowana, szybka |\n| **MediaPipe** | Google, real-time |\n\n## Przykład z face_recognition\n\n```python\nimport face_recognition\nimport cv2\n\n# Załaduj obrazy\nknown_image = face_recognition.load_image_file(\\\"pozna_osoba.jpg\\\")\nunknown_image = face_recognition.load_image_file(\\\"nieznana_osoba.jpg\\\")\n\n# Koduj twarze\nknown_encoding = face_recognition.face_encodings(known_image)[0]\nunknown_encoding = face_recognition.face_encodings(unknown_image)[0]\n\n# Porównaj\nresults = face_recognition.compare_faces(\n    [known_encoding], \n    unknown_encoding\n)\n\nprint(f\\\"Czy to ta sama osoba? {results[0]}\\\")\n```\n\n## Segmentacja obrazów (Semantic)\n\n```python\nfrom torchvision import models\n\n# Załaduj model\nmodel = models.segmentation.fcn_resnet50(pretrained=True)\n\n# Predykcja\noutput = model(input_tensor)\nsegmentation_map = output[\\\"out\\\"].argmax(1)\n```\n\n## Etyka i bezpieczeństwo\n\n⚠️ **Ważne zagadnienia:**\n- Bias w modelach rozpoznawania twarzy\n- Prywatność i GDPR\n- Oświadczenie zgody użytkownika\n- Transparent use cases\n- Audit systemów regularnie\n\n## Aplikacje praktyczne\n\n- ✅ Bezpieczeństwo i monitoring\n- ✅ Selfie verification\n- ✅ Attendance system\n- ✅ Criminal identification\n- ✅ Age verification\n\n## 📝 Ćwiczenie\n\nUtwórz system attendance na bazie Face Recognition - poznaj uczestników na starcie i automatycznie rejestruj ich obecność na wideo."
    }'::jsonb,
    3
);

-- ============ KURS VIBE CODING – METODA ADAM CODING ============
INSERT INTO courses (title, description, price_cents, category, difficulty, instructor)
VALUES
(
    'Vibe Coding: Programowanie z AI metodą Adam Coding',
    'Poznaj nowy paradygmat programowania, w którym to AI pisze kod, a Ty nadajesz kierunek. Vibe coding pozwala tworzyć aplikacje opisując jedynie intencje. Kurs zawiera humorystyczne wstawki o Adamie, który zawsze twierdzi, że zrobiłby to lepiej.',
    99900,
    'AI',
    'Beginner',
    'Prof dr hab. Adam Paśniewski'
);

-- Lekcja 1: Wprowadzenie do Vibe Coding
INSERT INTO lessons (course_id, title, content, lesson_order)
VALUES (
    (SELECT id FROM courses WHERE title = 'Vibe Coding: Programowanie z AI metodą Adam Coding' LIMIT 1),
    'Wprowadzenie do Vibe Coding',
    '{
        "duration": "45 min",
        "markdown": "# Wprowadzenie do Vibe Coding\n\n## Czym jest vibe coding?\n\n**Vibe coding** to paradygmat programowania, w którym:\n- opisujesz problem w kilku zdaniach,\n- AI generuje kod,\n- Ty kierujesz, testujesz i poprawiasz,\n- a Adam z boku mówi: *„Ja bym to zrobił w 3 linijkach.”*\n\nTo programowanie oparte na **intencjach**, nie na składni.\n\n## Dlaczego vibe coding powstał?\n\nTermin wprowadził **Andrej Karpathy (2025)**, zauważając, że:\n- modele językowe potrafią pisać kod szybciej niż człowiek,\n- programista staje się *reżyserem*, nie *maszynistą*,\n- próg wejścia do tworzenia oprogramowania drastycznie spada.\n\nAdam twierdzi, że on to przewidział już w 2017, ale nie ma na to dowodów.\n\n## Główne założenia\n\n| Koncepcja | Opis |\n|---|---|\n| **Prompt-first** | Najpierw opisujesz, potem kod powstaje sam |\n| **Iteracyjne poprawki** | „Popraw to”, „dodaj logikę”, „zrób ładniej” |\n| **AI jako partner** | Nie narzędzie, ale współprogramista |\n| **Flow & vibe** | Kod powstaje w rytmie Twojej myśli |\n\n## Przykład vibe codingu\n\n```text\nUżytkownik: Zrób mi API do listy zadań z endpointami CRUD.\nAI: Jasne, oto gotowy serwer Express z MongoDB.\nAdam: A gdzie walidacja? Ja bym zrobił lepiej.\n```\n\n## 📝 Ćwiczenie\n\nOpisz w 3 zdaniach aplikację, którą chcesz stworzyć. Nie używaj żadnego kodu. Tylko vibe."
    }'::jsonb,
    1
);

-- Lekcja 2: Metoda Adam Coding
INSERT INTO lessons (course_id, title, content, lesson_order)
VALUES (
    (SELECT id FROM courses WHERE title = 'Vibe Coding: Programowanie z AI metodą Adam Coding' LIMIT 1),
    'Metoda Adam Coding',
    '{
        "duration": "60 min",
        "markdown": "# Metoda Adam Coding\n\n## Kim jest Adam?\n\nNikt nie wie.\n\nAle w vibe codingu „Adam Coding” oznacza:\n- minimalizm,\n- maksymalną pewność siebie,\n- oraz nieustanne powtarzanie, że *„da się prościej”*.\n\n## Zasady Adam Coding\n\n| Zasada | Opis |\n|---|---|\n| **1. Najpierw vibe, potem kod** | Nie zaczynaj od technologii, tylko od intencji |\n| **2. Kod ma być prosty** | Jeśli AI generuje 200 linii, poproś o 20 |\n| **3. Iteruj bez litości** | „Zrób to czytelniej”, „zrób to szybciej”, „zrób to jak Adam” |\n| **4. Nie bój się mówić AI, że się myli** | AI nie ma ego, Adam ma |\n\n## Przykład promptu w stylu Adam Coding\n\n```text\nZrób mi prosty backend do notatek. Tylko najważniejsze funkcje. Zero zbędnych rzeczy. Adam style.\n```\n\nAI odpowie kodem, a Ty iterujesz, aż poczujesz vibe.\n\n## Typowy workflow\n\n```\n1. Opisz problem w 1–3 zdaniach\n2. AI generuje kod\n3. Ty testujesz\n4. Mówisz AI: „popraw”, „dodaj”, „uproszcz”\n5. Adam mówi: „ja bym to zrobił w Rust”\n```\n\n## 📝 Ćwiczenie\n\nNapisz prompt w stylu Adam Coding do stworzenia mini-aplikacji, która rozwiązuje Twój codzienny problem."
    }'::jsonb,
    2
);

-- Lekcja 3: Praktyka vibe codingu z AI
INSERT INTO lessons (course_id, title, content, lesson_order)
VALUES (
    (SELECT id FROM courses WHERE title = 'Vibe Coding: Programowanie z AI metodą Adam Coding' LIMIT 1),
    'Praktyka vibe codingu z AI',
    '{
        "duration": "70 min",
        "markdown": "# Praktyka vibe codingu z AI\n\n## Jak pracować z AI w vibe codingu?\n\n### 1. Opisuj intencje, nie implementacje\nZamiast:\n```text\nNapisz mi funkcję w Pythonie, która iteruje po liście i filtruje wartości.\n```\nPowiedz:\n```text\nChcę funkcję, która zwróci tylko ważne elementy listy.\n```\nAdam dodałby: „ważne, czyli jakie?”, ale to już Twój vibe.\n\n### 2. Używaj języka naturalnego\nAI rozumie:\n- „zrób to szybciej”,\n- „ładniej”,\n- „bardziej jak senior dev”,\n- „mniej jak Adam”.\n\n### 3. Iteruj aż poczujesz flow\nKażda iteracja to nowy vibe.\n\n## Przykład pełnego procesu\n\n```text\nUżytkownik: Zrób mi prostą aplikację do budżetu domowego.\nAI: (generuje kod)\nUżytkownik: Dodaj wykresy.\nAI: (dodaje)\nUżytkownik: Zrób UI bardziej aesthetic.\nAI: (poprawia)\nAdam: A gdzie dark mode?\n```\n\n## Najczęstsze błędy\n\n| Błąd | Jak naprawić |\n|---|---|\n| Zbyt techniczny prompt | Uprość język |\n| Za dużo szczegółów | Pozwól AI zaproponować rozwiązanie |\n| Brak iteracji | Poprawiaj, aż będzie dobrze |\n| Słuchanie Adama | Nie rób tego |\n\n## 📝 Ćwiczenie\n\nWybierz dowolny projekt i przeprowadź 5 iteracji vibe codingu. Zapisz, jak zmieniały się Twoje intencje."
    }'::jsonb,
    3
);
