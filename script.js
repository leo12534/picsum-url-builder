function buildPicsumUrl({ seed, width, height, grayscale, blur }) {
  const params = [];
  if (grayscale) params.push('grayscale');
  if (blur > 0) params.push(`blur=${blur}`);
  const query = params.length ? `?${params.join('&')}` : '';
  return `https://picsum.photos/seed/${seed}/${width}/${height}${query}`;
}

function updateHtmlImage() {
  const seed = document.getElementById('html-seed').value;
  const width = document.getElementById('html-width').value;
  const height = document.getElementById('html-height').value;
  const grayscale = document.getElementById('html-grayscale').checked;
  const blur = document.getElementById('html-blur').value;

  document.getElementById('html-blur-value').textContent = blur;

  const url = buildPicsumUrl({ seed, width, height, grayscale, blur });
  document.getElementById('img-html').src = url;
  document.getElementById('html-url').value = url;
}

function updateCssImage() {
  const seed = document.getElementById('css-seed').value;
  const width = document.getElementById('css-width').value;
  const height = document.getElementById('css-height').value;
  const grayscale = document.getElementById('css-grayscale').checked;
  const blur = document.getElementById('css-blur').value;

  document.getElementById('css-blur-value').textContent = blur;

  const url = buildPicsumUrl({ seed, width, height, grayscale, blur });
  document.getElementById('img-css').style.backgroundImage = `url('${url}')`;
  document.getElementById('css-url').value = url;
}

function copyToClipboard(inputId, buttonEl) {
  const input = document.getElementById(inputId);
  navigator.clipboard.writeText(input.value);

  const originalText = buttonEl.textContent;
  buttonEl.textContent = 'Copied!';
  setTimeout(() => {
    buttonEl.textContent = originalText;
  }, 1500);
}

function randomSeed() {
  return Math.random().toString(36).slice(2, 8);
}

['html-seed', 'html-width', 'html-height', 'html-blur', 'html-grayscale'].forEach((id) => {
  document.getElementById(id).addEventListener('input', updateHtmlImage);
});

['css-seed', 'css-width', 'css-height', 'css-blur', 'css-grayscale'].forEach((id) => {
  document.getElementById(id).addEventListener('input', updateCssImage);
});

document.getElementById('html-random').addEventListener('click', () => {
  document.getElementById('html-seed').value = randomSeed();
  updateHtmlImage();
});

document.getElementById('css-random').addEventListener('click', () => {
  document.getElementById('css-seed').value = randomSeed();
  updateCssImage();
});

document.getElementById('html-copy').addEventListener('click', (event) => {
  copyToClipboard('html-url', event.currentTarget);
});

document.getElementById('css-copy').addEventListener('click', (event) => {
  copyToClipboard('css-url', event.currentTarget);
});

updateHtmlImage();
updateCssImage();
