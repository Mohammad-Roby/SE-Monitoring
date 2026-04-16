// =======================
// HELPER
// =======================
const toNumber = (v) => {
  if (!v) return 0;
  const match = String(v).match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
};

const toStr = (v) => String(v || "").toLowerCase();


// =======================
// CHECK (USER)
// =======================
async function check() {
  const kdtk = document.getElementById("kdtk").value;
  const result = document.getElementById("result");

  result.innerText = "Loading...";

  try {
    const res = await fetch(`https://cold-haze-26b9.muhammadrooby.workers.dev/check?kdtk=${kdtk}`);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      result.innerText = "❌ KDTK tidak ditemukan";
      return;
    }

    let output = `📊 LAPORAN KDTK: ${kdtk}\n\n`;

    data.forEach((d, i) => {
      const station = d.device_id || d.station || `Station ${i+1}`;
      let issues = [];

      // 🔥 SAFE VALUE
      const lan = toNumber(d.lan_speed);
      const suhu = toNumber(d.suhu);
      const boot = toNumber(d.boot_time);
      const bsod = toStr(d.status_bsod);
      const ups = toStr(d.ups_status);

      const bca_on = toNumber(d.edc_bca_on);
      const bca_off = toNumber(d.edc_bca_off);

      const mandiri_on = toNumber(d.edc_mandiri_on);
      const mandiri_off = toNumber(d.edc_mandiri_off);

      const mti_on = toNumber(d.edc_mti_on);
      const mti_off = toNumber(d.edc_mti_off);

      const m_on = mandiri_on + mti_on;
      const m_off = mandiri_off + mti_off;

      // ======================
      // RULES
      // ======================

      if (lan > 0 && lan < 1000) {
        issues.push("LAN < 1000 Mbps");
      }

      if (boot >= 2) {
        issues.push("MYSQL lambat");
      }

      if (suhu >= 80) {
        issues.push("CPU panas");
      }

      if (boot >= 4) {
        issues.push("Boot lama");
      }

      if (bsod.includes("nok") || bsod.includes("error")) {
        issues.push("BSOD bermasalah");
      }

      // 🔥 FIX UPS (IMPORTANT)
      if (!ups.includes("terpasang") && !ups.includes("ok")) {
        issues.push("UPS tidak OK");
      }

      // 🔥 FIX EDC BCA
      if ((bca_on + bca_off) > 0 && bca_on <= bca_off) {
        issues.push("EDC BCA OFF");
      }

      // 🔥 FIX EDC MANDIRI + MTI
      if ((m_on + m_off) > 0 && m_on <= m_off) {
        issues.push("EDC Mandiri/MTI OFF");
      }

      // ======================
      // OUTPUT
      // ======================
      output += `🖥️ ${station}\n`;

      if (issues.length === 0) {
        output += "✅ Semua normal\n\n";
      } else {
        issues.forEach(x => {
          output += `❌ ${x}\n`;
        });
        output += "\n";
      }
    });

    result.innerText = output;

  } catch (e) {
    result.innerText = "❌ Error: " + e.message;
  }
}


// =======================
// CSV PARSER (AMAN)
// =======================
function parseCSV(text, delimiter = ";") {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        value += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (value || row.length) {
        row.push(value);
        rows.push(row);
        row = [];
        value = "";
      }
    } else {
      value += char;
    }
  }

  if (value) row.push(value);
  if (row.length) rows.push(row);

  return rows;
}


// =======================
// UPLOAD (ADMIN FINAL)
// =======================
async function uploadFile() {
  const fileInput = document.getElementById("file");
  const file = fileInput.files[0];

  if (!file) {
    alert("Pilih file dulu");
    return;
  }

  let rows = [];

  try {

    // ======================
    // XLSX
    // ======================
    if (file.name.endsWith(".xlsx")) {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    } else {

      // ======================
      // CSV
      // ======================
      const text = await file.text();
      const parsed = parseCSV(text, ";");

      const header = parsed[0].map(h => h.trim().toLowerCase());

      rows = parsed.slice(1).map(r => {
        let obj = {};
        header.forEach((h, i) => {
          obj[h] = r[i];
        });
        return obj;
      });
    }

    // ======================
    // KIRIM KE WORKER
    // ======================
    const res = await fetch("https://cold-haze-26b9.muhammadrooby.workers.dev/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(rows)
    });

    const result = await res.json();

    alert("Upload sukses\n" + JSON.stringify(result, null, 2));

  } catch (e) {
    alert("ERROR: " + e.message);
  }
}
