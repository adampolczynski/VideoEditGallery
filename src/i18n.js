import { useEffect, useMemo } from 'react';

export const translations = {
  en: {
    admin: 'Admin',
    adminAccess: 'Admin access',
    adminPanel: 'Admin panel',
    after: 'After',
    autoScroll: 'Enable auto-scroll',
    autoScrollInterval: 'Auto-scroll interval (ms)',
    backToGallery: 'Back to gallery',
    before: 'Before',
    beforeVideo: 'Before video',
    brandTitle: 'Adam Polczynski Video Edits',
    contactIntro: 'Video editing services by Adam Polczynski. Contact: adam_polczynski@yahoo.com or beatchemik@gmail.com.',
    createVideo: 'Create video',
    delete: 'Delete',
    deleteConfirm: 'Are you sure you want to delete this video?',
    description: 'Description',
    descriptionPlaceholder: 'Add a description for your video...',
    edit: 'Edit',
    editVideo: 'Edit video',
    enterPassword: 'Enter password to continue',
    formTitlePlaceholder: 'e.g. Fitness transformation',
    invalidPassword: 'Invalid password',
    loadingVideos: 'Loading videos...',
    login: 'Login',
    logout: 'Logout',
    manageVideos: 'Manage videos',
    minimumInterval: 'Minimum 1000ms (1 second)',
    noVideos: 'No videos yet. Add your first before/after video.',
    passwordPlaceholder: 'Enter admin password',
    saveFailed: 'Failed to save video',
    saving: 'Saving...',
    settings: 'Settings',
    transformations: 'Adam Video Edits - Inpainting / Object Removal',
    updateFailed: 'Failed to update settings',
    updateVideo: 'Update video',
    upload: 'Upload',
    uploadFailed: 'Upload failed',
    uploading: 'Uploading...',
    verifying: 'Verifying...',
    videoLoadFailed: 'Failed to load videos',
    videoTitle: 'Video title',
    videoUrlPlaceholder: '/uploads/video.mp4',
    videosIntro: 'Videos are processed locally with diffusion AI models, without costly subscriptions. I provide video editing services focused on inpainting, object removal, cleanup, and before/after transformation edits.',
    addVideo: 'Add video',
    addNewVideo: 'Add new video',
    afterVideo: 'After video',
    deleteFailed: 'Failed to delete video',
  },
  pl: {
    admin: 'Admin',
    adminAccess: 'Dostep administratora',
    adminPanel: 'Panel administratora',
    after: 'Po',
    autoScroll: 'Wlacz automatyczne przewijanie',
    autoScrollInterval: 'Interwal automatycznego przewijania (ms)',
    backToGallery: 'Powrot do galerii',
    before: 'Przed',
    beforeVideo: 'Wideo przed',
    brandTitle: 'Adam Polczynski Video Edits',
    contactIntro: 'Uslugi edycji wideo: Adam Polczynski. Kontakt: adam_polczynski@yahoo.com lub beatchemik@gmail.com.',
    createVideo: 'Utworz wideo',
    delete: 'Usun',
    deleteConfirm: 'Czy na pewno chcesz usunac to wideo?',
    description: 'Opis',
    descriptionPlaceholder: 'Dodaj opis wideo...',
    edit: 'Edytuj',
    editVideo: 'Edytuj wideo',
    enterPassword: 'Wpisz haslo, aby kontynuowac',
    formTitlePlaceholder: 'np. Transformacja sylwetki',
    invalidPassword: 'Nieprawidlowe haslo',
    loadingVideos: 'Ladowanie wideo...',
    login: 'Zaloguj',
    logout: 'Wyloguj',
    manageVideos: 'Zarzadzaj wideo',
    minimumInterval: 'Minimum 1000 ms (1 sekunda)',
    noVideos: 'Brak wideo. Dodaj pierwsze wideo przed/po.',
    passwordPlaceholder: 'Wpisz haslo administratora',
    saveFailed: 'Nie udalo sie zapisac wideo',
    saving: 'Zapisywanie...',
    settings: 'Ustawienia',
    transformations: 'Adam Video Edits - Inpainting / Usuwanie obiektow',
    updateFailed: 'Nie udalo sie zaktualizowac ustawien',
    updateVideo: 'Zaktualizuj wideo',
    upload: 'Wgraj',
    uploadFailed: 'Wgrywanie nie powiodlo sie',
    uploading: 'Wgrywanie...',
    verifying: 'Sprawdzanie...',
    videoLoadFailed: 'Nie udalo sie zaladowac wideo',
    videoTitle: 'Tytul wideo',
    videoUrlPlaceholder: '/uploads/video.mp4',
    videosIntro: 'Wideo sa przetwarzane lokalnie z uzyciem dyfuzyjnych modeli AI, bez drogich subskrypcji. Oferuje uslugi edycji wideo: inpainting, usuwanie obiektow, cleanup i montaze transformacji przed/po.',
    addVideo: 'Dodaj wideo',
    addNewVideo: 'Dodaj nowe wideo',
    afterVideo: 'Wideo po',
    deleteFailed: 'Nie udalo sie usunac wideo',
  },
};

export const getBrowserLanguage = () => {
  if (typeof navigator === 'undefined') return 'en';

  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  return languages.some((language) => language?.toLowerCase().startsWith('pl')) ? 'pl' : 'en';
};

export const useTranslation = () => {
  const language = getBrowserLanguage();

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const dictionary = translations[language] || translations.en;

  return useMemo(() => ({
    language,
    t: (key) => dictionary[key] || translations.en[key] || key,
  }), [dictionary, language]);
};
