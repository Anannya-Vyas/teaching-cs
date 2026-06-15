// Wait for DOM to load fully
document.addEventListener('DOMContentLoaded', () => {
  setupColorSelection();
  setupGardenCanvas();
  setupTipGenerator();
});

// 1. Color Button State Management
let selectedColorHex = '#10b981'; // Default: Green

function setupColorSelection() {
  const colorBtns = document.querySelectorAll('.color-btn');

  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      colorBtns.forEach(b => b.classList.remove('active'));
      
      // Add active class to clicked button
      btn.classList.add('active');
      
      // Update global selected hex color
      selectedColorHex = btn.getAttribute('data-hex');
    });
  });
}

// 2. Virtual Garden Click-To-Plant
function setupGardenCanvas() {
  const canvas = document.getElementById('garden-canvas');
  if (!canvas) return;

  const maxFlowers = 40;
  const plantedFlowers = [];

  canvas.addEventListener('click', (e) => {
    // Get mouse position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create flower container
    const flower = document.createElement('div');
    flower.className = 'flower';
    flower.style.left = `${x}px`;
    flower.style.top = `${y}px`;
    flower.style.color = selectedColorHex; // Sets petal color via currentColor

    // Create stem
    const stem = document.createElement('div');
    stem.className = 'flower-stem';
    flower.appendChild(stem);

    // Create petals
    for (let i = 1; i <= 5; i++) {
      const petal = document.createElement('div');
      petal.className = `petal petal-${i}`;
      flower.appendChild(petal);
    }

    // Create flower center yellow core
    const center = document.createElement('div');
    center.className = 'flower-center';
    flower.appendChild(center);

    // Append to canvas
    canvas.appendChild(flower);
    plantedFlowers.push(flower);

    // Limit maximum number of flowers to keep page responsive
    if (plantedFlowers.length > maxFlowers) {
      const oldestFlower = plantedFlowers.shift();
      oldestFlower.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
      oldestFlower.style.transform = 'scale(0)';
      oldestFlower.style.opacity = '0';
      setTimeout(() => {
        if (oldestFlower.parentNode) {
          oldestFlower.parentNode.removeChild(oldestFlower);
        }
      }, 400);
    }
  });
}

// 3. Environmental Tips Rotating List
const ecoTips = [
  "Reduce waste by using a reusable water bottle. It saves hundreds of plastic bottles every year!",
  "Turn off the lights when leaving a room to conserve energy and reduce electricity demands.",
  "Shorten your showers by 2 minutes to save up to 10 gallons of water per day.",
  "Plant local flowers (like sunflowers or marigolds) to support local bees, butterflies, and birds.",
  "Compost organic kitchen food scraps. This reduces waste and yields rich fertilizer for soil.",
  "Unplug chargers when devices are fully powered. Standby chargers consume 'phantom electricity'.",
  "Choose walking, biking, or public transit over driving short distances to cut down air emissions.",
  "Avoid single-use plastics! Bring your own cloth bag whenever you go shopping.",
  "Turn off the tap while brushing your teeth. This simple act saves up to 4 gallons of water every time!",
  "Use natural light during the daytime to brighten your workspace and conserve power."
];

function setupTipGenerator() {
  const tipTextElement = document.getElementById('tip-text');
  const tipBtn = document.getElementById('tip-btn');
  if (!tipTextElement || !tipBtn) return;

  let lastIndex = 0;

  tipBtn.addEventListener('click', () => {
    // Select a random index that is different from the last one
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * ecoTips.length);
    } while (newIndex === lastIndex && ecoTips.length > 1);

    lastIndex = newIndex;

    // Fade out tip content
    tipTextElement.style.opacity = '0';
    tipTextElement.style.transform = 'translateY(5px)';
    
    // Swap text and fade back in after transitions complete
    setTimeout(() => {
      tipTextElement.textContent = ecoTips[newIndex];
      tipTextElement.style.opacity = '1';
      tipTextElement.style.transform = 'translateY(0)';
    }, 200);
  });
  
  // Set transition attributes in JS to maintain CSS style independence
  tipTextElement.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
}
