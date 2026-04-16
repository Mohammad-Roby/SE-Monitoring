// =======================
// CHECK (USER)
// =======================
async function check(){
  const kdtk = document.getElementById('kdtk').value;

  try {
    const res = await fetch('https://cold-haze-26b9.muhammadrooby.workers.dev/check?kdtk=' + kdtk);
    const data = await res.json();

    console.log(data);

    let output = "";

    // ❗ kalau error dari backend
    if(data.error){
      output = "❌ " + data.error + "\n\nContoh KDTK:\n" + (data.sample_kdtk || []).join(", ");
    }
    // ❗ kalau ada issues
    else if(data.issues && data.issues.length > 0){
      output = "Masalah ditemukan:\n\n";
      data.issues.forEach(i => {
        output += "- " + i + "\n";
      });
    }
    else {
      output = "Semua kondisi normal";
    }

    document.getElementById('result').textContent = output;

  } catch(err){
    document.getElementById('result').textContent = "ERROR: " + err.message;
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
