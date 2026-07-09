# Portfolio Setup Guide

## Quick Start (5 minutes)

### 1. Personalize Your Portfolio

Edit `index.html` and update:

```html
<!-- Update Hero Section -->
<h1 class="hero-title">Hi, I'm <span class="highlight">Your Name</span></h1>
<p class="hero-subtitle">Your Title | Your Tagline</p>

<!-- Update Social Links -->
<a href="https://github.com/yourusername" target="_blank">
<a href="https://linkedin.com/in/yourprofile" target="_blank">
```

### 2. Update Your Information

- **About Section**: Update your bio and stats
- **Experience**: Add your work history from resume
- **Projects**: Replace with your actual projects
- **Skills**: List your technical skills
- **Contact**: Update email and phone number

### 3. Test Locally

```bash
# Open in browser or use a local server
python -m http.server 8000
# Visit: http://localhost:8000
```

## Deploy to GitHub Pages (3 steps)

### Step 1: Create GitHub Repository
- Go to github.com
- Click New Repository
- Name: `parisha-joshi`
- Make it Public

### Step 2: Push Your Code
```bash
cd portfolio
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/parisha-joshi.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages
- Repository Settings → Pages
- Source: Deploy from a branch (main)
- Save

**Your website is now live at:**
```
https://yourusername.github.io/parisha-joshi
```

## Advanced: Custom Domain

1. Edit `CNAME` file:
   ```
   your-domain.com
   ```

2. Update DNS records at your registrar:
   ```
   A: 185.199.108.153
   A: 185.199.109.153
   A: 185.199.110.153
   A: 185.199.111.153
   CNAME www: yourusername.github.io
   ```

3. Commit and push CNAME file

**Website will be available at:**
```
https://your-domain.com
```

## File Structure Explanation

| File | Purpose |
|------|---------|
| `index.html` | Main webpage - contains all content |
| `styles.css` | Design and layout - no changes needed unless customizing colors |
| `script.js` | Interactions - smooth scrolling, animations, form handling |
| `README.md` | Full documentation for GitHub |
| `.gitignore` | Tells Git which files to ignore |
| `CNAME` | For custom domain setup (optional) |

## Tips & Tricks

### 1. Add a Profile Photo
```html
<div style="width: 200px; height: 200px; margin: 0 auto;">
    <img src="photo.jpg" style="width: 100%; border-radius: 50%;">
</div>
```

### 2. Add Project Images
Replace the gradient background:
```html
<div class="project-image" style="background-image: url('project1.png');"></div>
```

### 3. Change Brand Colors
Edit `:root` in `styles.css`:
```css
:root {
    --primary-color: #your-color;
    --secondary-color: #your-color;
}
```

### 4. Make Contact Form Work
Use Formspree (free):
1. Go to formspree.io
2. Create form
3. Get form ID
4. Update form `action` in HTML

## Common Issues

### GitHub Pages Not Showing
- Wait 2-3 minutes after enabling
- Check Settings → Pages shows "Active"
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

### Styling Looks Wrong
- Verify `styles.css` is in same folder as `index.html`
- Check browser console for 404 errors
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

### Custom Domain Not Working
- Wait 24 hours for DNS to propagate
- Verify CNAME record in repository
- Check DNS settings at registrar

## Next Steps

1. ✅ Customize content
2. ✅ Add projects from resume
3. ✅ Update contact info
4. ✅ Deploy to GitHub
5. ✅ Get your own domain (optional)
6. ✅ Share your portfolio!

## Resources

- **GitHub Pages Docs**: https://pages.github.com
- **Free Domain Names**: namecheap.com, godaddy.com
- **Custom Email**: Add to your domain via Google Workspace or similar

---

Happy hosting! 🎉
