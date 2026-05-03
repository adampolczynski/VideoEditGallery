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
    transformations: 'Transformations',
    updateFailed: 'Failed to update settings',
    updateVideo: 'Update video',
    upload: 'Upload',
    uploadFailed: 'Upload failed',
    uploading: 'Uploading...',
    verifying: 'Verifying...',
    videoLoadFailed: 'Failed to load videos',
    videoTitle: 'Video title',
    videoUrlPlaceholder: '/uploads/video.mp4',
    videosIntro: 'Explore the collection of before and after videos. Move the slider to compare every transformation.',
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
    transformations: 'Transformacje',
    updateFailed: 'Nie udalo sie zaktualizowac ustawien',
    updateVideo: 'Zaktualizuj wideo',
    upload: 'Wgraj',
    uploadFailed: 'Wgrywanie nie powiodlo sie',
    uploading: 'Wgrywanie...',
    verifying: 'Sprawdzanie...',
    videoLoadFailed: 'Nie udalo sie zaladowac wideo',
    videoTitle: 'Tytul wideo',
    videoUrlPlaceholder: '/uploads/video.mp4',
    videosIntro: 'Przegladaj kolekcje wideo przed i po. Przesun suwak, aby porownac kazda transformacje.',
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
