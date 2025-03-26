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
  if (abs >= 100) {
    return `$${num.toFixed(0)}`;
  }
  return `$${num.toFixed(2)}`;
}

function getCountryColor(rank, countryValue) {
  if (countryValue === 0) {
    return '#FF6B6B'; // Red for not found
  }
  
  if (rank <= 5) {
    return '#81C784'; // Green for top 5
  }
  
  if (countryValue > 0) {
    return '#FFB74D'; // Orange for non-zero, not top 5
  }
  
  return '#FF6B6B'; // Red for zero value
}

async function generateShareableUrl(today, selectedCountries) {
  try {
    // Create a data object with essential information
    const data = {
      product: today.product_name,
      year: today.year,
      countries: selectedCountries.map(country => country.code) // Changed to store country codes
    };
    
    // Convert to base64
    const encodedData = btoa(JSON.stringify(data));
    
    // Create URL with data in hash fragment
    const baseUrl = window.location.href.split('#')[0];
    const fullUrl = `${baseUrl}#results=${encodedData}`;
    
    // Use TinyURL API to shorten the URL
    const tinyUrlApi = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(fullUrl)}`;
    const response = await fetch(tinyUrlApi);
    
    if (response.ok) {
      // Get the shortened URL from the response
      const shortUrl = await response.text();
      return shortUrl;
    } else {
      console.error("Error from TinyURL API:", response.statusText);
      return fullUrl; // Fall back to the original URL if shortening fails
    }
  } catch (e) {
    console.error("Error generating URL:", e);
    return "invalid url";
  }
}        
        
function getCountryNameByCode(today, countryCode) {
  // Find country name by code in the country_codes dictionary
  for (const [name, code] of Object.entries(today.country_codes)) {
    if (code === countryCode) {
      return name;
    }
  }
  return null;
}

// Function to generate the results text - used by both copy and display functions
async function generateResultsText(today, selectedCountries) {
  // Get current date
  const currentDate = new Date().toLocaleDateString('en-US');
  
  // Calculate percentage
  const chosenExportValue = selectedCountries.reduce(
    (acc, item) => {
      const countryExporter = today.exporters.find(c => c.country_code === item.code);
      return acc + (countryExporter ? parseInt(countryExporter.value) : 0);
    }, 0
  );
  const percentage = (chosenExportValue / today.sum_of_top_5 * 100).toFixed(2);
  
  // Determine emojis for results
  const emojiString = selectedCountries.map(country => {
    const countryExporter = today.exporters.find(c => c.country_code === country.code);
    let emoji = '⚪'; // Default neutral emoji
    if (countryExporter) {
      const rank = today.exporters
        .sort((a, b) => parseInt(b.value) - parseInt(a.value))
        .findIndex(e => e.country_code === country.code) + 1;
      if (rank <= 5) emoji = '🟢'; // Green for top 5
      else if (parseInt(countryExporter.value) > 0) emoji = '🟡'; // Yellow for non-zero
      else emoji = '🔴'; // Red for zero
    } else {
      emoji = '🔴'; // Red for not found
    }
    return emoji;
  }).join(' ');
  
  // Count green emojis
  const greenEmojis = emojiString.match(/🟢/g) || [];
  const emojiCount = greenEmojis.length;
  
  // Generate shareable URL
  const shareableUrl = await generateShareableUrl(today, selectedCountries);
  
  // Construct results text
  return `${currentDate} - ${today.product_name} το ${today.year}
${percentage}%
${emojiString} ${emojiCount}/5
Παίξε στο: ${window.location.href}
Τα αποτελέσματά μου: ${shareableUrl}`;
}

function displayCorrectAnswers(container, today) {
  // Create header for correct answers section
  const correctHeader = document.createElement('h3');
  correctHeader.textContent = 'Λύσεις';
  correctHeader.style.marginTop = '30px';
  correctHeader.style.marginBottom = '15px';
  container.appendChild(correctHeader);
  
  // Create container for correct answer slots
  const correctSlotsContainer = document.createElement('div');
  correctSlotsContainer.className = 'correct-country-slots';
  correctSlotsContainer.style.display = 'flex';
  correctSlotsContainer.style.flexDirection = 'column';
  correctSlotsContainer.style.gap = '10px';
  correctSlotsContainer.style.marginBottom = '20px';
  
  // Get top 5 exporters sorted by value
  const top5Exporters = [...today.exporters]
    .sort((a, b) => parseInt(b.value) - parseInt(a.value))
    .slice(0, 5);
  
  // Create slots for each of the top 5 exporters
  top5Exporters.forEach((exporter, index) => {
    const slot = document.createElement('div');
    slot.className = 'correct-country-slot';
    slot.style.width = '100%';
    slot.style.height = '40px';
    slot.style.backgroundColor = '#81C784'; // Always green for correct answers
    slot.style.display = 'flex';
    slot.style.alignItems = 'center';
    slot.style.justifyContent = 'space-between';
    slot.style.borderRadius = '5px';
    slot.style.fontWeight = 'bold';
    slot.style.padding = '0 10px';
    slot.style.boxSizing = 'border-box';
    
    // Add rank indicator
    const rankIndicator = document.createElement('span');
    rankIndicator.textContent = `#${index + 1}`;
    rankIndicator.style.minWidth = '30px';
    rankIndicator.style.textAlign = 'center';
    rankIndicator.style.backgroundColor = '#4CAF50';
    rankIndicator.style.color = 'white';
    rankIndicator.style.borderRadius = '4px';
    rankIndicator.style.padding = '2px 5px';
    rankIndicator.style.marginRight = '10px';
    slot.appendChild(rankIndicator);
    
    // Country name from country code
    const countryName = document.createElement('span');
    const countryNameStr = getCountryNameByCode(today, exporter.country_code);
    const countryEmoji = today.emojis[exporter.country_code];
    if (countryNameStr) {
      countryName.textContent = `${countryEmoji} ${countryNameStr}`;
    } else {
      countryName.textContent = `Unknown (country code: ${exporter.country_code})`;
    }
    countryName.style.fontSize = '20px';
    countryName.style.flexGrow = '1';
    slot.appendChild(countryName);
    
    // Value
    const exportValue = document.createElement('span');
    exportValue.textContent = toHumanReadableFormat(exporter.value);
    exportValue.style.fontFamily = 'monospace';
    exportValue.style.fontSize = '20px';
    slot.appendChild(exportValue);
    
    correctSlotsContainer.appendChild(slot);
  });
  
  container.appendChild(correctSlotsContainer);
}

