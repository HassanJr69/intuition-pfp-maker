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
      left: 256,
      top: 256,
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

function resizeCanvas() {
  const container = document.getElementById('canvas-container');
  const size = Math.min(window.innerWidth - 40, 512);
  const scaleFactor = size / canvas.getWidth();

  canvas.setWidth(size);
  canvas.setHeight(size);
  container.style.width = `${size}px`;

  canvas.getObjects().forEach(obj => {
    obj.scaleX *= scaleFactor;
    obj.scaleY *= scaleFactor;
    obj.left *= scaleFactor;
    obj.top *= scaleFactor;
    obj.setCoords();
  });

  canvas.renderAll();
}

window.addEventListener('resize', resizeCanvas);

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
      canvas.setWidth(512);
      canvas.setHeight(512);

      const scale = Math.min(512 / img.width, 512 / img.height);
      img.scale(scale);
      img.set({
        originX: 'center',
        originY: 'center',
        left: 256,
        top: 256,
        selectable: false,
        hasControls: false,
        hasBorders: false
      });

      pfpImage = img;
      canvas.add(pfpImage);
      canvas.sendToBack(pfpImage);

      loadGlasses();
      resizeCanvas();
    }, { crossOrigin: 'anonymous' });
  };

  reader.onerror = function () {
    alert("Failed to read image.");
  };

  reader.readAsDataURL(file);
});

document.getElementById('reset-btn').addEventListener('click', () => {
  canvas.clear();
  canvas.setWidth(512);
  canvas.setHeight(512);
  pfpImage = null;
  glassesImage = null;
  loadGlasses();
  resizeCanvas();
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
  canvas.setWidth(512);
  canvas.setHeight(512);
  resizeCanvas();
  loadGlasses();
});
