// Pasta Evim — galeri, menü ve WhatsApp sipariş formu
const WHATSAPP = "905470210211";
const PRICES = { "4–6 kişilik": 1000, "8–10 kişilik": 1500, "12–15 kişilik": 2000, "20–25 kişilik": 2500, "30 kişilik": 3000 };
const PHOTO_EXTRA = 100;
const CUPCAKE_PRICE = 250;

const CAKES = [
  { img: "p09", title: "Beyaz Güller", tag: "cicek", tema: "Çiçekli / romantik" },
  { img: "p20", title: "Karlar Ülkesi", tag: "cocuk", tema: "Çizgi film / karakter" },
  { img: "p02", title: "Yıllar Seni Benimle", tag: "sevgi", tema: "Minimal & yazılı" },
  { img: "p15", title: "Sarı Lacivert", tag: "taraftar", tema: "Takım / taraftar" },
  { img: "p16", title: "Makaron Taç", tag: "cicek", tema: "Makaron / meyve süslü" },
  { img: "p18", title: "Barbie 5 Yaş", tag: "cocuk", tema: "Çizgi film / karakter" },
  { img: "p10", title: "Anı Fotoğraflı", tag: "fotograf", tema: "Fotoğraf baskılı" },
  { img: "p06", title: "Sarı Kırmızı", tag: "taraftar", tema: "Takım / taraftar" },
  { img: "p01", title: "İki Katlı 1 Yaş", tag: "cocuk", tema: "Balonlu / renkli" },
  { img: "p03", title: "Kalpler", tag: "sevgi", tema: "Minimal & yazılı" },
  { img: "p19", title: "Kırmızı Güller", tag: "cicek", tema: "Çiçekli / romantik" },
  { img: "p14", title: "Boss Baby", tag: "cocuk", tema: "Çizgi film / karakter" },
  { img: "p05", title: "Siyah Beyaz", tag: "taraftar", tema: "Takım / taraftar" },
  { img: "p13", title: "Dantel Fotoğraflı", tag: "fotograf", tema: "Fotoğraf baskılı" },
  { img: "p07", title: "Balonlu 1 Yaş", tag: "cocuk", tema: "Balonlu / renkli" },
  { img: "p08", title: "Benimle Yaşlandırsın", tag: "sevgi", tema: "Minimal & yazılı" },
  { img: "p11", title: "Hafızlık Hediyesi", tag: "sevgi", tema: "Minimal & yazılı" },
  { img: "p04", title: "Siyah Beyaz Zarafet", tag: "sevgi", tema: "Minimal & yazılı" },
  { img: "p12", title: "Happy Birthday", tag: "sevgi", tema: "Minimal & yazılı" },
  { img: "p17", title: "Her Yeni Yaşında", tag: "sevgi", tema: "Minimal & yazılı" },
];
const TAG_LABEL = { cocuk: "Çocuk", sevgi: "Sevdiklerinize", fotograf: "Fotoğraflı", taraftar: "Taraftar", cicek: "Çiçek & Süslü" };

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// Header & menu
const header = $(".site-header");
addEventListener("scroll", () => header.classList.toggle("scrolled", scrollY > 10), { passive: true });
const nav = $("#nav"), toggle = $("#navToggle");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
$$("#nav a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
$("#year").textContent = new Date().getFullYear();

// Gallery
const gallery = $("#gallery");
gallery.innerHTML = CAKES.map((c, i) => `
  <button class="card" data-tag="${c.tag}" data-i="${i}" style="animation-delay:${(i % 8) * 40}ms">
    <img src="img/${c.img}.jpg" alt="${c.title} — Pasta Evim" loading="lazy">
    <span class="card-info"><b>${c.title}</b><small>${TAG_LABEL[c.tag]}</small></span>
  </button>`).join("");

$$(".chip").forEach(chip => chip.addEventListener("click", () => {
  $$(".chip").forEach(c => c.classList.toggle("is-active", c === chip));
  const f = chip.dataset.filter;
  $$(".card").forEach(card => card.classList.toggle("is-hidden", f !== "all" && card.dataset.tag !== f));
}));

// Lightbox
const lb = $("#lightbox");
let lbIndex = 0;
gallery.addEventListener("click", e => {
  const card = e.target.closest(".card");
  if (!card) return;
  lbIndex = +card.dataset.i;
  const c = CAKES[lbIndex];
  $("#lbImg").src = `img/${c.img}.jpg`;
  $("#lbImg").alt = c.title;
  $("#lbCap").textContent = c.title;
  lb.hidden = false;
});
const closeLb = () => (lb.hidden = true);
$("#lbClose").addEventListener("click", closeLb);
lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
addEventListener("keydown", e => { if (e.key === "Escape") closeLb(); });

// Order form
const form = $("#orderForm");
const steps = $$(".step", form);
const progress = $$(".progress li", form);
const prevBtn = $("#prevBtn"), nextBtn = $("#nextBtn"), errorEl = $("#stepError");
let current = 0;
let pickedModel = null;

function pickModel(c) {
  pickedModel = c;
  const box = $("#modelPicked");
  box.hidden = false;
  $("img", box).src = `img/${c.img}.jpg`;
  $("#modelPickedText").textContent = c.title;
  const temaInput = $(`input[name="tema"][value="${c.tema}"]`, form);
  if (temaInput) temaInput.checked = true;
}
$("#lbOrder").addEventListener("click", () => {
  pickModel(CAKES[lbIndex]);
  closeLb();
  $("#siparis").scrollIntoView({ behavior: "smooth" });
});
$("#modelClear").addEventListener("click", () => {
  pickedModel = null;
  $("#modelPicked").hidden = true;
});

// Earliest delivery date: tomorrow
const dateInput = form.elements.tarih;
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
dateInput.min = iso(tomorrow);

// Address only for delivery
$$('input[name="teslimat"]', form).forEach(r => r.addEventListener("change", () => {
  $("#adresField").hidden = !r.value.startsWith("Adrese");
}));

// Cupcake has its own price, so the serving-size question does not apply
const boyutBox = $('[data-name="boyut"]', form);
const boyutParts = [boyutBox.previousElementSibling, boyutBox, boyutBox.nextElementSibling];
$$('input[name="urun"]', form).forEach(r => r.addEventListener("change", () => {
  const cupcake = r.value === "Cupcake";
  boyutParts.forEach(el => (el.hidden = cupcake));
  if (cupcake) {
    delete boyutBox.dataset.required;
    $$("input", boyutBox).forEach(i => (i.checked = false));
  } else {
    boyutBox.dataset.required = "";
  }
}));

// Quantity note only when an extra is picked
$('[data-name="ekstra"]', form).addEventListener("change", () => {
  $("#ekstraField").hidden = !$('input[name="ekstra"]:checked', form);
});

// Max 2 fillings
const dolguBox = $('[data-name="dolgu"]', form);
dolguBox.addEventListener("change", e => {
  const checked = $$("input:checked", dolguBox);
  if (checked.length > +dolguBox.dataset.max) e.target.checked = false;
});

function validate(stepEl) {
  let msg = "";
  $$(".invalid", stepEl).forEach(el => el.classList.remove("invalid"));
  $$(".options[data-required]", stepEl).forEach(group => {
    if (!$("input:checked", group)) { group.classList.add("invalid"); msg ||= "Lütfen işaretli alanlardan seçim yapın."; }
  });
  $$("[required]", stepEl).forEach(input => {
    if (!input.value.trim()) { input.classList.add("invalid"); msg ||= "Lütfen zorunlu alanları doldurun."; }
  });
  if (stepEl.dataset.step === "4") {
    if (dateInput.value && dateInput.value < dateInput.min) { dateInput.classList.add("invalid"); msg = "Siparişler en az 1 gün önceden alınır; lütfen yarından itibaren bir tarih seçin."; }
    const tel = form.elements.tel.value.replace(/\D/g, "");
    if (form.elements.tel.value && tel.length < 10) { form.elements.tel.classList.add("invalid"); msg ||= "Lütfen geçerli bir telefon numarası girin."; }
    const delivery = $('input[name="teslimat"]:checked', form);
    if (delivery && delivery.value.startsWith("Adrese") && !form.elements.adres.value.trim()) {
      form.elements.adres.classList.add("invalid"); msg ||= "Adrese teslim için lütfen adres yazın.";
    }
  }
  errorEl.textContent = msg;
  return !msg;
}

const val = name => {
  const els = form.elements[name];
  if (!els) return "";
  if (els instanceof RadioNodeList) {
    const checked = [...els].filter(e => e.checked).map(e => e.value);
    return checked.join(" + ");
  }
  return els.type === "checkbox" ? (els.checked ? "Evet" : "") : els.value.trim();
};

function formatDate(v) {
  if (!v) return "";
  const [y, m, d] = v.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", weekday: "long" });
}

function orderRows() {
  return [
    ["Özel gün", val("etkinlik")],
    ["Kutlanan kişi", [val("kisi"), val("yas") && `${val("yas")} yaş`].filter(Boolean).join(", ")],
    ["Ürün", val("urun")],
    ["Kişi sayısı", val("boyut")],
    ["Kek", val("kek")],
    ["Krema", val("krema")],
    ["İç dolgu", val("dolgu")],
    ["Ev lezzetleri", [val("ekstra"), $("#ekstraField").hidden ? "" : val("ekstraNot")].filter(Boolean).join(" — ")],
    ["Seçilen model", pickedModel ? pickedModel.title : ""],
    ["Tema", val("tema")],
    ["Renkler", val("renk")],
    ["Karakter / takım", val("temaDetay")],
    ["Pasta yazısı", val("yazi")],
    ["Altlık yazısı", val("altlik")],
    ["Mum / topper", val("mum")],
    ["Tasarım notu", val("tasarimNot")],
    ["Teslim tarihi", formatDate(val("tarih"))],
    ["Saat aralığı", val("saat")],
    ["Teslimat", val("teslimat")],
    ["Adres", $("#adresField").hidden ? "" : val("adres")],
    ["Ad soyad", val("ad")],
    ["Telefon", val("tel")],
    ["Alerji / not", val("alerji")],
  ].filter(([, v]) => v);
}

const esc = s => s.replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));

