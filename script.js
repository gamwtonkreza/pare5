function toHumanReadableFormat(num) {
  if (num === 0) return '$0';
  num = num * 1000;
  
  const abs = Math.abs(num);
  if (abs >= 1_000_000_000) {
    return `$${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (abs >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(1)}M`;
  }
  if (abs >= 1_000) {
    return `$${(num / 1_000).toFixed(1)}K`;
  }
  return `$${num.toFixed(2)}`;
}

function rankExporters(exporters) {
  const sortedExporters = [...exporters].sort((a, b) => b.value - a.value);
  
  const rankedExporters = [];
  let currentRank = 1;
  
  sortedExporters.forEach((exporter, index) => {
    if (index === 0 || exporter.value !== sortedExporters[index - 1].value) {
      currentRank = index + 1;
    }
    
    rankedExporters.push({
      ...exporter,
      rank: exporter.value > 0 ? currentRank : sortedExporters.length + 1
    });
  });
  
  return rankedExporters;
}

function getCountryColor(exporters, countryName, countryValue) {
  const rankedExporters = rankExporters(exporters);
  
  const countryExporter = rankedExporters.find(exp => exp.name === countryName);
  
  if (!countryExporter) {
    return '#FF6B6B'; // Red for not found
  }
  
  if (countryExporter.rank <= 5) {
    return '#81C784'; // Green for top 5
  }
  
  if (countryValue > 0) {
    return '#FFB74D'; // Orange for non-zero, not top 5
  }
  
  return '#FF6B6B'; // Red for zero value
}

