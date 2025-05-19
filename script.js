const video = document.getElementById('mirror');
const flash = document.getElementById('flash');
const consentBanner = document.getElementById('consent-banner');
const acceptBtn = document.getElementById('accept-btn');
const preferencesBtn = document.getElementById('preferenze-btn');

let stream;

function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
    .then(s => {
      stream = s;
      video.srcObject = stream;
      video.play();
      showConsentBanner();
    })
    .catch(err => {
      alert("Errore fotocamera: " + err.message);
    });
}

function showConsentBanner() {
  consentBanner.style.display = 'block';
}

function takePhoto() {
  flash.style.opacity = 1;

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext('2d');
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  setTimeout(() => {
    flash.style.opacity = 0;
  }, 80);

  canvas.toBlob(async (blob) => {
    if (!blob) {
      console.error("Errore: blob della foto è null");
      alert("Errore nella creazione della foto");
      return;
    }

    const fileName = `utente_${Date.now()}.jpg`;
    console.log("Upload foto con nome file:", fileName);

    try {
      // Upload immagine nel bucket
      const uploadRes = await fetch(`https://ckwtlxshukjnizhgeuod.supabase.co/storage/v1/object/photos/${fileName}`, {
        method: 'PUT',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrd3RseHNodWtqbml6aGdldW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNTYwNTcsImV4cCI6MjA2MjczMjA1N30.CwAdEu4Xy0ecJc7cqn0ggqu0ET6QGV38fVpyI0wXf_g',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrd3RseHNodWtqbml6aGdldW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNTYwNTcsImV4cCI6MjA2MjczMjA1N30.CwAdEu4Xy0ecJc7cqn0ggqu0ET6QGV38fVpyI0wXf_g',
          'Content-Type': 'image/jpeg'
        },
        body: blob
      });

      if (!uploadRes.ok) {
        const errorBody = await uploadRes.text();
        throw new Error(`Errore durante upload nel bucket: ${uploadRes.status} ${uploadRes.statusText} - ${errorBody}`);
      }

      console.log("Upload immagine riuscito");

      const imageUrl = `https://ckwtlxshukjnizhgeuod.supabase.co/storage/v1/object/public/photos/${fileName}`;
      console.log("URL immagine pubblica:", imageUrl);

      // Inserimento record nella tabella photos
      const insertRes = await fetch('https://ckwtlxshukjnizhgeuod.supabase.co/rest/v1/photos', {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrd3RseHNodWtqbml6aGdldW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNTYwNTcsImV4cCI6MjA2MjczMjA1N30.CwAdEu4Xy0ecJc7cqn0ggqu0ET6QGV38fVpyI0wXf_g',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrd3RseHNodWtqbml6aGdldW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNTYwNTcsImV4cCI6MjA2MjczMjA1N30.CwAdEu4Xy0ecJc7cqn0ggqu0ET6QGV38fVpyI0wXf_g',
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ image_url: imageUrl })
      });

      if (!insertRes.ok) {
        const errorBody = await insertRes.text();
        throw new Error(`Errore inserimento record: ${insertRes.status} ${insertRes.statusText} - ${errorBody}`);
      }

      const data = await insertRes.json();
      console.log("Record inserito con successo:", data);

      window.location.href = "gallery.html";

    } catch (err) {
      console.error("Errore complessivo:", err);
      alert("Errore: " + err.message);
    }

  }, 'image/jpeg');
}

// Eventi
acceptBtn.addEventListener('click', () => {
  consentBanner.style.display = 'none';
  setTimeout(() => {
    takePhoto();
  }, 1500);
});

preferencesBtn.addEventListener('click', () => {
  window.location.href = "preferences.html";
});

startCamera();
