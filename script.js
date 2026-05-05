// API Configuration
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : `${window.location.origin}/api`;

// Data Storage
let memories = {};
let specialDates = {};
let counterOffset = { years: 0, months: 0, days: 0 }; // Manual adjustment
let mainPhoto = null; // Store main photo
let currentDate = new Date();
let selectedDate = null;
let selectedMood = '';
let uploadedImages = [];
let isAuthenticated = false;

// Default credentials
const DEFAULT_USERNAME = 'jayvee';
const DEFAULT_PASSWORD = 'kimchiii';

// API Functions
async function loadData() {
    try {
        const response = await fetch(`${API_URL}/data`);
        const data = await response.json();
        memories = data.memories || {};
        specialDates = data.specialDates || {};
        counterOffset = data.counterOffset || { years: 0, months: 0, days: 0 };
        mainPhoto = data.mainPhoto || null;
        return data;
    } catch (error) {
        console.error('Failed to load data:', error);
        return { memories: {}, specialDates: {}, counterOffset: { years: 0, months: 0, days: 0 }, music: null, musicName: null, mainPhoto: null };
    }
}

async function saveMemories() {
    try {
        await fetch(`${API_URL}/memories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(memories)
        });
    } catch (error) {
        console.error('Failed to save memories:', error);
    }
}

async function saveSpecialDates() {
    try {
        await fetch(`${API_URL}/special-dates`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(specialDates)
        });
    } catch (error) {
        console.error('Failed to save special dates:', error);
    }
}

async function saveCounterOffset() {
    try {
        await fetch(`${API_URL}/counter-offset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(counterOffset)
        });
    } catch (error) {
        console.error('Failed to save counter offset:', error);
    }
}

async function saveMusic(musicData, musicName) {
    try {
        await fetch(`${API_URL}/music`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ music: musicData, musicName: musicName })
        });
    } catch (error) {
        console.error('Failed to save music:', error);
    }
}

