const axios = require("axios");
const ExcelJS = require("exceljs");

const API_BASE_V1 = "https://api-zone01-rouen.deno.dev/api/v1";
const API_BASE = `${API_BASE_V1}/promotions`;

const promotions = [
    {promoId: 32, name: "P1 2022"},
    {promoId: 148, name: "P1 2023"},
    {promoId: 216, name: "P2 2023"},
];

const projectsOrder = [
    "Go-reloaded",
    "Ascii-art",
    "Ascii-art-web",
    "Groupie-tracker",
    "Lem-in",
    "Forum",
    "Make-your-game",
    "Real-Time-Forum",
    "GraphQL",
    "Social-Network",
    "Mini-Framework",
    "Bomberman-Dom",

    // Rust
    "Smart-Road",
    "Filler",
    "RT",
    "Multiplayer-FPS",
    "0-shell",

    // Java
    "Lets-Play",
    "Angul-It",
    "Buy-01",
    "MR-Jenk",
    "Safe-Zone",
    "Buy-02",
    "Nexus",
    "Neo-4-Flix",
    "Travel-Plan",
    "Lets-Travel",
];

const optionalProjects = [
    "0-Shell-Scripting",
    "0-Shell-Job-Control",
    "Social-Network-Cross-Platform-Appimage",
    "Real-Time-Forum-Typing-In-Progress",
    "Make-Your-Game-Different-Maps",
    "Make-Your-Game-History",
    "Make-Your-Game-Score-Handling",
    "Forum-Advanced-Features",
    "Forum-Advanced-Moderation",
    "Forum-Advanced-Security",
    "Forum-Advanced-Image-Upload",
    "Forum-Authentication",
    "Groupie-Tracker-Search-Bar",
    "Groupie-Tracker-Visualizations",
    "Groupie-Tracker-Geolocalization",
    "Groupie-Tracker-Filters",
    "Ascii-Art-Web-Export-File",
    "Ascii-Art-Web-Dockerize",
    "Ascii-Art-Web-Stylize",
    "Ascii-Art-Reverse",
    "Ascii-Art-Justify",
    "Ascii-Art-Fs",
    "Ascii-Art-Output",
    "Ascii-Art-Color",
];

const additionalProjects = [
    "Math-Skills",
    "Guess-It-1",
    "Linear-Stats",
    "Guess-It-2",
    "Tetris-Optimizer",
    "ATM-Management-System",
    "Push-Swap",
    "My-LS-1",
    "Net-Cat",
    "Stock-Exchange-Sim",
    "Mister-Quiz",
    "Shop",
    "Netfix",
    "Linux",
    "Login",
    "Add-VM",
    "Connect",
    "Remote",
    "Scan",
    "Wget",
    "System-Monitor",
    "Zappy",
    "Corewar",
    "Make-Your-Own",
    "Kaggle-Titanic",
    "NLP-Scrapper",
    "Emotions-Detector",
    "SP500-Strategies",
    "Credit-Scoring",
    "Firing-Range",
    "Widget-Factory",
    "Army-Of-One",
    "Vehicle-Physics",
    "Zombie-AI",
    "Nascar-Online-Alpha",
    "Mouse-VR",
    "The-Pages",
    "Stealth-Boom",
    "Jumpo",
    "Twenty-Forty-Eight",
    "Sky-Map",
    "Chess",
    "Kaquiz",
    "Stock-Market",
    "Secure-Messenger",
    "Passive",
    "Inspector-Image",
    "Active",
    "Local",
    "Web-Hack",
    "Injector",
    "Hole-In-Bin",
    "Mal-Track",
    "Evasion",
    "Obfuscator",
    "Malware",
    "NFT-Marketplace",
    "Payment-Channel",
    "Node-Dashboard",
    "Financial-Instruments",
    "Deep-In-Net",
    "Deep-In-System",
    "Crud-Master",
    "Play-With-Container",
    "Orchestrator",
    "Cloud-Design",
    "Code-Keeper",
    "Formation-Git",
    "Atelier-Softskill",
    "Formation-Reseau",
    "Atelier-Photo",
    "Atelier-Certification",
    "Atelier-Pitch",
    "Job-Dating",
    "Atelier-Hardskills",
    "Create-Your-Portfolio",
];

const rustTrack = [
    "Smart-Road",
    "Filler",
    "RT",
    "Multiplayer-FPS",
    "0-shell",
];

const javaTrack = [
    "Lets-Play",
    "Angul-It",
    "Buy-01",
    "MR-Jenk",
    "Safe-Zone",
    "Buy-02",
    "Nexus",
    "Neo-4-Flix",
    "Travel-Plan",
    "Lets-Travel",
];

function normalizeProjectName(name) {
    return name?.toLowerCase().trim();
}

