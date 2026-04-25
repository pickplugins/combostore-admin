This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.


Here’s a clean, detailed documentation in **Markdown format** for installing and setting up ComboStore:

---

# 🚀 ComboStore Installation & Setup Guide

This guide walks you through installing **ComboStore Server (WordPress)**, configuring authentication, enabling CORS, and deploying the frontend/dashboard.

---

## 📌 Step 1: Install Required WordPress Plugins

### 1.1 Install ComboStore Server Plugin

* Download or install from GitHub:
  👉 [https://github.com/pickplugins/combostore-server](https://github.com/pickplugins/combostore-server)

#### Installation Steps:

1. Go to your WordPress Admin Dashboard
2. Navigate to **Plugins → Add New**
3. Click **Upload Plugin**
4. Upload the ZIP file from GitHub
5. Click **Install Now → Activate**

---

### 1.2 Install JWT Authentication Plugin

* Plugin URL:
  👉 [https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/)

#### Install:

Same process as above (Upload or search in plugin directory)

---

### 🔐 Configure JWT Authentication

You must add a secret key in your WordPress config file.

#### Edit `wp-config.php`

Open your WordPress root directory and locate:

```php
wp-config.php
```

Add the following line:

```php
define('JWT_AUTH_SECRET_KEY', 'your-secret-key-here');
```

✅ Example:

```php
define('JWT_AUTH_SECRET_KEY', 'my_super_secure_random_key_12345');
```

---

### 🔓 Enable JWT for All Requests

Add this line to allow JWT authentication across all endpoints:

```php
define('JWT_AUTH_CORS_ENABLE', true);
```

---

### 1.3 Enable CORS Plugin

* Plugin URL:
  👉 [https://wordpress.org/plugins/enable-cors/](https://wordpress.org/plugins/enable-cors/)

#### Install & Activate:

1. Go to **Plugins → Add New**
2. Search for **Enable CORS**
3. Click **Install → Activate**

---

### 🌐 Configure CORS for All Requests

After activation, ensure your server allows all origins.

#### Option 1: Using Plugin (Default)

The plugin automatically enables:

```
Access-Control-Allow-Origin: *
```

#### Option 2: Manual (Optional Advanced Setup)

Add this to `.htaccess` (Apache):

```apache
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Headers "Authorization, Content-Type"
Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
```

Or in `nginx.conf`:

```nginx
add_header Access-Control-Allow-Origin *;
add_header Access-Control-Allow-Headers Authorization,Content-Type;
add_header Access-Control-Allow-Methods GET,POST,PUT,DELETE,OPTIONS;
```

---

## 📌 Step 2: Create Vercel Account & API Token

### 🌍 Go to:

👉 [https://vercel.com/account/tokens](https://vercel.com/account/tokens)

### Steps:

1. Sign up or log in to your Vercel account
2. Navigate to **Settings → Tokens**
3. Click **Create Token**
4. Give it a name (e.g., `combostore-token`)
5. Copy and save the token securely

⚠️ This token will be used during deployment.

---

## 📌 Step 3: Deploy Storefront & Dashboard

### 🌐 Visit:

👉 [https://combostore.bd/](https://combostore.bd/)

### Steps:

1. Open the website
2. Click on **Deploy Storefront**
3. Click on **Deploy Dashboard**
4. Connect your Vercel account
5. Paste your **API Token**
6. Provide required configuration:

   * WordPress Site URL
   * JWT Endpoint
   * API Base URL

### Expected Output:

* Storefront URL (e.g., `yourstore.vercel.app`)
* Dashboard URL (e.g., `admin-yourstore.vercel.app`)

---

## 📌 Step 4: Login to Storefront & Dashboard

### 🔑 Authentication Method

ComboStore uses your **WordPress credentials**.

#### Steps:

1. Open your deployed Storefront or Dashboard URL
2. Click **Login**
3. Enter:

   * WordPress Username
   * WordPress Password

---

### 🔄 How It Works

* Login request → WordPress REST API
* JWT token is generated
* Token is used for authenticated requests

---

## ✅ Final Checklist

* [ ] ComboStore plugin installed
* [ ] JWT plugin installed & configured
* [ ] `JWT_AUTH_SECRET_KEY` added
* [ ] CORS enabled
* [ ] Vercel token created
* [ ] Storefront deployed
* [ ] Dashboard deployed
* [ ] Login working via WordPress

---

## ⚠️ Troubleshooting

### ❌ JWT Not Working

* Check secret key in `wp-config.php`
* Ensure no extra spaces or syntax errors

### ❌ CORS Errors

* Confirm plugin is active
* Check browser console for blocked requests
* Verify headers are properly set

### ❌ Login Failed

* Ensure WordPress REST API is accessible:

  ```
  https://your-site.com/wp-json/
  ```

---

## 🎯 Conclusion

You’ve successfully:

* Set up ComboStore backend (WordPress)
* Enabled secure JWT authentication
* Configured CORS for API access
* Deployed frontend & dashboard using Vercel

---

If you want, I can also create:

* 🔧 Docker-based setup
* ⚡ One-click deployment script
* 📦 n8n automation for ComboStore

Just tell me 👍
