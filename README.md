# Novel eShelf – Coming Soon Page

This project contains the static **coming-soon landing page** for the Novel eShelf platform.  
The page is built from the BeeDev base template and updated with Novel eShelf branding, layout enhancements, and a fully responsive design.

## Features

- Neon framed logo presentation with soft glow effects
- Updated Novel eShelf branding and assets
- Responsive layout for mobile, tablet, and desktop
- BeeDev favicon and footer branding
- Organized `/static` directory for deployment

## Project Structure

```
/static
  /assets
    /css
    /images
    /js
  index.html
```

## Development Notes

All updates were completed in the `dev` branch before opening a PR to `main`.  
Deployment will use the finalized static files in the `/static` folder.


# Notes
## Home Page 
- Add function to show active page showing to either hide that link in the nav or change it's color to indicate that it is the current page.
- Combine the for readers / for authors section that is at the bottom with the top buttons/section instead

## About Page
- Possibly remove the journey part

## Pricing Page
- Rename to shop
- No subscription
- Quills TBD on how that will look and be worded

## Library Page



Token Storage
```
// Access token - keep in memory only (most secure)
// Store in a variable or state management like Zustand/Redux
sessionStorage.setItem('access_token', accessToken);

// Refresh token - httpOnly cookie is safest
// This is ideally set by the backend not the frontend
```
API call examples
```
const accessToken = await SecureStore.getItemAsync('access_token');

const response = await fetch('http://localhost:8000/api/auth/me/', {
    headers: {
        'Authorization': `Bearer ${accessToken}`
    }
});
```
Token refresh (60 min)
```
const refreshToken = await SecureStore.getItemAsync('refresh_token');

const response = await fetch('http://localhost:8000/api/auth/refresh/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: refreshToken })
});

const data = await response.json();
// Store the new access token
await SecureStore.setItemAsync('access_token', data.access);
```
Token logout
```
await SecureStore.deleteItemAsync('access_token');
await SecureStore.deleteItemAsync('refresh_token');
```


console.log('access:', sessionStorage.getItem('access_token'))
console.log('refresh:', localStorage.getItem('refresh_token'))