function createClipboardButton(container, today, selectedCountries) {
  // Remove the previous submit button
  const oldSubmitBtn = container.querySelector('button');
  if (oldSubmitBtn) {
    oldSubmitBtn.remove();
  }
  
  // Create the copy button
  const clipboardBtn = document.createElement('button');
  clipboardBtn.textContent = 'Αντιγραφή Αποτελεσμάτων';
  clipboardBtn.style.padding = '8px 15px';
  clipboardBtn.style.backgroundColor = '#FFA500'; // Orange to match the design
  clipboardBtn.style.color = 'white';
  clipboardBtn.style.border = 'none';
  clipboardBtn.style.borderRadius = '4px';
  clipboardBtn.style.cursor = 'pointer';
  clipboardBtn.style.position = 'relative';
  clipboardBtn.style.width = '100%';
  
  // Flashing animation
  const flashAnimation = `
    @keyframes flash {
      0%, 50% { opacity: 1; }
      25%, 75% { opacity: 0.5; }
    }
  `;
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = flashAnimation;
  document.head.appendChild(styleSheet);
  
  clipboardBtn.style.animation = 'flash 1.5s infinite';
  
  // Create the show text button
  const showTextBtn = document.createElement('button');
  showTextBtn.textContent = 'Είμαι η μαριλενα και δε μπορω να κανω κοπι';
  showTextBtn.style.padding = '8px 15px';
  showTextBtn.style.backgroundColor = '#2196F3'; // Blue button
  showTextBtn.style.color = 'white';
  showTextBtn.style.border = 'none';
  showTextBtn.style.borderRadius = '4px';
  showTextBtn.style.cursor = 'pointer';
  showTextBtn.style.marginTop = '10px';
  showTextBtn.style.width = '100%';
  
  // Create a hidden text area for the results that will be toggled
  const resultsTextArea = document.createElement('textarea');
  resultsTextArea.style.width = '100%';
  resultsTextArea.style.height = '120px';
  resultsTextArea.style.padding = '10px';
  resultsTextArea.style.marginTop = '10px';
  resultsTextArea.style.marginBottom = '20px';
  resultsTextArea.style.boxSizing = 'border-box';
  resultsTextArea.style.border = '1px solid #ccc';
  resultsTextArea.style.borderRadius = '4px';
  resultsTextArea.style.display = 'none'; // Initially hidden
  resultsTextArea.readOnly = true; // Make it read-only

  const resTextPromise = generateResultsText(today, selectedCountries);
  
  // Function for clipboard button click
  clipboardBtn.addEventListener('click', async () => {
    // Generate results text using the shared function
    const clipboardText = await resTextPromise;
    // generateResultsText(today, selectedCountries);
    
    // Copy to clipboard
    navigator.clipboard.writeText(clipboardText).then(() => {
      // Temporary style change to indicate successful copy
      clipboardBtn.textContent = 'Αντιγράφηκαν!';
      clipboardBtn.style.backgroundColor = '#4CAF50';
      setTimeout(() => {
        clipboardBtn.textContent = 'Αντιγραφή Αποτελεσμάτων';
        clipboardBtn.style.backgroundColor = '#FFA500';
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  });
  
  // Generate and set the initial content for the text area
  // generateResultsText(today, selectedCountries).then(text => {
  resTextPromise.then(text => {
    resultsTextArea.value = text;
  });
  
  // Function for show text button click
  showTextBtn.addEventListener('click', () => {
    if (resultsTextArea.style.display === 'none') {
      resultsTextArea.style.display = 'block';
      showTextBtn.textContent = 'Εντάξει Κρύψτο';
    } else {
      resultsTextArea.style.display = 'none';
      showTextBtn.textContent = 'Είμαι η μαριλενα και δε μπορω να κανω κοπι';
    }
  });
  
  // Add buttons and text area to container
  container.appendChild(clipboardBtn);
  container.appendChild(showTextBtn);
  container.appendChild(resultsTextArea);
  
  // Display correct answers
  displayCorrectAnswers(container, today);
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

// Helper function to get country code by name
function getCountryCodeByName(today, countryName) {
  return today.country_codes[countryName];
}

function createInterface({today}) {
  const container = document.createElement('div');
  container.className = 'challenge-container';
  container.style.padding = '15px';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.maxWidth = '500px';
  container.style.margin = '0 auto';
  
  // Get all country names from the country_codes object
  const country_names = Object.keys(today.country_codes);

  // For all countries, get the code and add the corresponding emoji, by querying today.emoji with the code

  const name_to_emoji = {};
  for (const country of country_names) {
    const code = today.country_codes[country];
    const emoji = today.emojis[code];
    name_to_emoji[country] = emoji;
  }
  
  // Check if there's a shared result in the URL
  const hashParams = window.location.hash.substring(1).split('&');
  let sharedResult = null;
  
  for (const param of hashParams) {
    if (param.startsWith('results=')) {
      try {
        const encodedData = param.split('=')[1];
        sharedResult = JSON.parse(atob(encodedData));
        
        // Validate the shared result
        if (!sharedResult.product || !sharedResult.year || !Array.isArray(sharedResult.countries)) {
          console.error("Invalid shared result format");
          sharedResult = null;
        }
      } catch (e) {
        console.error("Error parsing shared result:", e);
        alert("Invalid URL");
        sharedResult = null;
      }
      break;
    }
  }
  
  addUnsplashImage(container, today.product_name); // Fetch and insert the image
  
  const heading = document.createElement('h2');
  heading.textContent = `Σημερινό πικ: ${today.product_name} το ${today.year}`;
  container.appendChild(heading);
  
  // If viewing a shared result, show that info
  if (sharedResult && sharedResult.product === today.product_name && sharedResult.year === today.year) {
    const sharedInfo = document.createElement('div');
    sharedInfo.style.backgroundColor = '#f0f0f0';
    sharedInfo.style.padding = '10px';
    sharedInfo.style.borderRadius = '5px';
    sharedInfo.style.marginBottom = '15px';
    sharedInfo.innerHTML = `<strong>Viewing shared result</strong>`;
    container.appendChild(sharedInfo);
  }
  
  const description = document.createElement('p');
  description.textContent = `Διάλεξε ποιοί ήταν οι τοπ 5 εξαγωγείς της κατηγορίας το ${today.year}`;
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
  searchInput.placeholder = 'Αναζήτηση Χώρας...';
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
  submitBtn.textContent = 'Επιλογή Χώρας';
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
  barGraphLabel.textContent = 'Πρόοδος για την μοιρασιά των πρώτων 5:';
  barGraphLabel.style.marginBottom = '5px';
  barGraphContainer.appendChild(barGraphLabel);
  
  const barGraph = document.createElement('canvas');
  barGraph.width = 400;
  barGraph.height = 50;
  barGraphContainer.appendChild(barGraph);
  
  container.appendChild(barGraphContainer);
  
  document.body.appendChild(container);
  
  let selectedCountry = null;
  let selectedCountryCode = null;
  
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
      .map(span => span.dataset.countryName);
    
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
        item.textContent = `${country} ${name_to_emoji[country]}`;
        item.style.padding = '8px 12px';
        item.style.cursor = 'pointer';
        item.style.transition = 'background-color 0.2s';
        item.style.fontSize = '20px';
        
        item.addEventListener('mouseover', () => {
          item.style.backgroundColor = '#f0f0f0';
        });
        item.addEventListener('mouseout', () => {
          item.style.backgroundColor = '';
        });
        
        item.addEventListener('click', () => {
          selectedCountry = country;
          selectedCountryCode = today.country_codes[country];
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
    selectedCountryCode = null;
    submitBtn.disabled = true;
  });
  
  submitBtn.addEventListener('click', () => {
    if (selectedCountry && selectedCountryCode) {
      const countryExporter = today.exporters.find(c => c.country_code === selectedCountryCode);
      const value = countryExporter?.value || 0;
      
      const emptySlot = Array.from(slotsContainer.querySelectorAll('.country-slot'))
        .find(slot => !slot.querySelector('.country-name').textContent);
      
      if (emptySlot) {
        const nameSpan = emptySlot.querySelector('.country-name');
        nameSpan.textContent = `${name_to_emoji[selectedCountry]} ${selectedCountry}`;
        nameSpan.style.fontSize = '20px';
        nameSpan.dataset.countryCode = selectedCountryCode; // Store country code in dataset
        nameSpan.dataset.countryName = selectedCountry; // Store country code in dataset
        
        const valueSpan = emptySlot.querySelector('.export-value');
        const exportersValuesArray = today.exporters.map(exporter => exporter.value);
        let rank = exportersValuesArray.sort((a, b) => b - a).indexOf(value) + 1;
        if (rank === 0) {
          rank = exportersValuesArray.length + 1;
        }
        valueSpan.textContent = `${toHumanReadableFormat(value)} (${rank})`;
        valueSpan.style.fontSize = '20px';
        
        emptySlot.style.backgroundColor = getCountryColor(rank, value);
        
        const filledCountries = Array.from(slotsContainer.querySelectorAll('.country-slot'))
          .filter(slot => slot.querySelector('.country-name').textContent)
          .map(slot => {
            const countryName = slot.querySelector('.country-name').dataset.countryName;
            const countryCode = slot.querySelector('.country-name').dataset.countryCode;
            const countryExporter = today.exporters.find(c => c.country_code === parseInt(countryCode));
            return {
              country: countryName,
              code: parseInt(countryCode),
              value: countryExporter ? countryExporter.value : 0
            };
          });
        
        updateBarGraph(filledCountries);
        
        searchInput.value = '';
        selectedCountry = null;
        selectedCountryCode = null;
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
  
  // If viewing a shared result, automatically fill in the countries
  if (sharedResult) {
    // Disable search and submit
    searchInput.disabled = true;
    submitBtn.disabled = true;

    // Also hide the search bar
    searchContainer.style.display = 'none';

    // hide all 'button'
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(button => {
      button.style.display = 'none';
    });


    // Fill in the countries from the shared result
    const slots = Array.from(slotsContainer.querySelectorAll('.country-slot'));
    const countriesToFill = sharedResult.countries.slice(0, 5); // Limit to 5 countries
    
    countriesToFill.forEach((countryCode, index) => {
      if (index < slots.length) {
        const slot = slots[index];
        const nameSpan = slot.querySelector('.country-name');
        const countryName = getCountryNameByCode(today, parseInt(countryCode));
        const country_emoji = name_to_emoji[countryName];
        if (countryName) {
          nameSpan.textContent = `${country_emoji} ${countryName}`
        } else {
          nameSpan.textContent = `Unknown (${countryCode})`;
        }
        nameSpan.dataset.countryCode = countryCode;
        nameSpan.style.fontSize = '20px';
        
        const countryExporter = today.exporters.find(c => c.country_code === parseInt(countryCode));
        const value = countryExporter?.value || 0;
        
        const valueSpan = slot.querySelector('.export-value');
        const exportersValuesArray = today.exporters.map(exporter => exporter.value);
        let rank = exportersValuesArray.sort((a, b) => b - a).indexOf(value) + 1;
        if (rank === 0) {
          rank = exportersValuesArray.length + 1;
        }
        valueSpan.textContent = `${toHumanReadableFormat(value)} (${rank})`;
        valueSpan.style.fontSize = '20px';
        
        slot.style.backgroundColor = getCountryColor(rank, value);
      }
    });
    
    // Update bar graph
    const filledCountries = countriesToFill.map(countryCode => {
      const parsedCode = parseInt(countryCode);
      const countryName = getCountryNameByCode(today, parsedCode);
      const countryExporter = today.exporters.find(c => c.country_code === parsedCode);
      return {
        country: countryName || `Unknown (${countryCode})`,
        code: parsedCode,
        value: countryExporter ? countryExporter.value : 0
      };
    });
    
    updateBarGraph(filledCountries);
    
    // Create clipboard button and show correct answers
    if (filledCountries.length === 5) {

      displayCorrectAnswers(container, today);
      // createClipboardButton(container, today, filledCountries.map(country => ({ 
      //   name: country.country, 
      //   code: country.code 
      // })));
    }
  } else {
    updateBarGraph([]);
  }
}

function todayChallenge() {
  return fetch('/pare5/today.json')
    .then(response => response.json())
    .then(today => {
      // Ensure exporters have name property based on country_code
      today.exporters.forEach(exporter => {
        // Make sure country_code is an integer
        exporter.country_code = parseInt(exporter.country_code);
      });
      
      // Store in localStorage for clipboard access
      return { today };
    });
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
