async function upload(){
  const file = document.getElementById('file').files[0];
  const form = new FormData();
  form.append('file', file);

  await fetch('https://cold-haze-26b9.muhammadrooby.workers.dev/upload',{method:'POST',body:form});
  alert('Uploaded');
}

function check(){
  alert("JS jalan"); // TEST
}
