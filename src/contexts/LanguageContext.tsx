import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'id';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // App
    'app.title': 'List My Job',
    'app.subtitle': 'Manage and remind your jobs easily',
    
    // Sidebar
    'sidebar.jobs': 'List My Job',
    'sidebar.pomodoro': 'Pomodoro Timer',
    'sidebar.notes': 'Sticky Notes',
    'sidebar.settings': 'Settings',
    
    // Jobs
    'jobs.title': 'List My Job',
    'jobs.subtitle': 'Manage and remind your jobs easily',
    'jobs.add': 'Add New Job',
    'jobs.edit': 'Edit Job',
    'jobs.save': 'Save Job',
    'jobs.update': 'Update Job',
    'jobs.delete': 'Delete',
    'jobs.deleteConfirm': 'Are you sure you want to delete this job?',
    'jobs.filter.all': 'All',
    'jobs.filter.pending': 'Pending',
    'jobs.filter.inProgress': 'In Progress',
    'jobs.filter.completed': 'Completed',
    'jobs.empty': 'No jobs yet',
    'jobs.emptyDesc': 'Create your first job to get started!',
    'jobs.form.title': 'Job Title',
    'jobs.form.titleRequired': 'Job title is required!',
    'jobs.form.titlePlaceholder': 'Example: Review application code',
    'jobs.form.description': 'Description',
    'jobs.form.descriptionPlaceholder': 'Add details about this job...',
    'jobs.form.deadline': 'Deadline',
    'jobs.form.reminderTime': 'Reminder Time',
    'jobs.form.reminderHint': 'Notification will appear when reminder time arrives',
    'jobs.form.image': 'Image',
    'jobs.form.uploadImage': 'Upload Image',
    'jobs.form.uploadingImage': 'Uploading...',
    'jobs.form.removeImage': 'Remove Image',
    'jobs.form.priority': 'Priority',
    'jobs.form.status': 'Status',
    'jobs.form.priority.low': 'Low',
    'jobs.form.priority.medium': 'Medium',
    'jobs.form.priority.high': 'High',
    'jobs.form.status.pending': 'Pending',
    'jobs.form.status.inProgress': 'In Progress',
    'jobs.form.status.completed': 'Completed',
    'jobs.form.cancel': 'Cancel',
    'jobs.list.title': 'Job List',
    'jobs.list.count': 'jobs',
    'jobs.item.priority.high': 'High',
    'jobs.item.priority.medium': 'Medium',
    'jobs.item.priority.low': 'Low',
    'jobs.item.status.pending': 'Pending',
    'jobs.item.status.inProgress': 'In Progress',
    'jobs.item.status.completed': 'Completed',
    'jobs.item.overdue': 'Overdue!',
    'jobs.item.deadline': 'Deadline:',
    'jobs.item.reminder': 'Reminder:',
    'jobs.item.created': 'Created:',
    'jobs.item.edit': 'Edit',
    'jobs.item.delete': 'Delete',
    
    // Pomodoro
    'pomodoro.title': 'Pomodoro Timer',
    'pomodoro.subtitle': 'Focus on your work with Pomodoro technique',
    'pomodoro.work': 'Work',
    'pomodoro.shortBreak': 'Short Break',
    'pomodoro.longBreak': 'Long Break',
    'pomodoro.focusTime': 'Focus Time',
    'pomodoro.start': 'Start',
    'pomodoro.pause': 'Pause',
    'pomodoro.reset': 'Reset',
    'pomodoro.stopAlarm': 'Stop Alarm',
    'pomodoro.alarmPlaying': 'Alarm is playing',
    'pomodoro.completed': 'Pomodoros completed',
    'pomodoro.completed.singular': 'Pomodoro completed',
    'pomodoro.completed.plural': 'Pomodoros completed',
    'pomodoro.notification.workComplete': 'Pomodoro session completed! Time for a break.',
    'pomodoro.notification.breakComplete': 'Break time is over! Ready to work?',
    'pomodoro.notification.title': 'Custom Notification',
    'pomodoro.notification.description': 'Upload a custom audio file to play when the timer completes',
    'pomodoro.notification.upload': 'Upload Audio',
    'pomodoro.notification.uploading': 'Uploading...',
    'pomodoro.notification.customAudio': 'Custom audio is set',
    'pomodoro.notification.remove': 'Remove',
    'pomodoro.notification.deleteConfirm': 'Are you sure you want to remove the custom notification audio?',
    
    // Notes
    'notes.title': 'Sticky Notes',
    'notes.subtitle': 'Create and manage your important notes',
    'notes.new': 'New Note',
    'notes.create': 'Create Note',
    'notes.edit': 'Edit Note',
    'notes.update': 'Update Note',
    'notes.delete': 'Delete',
    'notes.deleteConfirm': 'Are you sure you want to delete this note?',
    'notes.empty': 'No notes yet',
    'notes.emptyDesc': 'Create your first sticky note to get started!',
    'notes.form.title': 'Title',
    'notes.form.titlePlaceholder': 'Note title...',
    'notes.form.content': 'Content',
    'notes.form.contentPlaceholder': 'Note content...',
    'notes.form.color': 'Color',
    'notes.form.cancel': 'Cancel',
    
    // Settings
    'settings.title': 'Settings',
    'settings.subtitle': 'Configure your application preferences',
    'settings.language': 'Language',
    'settings.languageDesc': 'Choose your preferred language',
    'settings.english': 'English',
    'settings.indonesian': 'Indonesian',
    'settings.theme': 'Theme',
    'settings.themeDesc': 'Choose your preferred theme',
    'settings.lightMode': 'Light Mode',
    'settings.darkMode': 'Dark Mode',
    'settings.contact.title': 'Need Help?',
    'settings.contact.description': 'If you encounter any issues or have questions, feel free to reach out to me on Instagram @musahabibulloh_',
  },
  id: {
    // App
    'app.title': 'List My Job',
    'app.subtitle': 'Kelola dan ingatkan pekerjaan Anda dengan mudah',
    
    // Sidebar
    'sidebar.jobs': 'List My Job',
    'sidebar.pomodoro': 'Pomodoro Timer',
    'sidebar.notes': 'Sticky Notes',
    'sidebar.settings': 'Pengaturan',
    
    // Jobs
    'jobs.title': 'List My Job',
    'jobs.subtitle': 'Kelola dan ingatkan pekerjaan Anda dengan mudah',
    'jobs.add': 'Tambah Job Baru',
    'jobs.edit': 'Edit Job',
    'jobs.save': 'Simpan Job',
    'jobs.update': 'Update Job',
    'jobs.delete': 'Hapus',
    'jobs.deleteConfirm': 'Apakah Anda yakin ingin menghapus job ini?',
    'jobs.filter.all': 'Semua',
    'jobs.filter.pending': 'Pending',
    'jobs.filter.inProgress': 'In Progress',
    'jobs.filter.completed': 'Completed',
    'jobs.empty': 'Belum ada job',
    'jobs.emptyDesc': 'Buat job pertama Anda untuk memulai!',
    'jobs.form.title': 'Judul Job',
    'jobs.form.titleRequired': 'Judul job harus diisi!',
    'jobs.form.titlePlaceholder': 'Contoh: Review kode aplikasi',
    'jobs.form.description': 'Deskripsi',
    'jobs.form.descriptionPlaceholder': 'Tambahkan detail tentang job ini...',
    'jobs.form.deadline': 'Deadline',
    'jobs.form.reminderTime': 'Waktu Reminder',
    'jobs.form.reminderHint': 'Notifikasi akan muncul saat waktu reminder tiba',
    'jobs.form.image': 'Gambar',
    'jobs.form.uploadImage': 'Upload Gambar',
    'jobs.form.uploadingImage': 'Mengupload...',
    'jobs.form.removeImage': 'Hapus Gambar',
    'jobs.form.priority': 'Prioritas',
    'jobs.form.status': 'Status',
    'jobs.form.priority.low': 'Rendah',
    'jobs.form.priority.medium': 'Sedang',
    'jobs.form.priority.high': 'Tinggi',
    'jobs.form.status.pending': 'Pending',
    'jobs.form.status.inProgress': 'In Progress',
    'jobs.form.status.completed': 'Completed',
    'jobs.form.cancel': 'Batal',
    'jobs.list.title': 'Daftar Job',
    'jobs.list.count': 'job',
    'jobs.item.priority.high': 'Tinggi',
    'jobs.item.priority.medium': 'Sedang',
    'jobs.item.priority.low': 'Rendah',
    'jobs.item.status.pending': 'Pending',
    'jobs.item.status.inProgress': 'Sedang Dikerjakan',
    'jobs.item.status.completed': 'Selesai',
    'jobs.item.overdue': 'Terlambat!',
    'jobs.item.deadline': 'Deadline:',
    'jobs.item.reminder': 'Reminder:',
    'jobs.item.created': 'Dibuat:',
    'jobs.item.edit': 'Edit',
    'jobs.item.delete': 'Hapus',
    
    // Pomodoro
    'pomodoro.title': 'Pomodoro Timer',
    'pomodoro.subtitle': 'Fokus pada pekerjaan Anda dengan teknik Pomodoro',
    'pomodoro.work': 'Kerja',
    'pomodoro.shortBreak': 'Istirahat Pendek',
    'pomodoro.longBreak': 'Istirahat Panjang',
    'pomodoro.focusTime': 'Waktu Fokus',
    'pomodoro.start': 'Mulai',
    'pomodoro.pause': 'Jeda',
    'pomodoro.reset': 'Reset',
    'pomodoro.stopAlarm': 'Hentikan Alarm',
    'pomodoro.alarmPlaying': 'Alarm sedang diputar',
    'pomodoro.completed': 'Pomodoros selesai',
    'pomodoro.completed.singular': 'Pomodoro selesai',
    'pomodoro.completed.plural': 'Pomodoros selesai',
    'pomodoro.notification.workComplete': 'Sesi Pomodoro selesai! Waktunya istirahat.',
    'pomodoro.notification.breakComplete': 'Waktu istirahat selesai! Siap bekerja?',
    'pomodoro.notification.title': 'Notifikasi Kustom',
    'pomodoro.notification.description': 'Upload file audio kustom untuk diputar saat timer selesai',
    'pomodoro.notification.upload': 'Upload Audio',
    'pomodoro.notification.uploading': 'Mengupload...',
    'pomodoro.notification.customAudio': 'Audio kustom sudah diatur',
    'pomodoro.notification.remove': 'Hapus',
    'pomodoro.notification.deleteConfirm': 'Apakah Anda yakin ingin menghapus audio notifikasi kustom?',
    
    // Notes
    'notes.title': 'Sticky Notes',
    'notes.subtitle': 'Buat dan kelola catatan penting Anda',
    'notes.new': 'Note Baru',
    'notes.create': 'Buat Note',
    'notes.edit': 'Edit Note',
    'notes.update': 'Update Note',
    'notes.delete': 'Hapus',
    'notes.deleteConfirm': 'Apakah Anda yakin ingin menghapus note ini?',
    'notes.empty': 'Belum ada note',
    'notes.emptyDesc': 'Buat sticky note pertama Anda untuk memulai!',
    'notes.form.title': 'Judul',
    'notes.form.titlePlaceholder': 'Judul note...',
    'notes.form.content': 'Konten',
    'notes.form.contentPlaceholder': 'Konten note...',
    'notes.form.color': 'Warna',
    'notes.form.cancel': 'Batal',
    
    // Settings
    'settings.title': 'Pengaturan',
    'settings.subtitle': 'Konfigurasi preferensi aplikasi Anda',
    'settings.language': 'Bahasa',
    'settings.languageDesc': 'Pilih bahasa yang Anda inginkan',
    'settings.english': 'Bahasa Inggris',
    'settings.indonesian': 'Bahasa Indonesia',
    'settings.theme': 'Tema',
    'settings.themeDesc': 'Pilih tema yang Anda inginkan',
    'settings.lightMode': 'Mode Terang',
    'settings.darkMode': 'Mode Gelap',
    'settings.contact.title': 'Butuh Bantuan?',
    'settings.contact.description': 'Jika Anda mengalami kendala atau memiliki pertanyaan, jangan ragu untuk menghubungi saya melalui Instagram @musahabibulloh_',
  },
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Load from localStorage or default to 'en'
    const saved = localStorage.getItem('app-language') as Language;
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('app-language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

