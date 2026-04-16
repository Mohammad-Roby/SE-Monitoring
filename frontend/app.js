async function upload(){
  const file = document.getElementById('file').files[0];
  const form = new FormData();
  form.append('file', file);

  await fetch('https://cold-haze-26b9.muhammadrooby.workers.dev/upload',{method:'POST',body:form});
  alert('Uploaded');
}

async function check(){
  alert("Function jalan");

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
