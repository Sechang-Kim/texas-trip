// app.js
// Texas Trip Planner (Dec 17–21)
// - Day filter changes: only that day's route is emphasized (others dim).
// - Clicking an itinerary item: focuses map on POI + highlights that day's route.
// - POI markers: unified color to reduce visual clutter.

//// ====== Data ======
const places = [
  // Dec 17
  {
    id: "hyatt-las-colinas",
    day: "2025-12-17",
    time: "23:00+",
    title: "Hyatt House Dallas / Las Colinas (도착, 체크인)",
    note: "늦은 도착. 실질 일정 없음.",
    tags: ["sleep"],
    lat: 32.8981,
    lng: -96.9706
  },

  // Dec 18 Dallas
  {
    id: "downtown-dallas",
    day: "2025-12-18",
    time: "10:30–12:30",
    title: "Dallas Uptown ↔ Downtown 전차, 도보 투어",
    note: "Klyde Warren Park, Arts District 외관, West End, Dealey Plaza 외부 중심.",
    tags: ["must"],
    lat: 32.7767,
    lng: -96.797
  },
  {
    id: "aac",
    day: "2025-12-18",
    time: "19:30–21:30",
    title: "NBA: Dallas vs Detroit (American Airlines Center)",
    note: "필수. 18:00 전후 도착 권장.",
    tags: ["must"],
    lat: 32.7905,
    lng: -96.8103
  },
  {
    id: "koreatown-carrollton",
    day: "2025-12-18",
    time: "13:45–15:30",
    title: "Dallas Koreatown (Carrollton) 선택",
    note: "체력 여유 있으면. 차량 없이 비추천.",
    tags: [],
    lat: 32.9756,
    lng: -96.8897
  },

  // Dec 19: Austin + San Antonio
  {
    id: "south-congress",
    day: "2025-12-19",
    time: "12:30–17:30",
    title: "Austin SoCo (South Congress) 자유투어 Or UT Austin도 가능",
    note: "주차 가능, 짧은 체류에도 만족도 높은 구역.",
    tags: ["must"],
    lat: 30.2456,
    lng: -97.7503
  },
  {
    id: "riverwalk",
    day: "2025-12-19",
    time: "20:00–21:30",
    title: "San Antonio River Walk (밤 산책)",
    note: "저녁 식사 겸 산책. 야간 분위기 좋음.",
    tags: ["must"],
    lat: 29.4239,
    lng: -98.4861
  },
  {
    id: "airbnb-valley-pike",
    day: "2025-12-19",
    time: "22:00+",
    title: "AirBnB 숙박 (4226 Valley Pike St)",
    note: "실제 위치임",
    tags: ["sleep"],
    lat: 29.4695,
    lng: -98.468
  },

  // Dec 20: Alamo -> Llano -> Waco -> Fort Worth
  {
    id: "alamo",
    day: "2025-12-20",
    time: "08:30–09:30",
    title: "The Alamo",
    note: "가장 바쁜 날. 빠르게 관람.",
    tags: ["must"],
    lat: 29.426,
    lng: -98.4861
  },
  {
    id: "Llano (Or Fredericksburg)",
    day: "2025-12-20",
    time: "12:00–14:00",
    title: "Llano 읍내 카페",
    note: "읍내 카페 체험: 크리스마스 시즌 영업 확인 필요! -> 어려우면 Fredericksburg 고려",
    tags: [],
    lat: 30.759,
    lng: -98.6756
  },
  {
    id: "dr-pepper",
    day: "2025-12-20",
    time: "16:30–17:30",
    title: "Dr Pepper Museum (Waco)",
    note: "마감이 17:30이니 너무 늦지 않아야 함.",
    tags: ["must"],
    lat: 31.5486,
    lng: -97.1467
  },
  {
    id: "hampton-ftw",
    day: "2025-12-20",
    time: "20:00+",
    title: "Hampton Inn & Suites Fort Worth Downtown (숙박)",
    note: "장거리 운전... 체력 회복!",
    tags: ["sleep"],
    lat: 32.7546,
    lng: -97.332
  },

  // Dec 21: Kimbell -> DFW return
  {
    id: "kimbell",
    day: "2025-12-21",
    time: "09:30–11:30",
    title: "Kimbell Art Museum",
    note: "건축도 관람 포인트. 핵심만 집중.",
    tags: ["must"],
    lat: 32.7491,
    lng: -97.3626
  },
  {
    id: "dfw",
    day: "2025-12-21",
    time: "16:00–17:00",
    title: "DFW Airport (렌트카 반납)",
    note: "체크인 시간을 고려해 여유 있게 이동.",
    tags: ["move"],
    lat: 32.8998,
    lng: -97.0403
  }
];

