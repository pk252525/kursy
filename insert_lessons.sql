-- Inserowanie lekcji dla kursu "Kurs Cisco"
-- Zakładam, że course_id zostanie podstawione lub użyjesz subquery

-- Lekcja 1: Wprowadzenie do Pythona
INSERT INTO lessons (course_id, title, content, lesson_order)
VALUES (
    (SELECT id FROM courses WHERE title = 'Kurs Cisco' LIMIT 1),
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
    (SELECT id FROM courses WHERE title = 'Kurs Cisco' LIMIT 1),
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
    (SELECT id FROM courses WHERE title = 'Kurs Cisco' LIMIT 1),
    'Zmienne i typy danych',
    '{
        "duration": "60 min",
        "markdown": "# Zmienne i typy danych\n\n## Czym są zmienne?\n\nZmienne to **pojemniki na dane**. W Pythonie nie musisz deklarować typu zmiennej - jest on automatycznie wykrywany.\n\n## Tworzenie zmiennych\n\n```python\n# Liczby całkowite\nwiek = 25\n\n# Liczby zmiennoprzecinkowe\ncena = 19.99\n\n# Teksty (stringi)\nimie = \"Jan\"\n\n# Wartości logiczne\nczy_student = True\n```\n\n## Podstawowe typy danych\n\nPython ma kilka wbudowanych typów danych:\n\n| Typ | Nazwa | Przykład |\n|-----|-------|----------|\n| `int` | Liczby całkowite | `42` |\n| `float` | Liczby zmiennoprzecinkowe | `3.14` |\n| `str` | Teksty | `\"Hello\"` |\n| `bool` | Wartości logiczne | `True`, `False` |\n| `list` | Listy | `[1, 2, 3]` |\n| `dict` | Słowniki | `{\"klucz\": \"wartość\"}` |\n\n## Operacje na zmiennych\n\n```python\na = 10\nb = 5\n\n# Dodawanie\nsuma = a + b  # 15\n\n# Mnożenie\niloczyn = a * b  # 50\n\n# Łączenie stringów\npowitanie = \"Cześć \" + \"świecie!\"  # \"Cześć świecie!\"\n```\n\n## 📝 Ćwiczenie\n\nStwórz zmienne przechowujące:\n- Twoje imię\n- Twój wiek\n- Ulubiony kolor\n\nA następnie wyświetl je używając `print()`."
    }'::jsonb,
    3
);

-- Lekcja 4: Operatory i wyrażenia
INSERT INTO lessons (course_id, title, content, lesson_order)
VALUES (
    (SELECT id FROM courses WHERE title = 'Kurs Cisco' LIMIT 1),
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
    (SELECT id FROM courses WHERE title = 'Kurs Cisco' LIMIT 1),
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
    (SELECT id FROM courses WHERE title = 'Kurs Cisco' LIMIT 1),
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
    (SELECT id FROM courses WHERE title = 'Kurs Cisco' LIMIT 1),
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
    (SELECT id FROM courses WHERE title = 'Kurs Cisco' LIMIT 1),
    'Funkcje w Pythonie',
    '{
        "duration": "70 min",
        "markdown": "# Funkcje w Pythonie\n\n## Czym są funkcje?\n\nFunkcje to **bloki kodu**, które wykonują określone zadanie. Pozwalają:\n- Uniknąć powtarzania kodu\n- Lepiej organizować kod\n- Ułatwić testowanie\n- Zwiększyć czytelność\n\n## Definiowanie funkcji\n\n```python\ndef powitanie():\n    print(\"Witaj w Pythonie!\")\n\n# Wywołanie funkcji\npowitanie()\n```\n\n## Parametry funkcji\n\nFunkcje mogą **przyjmować parametry** - wartości przekazywane przy wywołaniu.\n\n```python\ndef powitaj(imie):\n    print(f\"Witaj, {imie}!\")\n\npowitaj(\"Anna\")  # Witaj, Anna!\npowitaj(\"Jan\")   # Witaj, Jan!\n```\n\n## Zwracanie wartości\n\nFunkcje mogą **zwracać wartości** używając słowa kluczowego `return`.\n\n```python\ndef dodaj(a, b):\n    return a + b\n\nwynik = dodaj(5, 3)\nprint(wynik)  # 8\n```\n\n## Domyślne wartości parametrów\n\nMożesz określić **domyślne wartości** dla parametrów.\n\n```python\ndef przedstaw_sie(imie, wiek=18):\n    print(f\"Jestem {imie} i mam {wiek} lat\")\n\nprzedstaw_sie(\"Anna\")      # Jestem Anna i mam 18 lat\nprzedstaw_sie(\"Jan\", 25)   # Jestem Jan i mam 25 lat\n```\n\n## 📝 Ćwiczenie\n\nNapisz funkcję `max_z_dwoch(a, b)`, która:\n- Przyjmuje dwie liczby\n- Zwraca większą z nich\n\n```python\ndef max_z_dwoch(a, b):\n    # Twój kod tutaj\n    pass\n\nprint(max_z_dwoch(10, 5))   # Powinno zwrócić 10\nprint(max_z_dwoch(3, 15))   # Powinno zwrócić 15\n```"
    }'::jsonb,
    8
);
