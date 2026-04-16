// =======================
// CHECK (USER)
// =======================
async function check(){
  const kdtk = document.getElementById('kdtk').value;

  const res = await fetch('https://cold-haze-26b9.muhammadrooby.workers.dev/check?kdtk=' + kdtk);
  const data = await res.json();

  let output = "";

  if(data.issues.length === 0){
    output = "Semua kondisi normal";
  } else {
    output = "Masalah ditemukan:\n";
    data.issues.forEach(i => {
      output += "- " + i + "\n";
    });
  }

  document.getElementById('result').textContent = output;
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
