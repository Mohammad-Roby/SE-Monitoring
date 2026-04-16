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

    const total = data.length;

    const count = (fn) => data.filter(fn).length;
    const percent = (ok) => ((ok / total) * 100).toFixed(0);

    let report = [];

    // 1 LAN
    let ok_lan = count(d => d.lan_speed >= 1000);
    report.push(`LAN OK: ${percent(ok_lan)}%`);

    // 2 MYSQL
    let ok_mysql = count(d => d.boot_time < 2);
    report.push(`MYSQL OK: ${percent(ok_mysql)}%`);

    // 3 CPU
    let ok_cpu = count(d => d.suhu < 80);
    report.push(`CPU OK: ${percent(ok_cpu)}%`);

    // 4 BOOT
    let ok_boot = count(d => d.boot_time < 4);
    report.push(`BOOT OK: ${percent(ok_boot)}%`);

    // 5 BSOD
    let ok_bsod = count(d => !String(d.status_bsod).toLowerCase().includes("nok"));
    report.push(`BSOD OK: ${percent(ok_bsod)}%`);

    // 6 UPS
    let validUPS = data.filter(d => d.ups_status !== "-");
    let ok_ups = validUPS.filter(d =>
      String(d.ups_status).toLowerCase().includes("terpasang")
    ).length;

    report.push(`UPS OK: ${validUPS.length ? ((ok_ups / validUPS.length) * 100).toFixed(0) : 0}%`);

    // 7 BCA
    let ok_bca = count(d => d.edc_bca_on > d.edc_bca_off);
    report.push(`EDC BCA OK: ${percent(ok_bca)}%`);

    // 8 Mandiri + MTI
    let ok_m = count(d =>
      (d.edc_mandiri_on + d.edc_mti_on) >
      (d.edc_mandiri_off + d.edc_mti_off)
    );
    report.push(`EDC Mandiri/MTI OK: ${percent(ok_m)}%`);

    result.innerText = "📊 HASIL MONITORING:\n\n" + report.join("\n");

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