// For each optional, find the main project whose normalized name is the longest prefix of the optional
function buildOptionalToMainMapping() {
    const mapping = {};
    for (const opt of optionalProjects) {
        const optNorm = normalizeProjectName(opt);
        let bestMatch = null;
        let bestMatchLen = 0;
        for (const main of projectsOrder) {
            const mainNorm = normalizeProjectName(main);
            if (optNorm.startsWith(mainNorm) && mainNorm.length > bestMatchLen) {
                bestMatch = main;
                bestMatchLen = mainNorm.length;
            }
        }
        mapping[opt] = bestMatch;
    }
    return mapping;
}

function groupOptionalsByMain() {
    const mapping = buildOptionalToMainMapping();
    const byMain = {};
    const unmapped = [];
    for (const opt of optionalProjects) {
        const main = mapping[opt];
        if (main) {
            if (!byMain[main]) byMain[main] = [];
            byMain[main].push(opt);
        } else {
            unmapped.push(opt);
        }
    }
    return {byMain, unmapped};
}

function formatDate(date) {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatDuration(ms) {
    if (!ms || ms < 0) return "";
    const totalHours = Math.floor(ms / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    return days > 0 ? `${days}j ${hours}h` : `${hours}h`;
}

function getProjectStatus(setupDate, workingDate, auditDate, finishedDate) {
    if (finishedDate) return "Finished";
    if (auditDate) return "Audit";
    if (workingDate || setupDate) return "In Progress";
    return "";
}

async function fetchPromotionData(eventId) {
    const response = await axios.get(`${API_BASE}/${eventId}/students`);
    return response.data.progress;
}

async function fetchOptionalData(eventId) {
    const response = await axios.get(`${API_BASE}/${eventId}/students/optionals`);
    return response.data.progress;
}

async function fetchAdditionalData(eventId) {
    const response = await axios.get(`${API_BASE}/${eventId}/students/additionals`);
    return response.data.progress;
}

async function fetchToadSessions() {
    const response = await axios.get(`${API_BASE_V1}/toad/sessions`);
    return response.data.toad_sessions;
}

async function fetchPiscineProgress() {
    const response = await axios.get(`${API_BASE_V1}/piscine/progress`);
    return response.data.progress;
}

function buildToadMap(toadSessions) {
    const map = {};
    for (const session of toadSessions) {
        const login = session.candidate?.login;
        if (!login) continue;
        if (!map[login]) map[login] = {};
        for (const game of session.games || []) {
            const gameName = game.name;
            const level = game.results?.[0]?.level ?? null;
            if (level !== null) {
                if (map[login][gameName] === undefined || level > map[login][gameName]) {
                    map[login][gameName] = level;
                }
            }
        }
    }
    return map;
}

function getAllToadGames(toadSessions) {
    const games = new Set();
    for (const session of toadSessions) {
        for (const game of session.games || []) {
            if (game.name) games.add(game.name);
        }
    }
    return [...games].sort();
}

function buildPiscineMap(piscineProgress) {
    const map = {};
    for (const entry of piscineProgress) {
        const login = entry.user?.login;
        if (!login) continue;
        if (map[login] === undefined || entry.grade > map[login]) {
            map[login] = entry.grade;
        }
    }
    return map;
}

function processEntries(entries, students) {
    for (const entry of entries) {
        const login = entry.user.login;
        const projectName = normalizeProjectName(entry.object.name);
        const group = entry.group;
        if (!group) continue;

        if (!students[login]) {
            students[login] = {
                projects: {},
                track: "",
                firstName: entry.user.firstName || "",
                lastName: entry.user.lastName || ""
            };
        }

        const setupDate = group.createdAt ? new Date(group.createdAt) : null;
        let workingDate = group.startedWorkingAt ? new Date(group.startedWorkingAt) : null;
        const finishedDate = group.results?.[0]?.createdAt ? new Date(group.results[0].createdAt) : null;

        if (!workingDate || (finishedDate && workingDate > finishedDate)) {
            workingDate = setupDate;
        }

        const validAudits = group.auditors
            .filter(a => a.auditedAt)
            .map(a => new Date(a.auditedAt))
            .filter(d => (!setupDate || d >= setupDate) && (!finishedDate || d <= finishedDate))
            .sort((a, b) => a - b);

        const auditDate = validAudits.length ? validAudits[validAudits.length - 1] : null;

        students[login].projects[projectName] = {
            setup: setupDate,
            working: workingDate,
            audit: auditDate,
            finished: finishedDate,
        };
    }
}

function buildStudentMap(progress, optProgress = [], addProgress = []) {
    const students = {};

    processEntries(progress, students);
    processEntries(optProgress, students);
    processEntries(addProgress, students);

    for (const login in students) {
        const studentProjects = Object.keys(students[login].projects);
        const didRust = studentProjects.some(p => rustTrack.map(normalizeProjectName).includes(p));
        const didJava = studentProjects.some(p => javaTrack.map(normalizeProjectName).includes(p));

        if (didRust) students[login].track = "Rust";
        else if (didJava) students[login].track = "Java";
    }

    return students;
}

function buildProjectColumns(project) {
    return [
        {header: `${project} - Status`, key: `${project}_status`, width: 14},
        {header: `${project} - Setup`, key: `${project}_setup`, width: 18},
        {header: `${project} - In Progress`, key: `${project}_working`, width: 18},
        {header: `${project} - Audit`, key: `${project}_audit`, width: 18},
        {header: `${project} - Finished`, key: `${project}_finished`, width: 18},
        {header: `${project} - Durée Total`, key: `${project}_duration_total`, width: 14},
        {header: `${project} - Setup → In Prog.`, key: `${project}_duration_setup_work`, width: 14},
        {header: `${project} - In Prog. → Audit`, key: `${project}_duration_work_audit`, width: 14},
        {header: `${project} - Audit → Finished`, key: `${project}_duration_audit_finished`, width: 14},
    ];
}

function fillProjectRow(row, project, studentProjects) {
    const data = studentProjects[normalizeProjectName(project)];

    const setupDate = data?.setup || null;
    const workingDate = data?.working || null;
    const auditDate = data?.audit || null;
    const finishedDate = data?.finished || null;

    row[`${project}_status`] = getProjectStatus(setupDate, workingDate, auditDate, finishedDate);
    row[`${project}_setup`] = formatDate(setupDate);
    row[`${project}_working`] = formatDate(workingDate);
    row[`${project}_audit`] = formatDate(auditDate);
    row[`${project}_finished`] = formatDate(finishedDate);

    row[`${project}_duration_total`] =
        setupDate && finishedDate && finishedDate >= setupDate
            ? formatDuration(finishedDate - setupDate)
            : "";

    row[`${project}_duration_setup_work`] =
        setupDate && workingDate && workingDate >= setupDate
            ? formatDuration(workingDate - setupDate)
            : "";

    row[`${project}_duration_work_audit`] =
        workingDate && auditDate && auditDate >= workingDate
            ? formatDuration(auditDate - workingDate)
            : "";

    row[`${project}_duration_audit_finished`] =
        auditDate && finishedDate && finishedDate >= auditDate
            ? formatDuration(finishedDate - auditDate)
            : "";
}

function createSheet(workbook, promoName, students, toadMap, toadGames, piscineMap) {
    const sheet = workbook.addWorksheet(promoName);

    const columns = [
        {header: "Login", key: "login", width: 20},
        {header: "Prénom", key: "firstName", width: 16},
        {header: "Nom", key: "lastName", width: 16},
    ];

    for (const game of toadGames) {
        columns.push({header: `Toad - ${game}`, key: `toad_${game}`, width: 14});
    }

    columns.push({header: "Piscine Go", key: "piscine_go", width: 14});
    columns.push({header: "Track", key: "track", width: 12});

    const {byMain, unmapped} = groupOptionalsByMain();

    for (const project of projectsOrder) {
        columns.push(...buildProjectColumns(project));
        for (const opt of byMain[project] || []) {
            columns.push(...buildProjectColumns(opt));
        }
    }

    for (const opt of unmapped) {
        columns.push(...buildProjectColumns(opt));
    }

    for (const add of additionalProjects) {
        columns.push(...buildProjectColumns(add));
    }

    sheet.columns = columns;

    for (const login of Object.keys(students).sort()) {
        const row = {
            login,
            firstName: students[login].firstName,
            lastName: students[login].lastName,
            track: students[login].track
        };

        const toadData = toadMap[login] || {};
        for (const game of toadGames) {
            row[`toad_${game}`] = toadData[game] !== undefined ? toadData[game] : "";
        }

        row["piscine_go"] = piscineMap[login] !== undefined ? piscineMap[login] : "";

        for (const project of projectsOrder) {
            fillProjectRow(row, project, students[login].projects);
            for (const opt of byMain[project] || []) {
                fillProjectRow(row, opt, students[login].projects);
            }
        }

        for (const opt of unmapped) {
            fillProjectRow(row, opt, students[login].projects);
        }

        for (const add of additionalProjects) {
            fillProjectRow(row, add, students[login].projects);
        }

        sheet.addRow(row);
    }
}

async function main() {
    const workbook = new ExcelJS.Workbook();

    console.log("Fetching toad sessions...");
    const toadSessions = await fetchToadSessions();
    const toadMap = buildToadMap(toadSessions);
    const toadGames = getAllToadGames(toadSessions);

    console.log("Fetching piscine progress...");
    const piscineProgress = await fetchPiscineProgress();
    const piscineMap = buildPiscineMap(piscineProgress);

    for (const promo of promotions) {
        console.log(`Processing ${promo.name}`);
        const progress = await fetchPromotionData(promo.promoId);
        const optProgress = await fetchOptionalData(promo.promoId);
        const addProgress = await fetchAdditionalData(promo.promoId);
        const students = buildStudentMap(progress, optProgress, addProgress);
        createSheet(workbook, promo.name, students, toadMap, toadGames, piscineMap);
    }

    await workbook.xlsx.writeFile("all_promotions_clean.xlsx");
    console.log("Fichier genere : all_promotions_clean.xlsx");
}

main();