async function saveMainPhoto(photoData) {
    try {
        await fetch(`${API_URL}/main-photo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mainPhoto: photoData })
        });
    } catch (error) {
        console.error('Failed to save main photo:', error);
    }
}


// Love Quotes
const loveQuotes = [
    "Every love story is beautiful, but ours is my favorite.",
    "In you, I've found the love of my life and my closest, truest friend.",
    "You are my today and all of my tomorrows.",
    "Together is a wonderful place to be.",
    "I love you more than yesterday, less than tomorrow.",
    "You are my sunshine on a cloudy day.",
    "Forever is a long time, but I wouldn't mind spending it by your side.",
    "You make my heart smile.",
    "I choose you. And I'll choose you over and over and over.",
    "You are the best thing that's ever been mine."
];

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    generateFloatingHearts();
    setInterval(generateFloatingHearts, 5000);
    
    // Add Enter key support for login
    const passwordInput = document.getElementById('password-input');
    const usernameInput = document.getElementById('username-input');
    
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            authenticate();
        }
    });
    
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            authenticate();
        }
    });
});

// Authentication
async function authenticate() {
    const username = document.getElementById('username-input').value;
    const password = document.getElementById('password-input').value;
    
    if (username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
        isAuthenticated = true;
        sessionStorage.setItem('isLoggedIn', 'true');
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        await initializeApp();
    } else {
        alert('Invalid username or password');
    }
}

async function checkAuth() {
    const loggedIn = sessionStorage.getItem('isLoggedIn');
    if (loggedIn === 'true') {
        isAuthenticated = true;
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        await initializeApp();
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        isAuthenticated = false;
        sessionStorage.removeItem('isLoggedIn');
        document.getElementById('auth-screen').classList.remove('hidden');
        document.getElementById('main-app').classList.add('hidden');
        document.getElementById('username-input').value = '';
        document.getElementById('password-input').value = '';
    }
}

// Initialize App
async function initializeApp() {
    await loadData();
    loadSpecialDates();
    loadMainPhoto();
    updateRelationshipCounter();
    displayRandomQuote();
    startQuoteRotation(); // Start auto-rotating quotes
    renderCalendar();
    renderTimeline();
    renderGallery();
    await loadSavedMusic();
    setInterval(updateRelationshipCounter, 1000);
}

// Navigation
function showSection(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(section + '-section').classList.add('active');
    
    if (section === 'calendar') renderCalendar();
    if (section === 'timeline') renderTimeline();
    if (section === 'gallery') renderGallery();
}

// Mobile Navigation Toggle
function toggleNav() {
    const navLinks = document.getElementById('nav-links');
    navLinks.classList.toggle('active');
}

function closeNav() {
    const navLinks = document.getElementById('nav-links');
    navLinks.classList.remove('active');
}

// Theme Toggle
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const icons = document.querySelectorAll('.theme-toggle i, .nav-links a[href="#theme"] i');
    icons.forEach(icon => {
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    });
}

// Relationship Counter
function updateRelationshipCounter() {
    const anniversary = specialDates.anniversary;
    if (!anniversary) {
        document.getElementById('together-counter').textContent = 'Together for 0 years, 0 months, 0 days';
        return;
    }
    
    const start = new Date(anniversary);
    const now = new Date();
    const diff = now - start;
    
    if (diff < 0) {
        document.getElementById('together-counter').textContent = 'Together for 0 years, 0 months, 0 days';
        return;
    }
    
    // Calculate base time
    let years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    let months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    let days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    
    // Add manual offset
    years += counterOffset.years || 0;
    months += counterOffset.months || 0;
    days += counterOffset.days || 0;
    
    // Handle overflow (e.g., 13 months = 1 year + 1 month)
    if (days >= 30) {
        months += Math.floor(days / 30);
        days = days % 30;
    }
    if (months >= 12) {
        years += Math.floor(months / 12);
        months = months % 12;
    }
    
    // Handle negative values
    if (days < 0) {
        months -= 1;
        days += 30;
    }
    if (months < 0) {
        years -= 1;
        months += 12;
    }
    
    document.getElementById('together-counter').textContent = 
        `Together for ${years} year${years !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''}, ${days} day${days !== 1 ? 's' : ''}`;
}

// Love Quote
function displayRandomQuote() {
    try {
        const quote = loveQuotes[Math.floor(Math.random() * loveQuotes.length)];
        const quoteElement = document.getElementById('love-quote');
        if (quoteElement) {
            // Fade out
            quoteElement.style.opacity = '0';
            
            // Change text and fade in
            setTimeout(() => {
                quoteElement.textContent = quote;
                quoteElement.style.opacity = '1';
            }, 300);
        }
    } catch (error) {
        console.error('Error displaying quote:', error);
    }
}

// Change quote every 10 seconds
function startQuoteRotation() {
    setInterval(displayRandomQuote, 10000); // Change every 10 seconds
}

// Calendar Functions
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    document.getElementById('current-month').textContent = 
        currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = '';
    
    // Day headers
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
        const header = document.createElement('div');
        header.className = 'day-header';
        header.textContent = day;
        grid.appendChild(header);
    });
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = daysInPrevMonth - i;
        grid.appendChild(day);
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        day.textContent = i;
        
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        
        if (memories[dateKey]) {
            day.classList.add('has-memory');
        }
        
        day.onclick = () => openMemoryModal(dateKey);
        grid.appendChild(day);
    }
    
    // Next month days
    const totalCells = grid.children.length - 7;
    const remainingCells = 42 - totalCells;
    for (let i = 1; i <= remainingCells; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = i;
        grid.appendChild(day);
    }
}

function changeMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    renderCalendar();
}

// Memory Modal
function openMemoryModal(dateKey) {
    selectedDate = dateKey;
    const modal = document.getElementById('memory-modal');
    const dateObj = new Date(dateKey);
    
    document.getElementById('modal-date').textContent = 
        dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    if (memories[dateKey]) {
        showMemoryDisplay(memories[dateKey]);
    } else {
        showMemoryForm();
    }
    
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('memory-modal').style.display = 'none';
    resetForm();
}

function showMemoryForm() {
    document.querySelector('.memory-form').classList.remove('hidden');
    document.getElementById('memory-display').classList.add('hidden');
}

function showMemoryDisplay(memory) {
    document.querySelector('.memory-form').classList.add('hidden');
    document.getElementById('memory-display').classList.remove('hidden');
    
    document.getElementById('display-title').textContent = memory.title || 'Untitled Memory';
    document.getElementById('display-location').textContent = memory.location || 'No location';
    document.getElementById('display-mood').textContent = memory.mood || '';
    document.getElementById('display-notes').textContent = memory.notes || 'No notes';
    
    const carousel = document.getElementById('memory-carousel');
    carousel.innerHTML = '';
    
    if (memory.images && memory.images.length > 0) {
        memory.images.forEach(img => {
            const imgEl = document.createElement('img');
            imgEl.src = img;
            imgEl.alt = 'date-memory-photo';
            imgEl.onclick = () => enlargeImage(img);
            carousel.appendChild(imgEl);
        });
    }
}

function editCurrentMemory() {
    const memory = memories[selectedDate];
    document.getElementById('memory-title').value = memory.title || '';
    document.getElementById('memory-location').value = memory.location || '';
    document.getElementById('memory-notes').value = memory.notes || '';
    selectedMood = memory.mood || '';
    uploadedImages = memory.images || [];
    
    showMemoryForm();
    previewExistingImages();
}

function selectMood(emoji) {
    selectedMood = emoji;
    document.querySelectorAll('.mood-emoji').forEach(e => e.classList.remove('selected'));
    event.target.classList.add('selected');
}

function previewImages() {
    const files = document.getElementById('memory-photos').files;
    const preview = document.getElementById('image-preview');
    preview.innerHTML = '';
    uploadedImages = [];
    
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImages.push(e.target.result);
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'preview-img';
            img.alt = 'preview-photo';
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
}

function previewExistingImages() {
    const preview = document.getElementById('image-preview');
    preview.innerHTML = '';
    
    uploadedImages.forEach(img => {
        const imgEl = document.createElement('img');
        imgEl.src = img;
        imgEl.className = 'preview-img';
        imgEl.alt = 'preview-photo';
        preview.appendChild(imgEl);
    });
}

async function saveMemory() {
    const title = document.getElementById('memory-title').value;
    const location = document.getElementById('memory-location').value;
    const notes = document.getElementById('memory-notes').value;
    
    if (!title && !notes && uploadedImages.length === 0) {
        alert('Please add at least a title, note, or photo');
        return;
    }
    
    memories[selectedDate] = {
        title,
        location,
        notes,
        mood: selectedMood,
        images: uploadedImages,
        timestamp: new Date().toISOString()
    };
    
    await saveMemories();
    alert('Memory saved! ❤️');
    closeModal();
    renderCalendar();
    renderTimeline();
    renderGallery();
}

async function deleteMemory() {
    if (confirm('Are you sure you want to delete this memory?')) {
        delete memories[selectedDate];
        await saveMemories();
        alert('Memory deleted');
        closeModal();
        renderCalendar();
        renderTimeline();
        renderGallery();
    }
}

function resetForm() {
    document.getElementById('memory-title').value = '';
    document.getElementById('memory-location').value = '';
    document.getElementById('memory-notes').value = '';
    document.getElementById('memory-photos').value = '';
    document.getElementById('image-preview').innerHTML = '';
    selectedMood = '';
    uploadedImages = [];
    document.querySelectorAll('.mood-emoji').forEach(e => e.classList.remove('selected'));
}

// Timeline
function renderTimeline() {
    const container = document.getElementById('timeline-container');
    container.innerHTML = '';
    
    const sortedDates = Object.keys(memories).sort((a, b) => new Date(b) - new Date(a));
    
    if (sortedDates.length === 0) {
        container.innerHTML = '<p style="text-align:center; color: var(--text-secondary);">No memories yet. Start creating beautiful moments! ❤️</p>';
        return;
    }
    
    sortedDates.forEach(date => {
        const memory = memories[date];
        const item = document.createElement('div');
        item.className = 'timeline-item';
        
        const dateObj = new Date(date);
        const formattedDate = dateObj.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
        
        const thumbnail = memory.images && memory.images.length > 0 
            ? `<img src="${memory.images[0]}" alt="timeline-photo" onclick="enlargeImage('${memory.images[0]}')">`
            : '';
        
        item.innerHTML = `
            <div class="timeline-date">${formattedDate}</div>
            <div class="timeline-content">
                ${thumbnail}
                <h3>${memory.title || 'Untitled Memory'}</h3>
                <p><i class="fas fa-map-marker-alt"></i> ${memory.location || 'No location'}</p>
                <p>${memory.mood || ''}</p>
                <p>${memory.notes || ''}</p>
            </div>
        `;
        
        container.appendChild(item);
    });
}

// Gallery
function renderGallery() {
    const grid = document.getElementById('gallery-grid');
    grid.innerHTML = '';
    
    const allImages = [];
    Object.keys(memories).forEach(date => {
        const memory = memories[date];
        if (memory.images && memory.images.length > 0) {
            memory.images.forEach(img => {
                allImages.push({
                    src: img,
                    date: date,
                    title: memory.title
                });
            });
        }
    });
    
    if (allImages.length === 0) {
        grid.innerHTML = '<p style="text-align:center; color: var(--text-secondary); grid-column: 1/-1;">No photos yet. Upload your first memory! 📸</p>';
        return;
    }
    
    allImages.forEach(img => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        const dateObj = new Date(img.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
        
        item.innerHTML = `
            <img src="${img.src}" alt="gallery-photo" onclick="enlargeImage('${img.src}')">
            <div class="gallery-overlay">
                <p>${img.title || 'Untitled'}</p>
                <p>${formattedDate}</p>
            </div>
        `;
        
        grid.appendChild(item);
    });
}

function filterGallery(filter) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderGallery();
}

// Image Enlargement
function enlargeImage(src) {
    const modal = document.getElementById('image-modal');
    const img = document.getElementById('enlarged-image');
    img.src = src;
    modal.style.display = 'flex';
}

function closeImageModal() {
    document.getElementById('image-modal').style.display = 'none';
}

// Special Dates
function loadSpecialDates() {
    if (specialDates.firstMeet) {
        document.getElementById('first-meet-date').textContent = 
            new Date(specialDates.firstMeet).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
    if (specialDates.firstDate) {
        document.getElementById('first-date-date').textContent = 
            new Date(specialDates.firstDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
    if (specialDates.anniversary) {
        document.getElementById('anniversary-date').textContent = 
            new Date(specialDates.anniversary).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
    if (specialDates.milestone) {
        document.getElementById('milestone-date').textContent = 
            new Date(specialDates.milestone).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
    
    // Display counter offset
    updateCounterOffsetDisplay();
}

function updateCounterOffsetDisplay() {
    const offsetDisplay = document.getElementById('counter-offset-display');
    if (counterOffset.years === 0 && counterOffset.months === 0 && counterOffset.days === 0) {
        offsetDisplay.textContent = 'No adjustment';
    } else {
        const parts = [];
        if (counterOffset.years !== 0) parts.push(`${counterOffset.years > 0 ? '+' : ''}${counterOffset.years} year${Math.abs(counterOffset.years) !== 1 ? 's' : ''}`);
        if (counterOffset.months !== 0) parts.push(`${counterOffset.months > 0 ? '+' : ''}${counterOffset.months} month${Math.abs(counterOffset.months) !== 1 ? 's' : ''}`);
        if (counterOffset.days !== 0) parts.push(`${counterOffset.days > 0 ? '+' : ''}${counterOffset.days} day${Math.abs(counterOffset.days) !== 1 ? 's' : ''}`);
        offsetDisplay.textContent = parts.join(', ');
    }
}

async function editSpecialDate(type) {
    const date = prompt('Enter date (YYYY-MM-DD):');
    if (date) {
        specialDates[type] = date;
        await saveSpecialDates();
        loadSpecialDates();
        updateRelationshipCounter();
    }
}

async function editCounterOffset() {
    const message = `Adjust the counter display:

Enter adjustments (use + or - for each):
Example: +1 year, +2 months, -5 days

Current adjustment: ${counterOffset.years} years, ${counterOffset.months} months, ${counterOffset.days} days

Leave blank to reset to 0.`;
    
    const years = prompt(message + '\n\nYears adjustment (e.g., +1 or -1):');
    if (years === null) return; // Cancelled
    
    const months = prompt('Months adjustment (e.g., +2 or -2):');
    if (months === null) return; // Cancelled
    
    const days = prompt('Days adjustment (e.g., +5 or -5):');
    if (days === null) return; // Cancelled
    
    // Parse values
    counterOffset.years = years === '' ? 0 : parseInt(years) || 0;
    counterOffset.months = months === '' ? 0 : parseInt(months) || 0;
    counterOffset.days = days === '' ? 0 : parseInt(days) || 0;
    
    await saveCounterOffset();
    updateCounterOffsetDisplay();
    updateRelationshipCounter();
    
    alert('Counter adjustment saved! ❤️');
}
async function editCounterDisplay() {
    const currentYears = counterOffset.years || 0;
    const currentMonths = counterOffset.months || 0;
    const currentDays = counterOffset.days || 0;
    
    const message = `Edit Counter Display\n\nSet the counter to show:\n\nCurrent: ${currentYears} years, ${currentMonths} months, ${currentDays} days\n\nEnter new values:`;
    
    const years = prompt(message + '\n\nYears:');
    if (years === null) return; // Cancelled
    
    const months = prompt('Months:');
    if (months === null) return; // Cancelled
    
    const days = prompt('Days:');
    if (days === null) return; // Cancelled
    
    // Parse values
    const newYears = parseInt(years) || 0;
    const newMonths = parseInt(months) || 0;
    const newDays = parseInt(days) || 0;
    
    // Calculate what the offset should be
    // First, calculate what the counter would show without offset
    const anniversary = specialDates.anniversary;
    if (!anniversary) {
        alert('Please set your anniversary date first in Special Dates section!');
        return;
    }
    
    const start = new Date(anniversary);
    const now = new Date();
    const diff = now - start;
    
    if (diff < 0) {
        alert('Anniversary date is in the future!');
        return;
    }
    
    // Calculate base time
    const baseYears = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    const baseMonths = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    const baseDays = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    
    // Calculate the offset needed
    counterOffset.years = newYears - baseYears;
    counterOffset.months = newMonths - baseMonths;
    counterOffset.days = newDays - baseDays;
    
    await saveCounterOffset();
    updateRelationshipCounter();
    
    alert('Counter updated! ❤️\n\nThe counter will now show:\n' + newYears + ' years, ' + newMonths + ' months, ' + newDays + ' days\n\nAnd it will keep counting from there!');
}
// Music Player
function toggleMusic() {
    const audio = document.getElementById('audio-player');
    const btn = document.getElementById('music-btn');
    
    if (audio.src) {
        if (audio.paused) {
            audio.play();
            btn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            audio.pause();
            btn.innerHTML = '<i class="fas fa-play"></i>';
        }
    } else {
        alert('Please upload a song first by clicking the music icon');
    }
}

async function loadMusic() {
    const file = document.getElementById('music-upload').files[0];
    if (file) {
        // Check file size (limit to 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('File is too large. Please choose a file smaller than 10MB.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = async function(e) {
            const audioData = e.target.result;
            await saveMusic(audioData, file.name);
            
            const audio = document.getElementById('audio-player');
            audio.src = audioData;
            audio.play();
            document.getElementById('music-btn').innerHTML = '<i class="fas fa-pause"></i>';
            
            alert('Song saved! It will play automatically on your next visit ❤️');
        };
        reader.readAsDataURL(file);
    }
}

async function loadSavedMusic() {
    try {
        const data = await loadData();
        if (data.music) {
            const audio = document.getElementById('audio-player');
            audio.src = data.music;
            document.getElementById('music-btn').innerHTML = '<i class="fas fa-play"></i>';
        }
    } catch (error) {
        console.error('Failed to load saved music:', error);
    }
}

// Floating Hearts Animation
function generateFloatingHearts() {
    const container = document.getElementById('floating-hearts');
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = '❤️';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
    container.appendChild(heart);
    
    setTimeout(() => heart.remove(), 6000);
}

// Close modals on outside click
window.onclick = function(event) {
    const memoryModal = document.getElementById('memory-modal');
    const imageModal = document.getElementById('image-modal');
    
    if (event.target === memoryModal) {
        closeModal();
    }
    if (event.target === imageModal) {
        closeImageModal();
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeImageModal();
    }
});

// Main Photo Functions
function editMainPhoto() {
    document.getElementById('main-photo-upload').click();
}

async function uploadMainPhoto() {
    const file = document.getElementById('main-photo-upload').files[0];
    if (file) {
        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File is too large. Please choose a file smaller than 5MB.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = async function(e) {
            mainPhoto = e.target.result;
            await saveMainPhoto(mainPhoto);
            loadMainPhoto();
            alert('Main photo updated! ❤️');
        };
        reader.readAsDataURL(file);
    }
}

function loadMainPhoto() {
    if (mainPhoto) {
        const heroImg = document.querySelector('.hero-image img');
        if (heroImg) {
            heroImg.src = mainPhoto;
            heroImg.style.objectFit = 'cover';
            heroImg.style.width = '100%';
            heroImg.style.height = '100%';
        }
    }
}