const daysMeta = [
  { day: "2025-12-17", title: "Dec 17 (Tue)", badge: "Arrival", subtitle: "늦은 도착, 체크인 후 휴식" },
  { day: "2025-12-18", title: "Dec 18 (Wed)", badge: "Dallas", subtitle: "전차 투어 + NBA (필수)" },
  { day: "2025-12-19", title: "Dec 19 (Thu)", badge: "Austin → SA", subtitle: "08:00 렌트, SoCo, Riverwalk" },
  { day: "2025-12-20", title: "Dec 20 (Fri)", badge: "Big Drive", subtitle: "Alamo + Llano + Waco + Fort Worth" },
  { day: "2025-12-21", title: "Dec 21 (Sat)", badge: "Wrap", subtitle: "Kimbell 후 DFW 반납" }
];

// 날짜별 경로(폴리라인). 색상은 날짜를 의미.
const dayRoutes = [
  { day: "2025-12-17", label: "Dec 17 (Arrival)", color: "#ff6b6b", ids: ["hyatt-las-colinas"] },
  { day: "2025-12-18", label: "Dec 18 (Dallas)", color: "#7aa7ff", ids: ["hyatt-las-colinas", "downtown-dallas", "aac", "hyatt-las-colinas"] },
  { day: "2025-12-19", label: "Dec 19 (Austin → San Antonio)", color: "#7ff0c0", ids: ["hyatt-las-colinas", "south-congress", "riverwalk", "airbnb-valley-pike"] },
  { day: "2025-12-20", label: "Dec 20 (SA → Llano → Waco → Fort Worth)", color: "#ffd36e", ids: ["airbnb-valley-pike", "alamo", "llano", "dr-pepper", "hampton-ftw"] },
  { day: "2025-12-21", label: "Dec 21 (Fort Worth → DFW)", color: "#b79bff", ids: ["hampton-ftw", "kimbell", "dfw"] }
];

//// ====== DOM refs ======
const statusEl = document.getElementById("status");
const timelineEl = document.getElementById("timeline");
const qEl = document.getElementById("q");
const dayFilterEl = document.getElementById("dayFilter");
const btnFit = document.getElementById("btnFit");
const btnToggleRoute = document.getElementById("btnToggleRoute");

//// ====== Map init ======
const map = L.map("map", { zoomControl: true }).setView([31.2, -97.4], 6);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

//// ====== Unified POI marker style ======
const POI_COLOR = "#a8b3c5";  // 중립(통일)
const POI_ACTIVE = "#e9eef5"; // 선택 강조

const markerLayer = L.layerGroup().addTo(map);
const markersById = new Map();

function addMarker(place) {
  const m = L.circleMarker([place.lat, place.lng], {
    radius: 6,
    weight: 2,
    opacity: 1,
    fillOpacity: 0.9,
    color: POI_COLOR,
    fillColor: POI_COLOR
  }).addTo(markerLayer);

  const html = `
    <div style="font-family: ui-sans-serif, system-ui; line-height:1.35;">
      <div style="font-weight:700; margin-bottom:4px;">${place.title}</div>
      <div style="color:#60708a; font-size:12px; margin-bottom:6px;">
        ${place.day} · ${place.time}
      </div>
      <div style="font-size:12px;">${place.note || ""}</div>
    </div>
  `;
  m.bindPopup(html, { maxWidth: 320 });

  markersById.set(place.id, m);
}

places.forEach(addMarker);

//// ====== Routes (day-colored) ======
const routeGroup = L.layerGroup().addTo(map);
const routeLayersByDay = new Map(); // day -> polyline

