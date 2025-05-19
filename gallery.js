const SUPABASE_URL = 'https://ckwtlxshukjnizhgeuod.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrd3RseHNodWtqbml6aGdldW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNTYwNTcsImV4cCI6MjA2MjczMjA1N30.CwAdEu4Xy0ecJc7cqn0ggqu0ET6QGV38fVpyI0wXf_g';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

window.onload = async function() {
  try {
    const { data, error } = await supabaseClient.storage.from('photos').list();
    if (error) {
      console.error("Errore nel recupero delle immagini da Storage:", error);
      return;
    }

    const gallery = document.getElementById('gallery');
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');

    data.forEach(file => {
      // Contenitore immagine + didascalia
      const container = document.createElement('div');
      container.classList.add('photo-container');

      // Immagine
      const img = document.createElement('img');
      img.src = `${SUPABASE_URL}/storage/v1/object/public/photos/${file.name}`;
      img.alt = file.name;
      img.addEventListener('click', () => {
        modalImg.src = img.src;
        modal.classList.add('active');
      });

      // Nome sotto immagine
      const caption = document.createElement('p');
      caption.className = 'photo-caption';
      caption.textContent = file.name;

      container.appendChild(img);
      container.appendChild(caption);
      gallery.appendChild(container);
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target === modalImg) {
        modal.classList.remove('active');
        modalImg.src = '';
      }
    });

  } catch (err) {
    console.error("Errore generico:", err);
  }
};
