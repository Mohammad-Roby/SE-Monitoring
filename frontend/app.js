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

      // RULES
      if (d.lan_speed < 1000) {
        issues.push("LAN < 1000 Mbps");
      }

      if (d.boot_time >= 2) {
        issues.push("MYSQL lambat");
      }

      if (d.suhu >= 80) {
        issues.push("CPU panas");
      }

      if (d.boot_time >= 4) {
        issues.push("Boot lama");
      }

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

      // OUTPUT
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
// UPLOAD (ADMIN)
// =======================
async function upload(){
  const fileInput = document.getElementById('file');
  const file = fileInput.files[0];

  if(!file){
    alert("Pilih file dulu");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch('https://cold-haze-26b9.muhammadrooby.workers.dev/upload', {
    method: 'POST',
    body: formData
  });

  const data = await res.json();

  alert("Upload berhasil");
}