const ROUTE_STYLE = {
  normal: { weight: 5, opacity: 0.85 },
  dim: { weight: 4, opacity: 0.18 },
  focus: { weight: 7, opacity: 1.0 }
};

function getLatLngById(id) {
  const p = places.find(x => x.id === id);
  return p ? [p.lat, p.lng] : null;
}

function buildRoutes() {
  routeGroup.clearLayers();
  routeLayersByDay.clear();

  for (const r of dayRoutes) {
    const latlngs = r.ids.map(getLatLngById).filter(Boolean);

    // 길이가 1이면 "경로"가 아니므로 점선 대신 스킵 (원하면 circle marker로 표시 가능)
    if (latlngs.length < 2) continue;

    const line = L.polyline(latlngs, {
      color: r.color,
      weight: ROUTE_STYLE.normal.weight,
      opacity: ROUTE_STYLE.normal.opacity
    });

    line.bindPopup(
      `<div style="font-family: ui-sans-serif, system-ui; line-height:1.35;">
        <div style="font-weight:700; margin-bottom:4px;">${r.label}</div>
        <div style="font-size:12px; color:#60708a;">날짜별 이동 경로</div>
      </div>`
    );

    line.addTo(routeGroup);
    routeLayersByDay.set(r.day, line);
  }
}

buildRoutes();

//// ====== Legend ======
const legend = L.control({ position: "bottomright" });
legend.onAdd = function () {
  const div = L.DomUtil.create("div", "leaflet-legend");

  const rows = dayRoutes.map(r => `
    <div class="legend-row">
      <span class="legend-swatch" style="background:${r.color}"></span>
      <span class="legend-text">${r.label}</span>
    </div>
  `).join("");

  div.innerHTML = `
    <div class="legend-title">Day Routes</div>
    ${rows}
    <div class="legend-note">Day 필터/일정 클릭 시 해당 날짜 경로만 강조</div>
  `;

  L.DomEvent.disableClickPropagation(div);
  L.DomEvent.disableScrollPropagation(div);
  return div;
};
legend.addTo(map);

//// ====== Route highlight logic ======
function applyRouteStyles(focusDay) {
  if (focusDay === "all") {
    for (const line of routeLayersByDay.values()) {
      line.setStyle({
        weight: ROUTE_STYLE.normal.weight,
        opacity: ROUTE_STYLE.normal.opacity
      });
    }
    return;
  }

  for (const [day, line] of routeLayersByDay.entries()) {
    if (day === focusDay) {
      line.setStyle({
        weight: ROUTE_STYLE.focus.weight,
        opacity: ROUTE_STYLE.focus.opacity
      });
      line.bringToFront();
    } else {
      line.setStyle({
        weight: ROUTE_STYLE.dim.weight,
        opacity: ROUTE_STYLE.dim.opacity
      });
    }
  }
}

function highlightDayFromFilter() {
  const v = dayFilterEl.value;
  applyRouteStyles(v);
  statusEl.textContent = (v === "all") ? "전체 날짜 경로 표시" : `경로 강조: ${v}`;
}

//// ====== Fit bounds ======
function fitAll() {
  const bounds = L.latLngBounds([]);

  if (routeLayersByDay.size) {
    for (const line of routeLayersByDay.values()) bounds.extend(line.getBounds());
  } else {
    for (const p of places) bounds.extend([p.lat, p.lng]);
  }

  map.fitBounds(bounds.pad(0.15));
  statusEl.textContent = "전체 범위로 맞춤";
}

btnFit.addEventListener("click", fitAll);

//// ====== Route visibility toggle ======
let routeVisible = true;
btnToggleRoute.addEventListener("click", () => {
  routeVisible = !routeVisible;
  if (routeVisible) routeGroup.addTo(map);
  else routeGroup.remove();
  statusEl.textContent = routeVisible ? "경로 표시 ON" : "경로 표시 OFF";
});

//// ====== Timeline render ======
function tagClass(t) {
  if (t === "must") return "must";
  if (t === "move") return "move";
  if (t === "sleep") return "sleep";
  return "";
}

