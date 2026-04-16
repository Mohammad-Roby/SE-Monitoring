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

    let issues = [];

    data.forEach(d => {
      const dev = d.device_id || "-";

      // 1 LAN
      if (d.lan_speed < 1000) {
        issues.push(`LAN <1000 (${d.lan_speed}) - ${dev}`);
      }

      // 2 MYSQL
      if (d.boot_time >= 2) {
        issues.push(`MYSQL lambat (${d.boot_time}) - ${dev}`);
      }

      // 3 CPU
      if (d.suhu >= 80) {
        issues.push(`CPU panas (${d.suhu}) - ${dev}`);
      }

      // 4 BOOT
      if (d.boot_time >= 4) {
        issues.push(`Boot lama (${d.boot_time}) - ${dev}`);
      }

      // 5 BSOD
      if (String(d.status_bsod).toLowerCase().includes("nok")) {
        issues.push(`BSOD bermasalah - ${dev}`);
      }

      // 6 UPS
      if (!String(d.ups_status).toLowerCase().includes("terpasang")) {
        issues.push(`UPS tidak OK - ${dev}`);
      }

      // 7 BCA
      if (d.edc_bca_on <= d.edc_bca_off) {
        issues.push(`EDC BCA OFF - ${dev}`);
      }

      // 8 Mandiri + MTI
      const m_on = d.edc_mandiri_on + d.edc_mti_on;
      const m_off = d.edc_mandiri_off + d.edc_mti_off;

      if (m_on <= m_off) {
        issues.push(`EDC Mandiri/MTI OFF - ${dev}`);
      }
    });

    if (issues.length === 0) {
      result.innerText = "✅ Semua kondisi normal";
    } else {
      result.innerText = "❌ Masalah ditemukan:\n\n" + issues.join("\n");
    }

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
