async function upload(){
  const file = document.getElementById('file').files[0];
  const form = new FormData();
  form.append('file', file);

  await fetch('https://cold-haze-26b9.muhammadrooby.workers.dev/upload',{method:'POST',body:form});
  alert('Uploaded');
}

async function check(){
  const kdtk = document.getElementById('kdtk').value;
  const res = await fetch('https://cold-haze-26b9.muhammadrooby.workers.dev/check?kdtk='+kdtk);
  const data = await res.json();
  document.getElementById('result').textContent = JSON.stringify(data,null,2);
}
