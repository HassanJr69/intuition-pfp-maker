const canvas = new fabric.Canvas('editor-canvas', {
  selection: false,
  preserveObjectStacking: true
});

let pfpImage = null;
let glassesImage = null;

function loadGlasses() {
  fabric.Image.fromURL('assets/intuition-glasses.png', function (img) {
    img.set({
      originX: 'center',
      originY: 'center',
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() / 2,
      hasControls: true,
      hasBorders: true,
      cornerStyle: 'circle',
      borderColor: '#aaa',
      cornerColor: '#aaa',
      transparentCorners: false
    });
    img.scale(0.5);
    glassesImage = img;
    canvas.add(glassesImage);
    canvas.setActiveObject(glassesImage);
    canvas.renderAll();
  });
}

document.getElementById('upload-image').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (f) {
    if (!f.target.result) {
      alert("Image failed to load.");
      return;
    }

    fabric.Image.fromURL(f.target.result, function (img) {
      canvas.clear();

      const imgWidth = img.width;
      const imgHeight = img.height;

      // Set canvas size exactly to image size
      canvas.setWidth(imgWidth);
      canvas.setHeight(imgHeight);

      const container = document.getElementById('canvas-container');
      container.style.width = `${imgWidth}px`;
      container.style.height = `${imgHeight}px`;

      img.set({
        originX: 'left',
        originY: 'top',
        left: 0,
        top: 0,
        selectable: false,
        hasControls: false,
        hasBorders: false
      });

      pfpImage = img;
      canvas.add(pfpImage);
      canvas.sendToBack(pfpImage);

      loadGlasses();
    }, { crossOrigin: 'anonymous' });
  };

  reader.onerror = function () {
    alert("Failed to read image.");
  };

  reader.readAsDataURL(file);
});

document.getElementById('reset-btn').addEventListener('click', () => {
  canvas.clear();
  pfpImage = null;
  glassesImage = null;
  loadGlasses();
});

document.getElementById('download-btn').addEventListener('click', () => {
  if (!pfpImage) return alert("Upload a PFP first.");

  if (glassesImage) {
    glassesImage.set({ hasControls: false, hasBorders: false });
  }

  canvas.discardActiveObject();
  canvas.renderAll();

  const dataURL = canvas.toDataURL({
    format: 'png',
    multiplier: 2
  });

  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'intuition-pfp.png';
  link.click();

  if (glassesImage) {
    glassesImage.set({ hasControls: true, hasBorders: true });
  }

  canvas.renderAll();
});

document.getElementById('mint-btn').addEventListener('click', () => {
  alert('🕯️ Ritual minting to the void... (soon)');
});

window.addEventListener('load', () => {
  // Default canvas size
  canvas.setWidth(512);
  canvas.setHeight(512);
  loadGlasses();
});
