const fs = require('fs');
const path = require('path');

// Configuration
const IMAGES_DIR = path.join(__dirname, 'images');
const OUTPUT_DIR = path.join(__dirname);
const IMAGES_PER_LOAD = 24;

// Helper to extract year and category from filename
function parseImageName(filename) {
  const match = filename.match(/^(\d{4})/);
  const year = match ? match[1] : 'other';

  let category = 'other';
  if (filename.includes('Banquet')) category = 'banquet';
  else if (filename.includes('Sash') || filename.includes('Ceremony')) category = 'ceremony';
  else if (filename.includes('Mass')) category = 'mass';
  else if (filename.includes('more_pictures')) category = 'more';
  else if (filename.includes('Parade')) category = 'parade';

  return { year, category, filename };
}

// Get alt text from filename
function getAltText(filename) {
  return filename
    .replace(/\.[^.]+$/, '')
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .substring(0, 100);
}

// Read all images
const files = fs.readdirSync(IMAGES_DIR).filter(f =>
  /\.(jpg|jpeg|png|gif|webp)$/i.test(f)
);

console.log(`Found ${files.length} images`);

// Organize by year and category
const imagesByYear = {};
files.forEach(file => {
  const { year, category } = parseImageName(file);

  if (!imagesByYear[year]) {
    imagesByYear[year] = {};
  }
  if (!imagesByYear[year][category]) {
    imagesByYear[year][category] = [];
  }
  imagesByYear[year][category].push(file);
});

