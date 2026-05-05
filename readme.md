# Our Moments - Romantic Memory Calendar Web Application

A beautiful, fully functional romantic web application for couples to save and cherish their memories together.

## 🌟 Features

### 1. **Authentication System**
- Password-protected access using anniversary date
- First-time setup saves your special date
- Secure login to keep your memories private

### 2. **Interactive Memory Calendar**
- Monthly calendar view with navigation
- Click any date to add or view memories
- Visual indicators (hearts) for dates with saved memories
- Smooth animations and transitions

### 3. **Memory Management**
- Upload multiple photos per date
- Add titles, locations, and notes
- Select mood emojis
- Edit or delete existing memories
- All data persists in browser's local storage

### 4. **Timeline View**
- Chronological display of all memories
- Shows date, photos, and captions
- Beautiful alternating layout
- Click photos to enlarge

### 5. **Photo Gallery**
- Masonry grid layout of all uploaded photos
- Hover effects with date and title overlay
- Click to enlarge images
- Filter options

### 6. **Special Dates Section**
- Track important milestones:
  - First Meet
  - First Date
  - Anniversary
  - Special Milestones
- Easy editing of dates

### 7. **Relationship Counter**
- Real-time counter showing time together
- Displays years, months, and days
- Updates every second

### 8. **Love Quotes Generator**
- Random romantic quotes on homepage
- Refreshes on page load

### 9. **Music Player**
- Floating music player
- Upload and play your favorite song
- Play/pause controls
- Loops continuously

### 10. **Dark/Light Mode**
- Toggle between themes
- Smooth transition effects
- Persistent preference

### 11. **Romantic Animations**
- Floating hearts animation
- Smooth page transitions
- Hover effects throughout
- Fade-in animations

## 🎨 Design Features

- **Soft romantic color palette**: Pink, cream, beige, white tones
- **Responsive design**: Works on mobile, tablet, and desktop
- **Clean and elegant UI**: Minimalist but emotional
- **Smooth animations**: Professional transitions
- **Modern aesthetics**: Contemporary design patterns

## 📁 File Structure

```
baki/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and animations
├── script.js           # All functionality and logic
└── README.md          # Documentation
```

## 🚀 How to Use

### Initial Setup

1. **Open the Application**
   - Open `index.html` in any modern web browser
   - You'll see the authentication screen

2. **First Time Login**
   - Enter your anniversary date (or any special date)
   - Click "Unlock Our Memories"
   - This date becomes your password

3. **Subsequent Logins**
   - Enter the same anniversary date to access
   - Your memories are protected

### Adding Memories

1. **Navigate to Calendar**
   - Click "Open Our Calendar" or use the navigation menu
   - Browse months using arrow buttons

2. **Create a Memory**
   - Click on any date
   - Fill in the form:
     - Title (e.g., "Our First Picnic")
     - Location (e.g., "Central Park")
     - Select a mood emoji
     - Write notes/journal entry
     - Upload photos (multiple allowed)
   - Click "Save Memory"

3. **View Memories**
   - Click on dates with heart indicators
   - View photos in carousel
   - Read notes and details
   - Edit or delete as needed

### Using Other Features

**Timeline**
- View all memories chronologically
- Click photos to enlarge
- Scroll through your journey

**Gallery**
- See all photos in grid layout
- Hover for details
- Click to enlarge

**Special Dates**
- Click any card to set/edit dates
- Enter date in YYYY-MM-DD format
- Dates display on cards

**Music Player**
- Click music icon to upload a song
- Use play/pause button
- Music loops automatically

**Theme Toggle**
- Click moon/sun icon in navbar
- Switches between light and dark mode

## 💾 Data Storage

- All data stored in browser's **localStorage**
- Memories persist after closing browser
- Photos stored as base64 strings
- No server required
- Data stays on your device

## 🔒 Privacy

- Completely private and local
- No data sent to any server
- Password-protected access
- Only accessible on your device

## 🌐 Browser Compatibility

Works on all modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

## 📱 Responsive Design

Fully responsive breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎯 Technical Details

### Technologies Used
- **HTML5**: Semantic structure
- **CSS3**: Modern styling, animations, grid, flexbox
- **JavaScript (ES6+)**: Full functionality
- **LocalStorage API**: Data persistence
- **FileReader API**: Image upload and preview
- **Font Awesome**: Icons

### Key Functions

**Calendar Logic**
- Dynamic month generation
- Handles different month lengths
- Previous/next month navigation
- Date selection and memory association

**Image Handling**
- Multiple file upload
- Base64 encoding for storage
- Preview before saving
- Carousel display
- Image enlargement modal

**Data Management**
- CRUD operations for memories
- JSON serialization
- LocalStorage persistence
- Data validation

## 🎨 Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary: #ffb6c1;      /* Main pink */
    --secondary: #ffd4d4;    /* Light pink */
    --accent: #ff69b4;       /* Hot pink */
    --bg-main: #fff5f7;      /* Background */
    --bg-card: #ffffff;      /* Card background */
}
```

### Quotes
Add more quotes in `script.js`:
```javascript
const loveQuotes = [
    "Your custom quote here",
    // Add more...
];
```

## 🚀 Deployment

### Local Deployment
1. Simply open `index.html` in a browser
2. No server required

### Web Hosting
1. Upload all files to any web host
2. Access via URL
3. Works on GitHub Pages, Netlify, Vercel, etc.

### GitHub Pages
1. Create a repository
2. Upload files
3. Enable GitHub Pages in settings
4. Access via `username.github.io/repo-name`

## 📝 Usage Tips

1. **Regular Backups**: Export localStorage data periodically
2. **Photo Size**: Compress large photos before upload for better performance
3. **Browser Cache**: Don't clear browser data or memories will be lost
4. **Multiple Devices**: Data doesn't sync between devices (local only)

## 🐛 Troubleshooting

**Images not loading?**
- Check file size (very large images may cause issues)
- Ensure browser supports FileReader API

**Data disappeared?**
- Check if browser cache was cleared
- Verify you're using the same browser

**Calendar not displaying?**
- Refresh the page
- Check browser console for errors

## 💡 Future Enhancements (Optional)

- Cloud storage integration
- Multi-device sync
- Export memories as PDF
- Share memories feature
- Reminder notifications
- Video upload support
- Collaborative editing

## ❤️ Perfect For

- Couples celebrating their relationship
- Long-distance relationships
- Anniversary gifts
- Wedding memories
- Dating journey documentation
- Romantic surprises

## 📄 License

Free to use and modify for personal use.

## 🤝 Support

For issues or questions:
1. Check this README
2. Review code comments
3. Test in different browser

---

**Made with ❤️ for couples who cherish every moment together**

*"Every love story is beautiful, but ours is my favorite."*