const tl = n => n.toLocaleString("tr-TR") + " TL";

// Starting price only: tiers, figures and delivery are quoted on WhatsApp
function estimate() {
  const urun = val("urun");
  if (urun === "Cupcake") return { total: CUPCAKE_PRICE, parts: [`Cupcake ${tl(CUPCAKE_PRICE)}`] };
  const base = PRICES[val("boyut")];
  if (!base) return null;
  const parts = [`${val("boyut")} ${tl(base)}`];
  let total = base;
  if (urun === "Fotoğraflı pasta" || val("tema") === "Fotoğraf baskılı") {
    total += PHOTO_EXTRA;
    parts.push(`fotoğraf +${tl(PHOTO_EXTRA)}`);
  }
  return { total, parts };
}

function estimateNotes() {
  const notes = ["kat, model ve şeker hamuru figürlerine göre değişebilir"];
  if (val("ekstra")) notes.push("ev lezzetleri ayrıca fiyatlandırılır");
  if (val("teslimat").startsWith("Adrese")) notes.push("teslimat ücreti konuma göre eklenir");
  return notes;
}

function renderSummary() {
  $("#summary").innerHTML = "<dl>" + orderRows().map(([k, v]) =>
    `<div class="row"><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("") + "</dl>";
  const est = estimate();
  $("#estimate").innerHTML = est
    ? `<div><span>Tahmini başlangıç fiyatı</span><small>${est.parts.join(" · ")}</small></div><strong>${tl(est.total)}</strong><p>Net fiyat WhatsApp'tan iletilir: ${estimateNotes().join("; ")}.</p>`
    : "";
}

function orderText() {
  const lines = orderRows().map(([k, v]) => `• *${k}:* ${v}`);
  const est = estimate();
  const price = est ? `\n\n💰 *Tahmini başlangıç fiyatı:* ${tl(est.total)} (${est.parts.join(", ")})\n_${estimateNotes().join("; ")}_` : "";
  return `Merhaba Pasta Evim 🎂\nWeb sitenizden sipariş vermek istiyorum:\n\n${lines.join("\n")}${price}\n\nNet fiyat ve onay için dönüşünüzü bekliyorum. Teşekkürler!`;
}

function show(i) {
  current = i;
  steps.forEach((s, n) => s.classList.toggle("is-active", n === i));
  progress.forEach((p, n) => {
    p.classList.toggle("is-active", n === i);
    p.classList.toggle("is-done", n < i);
  });
  prevBtn.hidden = i === 0;
  nextBtn.hidden = i === steps.length - 1;
  errorEl.textContent = "";
  if (i === steps.length - 1) renderSummary();
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

nextBtn.addEventListener("click", () => { if (validate(steps[current])) show(current + 1); });
prevBtn.addEventListener("click", () => show(current - 1));
form.addEventListener("change", e => {
  const group = e.target.closest(".options");
  if (group) group.classList.remove("invalid");
  e.target.classList.remove("invalid");
});

function requireConsent() {
  if (!form.elements.onay.checked) {
    errorEl.textContent = "Göndermeden önce lütfen onay kutusunu işaretleyin.";
    return false;
  }
  errorEl.textContent = "";
  return true;
}

$("#sendWa").addEventListener("click", () => {
  if (!requireConsent()) return;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(orderText())}`, "_blank", "noopener");
});

$("#copyOrder").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(orderText());
    $("#copyOrder").textContent = "Kopyalandı ✓";
  } catch {
    $("#copyOrder").textContent = "Kopyalanamadı";
  }
  setTimeout(() => ($("#copyOrder").textContent = "Metni kopyala"), 2200);
});
