# Translation System Documentation

## Overview
This project implements a comprehensive internationalization (i18n) system that supports both Georgian (ka) and English (en) languages across all pages.

## How It Works

### Global Language Context
The language preference is managed globally using React Context and persisted in localStorage:
- **File**: `src/contexts/LanguageContext.tsx`
- **Provider**: `LanguageProvider` wraps the entire app
- **Hook**: `useLanguage()` provides access to current locale and setLocale function

### Language Persistence
- Language selection is automatically saved to `localStorage` as `preferredLanguage`
- Persists across page reloads and navigation
- Defaults to English (`en`) if no preference is saved

### Translation Architecture

#### 1. Static UI Elements (Client-side)
Static text like buttons, labels, and UI elements are translated using translation objects in each component:

```typescript
const translations = {
  en: {
    backToCars: "Back to Cars",
    contactUs: "Contact Us",
    // ... more keys
  },
  ka: {
    backToCars: "მანქანებზე დაბრუნება",
    contactUs: "დაგვიკავშირდით",
    // ... more keys
  }
};

const t = (key: keyof typeof translations.en) => {
  return translations[currentLocale as keyof typeof translations]?.[key] || translations.en[key];
};
```

#### 2. Dynamic Content (Server-side via Strapi)
Dynamic content from Strapi CMS is handled by including locale parameters in API requests:

```typescript
const carApiUrl = `${strapiBaseUrl}/api/luxurycars-cars?filters[slug][$eq]=${slug}&populate=*&locale=${currentLocale}`;
```

## Implementation in Components

### Using the Language Context

```typescript
import { useLanguage } from '../../../contexts/LanguageContext';

const MyComponent = () => {
  const { currentLocale, setLocale } = useLanguage();
  
  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
  };
  
  // Component logic...
};
```

### Translation Function Pattern

Each component that needs translations should implement:

1. Import the language context
2. Create a translations object with `en` and `ka` keys
3. Create a `t()` function that safely returns translations
4. Use `t('key')` for all translatable text

## Pages with Translation Support

### Fully Implemented
- ✅ **CarDetail.tsx** - Car detail page with specs and gallery
- ✅ **cars.tsx** - Car listings and filtering page  
- ✅ **LuxuryCar.tsx** - Main landing page

### Translation Coverage
- **Static UI Elements**: All buttons, labels, form fields, error messages
- **Dynamic Content**: Car descriptions, specifications, and other CMS content
- **Navigation**: Breadcrumbs, menu items, page titles
- **User Feedback**: Loading states, error messages, success notifications

## API Integration

### Strapi Locale Parameter
When the user changes language, the app:
1. Updates the global locale state
2. Refetches data from Strapi with the new locale parameter
3. Strapi returns content in the requested language (if available)
4. UI elements update using client-side translations

### Caching Strategy
- English content is cached for performance
- Non-English content bypasses cache to ensure fresh translations
- Cache is cleared when locale changes

## Best Practices

### For Developers
1. **Always use the translation function**: `t('key')` instead of hardcoded strings
2. **Provide fallbacks**: The `t()` function automatically falls back to English
3. **Keep keys descriptive**: Use clear, semantic keys like `contactUs` not `btn1`
4. **Group related translations**: Organize translation keys logically
5. **Test both languages**: Verify functionality in both English and Georgian

### Adding New Translations
1. Add the key to the `translations` object in both `en` and `ka`
2. Use the `t('newKey')` function in your JSX
3. Test language switching to ensure the translation appears correctly

## Technical Details

### Context Provider Setup
```typescript
// App.tsx
function App() {
  return (
    <LanguageProvider>
      <Routes>
        {/* Your routes */}
      </Routes>
    </LanguageProvider>
  );
}
```

### Locale State Management
- **Global State**: Managed by React Context
- **Persistence**: localStorage with key `preferredLanguage`
- **Default**: English (`en`)
- **Supported Locales**: `en` (English), `ka` (Georgian)

### Data Flow
1. User selects language in navbar
2. `setLocale()` updates global state and localStorage
3. Components using `useLanguage()` re-render with new locale
4. API calls include new locale parameter
5. Both static and dynamic content updates

## Future Enhancements

### Planned Features
- URL-based locale routing (`/en/cars`, `/ka/cars`)
- Language detection based on browser settings
- Additional language support
- Translation management interface
- Automated translation validation

### Extensibility
The current system is designed to easily support additional languages by:
1. Adding new locale keys to translation objects
2. Adding Strapi locale configurations
3. Updating the supported locales list

## Troubleshooting

### Common Issues
1. **Translations not appearing**: Check that the component uses `useLanguage()` hook
2. **API content not updating**: Verify locale parameter is included in API calls
3. **Language not persisting**: Check localStorage permissions and LanguageProvider setup

### Debug Tips
- Check browser localStorage for `preferredLanguage` key
- Verify API calls include `&locale=${currentLocale}` parameter
- Use React DevTools to inspect context state