// Generate gallery HTML for each year
Object.keys(imagesByYear).sort().reverse().forEach(year => {
  if (year === 'other') return; // Skip non-dated images

  const yearData = imagesByYear[year];
  const filename = `gallery-${year}.html`;
  const filepath = path.join(OUTPUT_DIR, filename);

  // Count images
  const totalCount = Object.values(yearData).reduce((sum, arr) => sum + arr.length, 0);

  // Generate gallery items HTML
  function generateGalleryItems(images) {
    return images.map((img, idx) => {
      const hidden = idx >= IMAGES_PER_LOAD ? ' gallery-hidden' : '';
      return `          <div class="gallery-item${hidden}" data-src="images/${img}" data-alt="${getAltText(img)}">
            <img src="images/${img}" alt="${getAltText(img)}" loading="lazy">
            <div class="gallery-item-overlay">View</div>
          </div>`;
    }).join('\n');
  }

  // Build gallery sections
  let galleryHTML = '';
  let sectionNum = 0;

  // Parade photos first
  if (yearData.parade && yearData.parade.length > 0) {
    sectionNum++;
    const count = yearData.parade.length;
    const gridId = `grid-${year}-parade`;
    const btnId = `btn-parade`;
    const hasMore = count > IMAGES_PER_LOAD;

    galleryHTML += `    <div class="section-header">
      <span class="eyebrow">October ${year}</span>
      <h2>${year} Pulaski Day Parade</h2>
      <div class="divider"></div>
      <p class="lead" style="font-size:.9375rem;">5th Avenue, New York City &mdash; ${count} photos.</p>
    </div>
    <div class="gallery-grid" id="${gridId}">
${generateGalleryItems(yearData.parade)}
    </div>
${hasMore ? `    <div class="text-center mt-6" id="wrap-${btnId}">
      <button class="btn btn-outline" id="${btnId}" onclick="loadMorePhotos('${gridId}','wrap-${btnId}')">Load More Parade Photos</button>
    </div>` : ''}

`;
  }

  // More parade photos
  if (yearData.more && yearData.more.length > 0) {
    sectionNum++;
    const count = yearData.more.length;
    const gridId = `grid-${year}-more`;
    const btnId = `btn-more`;
    const hasMore = count > IMAGES_PER_LOAD;

    galleryHTML += `    <h3 style="margin:${sectionNum > 1 ? '3rem' : '1.5rem'} 0 .75rem;color:var(--navy);">More ${year} Parade Photos</h3>
    <p style="margin-bottom:1.5rem;color:var(--gray-600);font-size:.9375rem;">Additional photographs from the ${year} parade &mdash; ${count} photos.</p>
    <div class="gallery-grid" id="${gridId}">
${generateGalleryItems(yearData.more)}
    </div>
${hasMore ? `    <div class="text-center mt-6" id="wrap-${btnId}">
      <button class="btn btn-outline" id="${btnId}" onclick="loadMorePhotos('${gridId}','wrap-${btnId}')">Load More Photos</button>
    </div>` : ''}

`;
  }

  // Banquet photos
  if (yearData.banquet && yearData.banquet.length > 0) {
    sectionNum++;
    const count = yearData.banquet.length;
    const gridId = `grid-${year}-banquet`;
    const btnId = `btn-banquet`;
    const hasMore = count > IMAGES_PER_LOAD;

    galleryHTML += `    <h3 style="margin:${sectionNum > 1 ? '3rem' : '1.5rem'} 0 .75rem;color:var(--navy);">${year} Pulaski Parade Banquet</h3>
    <p style="margin-bottom:1.5rem;color:var(--gray-600);font-size:.9375rem;">Banquet photos &mdash; ${count} photos.</p>
    <div class="gallery-grid" id="${gridId}">
${generateGalleryItems(yearData.banquet)}
    </div>
${hasMore ? `    <div class="text-center mt-6" id="wrap-${btnId}">
      <button class="btn btn-outline" id="${btnId}" onclick="loadMorePhotos('${gridId}','wrap-${btnId}')">Load More Banquet Photos</button>
    </div>` : ''}

`;
  }

  // Ceremony/Mass photos
  if (yearData.ceremony && yearData.ceremony.length > 0) {
    sectionNum++;
    const count = yearData.ceremony.length;
    const gridId = `grid-${year}-ceremony`;
    const btnId = `btn-ceremony`;
    const hasMore = count > IMAGES_PER_LOAD;
    const ceremonyType = year === '2014' ? 'Parade Mass' : 'Ceremony';

    galleryHTML += `    <h3 style="margin:${sectionNum > 1 ? '3rem' : '1.5rem'} 0 .75rem;color:var(--navy);">${year} ${ceremonyType}</h3>
    <p style="margin-bottom:1.5rem;color:var(--gray-600);font-size:.9375rem;">${ceremonyType} photos &mdash; ${count} photos.</p>
    <div class="gallery-grid" id="${gridId}">
${generateGalleryItems(yearData.ceremony)}
    </div>
${hasMore ? `    <div class="text-center mt-6" id="wrap-${btnId}">
      <button class="btn btn-outline" id="${btnId}" onclick="loadMorePhotos('${gridId}','wrap-${btnId}')">Load More ${ceremonyType} Photos</button>
    </div>` : ''}

`;
  }

  // Other photos
  if (yearData.other && yearData.other.length > 0) {
    sectionNum++;
    const count = yearData.other.length;
    const gridId = `grid-${year}-other`;
    const btnId = `btn-other`;
    const hasMore = count > IMAGES_PER_LOAD;

    galleryHTML += `    <h3 style="margin:${sectionNum > 1 ? '3rem' : '1.5rem'} 0 .75rem;color:var(--navy);">${year} Additional Photos</h3>
    <p style="margin-bottom:1.5rem;color:var(--gray-600);font-size:.9375rem;">Additional photos &mdash; ${count} photos.</p>
    <div class="gallery-grid" id="${gridId}">
${generateGalleryItems(yearData.other)}
    </div>
${hasMore ? `    <div class="text-center mt-6" id="wrap-${btnId}">
      <button class="btn btn-outline" id="${btnId}" onclick="loadMorePhotos('${gridId}','wrap-${btnId}')">Load More Photos</button>
    </div>` : ''}

`;
  }

  // Create the full HTML document
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${year} Photo Gallery — Pulaski Day Parade</title>
  <meta name="description" content="Photos from the ${year} Pulaski Day Parade, 5th Avenue, New York City." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="css/styles.css" />
  <style>
    .gallery-hidden{display:none!important}
  </style>
</head>
<body>

<div class="top-bar">
  <div class="container">
    <div><svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true" style="vertical-align:middle;margin-right:.3rem"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>5th Avenue, New York City &nbsp;|&nbsp; October 4, 2026 at 12:30pm</div>
    <div class="top-bar-right"><svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true" style="vertical-align:middle;margin-right:.3rem"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/></svg><a href="mailto:events@pulaskiparade.org">events@pulaskiparade.org</a></div>
  </div>
</div>

<nav class="navbar">
  <div class="container">
    <div class="navbar-inner">
      <a href="index.html" class="navbar-brand">
        <div class="navbar-logo"><img src="images/Gen.CasimirPulaski.png" alt="General Casimir Pulaski" style="width:36px;height:36px;object-fit:contain;" /></div>
        <div class="navbar-brand-text">
          <strong>Pulaski Day Parade</strong>
          <span>New York City · Est. 1937</span>
        </div>
      </a>
      <div class="nav-links">
        <a href="index.html">Home</a>
        <a href="about.html">About</a>
        <div class="nav-dropdown">
          <a href="parade.html" class="active">Parade ▾</a>
          <div class="dropdown-menu">
            <a href="parade.html">2026 Parade Info</a>
            <a href="program.html">Parade Program</a>
            <a href="contingents.html">Contingents</a>
            <a href="gallery.html">Photo Gallery</a>
          </div>
        </div>
        <a href="events.html">Events</a>
        <a href="membership.html">Membership</a>
        <a href="sponsors.html">Sponsors</a>
        <a href="contact.html">Contact</a>
      </div>
      <button class="hamburger" id="hamburger"><span></span><span></span><span></span></button>
    </div>
    <div class="mobile-nav" id="mobileNav">
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
      <a href="parade.html">2026 Parade</a>
      <a href="events.html">Events</a>
      <a href="membership.html">Membership</a>
      <a href="gallery.html">Gallery</a>
      <a href="contact.html">Contact</a>
    </div>
  </div>
</nav>

<div class="page-hero">
  <div class="container">
    <div class="breadcrumb">
      <a href="index.html">Home</a> <span>›</span> <a href="gallery.html">Photo Gallery</a> <span>›</span> <span>${year}</span>
    </div>
    <h1>${year} Photo Gallery</h1>
    <p class="lead">Photos from the General Casimir Pulaski Memorial Parade and related events, ${year}.</p>
  </div>
</div>

<section class="section">
  <div class="container">

${galleryHTML}

    <div class="text-center mt-6">
      <a href="gallery.html" class="btn btn-outline">&larr; Back to Photo Gallery</a>
    </div>
  </div>
</section>

<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <h3>General Casimir Pulaski<br>Memorial Parade Committee</h3>
        <p>Celebrating Polish-American heritage since 1937 on 5th Avenue, New York City.</p>
      </div>
      <div class="footer-col">
        <h4>Pages</h4>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="parade.html">2026 Parade</a></li>
          <li><a href="events.html">Events</a></li>
          <li><a href="contingents.html">Contingents</a></li>
          <li><a href="gallery.html">Gallery</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Resources</h4>
        <ul>
          <li><a href="membership.html">Membership</a></li>
          <li><a href="scholarships.html">Scholarships</a></li>
          <li><a href="sponsors.html">Sponsors</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Contact</h4>
        <ul>
          <li><a href="mailto:events@pulaskiparade.org"><svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true" style="vertical-align:middle;margin-right:.3rem"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/></svg>events@pulaskiparade.org</a></li>
          <li><a href="https://www.facebook.com/PulaskiParadeNY" target="_blank" rel="noopener"><svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" style="vertical-align:middle;margin-right:.3rem"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>Facebook</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div>© 2026 General Casimir Pulaski Memorial Parade Committee, Inc.</div>
    </div>
  </div>
</footer>

<button id="scrollTop" aria-label="Back to top">↑</button>
<script src="js/main.js"></script>
</body>
</html>`;

  // Write file
  fs.writeFileSync(filepath, htmlContent, 'utf8');
  console.log(`✓ Generated ${filename} with ${totalCount} images`);
});

console.log('\n✓ Gallery generation complete!');
