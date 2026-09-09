// Sistema de traducciones
        const translations = {
            es: {
                title: "Glosario Informático",
                selectLevel: "¿Qué tipo de usuario eres?",
                selectLevelDesc: "Elige tu nivel para adaptar las explicaciones",
                basic: "Básico",
                basicDesc: "Nunca he usado un ordenador",
                intermediate: "Intermedio",
                intermediateDesc: "Entiendo algo de informática",
                advanced: "Avanzado",
                advancedDesc: "Tengo conocimientos técnicos",
                changeLevel: "Cambiar Nivel",
                searchPlaceholder: "🔍 Buscar término...",
                viewAll: "Ver Todo",
                quizMode: "Modo Quiz",
                shuffle: "Mezclar",
                whatMeans: "¿Qué significa este término?",
                score: "Puntuación",
                footer: "✨ Aprende informática de forma fácil y divertida ✨",
                clickToSee: "Haz click para ver",
                correct: "¡Muy bien! 🎉",
                wrong: "¡Casi! 😊",
                theAnswerWas: "La respuesta correcta era:"
            },
            en: {
                title: "Computer Glossary",
                selectLevel: "What type of user are you?",
                selectLevelDesc: "Choose your level to adapt the explanations",
                basic: "Basic",
                basicDesc: "I've never used a computer",
                intermediate: "Intermediate",
                intermediateDesc: "I understand some computing",
                advanced: "Advanced",
                advancedDesc: "I have technical knowledge",
                changeLevel: "Change Level",
                searchPlaceholder: "🔍 Search term...",
                viewAll: "View All",
                quizMode: "Quiz Mode",
                shuffle: "Shuffle",
                whatMeans: "What does this term mean?",
                score: "Score",
                footer: "✨ Learn computing easily and fun ✨",
                clickToSee: "Click to see",
                correct: "Very good! 🎉",
                wrong: "Almost! 😊",
                theAnswerWas: "The correct answer was:"
            },
            ca: {
                title: "Glossari Informàtic",
                selectLevel: "Quin tipus d'usuari ets?",
                selectLevelDesc: "Tria el teu nivell per adaptar les explicacions",
                basic: "Bàsic",
                basicDesc: "Mai he fet servir un ordinador",
                intermediate: "Intermedi",
                intermediateDesc: "Entenc una mica d'informàtica",
                advanced: "Avançat",
                advancedDesc: "Tinc coneixements tècnics",
                changeLevel: "Canviar Nivell",
                searchPlaceholder: "🔍 Cercar terme...",
                viewAll: "Veure Tot",
                quizMode: "Mode Quiz",
                shuffle: "Barrejar",
                whatMeans: "Què significa aquest terme?",
                score: "Puntuació",
                footer: "✨ Aprèn informàtica de forma fàcil i divertida ✨",
                clickToSee: "Fes clic per veure",
                correct: "Molt bé! 🎉",
                wrong: "Gairebé! 😊",
                theAnswerWas: "La resposta correcta era:"
            }
        };

        // Datos del glosario con diferentes niveles
        const glossaryData = {
            basic: [
                {
                    term: "Hardware",
                    emoji: "🖥️",
                    title: {
                        es: "El cuerpo del ordenador",
                        en: "The computer body",
                        ca: "El cos de l'ordinador"
                    },
                    definition: {
                        es: "Es todo lo que puedes tocar con las manos. La pantalla, el teclado, los botones, los cables. Igual que tú tienes un cuerpo con brazos y piernas, el ordenador tiene su 'cuerpo' físico.",
                        en: "Everything you can touch with your hands. The screen, keyboard, buttons, cables. Just like you have a body with arms and legs, the computer has its physical 'body'.",
                        ca: "És tot el que pots tocar amb les mans. La pantalla, el teclat, els botons, els cables. Igual que tu tens un cos amb braços i cames, l'ordinador té el seu 'cos' físic."
                    },
                    color: "from-blue-400 to-blue-600"
                },
                {
                    term: "Software",
                    emoji: "💭",
                    title: {
                        es: "Los pensamientos",
                        en: "The thoughts",
                        ca: "Els pensaments"
                    },
                    definition: {
                        es: "Es todo lo que NO puedes tocar. Son las ideas, reglas o recetas que le dicen al 'cuerpo' qué hacer. Un juego es software: no lo tocas, pero le dice al ordenador cómo funcionar.",
                        en: "Everything you CANNOT touch. They are the ideas, rules or recipes that tell the 'body' what to do. A game is software: you don't touch it, but it tells the computer how to work.",
                        ca: "És tot el que NO pots tocar. Són les idees, regles o receptes que li diuen al 'cos' què fer. Un joc és software: no el toques, però li diu a l'ordinador com funcionar."
                    },
                    color: "from-purple-400 to-purple-600"
                },
                {
                    term: "CPU",
                    emoji: "🧠",
                    title: {
                        es: "El cerebro",
                        en: "The brain",
                        ca: "El cervell"
                    },
                    definition: {
                        es: "Es una pieza pequeña escondida dentro. Es el cerebro que piensa rapidísimo y toma decisiones: 'ahora pinta esto', 'ahora suena esto'. Sin la CPU, el ordenador sería un cuerpo sin cabeza.",
                        en: "It's a small piece hidden inside. It's the brain that thinks super fast and makes decisions: 'now paint this', 'now play this sound'. Without the CPU, the computer would be a body without a head.",
                        ca: "És una peça petita amagada a dins. És el cervell que pensa rapidíssim i pren decisions: 'ara pinta això', 'ara sona això'. Sense la CPU, l'ordinador seria un cos sense cap."
                    },
                    color: "from-green-400 to-green-600"
                },
                {
                    term: "Memoria RAM",
                    emoji: "🪑",
                    title: {
                        es: "La mesa de trabajo",
                        en: "The work table",
                        ca: "La taula de treball"
                    },
                    definition: {
                        es: "Imagina que haces un puzzle. La RAM es la MESA donde tienes las piezas que usas AHORA. Es rápida, pero cuando apagas el ordenador, la mesa se limpia y queda vacía.",
                        en: "Imagine you're doing a puzzle. RAM is the TABLE where you have the pieces you're using NOW. It's fast, but when you turn off the computer, the table gets cleaned and becomes empty.",
                        ca: "Imagina que fas un puzle. La RAM és la TAULA on tens les peces que fas servir ARA. És ràpida, però quan apagues l'ordinador, la taula es neteja i queda buida."
                    },
                    color: "from-yellow-400 to-yellow-600"
                },
                {
                    term: "Memoria de Disco",
                    emoji: "🗄️",
                    title: {
                        es: "El armario",
                        en: "The closet",
                        ca: "L'armari"
                    },
                    definition: {
                        es: "Es donde guardas tus fotos y juguetes para que no se pierdan. Aunque apagues el ordenador, mañana todo seguirá ahí guardadito. Sirve para guardar cosas para siempre.",
                        en: "It's where you keep your photos and toys so they don't get lost. Even if you turn off the computer, tomorrow everything will still be there. It's for keeping things forever.",
                        ca: "És on guardes les teves fotos i joguines perquè no es perdin. Encara que apaguis l'ordinador, demà tot seguirà ahí guardadet. Serveix per guardar coses per sempre."
                    },
                    color: "from-orange-400 to-orange-600"
                },
                {
                    term: "Memoria ROM",
                    emoji: "🧬",
                    title: {
                        es: "Los instintos",
                        en: "The instincts",
                        ca: "Els instints"
                    },
                    definition: {
                        es: "Es como saber respirar o llorar cuando nacemos; ya viene con nosotros. Son instrucciones que nadie puede borrar y le enseñan al ordenador a 'despertar' cada mañana.",
                        en: "It's like knowing how to breathe or cry when we're born; it comes with us. They are instructions that no one can erase and teach the computer to 'wake up' every morning.",
                        ca: "És com saber respirar o plorar quan naixem; ja ve amb nosaltres. Són instruccions que ningú pot esborrar i li ensenyen a l'ordinador a 'despertar' cada matí."
                    },
                    color: "from-red-400 to-red-600"
                },
                {
                    term: "Sistema Operativo",
                    emoji: "👔",
                    title: {
                        es: "El director",
                        en: "The director",
                        ca: "El director"
                    },
                    definition: {
                        es: "Es el JEFE de todos. Organiza a todo el mundo: le dice a la pantalla cuándo encenderse, al ratón cuándo moverse, y a los programas que hagan turno. Sin el jefe, sería un caos.",
                        en: "It's the BOSS of everyone. It organizes everyone: tells the screen when to turn on, the mouse when to move, and the programs to take turns. Without the boss, it would be chaos.",
                        ca: "És el CAP de tots. Organitza tothom: li diu a la pantalla quan encendre's, al ratolí quan moure's, i als programes que facin torn. Sense el cap, seria un caos."
                    },
                    color: "from-indigo-400 to-indigo-600"
                },
                {
                    term: "UEFI",
                    emoji: "⏰",
                    title: {
                        es: "El despertador",
                        en: "The alarm clock",
                        ca: "El despertador"
                    },
                    definition: {
                        es: "Antes de que el jefe empiece a trabajar, el ordenador se despierta. El UEFI es como cuando te levantas: bostezas, estiras, compruebas que tienes manos y pies. Es el primer estiramiento del ordenador.",
                        en: "Before the boss starts working, the computer wakes up. UEFI is like when you get up: you yawn, stretch, check you have hands and feet. It's the computer's first stretch.",
                        ca: "Abans que el cap comenci a treballar, l'ordinador es desperta. L'UEFI és com quan et lleves: badalles, t'estires, comproves que tens mans i peus. És el primer estirament de l'ordinador."
                    },
                    color: "from-pink-400 to-pink-600"
                },
                {
                    term: "GUI",
                    emoji: "🎨",
                    title: {
                        es: "Los dibujos bonitos",
                        en: "The pretty drawings",
                        ca: "Els dibuixos bonics"
                    },
                    definition: {
                        es: "Son los dibujos y botones que ves. Antes había que escribir palabras raras. La GUI inventó los dibujos: una papelera para borrar, una carpeta para guardar. ¡Todo con dibujos!",
                        en: "They are the drawings and buttons you see. Before you had to write strange words. The GUI invented drawings: a trash can to delete, a folder to save. Everything with drawings!",
                        ca: "Són els dibuixos i botons que veus. Abans calia escriure paraules estranyes. La GUI va inventar els dibuixos: una paperera per esborrar, una carpeta per guardar. Tot amb dibuixos!"
                    },
                    color: "from-teal-400 to-teal-600"
                },
                {
                    term: "Driver",
                    emoji: "🗣️",
                    title: {
                        es: "El traductor",
                        en: "The translator",
                        ca: "El traductor"
                    },
                    definition: {
                        es: "Imagina que tu ordenador habla español y compras una impresora que habla japonés. El driver es un librito mágico que les enseña a entenderse y trabajar juntos.",
                        en: "Imagine your computer speaks Spanish and you buy a printer that speaks Japanese. The driver is a magic booklet that teaches them to understand each other and work together.",
                        ca: "Imagina que el teu ordinador parla castellà i compres una impressora que parla japonès. El driver és un llibret màgic que els ensenya a entendre's i treballar junts."
                    },
                    color: "from-cyan-400 to-cyan-600"
                },
                {
                    term: "Periféricos",
                    emoji: "🖐️",
                    title: {
                        es: "Los sentidos",
                        en: "The senses",
                        ca: "Els sentits"
                    },
                    definition: {
                        es: "Son los ojos, oídos y manos del ordenador. El ratón es su mano, los altavoces su boca, la webcam sus ojos, el micrófono sus orejas. Sin ellos, el ordenador estaría solo en su caja.",
                        en: "They are the computer's eyes, ears and hands. The mouse is its hand, the speakers its mouth, the webcam its eyes, the microphone its ears. Without them, the computer would be alone in its box.",
                        ca: "Són els ulls, orelles i mans de l'ordinador. El ratolí és la seva mà, els altaveus la seva boca, la webcam els seus ulls, el micròfon les seves orelles. Sense ells, l'ordinador estaria sol a la seva caixa."
                    },
                    color: "from-lime-400 to-lime-600"
                },
                {
                    term: "USB",
                    emoji: "🔌",
                    title: {
                        es: "El enchufe universal",
                        en: "The universal plug",
                        ca: "L'endoll universal"
                    },
                    definition: {
                        es: "Es una puerta mágica que vale para casi todo: ratón, teclado, cargar el móvil... Da igual la marca, si tiene esa forma, ¡encaja y funciona!",
                        en: "It's a magic door that works for almost everything: mouse, keyboard, charging your phone... It doesn't matter the brand, if it has that shape, it fits and works!",
                        ca: "És una porta màgica que serveix per gairebé tot: ratolí, teclat, carregar el mòbil... Tant se val la marca, si té aquesta forma, encaixa i funciona!"
                    },
                    color: "from-rose-400 to-rose-600"
                }
            ],
            intermediate: [
                {
                    term: "Hardware",
                    emoji: "🖥️",
                    title: {
                        es: "Componentes físicos",
                        en: "Physical components",
                        ca: "Components físics"
                    },
                    definition: {
                        es: "Son todos los componentes físicos y tangibles del ordenador: placa base, procesador, memoria, discos duros, tarjetas gráficas, etc. Es la parte que puedes ver y tocar.",
                        en: "All the physical and tangible components of the computer: motherboard, processor, memory, hard drives, graphics cards, etc. It's the part you can see and touch.",
                        ca: "Són tots els components físics i tangibles de l'ordinador: placa base, processador, memòria, discs durs, targetes gràfiques, etc. És la part que pots veure i tocar."
                    },
                    color: "from-blue-400 to-blue-600"
                },
                {
                    term: "Software",
                    emoji: "💭",
                    title: {
                        es: "Programas y aplicaciones",
                        en: "Programs and applications",
                        ca: "Programes i aplicacions"
                    },
                    definition: {
                        es: "Son los programas, aplicaciones y sistemas que hacen funcionar el hardware. Incluye el sistema operativo, aplicaciones de oficina, juegos, etc. Es el código que ejecuta el procesador.",
                        en: "Programs, applications and systems that make the hardware work. Includes the operating system, office applications, games, etc. It's the code that the processor executes.",
                        ca: "Són els programes, aplicacions i sistemes que fan funcionar el maquinari. Inclou el sistema operatiu, aplicacions d'oficina, jocs, etc. És el codi que executa el processador."
                    },
                    color: "from-purple-400 to-purple-600"
                },
                {
                    term: "CPU",
                    emoji: "🧠",
                    title: {
                        es: "Procesador central",
                        en: "Central processor",
                        ca: "Processador central"
                    },
                    definition: {
                        es: "El procesador central ejecuta las instrucciones de los programas. Realiza cálculos y operaciones lógicas a gran velocidad. Su velocidad se mide en GHz y tiene múltiples núcleos.",
                        en: "The central processor executes program instructions. It performs calculations and logical operations at high speed. Its speed is measured in GHz and it has multiple cores.",
                        ca: "El processador central executa les instruccions dels programes. Realitza càlculs i operacions lògiques a gran velocitat. La seva velocitat es mesura en GHz i té múltiples nuclis."
                    },
                    color: "from-green-400 to-green-600"
                },
                {
                    term: "Memoria RAM",
                    emoji: "🪑",
                    title: {
                        es: "Memoria de acceso aleatorio",
                        en: "Random access memory",
                        ca: "Memòria d'accés aleatori"
                    },
                    definition: {
                        es: "Memoria volátil de alta velocidad donde se cargan los programas en ejecución. Es mucho más rápida que el disco, pero se borra al apagar. Cuanta más RAM, más programas puedes tener abiertos.",
                        en: "High-speed volatile memory where running programs are loaded. It's much faster than disk, but erased when turned off. More RAM means you can have more programs open.",
                        ca: "Memòria volàtil d'alta velocitat on es carreguen els programes en execució. És molt més ràpida que el disc, però s'esborra en apagar. Quanta més RAM, més programes pots tenir oberts."
                    },
                    color: "from-yellow-400 to-yellow-600"
                },
                {
                    term: "Memoria de Disco",
                    emoji: "🗄️",
                    title: {
                        es: "Almacenamiento permanente",
                        en: "Permanent storage",
                        ca: "Emmagatzematge permanent"
                    },
                    definition: {
                        es: "Dispositivo de almacenamiento no volátil donde se guardan el sistema operativo, programas y archivos. Puede ser HDD (mecánico) o SSD (estado sólido, más rápido). Mantiene los datos sin electricidad.",
                        en: "Non-volatile storage device where the operating system, programs and files are stored. It can be HDD (mechanical) or SSD (solid state, faster). Keeps data without electricity.",
                        ca: "Dispositiu d'emmagatzematge no volàtil on es guarden el sistema operatiu, programes i arxius. Pot ser HDD (mecànic) o SSD (estat sòlid, més ràpid). Manté les dades sense electricitat."
                    },
                    color: "from-orange-400 to-orange-600"
                },
                {
                    term: "Memoria ROM",
                    emoji: "🧬",
                    title: {
                        es: "Memoria de solo lectura",
                        en: "Read-only memory",
                        ca: "Memòria de només lectura"
                    },
                    definition: {
                        es: "Memoria no volátil que contiene instrucciones básicas del sistema, como el firmware de la BIOS/UEFI. No se puede modificar fácilmente y mantiene su contenido sin alimentación eléctrica.",
                        en: "Non-volatile memory containing basic system instructions, like BIOS/UEFI firmware. Cannot be easily modified and keeps its content without power.",
                        ca: "Memòria no volàtil que conté instruccions bàsiques del sistema, com el firmware de la BIOS/UEFI. No es pot modificar fàcilment i manté el seu contingut sense alimentació elèctrica."
                    },
                    color: "from-red-400 to-red-600"
                },
                {
                    term: "Sistema Operativo",
                    emoji: "👔",
                    title: {
                        es: "Sistema operativo",
                        en: "Operating system",
                        ca: "Sistema operatiu"
                    },
                    definition: {
                        es: "Software principal que gestiona el hardware y proporciona servicios a las aplicaciones. Controla la memoria, procesos, archivos y dispositivos. Ejemplos: Windows, Linux, macOS.",
                        en: "Main software that manages hardware and provides services to applications. Controls memory, processes, files and devices. Examples: Windows, Linux, macOS.",
                        ca: "Software principal que gestiona el maquinari i proporciona serveis a les aplicacions. Controla la memòria, processos, arxius i dispositius. Exemples: Windows, Linux, macOS."
                    },
                    color: "from-indigo-400 to-indigo-600"
                },
                {
                    term: "UEFI",
                    emoji: "⏰",
                    title: {
                        es: "Firmware moderno de arranque",
                        en: "Modern boot firmware",
                        ca: "Firmware modern d'arrencada"
                    },
                    definition: {
                        es: "Reemplazo moderno de la BIOS antigua. Inicializa el hardware y carga el sistema operativo. Soporta discos grandes, arranque rápido y tiene interfaz gráfica. Es el primer software que se ejecuta.",
                        en: "Modern replacement for old BIOS. Initializes hardware and loads the operating system. Supports large disks, fast boot and has graphical interface. It's the first software to run.",
                        ca: "Reemplaçament modern de la BIOS antiga. Inicialitza el maquinari i carrega el sistema operatiu. Suporta discs grans, arrencada ràpida i té interfície gràfica. És el primer software que s'executa."
                    },
                    color: "from-pink-400 to-pink-600"
                },
                {
                    term: "GUI",
                    emoji: "🎨",
                    title: {
                        es: "Interfaz gráfica de usuario",
                        en: "Graphical user interface",
                        ca: "Interfície gràfica d'usuari"
                    },
                    definition: {
                        es: "Interfaz visual que permite interactuar con el ordenador mediante ventanas, iconos, menús y puntero. Más intuitiva que la línea de comandos. Ejemplo: el escritorio de Windows.",
                        en: "Visual interface that allows interaction with the computer through windows, icons, menus and pointer. More intuitive than command line. Example: Windows desktop.",
                        ca: "Interfície visual que permet interactuar amb l'ordinador mitjançant finestres, icones, menús i punter. Més intuïtiva que la línia de comandes. Exemple: l'escriptori de Windows."
                    },
                    color: "from-teal-400 to-teal-600"
                },
                {
                    term: "Driver",
                    emoji: "🗣️",
                    title: {
                        es: "Controlador de dispositivo",
                        en: "Device driver",
                        ca: "Controlador de dispositiu"
                    },
                    definition: {
                        es: "Software que permite al sistema operativo comunicarse con hardware específico. Traduce las órdenes del sistema operativo al lenguaje del dispositivo. Cada hardware necesita su driver específico.",
                        en: "Software that allows the operating system to communicate with specific hardware. Translates OS commands to device language. Each hardware needs its specific driver.",
                        ca: "Software que permet al sistema operatiu comunicar-se amb maquinari específic. Tradueix les ordres del sistema operatiu al llenguatge del dispositiu. Cada maquinari necessita el seu driver específic."
                    },
                    color: "from-cyan-400 to-cyan-600"
                },
                {
                    term: "Periféricos",
                    emoji: "🖐️",
                    title: {
                        es: "Dispositivos externos",
                        en: "External devices",
                        ca: "Dispositius externs"
                    },
                    definition: {
                        es: "Dispositivos externos conectados al ordenador para entrada/salida de datos. De entrada: teclado, ratón, escáner. De salida: monitor, impresora. Mixtos: pantalla táctil, USB.",
                        en: "External devices connected to the computer for data input/output. Input: keyboard, mouse, scanner. Output: monitor, printer. Mixed: touchscreen, USB.",
                        ca: "Dispositius externs connectats a l'ordinador per entrada/sortida de dades. D'entrada: teclat, ratolí, escàner. De sortida: monitor, impressora. Mixtos: pantalla tàctil, USB."
                    },
                    color: "from-lime-400 to-lime-600"
                },
                {
                    term: "USB",
                    emoji: "🔌",
                    title: {
                        es: "Bus serie universal",
                        en: "Universal serial bus",
                        ca: "Bus sèrie universal"
                    },
                    definition: {
                        es: "Estándar de conexión para periféricos. Permite conectar dispositivos y transferir datos. Versiones: USB 2.0 (480 Mbps), 3.0 (5 Gbps), 3.1 (10 Gbps), USB-C (reversible).",
                        en: "Connection standard for peripherals. Allows connecting devices and transferring data. Versions: USB 2.0 (480 Mbps), 3.0 (5 Gbps), 3.1 (10 Gbps), USB-C (reversible).",
                        ca: "Estàndard de connexió per a perifèrics. Permet connectar dispositius i transferir dades. Versions: USB 2.0 (480 Mbps), 3.0 (5 Gbps), 3.1 (10 Gbps), USB-C (reversible)."
                    },
                    color: "from-rose-400 to-rose-600"
                }
            ],
            advanced: [
                {
                    term: "Hardware",
                    emoji: "🖥️",
                    title: {
                        es: "Arquitectura de hardware",
                        en: "Hardware architecture",
                        ca: "Arquitectura de maquinari"
                    },
                    definition: {
                        es: "Conjunto de componentes electrónicos organizados según la arquitectura de Von Neumann: ALU, UC, memoria, E/S. Incluye CPU, chipset, buses, controladores y periféricos interconectados.",
                        en: "Set of electronic components organized according to Von Neumann architecture: ALU, CU, memory, I/O. Includes CPU, chipset, buses, controllers and interconnected peripherals.",
                        ca: "Conjunt de components electrònics organitzats segons l'arquitectura de Von Neumann: ALU, UC, memòria, E/S. Inclou CPU, chipset, busos, controladors i perifèrics interconnectats."
                    },
                    color: "from-blue-400 to-blue-600"
                },
                {
                    term: "Software",
                    emoji: "💭",
                    title: {
                        es: "Pila de software",
                        en: "Software stack",
                        ca: "Pila de software"
                    },
                    definition: {
                        es: "Capas de abstracción: firmware, kernel, sistema operativo, middleware, aplicaciones. Incluye software de sistema, de utilidad y de aplicación. Se ejecuta mediante instrucciones máquina.",
                        en: "Abstraction layers: firmware, kernel, OS, middleware, applications. Includes system software, utilities and applications. Executes via machine instructions.",
                        ca: "Capes d'abstracció: firmware, kernel, sistema operatiu, middleware, aplicacions. Inclou software de sistema, d'utilitat i d'aplicació. S'executa mitjançant instruccions màquina."
                    },
                    color: "from-purple-400 to-purple-600"
                },
                {
                    term: "CPU",
                    emoji: "🧠",
                    title: {
                        es: "Unidad central de procesamiento",
                        en: "Central processing unit",
                        ca: "Unitat central de processament"
                    },
                    definition: {
                        es: "Microprocesador que ejecuta instrucciones del conjunto ISA (x86, ARM). Contiene ALU, UC, registros y cachés L1/L2/L3. Implementa pipeline, out-of-order execution y branch prediction.",
                        en: "Microprocessor executing ISA instructions (x86, ARM). Contains ALU, CU, registers and L1/L2/L3 caches. Implements pipeline, out-of-order execution and branch prediction.",
                        ca: "Microprocessador que executa instruccions del conjunt ISA (x86, ARM). Conté ALU, UC, registres i cachés L1/L2/L3. Implementa pipeline, out-of-order execution i branch prediction."
                    },
                    color: "from-green-400 to-green-600"
                },
                {
                    term: "Memoria RAM",
                    emoji: "🪑",
                    title: {
                        es: "Memoria volátil DRAM",
                        en: "Volatile DRAM memory",
                        ca: "Memòria volàtil DRAM"
                    },
                    definition: {
                        es: "Memoria dinámica síncrona (DDR4/DDR5) con acceso aleatorio. Latencia ~10ns, ancho de banda ~50 GB/s. Usa condensadores que necesitan refresco. Organizada en canales y ranks.",
                        en: "Synchronous dynamic memory (DDR4/DDR5) with random access. Latency ~10ns, bandwidth ~50 GB/s. Uses capacitors needing refresh. Organized in channels and ranks.",
                        ca: "Memòria dinàmica síncrona (DDR4/DDR5) amb accés aleatori. Latència ~10ns, ample de banda ~50 GB/s. Usa condensadors que necessiten refresc. Organitzada en canals i ranks."
                    },
                    color: "from-yellow-400 to-yellow-600"
                },
                {
                    term: "Memoria de Disco",
                    emoji: "🗄️",
                    title: {
                        es: "Almacenamiento secundario",
                        en: "Secondary storage",
                        ca: "Emmagatzematge secundari"
                    },
                    definition: {
                        es: "HDD: platos magnéticos, ~100 IOPS, ~100 MB/s. SSD NAND: celdas flash, ~100K IOPS, ~3 GB/s. NVMe usa PCIe 4.0/5.0. Jerarquía: registros > caché > RAM > SSD > HDD.",
                        en: "HDD: magnetic platters, ~100 IOPS, ~100 MB/s. NAND SSD: flash cells, ~100K IOPS, ~3 GB/s. NVMe uses PCIe 4.0/5.0. Hierarchy: registers > cache > RAM > SSD > HDD.",
                        ca: "HDD: plats magnètics, ~100 IOPS, ~100 MB/s. SSD NAND: cel·les flash, ~100K IOPS, ~3 GB/s. NVMe usa PCIe 4.0/5.0. Jerarquia: registres > caché > RAM > SSD > HDD."
                    },
                    color: "from-orange-400 to-orange-600"
                },
                {
                    term: "Memoria ROM",
                    emoji: "🧬",
                    title: {
                        es: "Firmware no volátil",
                        en: "Non-volatile firmware",
                        ca: "Firmware no volàtil"
                    },
                    definition: {
                        es: "EEPROM/Flash que almacena firmware POST, UEFI/BIOS, tabla de particiones. Incluye Secure Boot, TPM integration. Actualizable vía flash pero protegido contra escritura en runtime.",
                        en: "EEPROM/Flash storing POST firmware, UEFI/BIOS, partition table. Includes Secure Boot, TPM integration. Updateable via flash but write-protected at runtime.",
                        ca: "EEPROM/Flash que emmagatzema firmware POST, UEFI/BIOS, taula de particions. Inclou Secure Boot, TPM integration. Actualitzable via flash però protegit contra escriptura en runtime."
                    },
                    color: "from-red-400 to-red-600"
                },
                {
                    term: "Sistema Operativo",
                    emoji: "👔",
                    title: {
                        es: "Kernel y sistema operativo",
                        en: "Kernel and operating system",
                        ca: "Kernel i sistema operatiu"
                    },
                    definition: {
                        es: "Kernel (monolítico/microkernel) gestiona procesos, memoria virtual, FS, dispositivos. Modo kernel vs usuario. Syscalls, scheduling, paging. POSIX compliance. Ej: Linux, NT, XNU.",
                        en: "Kernel (monolithic/microkernel) manages processes, virtual memory, FS, devices. Kernel vs user mode. Syscalls, scheduling, paging. POSIX compliance. Ex: Linux, NT, XNU.",
                        ca: "Kernel (monolític/microkernel) gestiona processos, memòria virtual, FS, dispositius. Mode kernel vs usuari. Syscalls, scheduling, paging. POSIX compliance. Ex: Linux, NT, XNU."
                    },
                    color: "from-indigo-400 to-indigo-600"
                },
                {
                    term: "UEFI",
                    emoji: "⏰",
                    title: {
                        es: "Firmware UEFI/PI",
                        en: "UEFI/PI firmware",
                        ca: "Firmware UEFI/PI"
                    },
                    definition: {
                        es: "Spec UEFI reemplaza BIOS legacy. SEC→PEI→DXE→BDS→RT. Soporta GPT, Secure Boot, Network Boot, ACPI. Módulos en FV (Firmware Volumes). Protocolos y PPIs para comunicación.",
                        en: "UEFI spec replaces legacy BIOS. SEC→PEI→DXE→BDS→RT. Supports GPT, Secure Boot, Network Boot, ACPI. Modules in FV (Firmware Volumes). Protocols and PPIs for communication.",
                        ca: "Spec UEFI reemplaça BIOS legacy. SEC→PEI→DXE→BDS→RT. Suporta GPT, Secure Boot, Network Boot, ACPI. Mòduls en FV (Firmware Volumes). Protocols i PPIs per comunicació."
                    },
                    color: "from-pink-400 to-pink-600"
                },
                {
                    term: "GUI",
                    emoji: "🎨",
                    title: {
                        es: "Sistema de ventanas y compositor",
                        en: "Window system and compositor",
                        ca: "Sistema de finestres i compositor"
                    },
                    definition: {
                        es: "X11/Wayland en Linux, DWM en Windows, Quartz en macOS. Gestiona ventanas, eventos, rendering 2D/3D. Compositor usa GPU acceleration. Toolkit: GTK, Qt, WinUI. Event loop y message passing.",
                        en: "X11/Wayland on Linux, DWM on Windows, Quartz on macOS. Manages windows, events, 2D/3D rendering. Compositor uses GPU acceleration. Toolkit: GTK, Qt, WinUI. Event loop and message passing.",
                        ca: "X11/Wayland a Linux, DWM a Windows, Quartz a macOS. Gestiona finestres, esdeveniments, rendering 2D/3D. Compositor usa GPU acceleration. Toolkit: GTK, Qt, WinUI. Event loop i message passing."
                    },
                    color: "from-teal-400 to-teal-600"
                },
                {
                    term: "Driver",
                    emoji: "🗣️",
                    title: {
                        es: "Controlador de dispositivo del kernel",
                        en: "Kernel device driver",
                        ca: "Controlador de dispositiu del kernel"
                    },
                    definition: {
                        es: "Módulo del kernel que implementa interfaz para hardware específico. Character/block devices en Linux. IRP en Windows. DMA, interrupts, MMIO. Model: WDM/KMDF, Linux driver model.",
                        en: "Kernel module implementing interface for specific hardware. Character/block devices in Linux. IRP in Windows. DMA, interrupts, MMIO. Model: WDM/KMDF, Linux driver model.",
                        ca: "Mòdul del kernel que implementa interfície per maquinari específic. Character/block devices a Linux. IRP a Windows. DMA, interrupts, MMIO. Model: WDM/KMDF, Linux driver model."
                    },
                    color: "from-cyan-400 to-cyan-600"
                },
                {
                    term: "Periféricos",
                    emoji: "🖐️",
                    title: {
                        es: "Controladores de E/S y buses",
                        en: "I/O controllers and buses",
                        ca: "Controladors d'E/S i busos"
                    },
                    definition: {
                        es: "Controladores conectados via buses: PCIe, USB, SATA, I²C. Usan DMA para transferencia eficiente. Interrupciones MSI/MSI-X. HID class devices. Polling vs interrupt-driven I/O.",
                        en: "Controllers connected via buses: PCIe, USB, SATA, I²C. Use DMA for efficient transfer. MSI/MSI-X interrupts. HID class devices. Polling vs interrupt-driven I/O.",
                        ca: "Controladors connectats via busos: PCIe, USB, SATA, I²C. Usen DMA per transferència eficient. Interrupcions MSI/MSI-X. HID class devices. Polling vs interrupt-driven I/O."
                    },
                    color: "from-lime-400 to-lime-600"
                },
                {
                    term: "USB",
                    emoji: "🔌",
                    title: {
                        es: "Protocolo USB y controlador host",
                        en: "USB protocol and host controller",
                        ca: "Protocol USB i controlador host"
                    },
                    definition: {
                        es: "Protocolo serial con topología en árbol. Host controller (xHCI). Transacciones: SETUP, IN, OUT. Endpoints y pipes. Classes: HID, Mass Storage, CDC. Power delivery hasta 240W en USB-C.",
                        en: "Serial protocol with tree topology. Host controller (xHCI). Transactions: SETUP, IN, OUT. Endpoints and pipes. Classes: HID, Mass Storage, CDC. Power delivery up to 240W in USB-C.",
                        ca: "Protocol serial amb topologia en arbre. Host controller (xHCI). Transaccions: SETUP, IN, OUT. Endpoints i pipes. Classes: HID, Mass Storage, CDC. Power delivery fins a 240W en USB-C."
                    },
                    color: "from-rose-400 to-rose-600"
                }
            ]
        };

        let currentLanguage = 'es';
        let currentUserLevel = 'basic';
        let currentView = 'grid';
        let score = 0;
        let currentQuestion = null;

        // Inicializar
        document.addEventListener('DOMContentLoaded', () => {
            // Cargar preferencias guardadas
            const savedLang = localStorage.getItem('language') || 'es';
            const savedLevel = localStorage.getItem('userLevel');
            const savedDarkMode = localStorage.getItem('darkMode') === 'true';

            // Aplicar modo oscuro
            if (savedDarkMode) {
                document.documentElement.classList.add('dark');
                updateDarkModeIcon();
            }

            // Aplicar idioma
            currentLanguage = savedLang;
            document.getElementById('languageSelect').value = savedLang;
            applyTranslations();

            // Mostrar modal si no hay nivel guardado
            if (!savedLevel) {
                document.getElementById('userModal').classList.remove('hidden');
            } else {
                currentUserLevel = savedLevel;
                document.getElementById('userModal').classList.add('hidden');
                renderCards();
            }
        });

        // Seleccionar nivel de usuario
        function selectUserLevel(level) {
            currentUserLevel = level;
            localStorage.setItem('userLevel', level);
            document.getElementById('userModal').classList.add('hidden');
            renderCards();
        }

        // Mostrar modal de usuario
        function showUserModal() {
            document.getElementById('userModal').classList.remove('hidden');
        }

        // Cambiar idioma
        function changeLanguage(lang) {
            currentLanguage = lang;
            localStorage.setItem('language', lang);
            applyTranslations();
            renderCards();
        }

        // Aplicar traducciones
        function applyTranslations() {
            const elements = document.querySelectorAll('[data-i18n]');
            elements.forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (translations[currentLanguage][key]) {
                    el.textContent = translations[currentLanguage][key];
                }
            });

            const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
            placeholders.forEach(el => {
                const key = el.getAttribute('data-i18n-placeholder');
                if (translations[currentLanguage][key]) {
                    el.placeholder = translations[currentLanguage][key];
                }
            });
        }

        // Modo oscuro
        function toggleDarkMode() {
            document.documentElement.classList.toggle('dark');
            const isDark = document.documentElement.classList.contains('dark');
            localStorage.setItem('darkMode', isDark);
            updateDarkModeIcon();
        }

        function updateDarkModeIcon() {
            const isDark = document.documentElement.classList.contains('dark');
            document.getElementById('darkModeIcon').textContent = isDark ? '☀️' : '🌙';
        }

        // Renderizar tarjetas
        function renderCard(item) {
            const card = document.createElement('div');
            card.className = 'flip-card';
            card.addEventListener('click', function () { card.classList.toggle('flipped'); });
            const inner = document.createElement('div');
            inner.className = 'flip-card-inner';
            const front = document.createElement('div');
            front.className = 'flip-card-front';
            const emoji = document.createElement('div');
            emoji.textContent = item.emoji;
            const term = document.createElement('h3');
            term.textContent = item.term;
            const hint = document.createElement('p');
            hint.textContent = translations[currentLanguage].clickToSee;
            front.appendChild(emoji); front.appendChild(term); front.appendChild(hint);
            const back = document.createElement('div');
            back.className = 'flip-card-back';
            const title = document.createElement('h4');
            title.textContent = item.title[currentLanguage];
            const def = document.createElement('p');
            def.textContent = item.definition[currentLanguage];
            back.appendChild(title); back.appendChild(def);
            inner.appendChild(front); inner.appendChild(back);
            card.appendChild(inner);
            return card;
        }

        function renderCards() {
            const data = glossaryData[currentUserLevel];
            const grid = document.getElementById('gridView');
            while (grid.firstChild) grid.removeChild(grid.firstChild);
            data.forEach(function (item) { grid.appendChild(renderCard(item)); });
        }

        // Buscador
        document.getElementById('searchInput').addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const data = glossaryData[currentUserLevel];
            const filtered = data.filter(item => 
                item.term.toLowerCase().includes(term) || 
                item.definition[currentLanguage].toLowerCase().includes(term) ||
                item.title[currentLanguage].toLowerCase().includes(term)
            );
            
            const grid = document.getElementById('gridView');
            while (grid.firstChild) grid.removeChild(grid.firstChild);
            filtered.forEach(function (item) { grid.appendChild(renderCard(item)); });
        });

        // Cambiar vista
        function toggleView(view) {
            currentView = view;
            const gridView = document.getElementById('gridView');
            const quizView = document.getElementById('quizView');
            const btnGrid = document.getElementById('btnGrid');
            const btnQuiz = document.getElementById('btnQuiz');

            if (view === 'grid') {
                gridView.classList.remove('hidden');
                quizView.classList.add('hidden');
                btnGrid.classList.add('bg-blue-500', 'text-white');
                btnGrid.classList.remove('bg-gray-300', 'dark:bg-gray-700', 'text-gray-600', 'dark:text-gray-300');
                btnQuiz.classList.remove('bg-purple-500', 'text-white');
                btnQuiz.classList.add('bg-gray-300', 'dark:bg-gray-700', 'text-gray-600', 'dark:text-gray-300');
            } else {
                gridView.classList.add('hidden');
                quizView.classList.remove('hidden');
                btnQuiz.classList.add('bg-purple-500', 'text-white');
                btnQuiz.classList.remove('bg-gray-300', 'dark:bg-gray-700', 'text-gray-600', 'dark:text-gray-300');
                btnGrid.classList.remove('bg-blue-500', 'text-white');
                btnGrid.classList.add('bg-gray-300', 'dark:bg-gray-700', 'text-gray-600', 'dark:text-gray-300');
                startQuiz();
            }
        }

        // Mezclar tarjetas
        function shuffleCards() {
            const data = [...glossaryData[currentUserLevel]].sort(() => Math.random() - 0.5);
            glossaryData[currentUserLevel] = data;
            renderCards();
        }

        // Quiz
        function startQuiz() {
            score = 0;
            document.getElementById('quizScore').classList.add('hidden');
            nextQuestion();
        }

        function nextQuestion() {
            const data = glossaryData[currentUserLevel];
            const randomIndex = Math.floor(Math.random() * data.length);
            currentQuestion = data[randomIndex];
            
            const wrongOptions = data
                .filter(item => item.term !== currentQuestion.term)
                .sort(() => Math.random() - 0.5)
                .slice(0, 3);
            
            const allOptions = [currentQuestion, ...wrongOptions].sort(() => Math.random() - 0.5);

            const qCard = document.getElementById('questionCard');
            while (qCard.firstChild) qCard.removeChild(qCard.firstChild);
            const qEmoji = document.createElement('div');
            qEmoji.textContent = currentQuestion.emoji;
            const qTerm = document.createElement('h3');
            qTerm.textContent = currentQuestion.term;
            const qHint = document.createElement('p');
            qHint.textContent = translations[currentLanguage].whatMeans;
            qCard.appendChild(qEmoji); qCard.appendChild(qTerm); qCard.appendChild(qHint);

            const answers = document.getElementById('answersGrid');
            while (answers.firstChild) answers.removeChild(answers.firstChild);
            allOptions.forEach(function (option, index) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.textContent = String.fromCharCode(65 + index) + '. ' + option.title[currentLanguage];
                btn.addEventListener('click', function () { checkAnswer(index, option.term); });
                answers.appendChild(btn);
            });

            document.getElementById('quizResult').classList.add('hidden');
        }

        function checkAnswer(selectedIndex, selectedTerm) {
            const isCorrect = selectedTerm === currentQuestion.term;
            const resultDiv = document.getElementById('quizResult');
            const buttons = document.getElementById('answersGrid').children;

            while (resultDiv.firstChild) resultDiv.removeChild(resultDiv.firstChild);
            const box = document.createElement('div');
            box.className = isCorrect ? 'ok-box' : 'bad-box';
            const p1 = document.createElement('p');
            p1.textContent = isCorrect ? translations[currentLanguage].correct : translations[currentLanguage].wrong;
            const p2 = document.createElement('p');
            p2.textContent = isCorrect
              ? currentQuestion.definition[currentLanguage]
              : (translations[currentLanguage].theAnswerWas + ' ' + currentQuestion.title[currentLanguage]);
            box.appendChild(p1); box.appendChild(p2);
            resultDiv.appendChild(box);
            if (isCorrect) score++;

            resultDiv.classList.remove('hidden');
            document.getElementById('scoreValue').textContent = score;
            document.getElementById('quizScore').classList.remove('hidden');

            setTimeout(nextQuestion, 3000);
        }

        document.addEventListener('DOMContentLoaded', function () {
            document.querySelectorAll('[data-level]').forEach(function (btn) {
                btn.addEventListener('click', function () { selectUserLevel(btn.getAttribute('data-level')); });
            });
            document.querySelectorAll('[data-view]').forEach(function (btn) {
                btn.addEventListener('click', function () { toggleView(btn.getAttribute('data-view')); });
            });
            document.querySelectorAll('[data-action="shuffle"]').forEach(function (btn) {
                btn.addEventListener('click', shuffleCards);
            });
            document.querySelectorAll('[data-action="show-user-modal"]').forEach(function (btn) {
                btn.addEventListener('click', showUserModal);
            });
            var darkBtn = document.getElementById('darkModeToggle') || document.getElementById('darkModeToggleBind');
            if (darkBtn) darkBtn.addEventListener('click', toggleDarkMode);
        });
