# Deploying Your Portfolio to GitHub Pages

Your portfolio is ready to deploy! Here's how to get `parisha-joshi.com` (or your domain) live on the web.

## Option 1: Deploy with GitHub Pages (Free - 5 minutes)

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the **+** icon → **New repository**
3. Repository name: `parisha-joshi` (important for GitHub Pages)
4. Choose **Public** visibility
5. Click **Create repository**

### Step 2: Push Your Code to GitHub

Open your terminal and run these commands from the portfolio folder:

```bash
cd /Users/parisha/Desktop/ParishaJoshi/portfolio

# Initialize git and add files
git init
git add .
git commit -m "Initial portfolio commit"

# Connect to GitHub (replace 'yourusername' with your GitHub username)
git remote add origin https://github.com/yourusername/parisha-joshi.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top right)
3. Click **Pages** in the left sidebar
4. Under "Build and deployment":
   - **Source**: Select "Deploy from a branch"
   - **Branch**: Select `main` and `/ (root)`
5. Click **Save**

**Your site is now live at:**
```
https://yourusername.github.io/parisha-joshi
```

---

## Option 2: Use a Custom Domain (parisha-joshi.com)

### Step 1: Buy a Domain

1. Visit a domain registrar:
   - **Namecheap** (inexpensive)
   - **GoDaddy** (popular)
   - **Google Domains** (simple)

2. Search for and buy your domain (e.g., `parisha-joshi.com` or `parishajoshi.dev`)

### Step 2: Update DNS Records

In your domain registrar's dashboard, add these DNS records:

**For the root domain (parisha-joshi.com):**
```
Type: A
Name: @ (or leave blank)
Value: 185.199.108.153
       185.199.109.153
       185.199.110.153
       185.199.111.153
TTL: 3600
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: yourusername.github.io
TTL: 3600
```

### Step 3: Add Custom Domain to GitHub

1. Go to repository **Settings** → **Pages**
2. Under "Custom domain", enter: `parisha-joshi.com`
3. Click **Save**
4. GitHub will create a `CNAME` file automatically

**Wait 5-30 minutes for DNS to propagate, then visit:**
```
https://parisha-joshi.com
```

---

## Troubleshooting

### Site Not Showing?
- Wait 5-10 minutes after enabling Pages
- Hard refresh your browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Check that repository Settings → Pages shows "Active"

### GitHub Pages Not Building?
- Ensure all files are committed: `git status`
- Push changes: `git push`
- Check GitHub Actions tab for build errors

### Custom Domain Not Working?
- Verify DNS records are correct (use `dig` or online DNS checker)
- Ensure `CNAME` file is in your repository
- Wait up to 24 hours for full DNS propagation

### Site Shows "404"?
- Make sure your repository name is `parisha-joshi`
- If using custom domain, skip the double domain name in settings
- Clear your browser cache

---

## Making Updates

After deployment, every time you make changes:

```bash
git add .
git commit -m "Update portfolio"
git push
```

Changes appear on your live site within 1-2 minutes!

---

## Recommended Enhancements

After deploying, consider:

1. **Add a profile photo**: Place an image in the portfolio folder and add it to the About section
2. **Link to projects**: Update project cards with actual GitHub repo links
3. **Add Google Analytics**: Track who visits your portfolio
4. **Custom email**: Set up a professional email like `hello@parisha-joshi.com` through your domain registrar

---

## Need Help?

- GitHub Pages Docs: https://pages.github.com
- DNS Propagation Checker: https://www.whatsmydns.net
- GitHub Documentation: https://docs.github.com

Your portfolio is production-ready! Deploy it today! 🚀
