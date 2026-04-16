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

      if (d.lan_speed < 1000) issues.push("LAN < 1000 Mbps");
      if (d.boot_time >= 2) issues.push("MYSQL lambat");
      if (d.suhu >= 80) issues.push("CPU panas");
      if (d.boot_time >= 4) issues.push("Boot lama");

      if (String(d.status_bsod).toLowerCase().includes("nok")) {
        issues.push("BSOD bermasalah");
      }

      if (!String(d.ups_status).toLowerCase().includes("terpasang")) {
        issues.push("UPS tidak OK");
      }

      if (d.edc_bca_on <= d.edc_bca_off) {
        issues.push("EDC BCA OFF");
      }

      const m_on = d.edc_mandiri_on + d.edc_mti_on;
      const m_off = d.edc_mandiri_off + d.edc_mti_off;

      if (m_on <= m_off) {
        issues.push("EDC Mandiri/MTI OFF");
      }

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
      // CSV (AMAN)
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