function createClipboardButton(container, today, selectedCountries) {
  // Remove the previous submit button
  const oldSubmitBtn = container.querySelector('button');
  if (oldSubmitBtn) {
    oldSubmitBtn.remove();
  }

  const clipboardBtn = document.createElement('button');
  clipboardBtn.textContent = 'Copy Results';
  clipboardBtn.style.padding = '8px 15px';
  clipboardBtn.style.backgroundColor = '#FFA500'; // Orange to match the design
  clipboardBtn.style.color = 'white';
  clipboardBtn.style.border = 'none';
  clipboardBtn.style.borderRadius = '4px';
  clipboardBtn.style.cursor = 'pointer';
  clipboardBtn.style.position = 'relative';
  
  // Flashing animation
  const flashAnimation = `
    @keyframes flash {
      0%, 50% { opacity: 1; }
      25%, 75% { opacity: 0.5; }
    }
  `;
  const styleSheet = document.createElement("style")
  styleSheet.type = "text/css"
  styleSheet.innerText = flashAnimation;
  document.head.appendChild(styleSheet);
  
  clipboardBtn.style.animation = 'flash 1.5s infinite';

  clipboardBtn.addEventListener('click', () => {
    // Prepare the clipboard text
    const today = JSON.parse(localStorage.getItem('todayChallenge'));
    const selectedCountries = Array.from(container.querySelectorAll('.country-slot'))
      .filter(slot => slot.querySelector('.country-name').textContent)
      .map(slot => {
        const countryName = slot.querySelector('.country-name').textContent;
        const valueSpan = slot.querySelector('.export-value');
        const backgroundColor = slot.style.backgroundColor;
        
        let emoji = '⚪'; // Default neutral emoji
        if (backgroundColor === 'rgb(129, 199, 132)') emoji = '🟢'; // Green
        if (backgroundColor === 'rgb(255, 107, 107)') emoji = '🔴'; // Red
        if (backgroundColor === 'rgb(255, 183, 77)') emoji = '🟡'; // Orange
        
        return { name: countryName, emoji };
      });

    // Get current date
    const currentDate = new Date().toLocaleDateString('en-US');
    
    // Calculate percentage
    const chosenExportValue = selectedCountries.reduce(
      (acc, item) => {
        const countryExporter = today.exporters.find(c => c.name === item.name);
        return acc + (countryExporter ? parseInt(countryExporter.value) : 0);
      }, 0
    );
    const percentage = (chosenExportValue / today.sum_of_top_5 * 100).toFixed(2);
    
    // Determine emojis for results
    const emojiString = selectedCountries.map(country => country.emoji).join(' ');
    
    // Construct clipboard text
    const clipboardText = `${currentDate} - ${today.product_name}
${percentage}%
${emojiString} ${selectedCountries.length}/5

Play: ${window.location.href}`;

    // Copy to clipboard
    navigator.clipboard.writeText(clipboardText).then(() => {
      // Temporary style change to indicate successful copy
      clipboardBtn.textContent = 'Copied!';
      clipboardBtn.style.backgroundColor = '#4CAF50';
      setTimeout(() => {
        clipboardBtn.textContent = 'Copy Results';
        clipboardBtn.style.backgroundColor = '#FFA500';
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  });

  container.appendChild(clipboardBtn);
}

async function addUnsplashImage(container, query) {
  const accessKey = '0VpGpJxCvP-QWQyOHlmQzv4dhG_6sX9EdbmXTTMMqQo';
  const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&client_id=${accessKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.urls && data.urls.regular) {
      const imgContainer = document.createElement('div');
      imgContainer.style.position = 'relative';
      imgContainer.style.width = '100%';
      imgContainer.style.paddingBottom = '50%'; // 2:1 aspect ratio
      imgContainer.style.overflow = 'hidden';
      imgContainer.style.borderRadius = '8px';
      imgContainer.style.marginBottom = '10px';
      const img = document.createElement('img');
      img.src = data.urls.regular;
      img.alt = query;
      img.style.position = 'absolute';
      img.style.top = '0';
      img.style.left = '0';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      imgContainer.appendChild(img);
      container.insertBefore(imgContainer, container.firstChild);
    }
  } catch (error) {
    console.error('Error fetching image:', error);
  }
}

function createInterface({today, country_names}) {
  const container = document.createElement('div');
  container.className = 'challenge-container';
  container.style.padding = '15px';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.maxWidth = '500px';
  container.style.margin = '0 auto';
  
  addUnsplashImage(container, today.product_name); // Fetch and insert the image
  
  const heading = document.createElement('h2');
  heading.textContent = `Today's Challenge: ${today.product_name}`;
  container.appendChild(heading);
  
  const description = document.createElement('p');
  description.textContent = 'Select the 5 countries with the highest export values for this category';
  container.appendChild(description);
  
  const slotsContainer = document.createElement('div');
  slotsContainer.className = 'country-slots';
  slotsContainer.style.display = 'flex';
  slotsContainer.style.flexDirection = 'column';
  slotsContainer.style.gap = '10px';
  slotsContainer.style.marginBottom = '15px';
  
  for (let i = 0; i < 5; i++) {
    const slot = document.createElement('div');
    slot.className = 'country-slot';
    slot.dataset.index = i;
    slot.style.width = '100%';
    slot.style.height = '40px';
    slot.style.backgroundColor = '#e0e0e0';
    slot.style.display = 'flex';
    slot.style.alignItems = 'center';
    slot.style.justifyContent = 'space-between';
    slot.style.borderRadius = '5px';
    slot.style.fontWeight = 'bold';
    slot.style.padding = '0 10px';
    slot.style.boxSizing = 'border-box';
    
    const countryName = document.createElement('span');
    countryName.className = 'country-name';
    slot.appendChild(countryName);
    
    const exportValue = document.createElement('span');
    exportValue.className = 'export-value';
    exportValue.style.fontFamily = 'monospace';
    slot.appendChild(exportValue);
    
    slotsContainer.appendChild(slot);
  }
  container.appendChild(slotsContainer);
  
  const searchContainer = document.createElement('div');
  searchContainer.style.position = 'relative';
  searchContainer.style.marginBottom = '15px';
  
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search Country...';
  searchInput.style.width = '100%';
  searchInput.style.padding = '8px';
  searchInput.style.boxSizing = 'border-box';
  searchInput.style.borderRadius = '4px';
  searchInput.style.border = '1px solid #ccc';
  searchContainer.appendChild(searchInput);
  
  const dropdown = document.createElement('ul');
  dropdown.style.position = 'absolute';
  dropdown.style.width = '100%';
  dropdown.style.maxHeight = '200px';
  dropdown.style.overflowY = 'auto';
  dropdown.style.border = '1px solid #ccc';
  dropdown.style.borderTop = 'none';
  dropdown.style.borderRadius = '0 0 4px 4px';
  dropdown.style.backgroundColor = 'white';
  dropdown.style.listStyle = 'none';
  dropdown.style.margin = '0';
  dropdown.style.padding = '0';
  dropdown.style.display = 'none';
  dropdown.style.zIndex = '100';
  searchContainer.appendChild(dropdown);
  
  container.appendChild(searchContainer);
  
  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'Add Country';
  submitBtn.style.padding = '8px 15px';
  submitBtn.style.backgroundColor = '#4CAF50';
  submitBtn.style.color = 'white';
  submitBtn.style.border = 'none';
  submitBtn.style.borderRadius = '4px';
  submitBtn.style.cursor = 'pointer';
  submitBtn.disabled = true;
  container.appendChild(submitBtn);
  
  const barGraphContainer = document.createElement('div');
  barGraphContainer.style.marginTop = '20px';
  
  const barGraphLabel = document.createElement('p');
  barGraphLabel.textContent = 'Progress toward top 5 exporters:';
  barGraphLabel.style.marginBottom = '5px';
  barGraphContainer.appendChild(barGraphLabel);
  
  const barGraph = document.createElement('canvas');
  barGraph.width = 400;
  barGraph.height = 50;
  barGraphContainer.appendChild(barGraph);
  
  container.appendChild(barGraphContainer);
  
  document.body.appendChild(container);
  
  let selectedCountry = null;
  
  function updateDropdown() {
    dropdown.innerHTML = '';
    
    const filterText = searchInput.value.toLowerCase();
    if (filterText) {
      const filteredCountries = country_names.filter(country => 
        country.toLowerCase().includes(filterText)
      );
      populateDropdown(filteredCountries);
    } else {
      populateDropdown(country_names);
    }
  }
  
  function populateDropdown(countryList) {
    const selectedCountries = Array.from(slotsContainer.querySelectorAll('.country-name'))
      .filter(span => span.textContent)
      .map(span => span.textContent);
    
    const availableCountries = countryList.filter(country => 
      !selectedCountries.includes(country)
    );
    
    if (availableCountries.length === 0) {
      const emptyItem = document.createElement('li');
      emptyItem.textContent = 'No countries found';
      emptyItem.style.padding = '8px 12px';
      emptyItem.style.color = '#999';
      dropdown.appendChild(emptyItem);
    } else {
      availableCountries.forEach(country => {
        const item = document.createElement('li');
        item.textContent = country;
        item.style.padding = '8px 12px';
        item.style.cursor = 'pointer';
        item.style.transition = 'background-color 0.2s';
        
        item.addEventListener('mouseover', () => {
          item.style.backgroundColor = '#f0f0f0';
        });
        item.addEventListener('mouseout', () => {
          item.style.backgroundColor = '';
        });
        
        item.addEventListener('click', () => {
          selectedCountry = country;
          searchInput.value = country;
          dropdown.style.display = 'none';
          submitBtn.disabled = false;
        });
        
        dropdown.appendChild(item);
      });
    }
  }
  
  function updateBarGraph(selectedCountriesWithValues) {
    selectedCountriesWithValues.sort((a, b) => a.value - b.value);
    const chosenExportValue = selectedCountriesWithValues.reduce(
      (acc, item) => acc + parseInt(item.value), 0
    );
    const proportion = (chosenExportValue / today.sum_of_top_5);
    
    const ctx = barGraph.getContext('2d');
    ctx.clearRect(0, 0, barGraph.width, barGraph.height);
    
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(0, 0, barGraph.width, barGraph.height);
    
    let currentX = 0;
    for (let i = 0; i < selectedCountriesWithValues.length; i++) {
      const countryData = selectedCountriesWithValues[i];
      const countryValue = parseInt(countryData.value);
      const countryProportion = countryValue / today.sum_of_top_5;
      const segmentWidth = barGraph.width * countryProportion;
      
      const baseColor = 120;
      const minLightness = 30;
      const maxLightness = 70;
      const lightness = maxLightness - ((i / Math.max(1, selectedCountriesWithValues.length - 1)) * (maxLightness - minLightness));
      
      ctx.fillStyle = `hsl(${baseColor}, 70%, ${lightness}%)`;
      ctx.fillRect(currentX, 0, segmentWidth, barGraph.height);
      
      if (segmentWidth > 20) {
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        const countryCode = countryData.country.substring(0, 2).toUpperCase();
        ctx.fillText(countryCode, currentX + (segmentWidth / 2), barGraph.height / 2 + 5);
      }
      
      currentX += segmentWidth;
    }
    
    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(proportion * 100)}%`, barGraph.width / 2, barGraph.height / 2 + 5);
  }
  
  searchInput.addEventListener('focus', () => {
    updateDropdown();
    dropdown.style.display = 'block';
  });
  
  searchInput.addEventListener('input', () => {
    updateDropdown();
    dropdown.style.display = 'block';
    selectedCountry = null;
    submitBtn.disabled = true;
  });
  
  submitBtn.addEventListener('click', () => {
    if (selectedCountry) {
      const countryExporter = today.exporters.find(c => c.name === selectedCountry);
      const value = countryExporter?.value || 0;
      
      const emptySlot = Array.from(slotsContainer.querySelectorAll('.country-slot'))
        .find(slot => !slot.querySelector('.country-name').textContent);
      
      if (emptySlot) {
        const nameSpan = emptySlot.querySelector('.country-name');
        nameSpan.textContent = selectedCountry;
        
        const valueSpan = emptySlot.querySelector('.export-value');
        const exportersValuesArray = today.exporters.map(exporter => exporter.value);
        let rank = exportersValuesArray.sort((a, b) => b - a).indexOf(value);
        if (rank === -1) {
          rank = exportersValuesArray.length + 1;
        }
        valueSpan.textContent = `${toHumanReadableFormat(value)} (${rank})`;
        
        emptySlot.style.backgroundColor = getCountryColor(today.exporters, selectedCountry, value);
        
        const filledCountries = Array.from(slotsContainer.querySelectorAll('.country-slot'))
          .filter(slot => slot.querySelector('.country-name').textContent)
          .map(slot => {
            const countryName = slot.querySelector('.country-name').textContent;
            const countryExporter = today.exporters.find(c => c.name === countryName);
            return {
              country: countryName,
              value: countryExporter ? countryExporter.value : 0
            };
          });
        
        updateBarGraph(filledCountries);
        
        searchInput.value = '';
        selectedCountry = null;
        submitBtn.disabled = true;
        
        if (filledCountries.length >= 5) {
          searchInput.disabled = true;
          
          // Replace submit button with clipboard button
          createClipboardButton(container, today, filledCountries);
        }
      }
    }
  });
  
  document.addEventListener('click', (event) => {
    if (!searchContainer.contains(event.target)) {
      dropdown.style.display = 'none';
    }
  });
  
  updateBarGraph([]);
}

function todayChallenge() {
  return Promise.all([
    fetch('/pare5/today.json').then(response => response.json()),
    fetch('/pare5/country_names.json').then(response => response.json())
  ]).then(([today, country_names]) => {
    // Store in localStorage for clipboard access
    localStorage.setItem('todayChallenge', JSON.stringify(today));
    return { today, country_names };
  })
}

let have_started = false;
function startChallenge() {
    if (have_started) {
        return;
    }
    have_started = true;
   
    todayChallenge()
        .then(data => {
            console.log("Today's challenge:", data.today);
            createInterface(data);
        })
        .catch(err => {
            console.error("Failed to load challenge:", err);
        });
}

window.addEventListener('load', startChallenge);