function matches(place, q) {
  if (!q) return true;
  const s = (place.title + " " + (place.note || "") + " " + place.day).toLowerCase();
  return s.includes(q.toLowerCase());
}

function setActiveItem(el) {
  document.querySelectorAll(".item.active").forEach(x => x.classList.remove("active"));
  el.classList.add("active");
}

function render() {
  const q = qEl.value.trim();
  const dayFilter = dayFilterEl.value;

  timelineEl.innerHTML = "";

  const filtered = places.filter(p => {
    if (dayFilter !== "all" && p.day !== dayFilter) return false;
    return matches(p, q);
  });

  for (const d of daysMeta) {
    const items = filtered.filter(p => p.day === d.day);

    if (dayFilter !== "all" && d.day !== dayFilter) continue;
    if (dayFilter === "all" && items.length === 0 && q) continue;

    const dayBox = document.createElement("div");
    dayBox.className = "day";

    const head = document.createElement("div");
    head.className = "day-header";
    head.innerHTML = `
      <div class="day-title">
        <strong>${d.title}</strong>
        <span>${d.subtitle}</span>
      </div>
      <div class="day-badge">${d.badge}</div>
    `;
    dayBox.appendChild(head);

    const list = document.createElement("div");
    list.className = "items";

    if (items.length === 0) {
      const empty = document.createElement("div");
      empty.style.color = "var(--muted)";
      empty.style.fontSize = "12px";
      empty.style.padding = "8px 10px";
      empty.textContent = "검색 결과 없음";
      list.appendChild(empty);
    }

    items
      .slice()
      .sort((a, b) => (a.time || "").localeCompare(b.time || ""))
      .forEach(p => {
        const el = document.createElement("div");
        el.className = "item";
        el.dataset.placeId = p.id;

        const tags = (p.tags || []).map(t => {
          const label = (t === "must") ? "필수" : (t === "sleep") ? "숙박" : (t === "move") ? "이동" : t;
          return `<span class="tag ${tagClass(t)}">${label}</span>`;
        }).join("");

        el.innerHTML = `
          <div class="time">${p.time || ""}</div>
          <div class="desc">
            <p class="place">${p.title}</p>
            <p class="note">${p.note || ""}</p>
            <div class="tagrow">${tags}</div>
          </div>
        `;

        el.addEventListener("click", () => {
          setActiveItem(el);

          // 1) 날짜 경로 하이라이트
          applyRouteStyles(p.day);

          // 2) 지도 포커스 + 마커 강조
          focusPlace(p.id);

          statusEl.textContent = `이동 + 경로 강조: ${p.day}`;
        });

        list.appendChild(el);
      });

    dayBox.appendChild(list);
    timelineEl.appendChild(dayBox);
  }
}

//// ====== Focus map & marker highlight ======
function focusPlace(id) {
  const p = places.find(x => x.id === id);
  if (!p) return;

  // 마커 전체 리셋
  for (const m of markersById.values()) {
    m.setStyle({ color: POI_COLOR, fillColor: POI_COLOR, radius: 6 });
  }

  // 선택 마커 강조
  const m = markersById.get(id);
  if (m) {
    m.setStyle({ color: POI_ACTIVE, fillColor: POI_ACTIVE, radius: 8 });
    m.openPopup();
  }

  map.setView([p.lat, p.lng], 13, { animate: true });
}

//// ====== Events ======
qEl.addEventListener("input", render);

dayFilterEl.addEventListener("change", () => {
  render();
  highlightDayFromFilter();
});

// Esc: 필터 초기화 + 경로/마커 리셋
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    qEl.value = "";
    dayFilterEl.value = "all";
    render();

    // 경로 전체 normal
    applyRouteStyles("all");

    // 마커 리셋
    for (const m of markersById.values()) {
      m.setStyle({ color: POI_COLOR, fillColor: POI_COLOR, radius: 6 });
    }

    fitAll();
    statusEl.textContent = "필터 초기화";
  }
});

//// ====== Initial ======
render();
applyRouteStyles("all");
fitAll();
statusEl.textContent = "준비됨";

